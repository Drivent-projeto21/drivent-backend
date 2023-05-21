import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createSubscription } from '@/controllers';

const subscriptionRouter = Router();

subscriptionRouter.all('/*', authenticateToken).post('', createSubscription);

export { subscriptionRouter };
