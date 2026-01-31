import type { AdminMessage, AdminRoom, RoomAmenity } from "@/lib/admin/types";

export const initialRooms: AdminRoom[] = [
  {
    id: "room_std_101",
    name: "Standard Room",
    number: "101",
    pricePerNight: 3500,
    beds: 1,
    description: "Cozy and comfortable room perfect for couples or solo travelers.",
    amenities: ["wifi", "hotShower", "tv"] as RoomAmenity[],
    photos: [],
  },
  {
    id: "room_dlx_201",
    name: "Deluxe Room",
    number: "201",
    pricePerNight: 5000,
    beds: 2,
    description: "Spacious room with extra amenities for a premium experience.",
    amenities: ["wifi", "hotShower", "tv", "miniFridge"] as RoomAmenity[],
    photos: [],
  },
  {
    id: "room_exec_301",
    name: "Executive Suite",
    number: "301",
    pricePerNight: 8000,
    beds: 2,
    description: "Our finest suite with all luxury amenities and stunning views.",
    amenities: ["wifi", "hotShower", "tv", "kitchen", "miniFridge"] as RoomAmenity[],
    photos: [],
  },
];

export const initialMessages: AdminMessage[] = [
  {
    id: "msg_1",
    name: "Grace Wanjiku",
    email: "grace.wanjiku@example.com",
    message: "Hello, do you have availability for 2 nights next weekend?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    replies: [],
  },
  {
    id: "msg_2",
    name: "Kevin Otieno",
    email: "kevin.otieno@example.com",
    message: "Is the location close to town and is parking available?",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    replies: [],
  },
];
