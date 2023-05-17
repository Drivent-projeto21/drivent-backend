import { Event } from '@prisma/client';
import { prisma } from '@/config';
import { redis } from '@/config/redis';

async function findFirst() {
  const cachedEvent = await redis.get('event');

  if (cachedEvent) {
    const event: Event = JSON.parse(cachedEvent);
    return event;
  }

  const event = await prisma.event.findFirst();
  redis.setEx('event', 43200, JSON.stringify(event));

  return event;
}

const eventRepository = {
  findFirst,
};

export default eventRepository;
