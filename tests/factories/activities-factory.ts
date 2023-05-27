/* eslint-disable prettier/prettier */
import faker from "@faker-js/faker";
import { prisma } from "@/config";

export async function createActivity() {

    const venue = await prisma.venue.create({
        data: {
            name: faker.address.streetName(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),

        },
    });
    const activityData = {
        name: faker.name.findName(),
        vacancies: faker.datatype.number(),
        venueId: venue.id,
        startsAt: faker.date.future(),
        endsAt: faker.date.future(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };

    return await prisma.activity.create({
        data: activityData
    });
}

export async function createActivityWithoutVacancies() {

    const venue = await prisma.venue.create({
        data: {
            name: faker.address.streetName(),
            createdAt: faker.date.recent(),
            updatedAt: faker.date.recent(),

        },
    });
    const activityData = {
        name: faker.name.findName(),
        vacancies: 0,
        venueId: venue.id,
        startsAt: faker.date.future(),
        endsAt: faker.date.future(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };

    return await prisma.activity.create({
        data: activityData
    });
}

