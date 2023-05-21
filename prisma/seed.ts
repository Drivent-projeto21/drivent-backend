import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);


async function main() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }

  await prisma.ticketType.deleteMany();
  await prisma.ticketType.createMany({ data: ticketTypes });

  await prisma.hotel.deleteMany();
  await prisma.hotel.createMany({ data: hotels });

  const createdHotels = await prisma.hotel.findMany();

  await prisma.room.deleteMany();
  const rooms = [
    {name: '101', capacity: 1, hotelId: createdHotels[0].id},
    {name: '102', capacity: 2, hotelId: createdHotels[0].id},
    {name: '101', capacity: 2, hotelId: createdHotels[1].id},
    {name: '102', capacity: 3, hotelId: createdHotels[1].id},
  ];
  await prisma.room.createMany({ data: rooms });

  await prisma.venue.deleteMany();
  await prisma.venue.createMany({data: venues});
  const createdVenues = await prisma.venue.findMany({ orderBy: {id: 'asc'}});

  await prisma.activity.deleteMany({});
  await prisma.activity.createMany({
    data: [
      {name: 'Minecraft: montando o PC ideal', vacancies: 25, venueId: createdVenues[0].id, 
      startsAt: dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0).toDate(), 
      endsAt: dayjs().add(1, 'day').hour(10).minute(0).second(0).millisecond(0).toDate()},

      {name: 'LoL: montando o PC ideal', vacancies: 0, venueId: createdVenues[0].id, 
      startsAt: dayjs().add(1, 'day').hour(10).minute(0).second(0).millisecond(0).toDate(), 
      endsAt: dayjs().add(1, 'day').hour(11).minute(0).second(0).millisecond(0).toDate()},

      {name: 'Palestra: auditório lateral', vacancies: 25, venueId: createdVenues[1].id, 
      startsAt: dayjs().add(1, 'day').hour(9).minute(0).second(0).millisecond(0).toDate(), 
      endsAt: dayjs().add(1, 'day').hour(11).minute(0).second(0).millisecond(0).toDate()},

      {name: 'Palestra x: workshop', vacancies: 25, venueId: createdVenues[2].id, 
      startsAt: dayjs().add(2, 'day').hour(9).minute(0).second(0).millisecond(0).toDate(), 
      endsAt: dayjs().add(2, 'day').hour(10).minute(0).second(0).millisecond(0).toDate()},

      {name: 'Palestra y: workshop', vacancies: 25, venueId: createdVenues[2].id, 
      startsAt: dayjs().add(2, 'day').hour(9).minute(0).second(0).millisecond(0).toDate(), 
      endsAt: dayjs().add(2, 'day').hour(10).minute(0).second(0).millisecond(0).toDate()},

      {name: 'Palestra dia 3: auditório princiapl', vacancies: 0, venueId: createdVenues[0].id, 
      startsAt: dayjs().add(3, 'day').hour(14).minute(0).second(0).millisecond(0).toDate(), 
      endsAt: dayjs().add(3, 'day').hour(15).minute(0).second(0).millisecond(0).toDate()},

      {name: 'Palestra dia 3: auditório lateral', vacancies: 3, venueId: createdVenues[1].id, 
      startsAt: dayjs().add(3, 'day').hour(9).minute(0).second(0).millisecond(0).toDate(), 
      endsAt: dayjs().add(3, 'day').hour(10).minute(30).second(0).millisecond(0).toDate()} 
    ]
  });


  console.log({ event });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  const ticketTypes = [
    {
      name: 'Online',
      price: 100,
      isRemote: true,
      includesHotel: false
    },
    {
      name: 'Presencial',
      price: 250,
      isRemote: false,
      includesHotel: false
    },
    {
      name: 'Presencial',
      price: 600,
      isRemote: false,
      includesHotel: true
    }
  ];

  const hotels = [
    {
      name:'Driven World',
      image: 'https://media-cdn.tripadvisor.com/media/photo-s/16/1a/ea/54/hotel-presidente-4s.jpg'
    },
    {
      name:'Driven Palace',
      image: 'https://sp-ao.shortpixel.ai/client/to_webp,q_glossy,ret_img,w_871,h_581/https://blog.hotelpontaverde.com.br/wp-content/uploads/2019/09/Resort-ou-Hotel-Hotel-Ponta-Verde-France%CC%82s.png'
    },
  ];

  const venues = [{name: 'Auditório Principal'}, {name: 'Auditório Lateral'}, {name: 'Sala de Workshop'}];
