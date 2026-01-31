import { Shield, MapPin, Sparkles, Clock } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Safe & Secure",
    description: "24/7 security with CCTV surveillance for your peace of mind",
  },
  {
    icon: MapPin,
    title: "Prime Location",
    description: "Located on Kenyatta Avenue, near Shawmut Plaza - close to everything",
  },
  {
    icon: Sparkles,
    title: "Clean & Comfortable",
    description: "Spotless rooms with modern amenities for a relaxing stay",
  },
  {
    icon: Clock,
    title: "Flexible Check-in",
    description: "Easy booking with flexible check-in and check-out times",
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Shabana Palace</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Shabana Palace is a premium Airbnb accommodation located in the heart of Nakuru, Kenya. 
            We offer a perfect blend of comfort, luxury, and convenience for both business and leisure travelers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="bg-background rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-coral-light flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
