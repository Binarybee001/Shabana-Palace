import { Calendar, Users, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { toast } from "sonner";

const BookingSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: "",
    roomType: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.phone || !formData.checkIn || !formData.checkOut || !formData.guests || !formData.roomType) {
      toast.error("Please fill in all fields");
      return;
    }

    // Create WhatsApp message
    const message = `Hello! I would like to book a room at Shabana Palace.

*Booking Details:*
- Name: ${formData.name}
- Phone: ${formData.phone}
- Check-in: ${formData.checkIn}
- Check-out: ${formData.checkOut}
- Guests: ${formData.guests}
- Room Type: ${formData.roomType}

Please confirm availability. Thank you!`;

    const whatsappUrl = `https://wa.me/254780116262?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    
    toast.success("Redirecting to WhatsApp to complete your booking!");
  };

  return (
    <section id="booking" className="py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Book Your Stay</h2>
            <p className="text-muted-foreground text-lg">
              Fill in the details below and we'll confirm your booking via WhatsApp
            </p>
          </div>

          <form 
            onSubmit={handleSubmit}
            className="bg-background rounded-2xl p-8 shadow-card-hover animate-fade-in"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="rounded-xl h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    placeholder="0712 345 678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded-xl h-12 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkIn">Check-in Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                    className="rounded-xl h-12 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkOut">Check-out Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                    className="rounded-xl h-12 pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">Number of Guests</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Select onValueChange={(value) => setFormData({ ...formData, guests: value })}>
                    <SelectTrigger className="rounded-xl h-12 pl-10">
                      <SelectValue placeholder="Select guests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Guest</SelectItem>
                      <SelectItem value="2">2 Guests</SelectItem>
                      <SelectItem value="3">3 Guests</SelectItem>
                      <SelectItem value="4">4 Guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomType">Room Type</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, roomType: value })}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select room" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1 bedroom">1 bedroom</SelectItem>
                    <SelectItem value="2 bedroom">2 bedroom</SelectItem>
                    <SelectItem value="3 bedroom">3 bedroom</SelectItem>
                    <SelectItem value="4 bedroom">4 bedroom</SelectItem>

                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              type="submit"
              size="lg"
              className="w-full rounded-xl bg-primary hover:bg-coral-dark font-bold h-14 text-lg"
            >
              Book via WhatsApp
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Or call us directly at <a href="tel:0742864164" className="text-primary font-semibold hover:underline">0742864164</a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
