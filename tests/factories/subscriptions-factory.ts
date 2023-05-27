/* eslint-disable prettier/prettier */
import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createSubscription(userId: number, activityId: number) {
    return await prisma.subscription.create({
        data: {
            userId,
            activityId,
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),
        }
    })
}