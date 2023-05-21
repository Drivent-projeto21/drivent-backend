import { prisma } from '@/config';

async function createSubscription(userId: number, activityId: number) {
  return await prisma.subscription.create({
    data: {
      userId,
      activityId,
    },
  });
}

async function findConflicting(userId: number, startsAt: Date, endsAt: Date) {
  return await prisma.subscription.findFirst({
    where: {
      userId,
      Activity: {
        startsAt: {
          lte: endsAt,
          gte: startsAt,
        },
        endsAt: {
          gte: startsAt,
        },
        NOT: {
          startsAt: {
            gte: endsAt,
          },
        },
      },
    },
  });
}

const subscriptionRepository = {
  createSubscription,
  findConflicting,
};

export default subscriptionRepository;
