import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

const MapSection = () => {
  const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Kenyatta+Avenue+near+Shawmut+Plaza+Nakuru+Kenya";
  const embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.7481!2d36.0689!3d-0.2871!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKenyatta%20Avenue%2C%20Nakuru!5e0!3m2!1sen!2ske!4v1" ;

  return (
    <section id="location" className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Find Us</h2>
          <p className="text-muted-foreground text-lg flex items-center justify-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Kenyatta Avenue, near Shawmut Plaza, Nakuru, Kenya
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-card-hover animate-fade-in">
            <div className="relative w-full h-[400px] bg-muted">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Shabana Palace Location"
                className="w-full h-full"
              />
            </div>
          </div>
          {/* INFO CARD */}
          <div className="mt-8 bg-background rounded-2xl shadow-card p-6 animate-fade-in">
            <h3 className="text-2xl font-bold mb-2">Shabana Palace</h3>
            <p className="text-muted-foreground mb-4">
              Kenyatta Avenue, near Shawmut Plaza, Nakuru
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <Button className="rounded-full bg-primary hover:bg-coral-dark gap-2 px-6">
                  <Navigation className="h-5 w-5" />
                  Get Directions
                </Button>
              </a>
              <a href = "tel:+254742864164">
              <Button
                variant="outline"
                className="rounded-full border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
              >
                Call: 0742864164
              </Button>
              </a>
            </div>
          </div>

          
        </div>
      </div>
    </section>
  );
};

export default MapSection;
