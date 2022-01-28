import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Account } from '../../types';
import { Entities } from '../constants';

function getAccountKey(id: string): string {
  return `zendesk_account:${id}`;
}

export function createAccountEntity(data: Account): Entity {
  return createIntegrationEntity({
    entityData: {
      source: data,
      assign: {
        _class: Entities.ACCOUNT._class,
        _type: Entities.ACCOUNT._type,
        _key: getAccountKey(data.subdomain),
        accountId: data.subdomain,
        accessURL: data.url,
        name: data.name,
      },
    },
  });
}
