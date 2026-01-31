import { useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  BedDouble,
  Coins,
  FileText,
  Hash,
  Hotel,
  ImagePlus,
  Tv,
  UtensilsCrossed,
  Wifi,
  X,
  Refrigerator,
  Wind,
  Car,
  TreePine,
  Lock,
  WashingMachine,
  Laptop,
  Waves,
  Dumbbell,
} from "lucide-react";
import { FaShower } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRooms } from "@/lib/useRooms";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Room name is required").max(80),
  number: z.string().trim().min(1, "Room number is required").max(20),
  pricePerNight: z.coerce.number().int().min(1, "Price must be greater than 0").max(1_000_000),
  beds: z.coerce.number().int().min(1, "Beds must be at least 1").max(20),
  description: z.string().trim().min(10, "Description is required").max(600, "Max 600 characters"),
});

type FormValues = z.infer<typeof schema>;

// Map amenity IDs to display names that match database
const amenityMap: Record<string, string> = {
  wifi: "WiFi",
  hotShower: "Hot Shower",
  tv: "TV",
  kitchen: "Kitchen",
  miniFridge: "Mini Fridge",
  airConditioning: "Air Conditioning",
  parking: "Parking",
  balcony: "Balcony",
  safe: "Safe",
  washer: "Washer",
  workspace: "Workspace",
  pool: "Pool Access",
  gym: "Gym Access",
};

const amenityConfig: { id: string; label: string; icon: React.ReactNode }[] = [
  { id: "wifi", label: "WiFi", icon: <Wifi className="h-5 w-5" /> },
  { id: "hotShower", label: "Hot Shower", icon: <FaShower className="h-5 w-5" /> },
  { id: "tv", label: "TV", icon: <Tv className="h-5 w-5" /> },
  { id: "kitchen", label: "Kitchen", icon: <UtensilsCrossed className="h-5 w-5" /> },
  { id: "miniFridge", label: "Mini Fridge", icon: <Refrigerator className="h-5 w-5" /> },
  { id: "airConditioning", label: "Air Conditioning", icon: <Wind className="h-5 w-5" /> },
  { id: "parking", label: "Parking", icon: <Car className="h-5 w-5" /> },
  { id: "balcony", label: "Balcony", icon: <TreePine className="h-5 w-5" /> },
  { id: "safe", label: "Safe", icon: <Lock className="h-5 w-5" /> },
  { id: "washer", label: "Washer", icon: <WashingMachine className="h-5 w-5" /> },
  { id: "workspace", label: "Workspace", icon: <Laptop className="h-5 w-5" /> },
  { id: "pool", label: "Pool Access", icon: <Waves className="h-5 w-5" /> },
  { id: "gym", label: "Gym Access", icon: <Dumbbell className="h-5 w-5" /> },
];

export default function AdminAddRoomPage() {
  const { addRoom } = useRooms();
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      number: "",
      pricePerNight: 0,
      beds: 1,
      description: "",
    },
    mode: "onChange",
  });

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload image files only");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotos((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const submit = async (values: FormValues) => {
    if (photos.length === 0) {
      toast.error("Please add at least one photo");
      return;
    }

    if (selectedAmenities.length === 0) {
      toast.error("Please select at least one amenity");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert amenity IDs to display names
      const amenityNames = selectedAmenities.map(id => amenityMap[id]);

      const result = await addRoom({
        name: values.name,
        number: values.number,
        price_per_night: values.pricePerNight,
        beds: values.beds,
        description: values.description,
        amenities: amenityNames,
        photos: photos,
      });

      if (result.success) {
        toast.success("Room added successfully! 🎉");
        form.reset({ name: "", number: "", pricePerNight: 0, beds: 1, description: "" });
        setSelectedAmenities([]);
        setPhotos([]);
      } else {
        toast.error("Failed to add room. Please try again.");
      }
    } catch (error) {
      console.error("Error adding room:", error);
      toast.error("An error occurred while adding the room");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Add New Room</h1>
        <p className="text-muted-foreground">Create a new room listing for Shabana Palace.</p>
      </div>

      <Card className="rounded-2xl shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hotel className="h-5 w-5 text-primary" />
            Room Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roomName">Room Name</Label>
                <div className="relative">
                  <Hotel className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="roomName" className="rounded-xl h-12 pl-10" placeholder="e.g. Deluxe Room" {...form.register("name")} />
                </div>
                {form.formState.errors.name?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomNumber">Room Number</Label>
                <div className="relative">
                  <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="roomNumber" className="rounded-xl h-12 pl-10" placeholder="e.g. 201" {...form.register("number")} />
                </div>
                {form.formState.errors.number?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="pricePerNight">Price per Night (KES)</Label>
                <div className="relative">
                  <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pricePerNight"
                    type="number"
                    className="rounded-xl h-12 pl-10"
                    placeholder="e.g. 3500"
                    {...form.register("pricePerNight")}
                  />
                </div>
                {form.formState.errors.pricePerNight?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.pricePerNight.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="beds">Number of Beds</Label>
                <div className="relative">
                  <BedDouble className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="beds" type="number" className="rounded-xl h-12 pl-10" placeholder="e.g. 2" {...form.register("beds")} />
                </div>
                {form.formState.errors.beds?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.beds.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Textarea
                  id="description"
                  placeholder="Write a short, clear description…"
                  className="rounded-xl min-h-[120px] pl-10 pt-3"
                  {...form.register("description")}
                />
              </div>
              {form.formState.errors.description?.message && (
                <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
              )}
            </div>

            {/* Amenities Section */}
            <div className="space-y-3">
              <Label>Amenities *</Label>
              <p className="text-sm text-muted-foreground">Click to add amenities that will be displayed on the room listing.</p>
              <div className="flex flex-wrap gap-2">
                {amenityConfig.map((amenity) => (
                  <button
                    key={amenity.id}
                    type="button"
                    onClick={() => toggleAmenity(amenity.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all",
                      selectedAmenities.includes(amenity.id)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border hover:border-primary/50 text-foreground"
                    )}
                  >
                    {amenity.icon}
                    <span className="text-sm font-medium">{amenity.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Upload Section */}
            <div className="space-y-3">
              <Label>Room Photos *</Label>
              <p className="text-sm text-muted-foreground">Upload photos of the room (max 5MB each).</p>
              
              <div className="flex flex-wrap gap-3">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Room photo ${index + 1}`}
                      className="w-24 h-24 object-cover rounded-xl border border-border"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ImagePlus className="h-6 w-6" />
                  <span className="text-xs">Add Photo</span>
                </button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="rounded-xl" 
                disabled={!form.formState.isValid || isSubmitting}
              >
                {isSubmitting ? "Adding Room..." : "Add Room"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}