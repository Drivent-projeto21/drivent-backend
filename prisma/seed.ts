import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

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

  console.log({ event });

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
