import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { IngestionSources } from './steps/constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [IngestionSources.GROUPS]: {
    title: 'Groups',
    description: 'Team units',
    defaultsToDisabled: false,
  },
  [IngestionSources.ORGANIZATIONS]: {
    title: 'Organizations',
    description: 'Company records',
    defaultsToDisabled: false,
  },
  [IngestionSources.TICKETS]: {
    title: 'Tickets',
    description: 'Support tickets',
    defaultsToDisabled: false,
  },
  [IngestionSources.USERS]: {
    title: 'Users',
    description: 'Client profiles',
    defaultsToDisabled: false,
  },
};
