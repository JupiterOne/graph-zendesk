import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { Ticket } from '../../types';
import { Entities } from '../constants';

function getTicketKey(id: string): string {
  return `zendesk_ticket:${id}`;
}

export function createTicketEntity(ticket: Ticket): Entity {
  return createIntegrationEntity({
    entityData: {
      source: ticket,
      assign: {
        _type: Entities.TICKET._type,
        _class: Entities.TICKET._class,
        _key: getTicketKey(ticket.id?.toString() as string),
        assigneeEmail: ticket.assignee_email,
        assigneeId: ticket.assignee_id,
        brandId: ticket.brand_id,
        collaboratorIds: ticket.collaborator_ids,
        createdAt: ticket.created_at,
        description: ticket.description,
        dueAt: ticket.due_at || undefined,
        emailCcIds: ticket.email_cc_ids,
        followerIds: ticket.follower_ids,
        forumTopicId: ticket.forum_topic_id || undefined,
        groupId: ticket.group_id,
        hasIncidents: ticket.has_incidents,
        id: ticket.id?.toString(),
        name: ticket.subject,
        organizationId: ticket.organization_id || undefined,
        priority: ticket.priority,
        problemId: ticket.problem_id || undefined,
        recipient: ticket.recipient || undefined,
        requestedId: ticket.requested_id,
        status: ticket.status,
        submitterId: ticket.submitter_id,
        requesterId: ticket.requester_id,
        type: ticket.type,
        url: ticket.url,
        queries: [ticket.description as string],
      },
    },
  });
}
