import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
        {/* Main Title */}
        <h1
          className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-lg animate-fade-in uppercase"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          <span className="text-red-600">SHABANA</span> <span className="text-black">PALACE</span>
        </h1>
        
        {/* Subtitle */}
        <p
          className="text-xl md:text-2xl text-primary-foreground/90 mb-2 max-w-2xl animate-fade-in font-semibold"
          style={{ animationDelay: "0.1s", textShadow: "2px 2px 6px rgba(0,0,0,0.7)" }}
        >
          Your Home Away From Home
        </p>
        
        <p
          className="text-lg text-primary-foreground/80 mb-8 max-w-xl animate-fade-in"
          style={{ animationDelay: "0.15s", textShadow: "1px 1px 4px rgba(0,0,0,0.6)" }}
        >
          Experience comfort, luxury, and convenience in the heart of Nakuru
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {/* Book Now Button */}
          <Button 
            size="lg" 
            onClick={scrollToBooking}
            className="rounded-full bg-primary gap-2 px-8 h-14 text-lg font-bold shadow-lg 
                       hover:bg-white hover:text-red-600 transition-colors duration-300"
          >
            Book Now
          </Button>
          
          {/* Phone Button */}
          <a href="tel:0780116262">
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full gap-2 px-8 h-14 text-lg font-semibold bg-background/80 border-2 border-gray-300
                         hover:bg-red-600 hover:text-white transition-colors duration-300"
            >
              <Phone className="h-5 w-5" />
              0742864164
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
