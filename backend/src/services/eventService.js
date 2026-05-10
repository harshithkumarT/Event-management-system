import { ApiError } from '../utils/apiError.js';
import { createEvent, deleteEvent, findEventById, getEventStats, listEvents, listUpcomingEvents, updateEvent } from '../models/eventModel.js';

export const getEvents = async (filters) => listEvents(filters);
export const getFeaturedEvents = async () => listUpcomingEvents();
export const getEvent = async (id) => {
  const event = await findEventById(id);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  return event;
};

export const addEvent = async (payload) => createEvent(payload);
export const editEvent = async (id, payload) => {
  const updatedEvent = await updateEvent(id, payload);
  if (!updatedEvent) {
    throw new ApiError(404, 'Event not found');
  }

  return updatedEvent;
};

export const removeEvent = async (id) => deleteEvent(id);
export const fetchEventStats = async () => getEventStats();