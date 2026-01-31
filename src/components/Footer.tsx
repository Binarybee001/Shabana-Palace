import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from "lucide-react";
import TikTokIcon from "@/assets/tiktok-solo-white-icon.svg";
import { useNavigate, useLocation } from "react-router-dom";

const Footer = () => {
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
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xl">SP</span>
              </div>
              <span className="text-xl font-bold">Shabana Palace</span>
            </div>
            <p className="text-background/70 mb-4">
              Your home away from home in the heart of Nakuru. Experience comfort, luxury, and convenience.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 hover:bg-primary flex items-center justify-center transition-colors">
                <img
                    src={TikTokIcon}
                    alt="TikTok"
                    className="h-5 w-5"
                  />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection("home")} className="text-background/70 hover:text-primary transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("about")} className="text-background/70 hover:text-primary transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("rooms")} className="text-background/70 hover:text-primary transition-colors">
                  Our Rooms
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("booking")} className="text-background/70 hover:text-primary transition-colors">
                  Book Now
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("contact")} className="text-background/70 hover:text-primary transition-colors">
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-background/70">Kenyatta Avenue, near Shawmut Plaza, Nakuru, Kenya</span>
              </li>
              <li>
                <a href="mailto:shabana26@gmail.com" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                  shabana26@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:0742864164" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  0742864164
                </a>
              </li>
              <li>
                <a href="https://wa.me/254742864164" className="flex items-center gap-3 text-background/70 hover:text-primary transition-colors">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                  WhatsApp: 0742864164
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-background/50 text-sm">
              © 2026 Shabana Palace. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-background/50">
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;