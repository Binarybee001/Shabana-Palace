import { Wifi, Tv, Coffee, Bath, Users, Bed, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRooms } from "@/lib/useRooms";

const amenityIcons: Record<string, typeof Wifi> = {
  WiFi: Wifi,
  TV: Tv,
  "Smart TV": Tv,
  "Hot Shower": Bath,
  "Mini Fridge": Coffee,
  Kitchen: Coffee,
  Balcony: Coffee,
  "Air Conditioning": Coffee,
  "Mini Bar": Coffee,
  "Room Service": Coffee,
};

const RoomsSection = () => {
  const { rooms, isLoading, error } = useRooms();
  const [likedRooms, setLikedRooms] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<Record<string, number>>({});

  const toggleLike = (roomId: string) => {
    setLikedRooms((prev) =>
      prev.includes(roomId)
        ? prev.filter((id) => id !== roomId)
        : [...prev, roomId]
    );
  };

  const nextImage = (roomId: string, total: number) => {
    setCurrentImage((prev) => ({
      ...prev,
      [roomId]: prev[roomId] !== undefined ? (prev[roomId] + 1) % total : 1,
    }));
  };

  const prevImage = (roomId: string, total: number) => {
    setCurrentImage((prev) => ({
      ...prev,
      [roomId]:
        prev[roomId] !== undefined
          ? (prev[roomId] - 1 + total) % total
          : total - 1,
    }));
  };

  if (isLoading) {
    return (
      <section id="rooms" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse text-muted-foreground">Loading rooms...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="rooms" className="py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">{error}</p>
        </div>
      </section>
    );
  }

  // Show only first 3 rooms on homepage
  const displayedRooms = rooms.slice(0, 3);

  return (
    <section id="rooms" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Rooms</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base">
            Choose from our selection of beautifully furnished rooms designed for your comfort
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRooms.map((room, index) => {
            const images = room.photos && room.photos.length > 0 ? room.photos : [room.photos?.[0] || ''];
            const imgIndex = currentImage[room.id] || 0;

            return (
              <div
                key={room.id}
                className="bg-background rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* IMAGE CAROUSEL */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={images[imgIndex]}
                    alt={`${room.name} ${imgIndex + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />

                  {/* Price badge */}
                  <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-semibold text-xs">
                    KES {room.price_per_night.toLocaleString()}/night
                  </div>

                  {/* Carousel Buttons */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() => prevImage(room.id, images.length)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white shadow"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => nextImage(room.id, images.length)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-1 rounded-full hover:bg-white shadow"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>

                      {/* Dots indicator */}
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                        {images.map((_, dotIndex) => (
                          <span
                            key={dotIndex}
                            className={`h-2 w-2 rounded-full transition-colors ${
                              imgIndex === dotIndex
                                ? "bg-primary"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <Link to={`/rooms/${room.id}`}>
                    <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors cursor-pointer">
                      {room.name}
                    </h3>
                  </Link>

                  <p className="text-muted-foreground text-xs mb-3 line-clamp-2">
                    {room.description}
                  </p>

                  <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      <span>
                        {room.beds} Bed{room.beds > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {room.amenities.slice(0, 4).map((amenity) => {
                      const Icon = amenityIcons[amenity] || Wifi;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center gap-1 bg-muted px-2 py-0.5 rounded-full text-[10px]"
                        >
                          <Icon className="h-3 w-3" />
                          <span>{amenity}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* BUTTONS */}
                  <div className="flex items-center gap-2">
                    <Link to={`/rooms/${room.id}`} className="flex-1">
                      <Button
                        size="sm"
                        className="w-full rounded-full bg-primary hover:bg-coral-dark font-semibold text-sm py-2"
                      >
                        View This Room
                      </Button>
                    </Link>

                    <button
                      onClick={() => toggleLike(room.id)}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      aria-label="Like room"
                    >
                      <Heart
                        className={`h-5 w-5 transition-colors ${
                          likedRooms.includes(room.id)
                            ? "fill-red-500 text-red-500"
                            : "text-muted-foreground"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* VIEW MORE ROOMS BUTTON */}
        <div className="text-center mt-10">
          <Link to="/all-rooms">
            <Button
              size="lg"
              className="rounded-full bg-primary hover:bg-coral-dark font-semibold text-base px-8 py-3 shadow-lg hover:shadow-xl transition-all"
            >
              View More Rooms
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;