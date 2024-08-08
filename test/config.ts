import * as dotenv from 'dotenv';
import * as path from 'path';
import { IntegrationConfig } from '../src/config';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_SUBDOMAIN = 'metronsecurity';
const ZENDESK_ACCESS_TOKEN = 'dummy-zendesk-access-token';
const DEFAULT_OMIT_DESCRIPTION = false;
const DEFAULT_USER_ROLE = 'end-user, admin, agent';

export const integrationConfig: IntegrationConfig = {
  zendeskSubdomain: process.env.ZENDESK_SUBDOMAIN || DEFAULT_SUBDOMAIN,
  zendeskAccessToken: process.env.ZENDESK_ACCESS_TOKEN || ZENDESK_ACCESS_TOKEN,
  omitTicketDescription:
    process.env.OMIT_TICKET_DESCRIPTION === 'true' || DEFAULT_OMIT_DESCRIPTION,
  userRoles: process.env.USER_ROLE || DEFAULT_USER_ROLE,
};
