import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    // If we're not on the home page, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // If we're already on home page, just scroll
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xl">SP</span>
            </div>
            <span
              className="text-xl font-bold uppercase"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              <span className="text-primary">SHABANA</span> <span className="text-black">PALACE</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection("home")} className="font-semibold hover:text-primary transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection("about")} className="font-semibold hover:text-primary transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("rooms")} className="font-semibold hover:text-primary transition-colors">
              Rooms
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="font-semibold hover:text-primary transition-colors">
              Testimonials
            </button>
            <button onClick={() => scrollToSection("contact")} className="font-semibold hover:text-primary transition-colors">
              Contact
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3 animate-fade-in">
            <button onClick={() => scrollToSection("home")} className="text-left py-2 font-semibold hover:text-primary transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection("about")} className="text-left py-2 font-semibold hover:text-primary transition-colors">
              About
            </button>
            <button onClick={() => scrollToSection("rooms")} className="text-left py-2 font-semibold hover:text-primary transition-colors">
              Rooms
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="text-left py-2 font-semibold hover:text-primary transition-colors">
              Testimonials
            </button>
            <button onClick={() => scrollToSection("contact")} className="text-left py-2 font-semibold hover:text-primary transition-colors">
              Contact
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;