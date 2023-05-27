/* eslint-disable prettier/prettier */
import supertest from 'supertest';
import * as jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createPayment, createTicket, createTicketTypeRemote, createUser, createActivity, createTicketType, createTicketTypeWithHotel } from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('GET /activities', () => {
    it('should responde with status 401 if no token is given', async () => {
        const response = await server.get('/activities');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it('should respond with status 401 if given token is invalid', async () => {
        const token = faker.lorem.word();

        const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    })

    it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe('when token is valid', () => {

        it('should responde with status 403 when user has no ticket', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.FORBIDDEN);
        })

        it('should responde with status 403 when user has no enrollment', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);

            const ticketType = createTicketTypeRemote();

            const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.FORBIDDEN);
        })

        it('should respond with status 403 when user ticket is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.FORBIDDEN);
        })

        it('should respond with status 403 when user ticket is not paid', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
            const payment = await createPayment(ticket.id, ticketType.price);

            const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.FORBIDDEN);
        })

        it('should respond with status 403 when the ticket user is remote', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeRemote();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const activity = await createActivity();

            const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.FORBIDDEN);

        })

        it('should respond with status 200 and the list of activities', async () => {
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketTypeWithHotel();
            const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
            const payment = await createPayment(ticket.id, ticketType.price);

            const activity = await createActivity();

            const response = await server.get('/activities').set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.OK);

        })

    })

})

