import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import subscriptionService from '@/services/subscription-service';

export async function createSubscription(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;
  const { activityId } = req.body as Record<string, number>;
  if (!activityId || isNaN(activityId)) return res.status(httpStatus.BAD_REQUEST).send('Invalid activity');

  try {
    const subscription = await subscriptionService.createSubscription(userId, activityId);
    return res.status(httpStatus.OK).send({ subscriptionId: subscription.id });
  } catch (error) {
    next(error);
  }
}
