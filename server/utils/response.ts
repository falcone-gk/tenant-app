import { H3Event, EventHandlerRequest } from 'h3'
import type { Status } from '~/types';

export function createResponse<T>(
    event: H3Event<EventHandlerRequest>,
    status: Status,
    statusCode: number,
    data?: T,
    message?: string
  ): ApiResponse<T> {

  const response: ApiResponse<T> = {
      status: status
  };

  if (data !== undefined) {
      response.data = data;
  }

  if (message !== undefined) {
      response.message = message;
  }

  setResponseStatus(event, statusCode);
  return response;
}
