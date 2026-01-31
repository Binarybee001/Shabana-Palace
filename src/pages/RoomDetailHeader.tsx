import { useParams } from "react-router-dom";
import { rooms } from "@/data/rooms";

const RoomDetailHeader = () => {
  const { id } = useParams<{ id: string }>();
  const room = rooms.find((r) => r.id === Number(id));

  if (!room) return null;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border py-4">
      <div className="container mx-auto px-4 relative flex items-center">
        
        {/* LEFT: Logo + Website Name */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xl">SP</span>
          </div>
          <span
            className="text-lg font-bold uppercase"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="text-primary">SHABANA</span>{" "}
            <span className="text-black">PALACE</span>
          </span>
        </div>

        {/* CENTER: Room Name */}
        <h1
          className="absolute left-1/2 -translate-x-1/2 text-xl md:text-2xl font-bold uppercase"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {room.name}
        </h1>
      </div>
    </header>
  );
};

export default RoomDetailHeader;
