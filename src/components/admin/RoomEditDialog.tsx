import { useState, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  ImagePlus,
  X,
  Wifi,
  Tv,
  UtensilsCrossed,
  Refrigerator,
  Wind,
  Car,
  TreePine,
  Lock,
  WashingMachine,
  Laptop,
  Waves,
  Dumbbell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FaShower } from "react-icons/fa";

import type { AdminRoom, RoomAmenity } from "@/lib/admin/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const schema = z.object({
  name: z.string().trim().min(2, "Room name is required").max(80, "Max 80 characters"),
  number: z.string().trim().min(1, "Room number is required").max(20, "Max 20 characters"),
  pricePerNight: z.coerce.number().int().min(1, "Price must be greater than 0").max(1_000_000),
  beds: z.coerce.number().int().min(1, "Beds must be at least 1").max(20),
  description: z.string().trim().min(10, "Description is required").max(600, "Max 600 characters"),
});

type FormValues = z.infer<typeof schema>;

const amenityConfig: { id: RoomAmenity; label: string; icon: React.ReactNode }[] = [
  { id: "wifi", label: "WiFi", icon: <Wifi className="h-4 w-4" /> },
  { id: "hotShower", label: "Hot Shower", icon: <FaShower className="h-4 w-4" /> },
  { id: "tv", label: "TV", icon: <Tv className="h-4 w-4" /> },
  { id: "kitchen", label: "Kitchen", icon: <UtensilsCrossed className="h-4 w-4" /> },
  { id: "miniFridge", label: "Mini Fridge", icon: <Refrigerator className="h-4 w-4" /> },
  { id: "airConditioning", label: "A/C", icon: <Wind className="h-4 w-4" /> },
  { id: "parking", label: "Parking", icon: <Car className="h-4 w-4" /> },
  { id: "balcony", label: "Balcony", icon: <TreePine className="h-4 w-4" /> },
  { id: "safe", label: "Safe", icon: <Lock className="h-4 w-4" /> },
  { id: "washer", label: "Washer", icon: <WashingMachine className="h-4 w-4" /> },
  { id: "workspace", label: "Workspace", icon: <Laptop className="h-4 w-4" /> },
  { id: "pool", label: "Pool", icon: <Waves className="h-4 w-4" /> },
  { id: "gym", label: "Gym", icon: <Dumbbell className="h-4 w-4" /> },
];

export function RoomEditDialog({
  room,
  onSave,
}: {
  room: AdminRoom;
  onSave: (patch: Partial<AdminRoom>) => void;
}) {
  const [open, setOpen] = useState(false);
  const [photos, setPhotos] = useState<string[]>(room.photos || []);
  const [amenities, setAmenities] = useState<RoomAmenity[]>(room.amenities || []);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { 
      name: room.name, 
      number: room.number,
      pricePerNight: room.pricePerNight,
      beds: room.beds,
      description: room.description,
    },
    values: { 
      name: room.name, 
      number: room.number,
      pricePerNight: room.pricePerNight,
      beds: room.beds,
      description: room.description,
    },
    mode: "onChange",
  });

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

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    if (previewIndex === index) {
      setPreviewIndex(null);
    } else if (previewIndex !== null && previewIndex > index) {
      setPreviewIndex(previewIndex - 1);
    }
  };

  const toggleAmenity = (amenity: RoomAmenity) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const submit = (values: FormValues) => {
    onSave({
      name: values.name,
      number: values.number,
      pricePerNight: values.pricePerNight,
      beds: values.beds,
      description: values.description,
      photos,
      amenities,
    });
    toast.success("Room updated");
    setOpen(false);
  };

  const navigatePreview = (direction: "prev" | "next") => {
    if (previewIndex === null || photos.length === 0) return;
    if (direction === "prev") {
      setPreviewIndex(previewIndex === 0 ? photos.length - 1 : previewIndex - 1);
    } else {
      setPreviewIndex(previewIndex === photos.length - 1 ? 0 : previewIndex + 1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="rounded-xl">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit room</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="photos">Photos ({photos.length})</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <form id="room-edit-form" className="space-y-4" onSubmit={form.handleSubmit(submit)}>
              <div className="space-y-2">
                <Label htmlFor={`edit-room-name-${room.id}`}>Room Name</Label>
                <Input
                  id={`edit-room-name-${room.id}`}
                  className="rounded-xl h-11"
                  {...form.register("name")}
                />
                {form.formState.errors.name?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`edit-room-number-${room.id}`}>Room Number</Label>
                <Input
                  id={`edit-room-number-${room.id}`}
                  className="rounded-xl h-11"
                  {...form.register("number")}
                />
                {form.formState.errors.number?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.number.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`edit-room-price-${room.id}`}>Price per Night (KES)</Label>
                <Input
                  id={`edit-room-price-${room.id}`}
                  type="number"
                  className="rounded-xl h-11"
                  {...form.register("pricePerNight")}
                />
                {form.formState.errors.pricePerNight?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.pricePerNight.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`edit-room-beds-${room.id}`}>Number of Beds</Label>
                <Input
                  id={`edit-room-beds-${room.id}`}
                  type="number"
                  className="rounded-xl h-11"
                  {...form.register("beds")}
                />
                {form.formState.errors.beds?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.beds.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor={`edit-room-description-${room.id}`}>Description</Label>
                <Textarea
                  id={`edit-room-description-${room.id}`}
                  placeholder="Describe the room..."
                  className="rounded-xl min-h-[100px]"
                  {...form.register("description")}
                />
                {form.formState.errors.description?.message && (
                  <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                )}
              </div>
            </form>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4 mt-4">
            {/* Photo Preview Modal */}
            {previewIndex !== null && photos[previewIndex] && (
              <div className="relative mb-4">
                <div className="relative bg-muted rounded-xl overflow-hidden">
                  <img
                    src={photos[previewIndex]}
                    alt={`Photo ${previewIndex + 1}`}
                    className="w-full h-64 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setPreviewIndex(null)}
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background rounded-full p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  {photos.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => navigatePreview("prev")}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => navigatePreview("next")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {previewIndex + 1} of {photos.length}
                </p>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Click on a photo to preview. Hover to see delete option.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {photos.map((photo, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all",
                    previewIndex === index ? "border-primary" : "border-border hover:border-primary/50"
                  )}
                  onClick={() => setPreviewIndex(index)}
                >
                  <img
                    src={photo}
                    alt={`Room photo ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(index);
                    }}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="h-20 rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <ImagePlus className="h-5 w-5" />
                <span className="text-xs">Add</span>
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
          </TabsContent>

          <TabsContent value="amenities" className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
              Click to toggle amenities for this room.
            </p>
            <div className="flex flex-wrap gap-2">
              {amenityConfig.map((amenity) => (
                <button
                  key={amenity.id}
                  type="button"
                  onClick={() => toggleAmenity(amenity.id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm",
                    amenities.includes(amenity.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background border-border hover:border-primary/50 text-foreground"
                  )}
                >
                  {amenity.icon}
                  <span className="font-medium">{amenity.label}</span>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4">
          <Button
            type="submit"
            form="room-edit-form"
            className="rounded-xl"
            disabled={!form.formState.isValid}
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}