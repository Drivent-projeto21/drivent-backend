import { cannotListActivitiesError } from '@/errors/cannot-list-activities-error';
import activityRepository from '@/repositories/activity-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function checkTicket(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw cannotListActivitiesError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote) {
    throw cannotListActivitiesError();
  }
}

async function getAllActivities(userId: number) {
  await checkTicket(userId);

  const activities = await activityRepository.getAllActivities(userId);
  return activities;
}

async function getVenues(userId: number) {
  await checkTicket(userId);

  const venues = await activityRepository.getVenues();
  return venues;
}

const activityService = {
  getAllActivities,
  getVenues,
};

export default activityService;
