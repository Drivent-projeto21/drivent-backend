import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getHotels, getHotelsWithRooms, getBookingsByHotelId } from '@/controllers/hotel-controller';

const hotelsRouter = Router();

hotelsRouter.all('/*', authenticateToken).get('/', getHotels).get('/:hotelId', getHotelsWithRooms).get('/bookings/:hotelId', getBookingsByHotelId);

export { hotelsRouter };
