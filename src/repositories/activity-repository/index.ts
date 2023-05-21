import { prisma } from '@/config';

async function getAllActivities(userId: number) {
  return await prisma.activity.findMany({
    select: {
      id: true,
      name: true,
      vacancies: true,
      venueId: true,
      startsAt: true,
      endsAt: true,
      _count: {
        select: { Subscriptions: true },
      },
      Subscriptions: {
        where: {
          userId: userId,
        },
      },
    },
  });
}

async function getVenues() {
  return await prisma.venue.findMany({
    orderBy: {
      id: 'asc',
    },
    select: {
      id: true,
      name: true,
    },
  });
}

async function findById(activityId: number) {
  return await prisma.activity.findUnique({
    where: { id: activityId },
    include: { Subscriptions: true },
  });
}

const activityRepository = {
  getAllActivities,
  getVenues,
  findById,
};

export default activityRepository;
