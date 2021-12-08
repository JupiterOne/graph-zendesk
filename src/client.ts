import fetch from 'node-fetch';
import { backOff } from 'exponential-backoff';
import {
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from './config';
import { Group, Organization, Ticket, User } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;
export type PageIteratee<T> = (page: T[]) => Promise<void>;

export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  private readonly baseUrl = `${this.config.zendeskSubdomain}.zendesk.com/api/v2`;

  async apiRequestWithErrorHandling(
    path: string,
    shouldRetry = true,
  ): Promise<any> {
    try {
      const res = await fetch(`https://${this.baseUrl}${path}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.config.zendeskAccessToken}`,
        },
      });
      const status = res.status;
      if (status === 429) {
        // Rate limit exceeded
        const retryAfter = res.headers.get('Retry-After');
        // Throw if retryAfter's value is greater than 10 seconds.
        if (retryAfter > 10) {
          throw new Error('Rate limit exceeded.');
        }
        // Retrying after sleeping for 5 seconds in case the retry-after header was not present.
        const retryAfterMs = Number(retryAfter || 5) * 1000 + 3000;
        await new Promise((resolve) => setTimeout(resolve, retryAfterMs));
        // Exponential backoff. Retrying the request max 10 times.
        return await backOff(() => this.apiRequestWithErrorHandling(path), {
          retry: (_, attemptNumber) => {
            if (attemptNumber > 10) {
              throw new Error('API rate limit exceeded.');
            }
            return true;
          },
          numOfAttempts: 10,
        });
      }
      if (status === 500) {
        if (!shouldRetry) {
          throw new Error(`Rate limit exceeded. Please try again later.`);
        }
        await new Promise((resolve) => setTimeout(resolve, 3000));
        return this.apiRequestWithErrorHandling(path, false);
      }
      const body = await res.json();
      return body;
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: path,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  async apiRequestWithPagination<T>(
    path: string,
    pageIteratee: PageIteratee<T>,
  ): Promise<void> {
    try {
      let page: number | null = 1;
      do {
        const response = await this.apiRequestWithErrorHandling(
          `${path}.json?page=${page}`,
        );
        const resource = path.split('/')[1];
        page = response.nextPage;
        await pageIteratee(response[resource]);
      } while (page);
    } catch (err) {
      throw new IntegrationProviderAPIError({
        cause: new Error(err.message),
        endpoint: path,
        status: err.statusCode,
        statusText: err.message,
      });
    }
  }

  public async verifyAuthentication(): Promise<void> {
    try {
      const users = (await this.apiRequestWithErrorHandling('/users.json'))
        .users;
      if (!users) {
        throw new Error('Provider authentication failed');
      }
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: '/users',
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(iteratee: ResourceIteratee<User>): Promise<void> {
    await this.apiRequestWithPagination<User>('/users', async (users) => {
      for (const user of users) {
        await iteratee(user);
      }
    });
  }

  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroups(iteratee: ResourceIteratee<Group>): Promise<void> {
    await this.apiRequestWithPagination<Group>('/groups', async (groups) => {
      for (const group of groups) {
        await iteratee(group);
      }
    });
  }

  /**
   * Iterates each organization resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateOrganizations(
    iteratee: ResourceIteratee<Organization>,
  ): Promise<void> {
    await this.apiRequestWithPagination<Organization>(
      '/organizations',
      async (organizations) => {
        for (const organization of organizations) {
          await iteratee(organization);
        }
      },
    );
  }

  /**
   * Iterates each ticket resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateTickets(
    iteratee: ResourceIteratee<Ticket>,
  ): Promise<void> {
    await this.apiRequestWithPagination<Ticket>('/tickets', async (tickets) => {
      for (const ticket of tickets) {
        await iteratee(ticket);
      }
    });
  }

  public async getCurrentUser(): Promise<User> {
    return (await this.apiRequestWithErrorHandling(`/users/me.json`)).user;
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
