import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "James Mwangi",
    location: "Nairobi, Kenya",
    rating: 5,
    text: "Amazing stay, very clean and close to town. The staff was incredibly friendly and helpful. Will definitely come back!",
    date: "December 2025",
  },
  {
    id: 2,
    name: "Sarah Ochieng",
    location: "Kisumu, Kenya",
    rating: 5,
    text: "Excellent customer service and secure environment. I felt completely safe during my entire stay. The room was spotless!",
    date: "November 2025",
  },
  {
    id: 3,
    name: "David Kimani",
    location: "Mombasa, Kenya",
    rating: 5,
    text: "Perfect location along Kenyatta Avenue, highly recommended. Everything you need is within walking distance.",
    date: "October 2025",
  },
  {
    id: 4,
    name: "Grace Wanjiku",
    location: "Eldoret, Kenya",
    rating: 5,
    text: "Best Airbnb experience in Nakuru! The amenities were top-notch and the bed was incredibly comfortable. A home away from home.",
    date: "September 2025",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="testimonials" className="py-16 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Guests Say</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Don't just take our word for it - hear from our satisfied guests
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-background rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 animate-fade-in relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Quote className="absolute top-4 right-4 h-8 w-8 text-coral-light" />
              
              <div className="flex items-center gap-1 mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              <p className="text-foreground mb-4 italic">"{testimonial.text}"</p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
                <p className="text-xs text-muted-foreground">{testimonial.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
