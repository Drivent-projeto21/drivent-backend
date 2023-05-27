/* eslint-disable prettier/prettier */
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createSubscription, createActivity, createActivityWithoutVacancies, createEnrollmentWithAddress, createPayment, createTicket, createTicketTypeWithHotel, createUser } from '../factories';
import app, { init } from '@/app';


beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('POST /subscriptions', () => {
    it('should responde with status 401 if no token is given', async () => {
        const response = await server.post('/subscriptions');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it('should respond with status 401 if given token is invalid', async () => {
        const token = faker.lorem.word();

        const response = await server.post('/subscriptions').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.post('/subscriptions').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should respond with status 400 when user has no activity', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.post('/subscriptions').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        })

        it('should respond with status 403 when is not have enough vacancies', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const activity = await createActivityWithoutVacancies();
            const subscription = await createSubscription(user.id, activity.id);

            const response = await server.post('/subscriptions').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.BAD_REQUEST);
        })
    })
})