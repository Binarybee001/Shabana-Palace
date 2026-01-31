export type RoomAmenity = 
  | "wifi" 
  | "hotShower" 
  | "tv" 
  | "kitchen" 
  | "miniFridge"
  | "airConditioning"
  | "parking"
  | "balcony"
  | "safe"
  | "washer"
  | "workspace"
  | "pool"
  | "gym";

export type AdminRoom = {
  id: string;
  name: string;
  number: string;
  pricePerNight: number;
  beds: number;
  description: string;
  amenities: RoomAmenity[];
  photos: string[]; // URLs or base64 data URLs for preview
};

export type AdminMessageReply = {
  id: string;
  body: string;
  createdAt: string; // ISO
};

export type AdminMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string; // ISO
  replies: AdminMessageReply[];
};
