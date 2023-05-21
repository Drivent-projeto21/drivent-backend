import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getActivities, getVenues } from '@/controllers';

const activityRouter = Router();

activityRouter.all('/*', authenticateToken).get('', getActivities).get('/venues', getVenues);

export { activityRouter };
