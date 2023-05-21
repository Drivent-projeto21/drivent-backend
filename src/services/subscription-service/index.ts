import { conflictError, notFoundError } from '@/errors';
import { forBiddenError } from '@/errors/forbidden-error';
import activityRepository from '@/repositories/activity-repository';
import subscriptionRepository from '@/repositories/subscription-repository';

async function createSubscription(userId: number, activityId: number) {
  const activity = await activityRepository.findById(activityId);
  if (!activity) throw notFoundError();

  if (activity.Subscriptions.length >= activity.vacancies) throw forBiddenError();

  const alreadySubscribed = activity.Subscriptions.find((el) => el.userId === userId);
  if (alreadySubscribed) throw forBiddenError();

  const conflictedSubscription = await subscriptionRepository.findConflicting(
    userId,
    activity.startsAt,
    activity.endsAt,
  );
  if (conflictedSubscription) throw conflictError('Schedule conflict');

  const subscription = await subscriptionRepository.createSubscription(userId, activityId);
  return subscription;
}

const subscriptionService = {
  createSubscription,
};

export default subscriptionService;
