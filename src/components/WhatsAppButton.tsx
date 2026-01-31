import { Phone } from "lucide-react"; // Use Phone icon for WhatsApp
import { useState } from "react";

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const whatsappUrl =
    "https://wa.me/254742864164?text=Hello%20Shabana%20Palace!%20I%20would%20like%20to%20inquire%20about%20booking%20a%20room.";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip */}
      <div
        className={`absolute bottom-full right-0 mb-3 px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-lg whitespace-nowrap shadow-lg transition-all duration-300 ${
          isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        Chat with us on WhatsApp
        <div className="absolute bottom-0 right-6 translate-y-1/2 rotate-45 w-2 h-2 bg-foreground" />
      </div>

      {/* Button */}
      <div className="relative">
        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-25" />

        {/* Main button */}
        <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110">
          {/* WhatsApp Phone Icon */}
          <Phone className="h-7 w-7 text-white" />
        </div>
      </div>
    </a>
  );
};

export default WhatsAppButton;
