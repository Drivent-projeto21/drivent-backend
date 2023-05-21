import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import activityService from '@/services/activity-service';

export async function getActivities(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const activities = await activityService.getAllActivities(userId);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    next(error);
  }
}

export async function getVenues(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const { userId } = req;

  try {
    const venues = await activityService.getVenues(userId);
    return res.status(httpStatus.OK).send(venues);
  } catch (error) {
    next(error);
  }
}
