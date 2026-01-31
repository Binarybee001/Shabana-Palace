import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import { Room } from "@/lib/useRooms";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import {
  Wifi,
  Tv,
  Coffee,
  Bath,
  Bed,
  MessageCircle,
  ArrowLeft,
  Grid3x3,
  Star,
  Trash2,
  Send,
  User,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const amenityIcons: Record<string, typeof Wifi> = {
  WiFi: Wifi,
  TV: Tv,
  "Smart TV": Tv,
  "Hot Shower": Bath,
  "Mini Fridge": Coffee,
  Kitchen: Coffee,
  Balcony: Coffee,
  "Air Conditioning": Coffee,
  "Mini Bar": Coffee,
  "Room Service": Coffee,
};

interface Review {
  id: string;
  room_id: string;
  name: string;
  email: string;
  comment: string;
  rating: number;
  created_at: string;
}

const RoomDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [room, setRoom] = useState<Room | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [photoIndex, setPhotoIndex] = useState<number | null>(null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    email: "",
    comment: "",
    rating: 5,
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        setRoom(data);
      } catch (error) {
        console.error('Error fetching room:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoom();
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchReviews = async () => {
    try {
      setReviewsLoading(true);
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('room_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newReview.name || !newReview.email || !newReview.comment) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmittingReview(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert([
          {
            room_id: id,
            name: newReview.name,
            email: newReview.email,
            comment: newReview.comment,
            rating: newReview.rating,
          }
        ]);

      if (error) throw error;

      toast.success("Review posted successfully!");
      setNewReview({ name: "", email: "", comment: "", rating: 5 });
      fetchReviews();
    } catch (error) {
      console.error('Error posting review:', error);
      toast.error("Failed to post review");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string, reviewEmail: string) => {
    const userEmail = prompt("Enter your email to confirm deletion:");
    
    if (userEmail !== reviewEmail) {
      toast.error("Email does not match. Cannot delete review.");
      return;
    }

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error("Failed to delete review");
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading room...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-destructive">Room not found</p>
        </div>
        <Footer />
      </>
    );
  }

  const photos = room.photos && room.photos.length > 0 ? room.photos : [];

  const whatsappLink =
    "https://wa.me/254742864164?text=" +
    encodeURIComponent(
      `Hello, I would like to book the ${room.name} from ${checkIn?.toDateString()} to ${checkOut?.toDateString()}. Will the room be available?`
    );

  const handleReservation = (e: React.MouseEvent) => {
    if (!checkIn || !checkOut) {
      e.preventDefault();
      alert("Please select both check-in and check-out dates before reserving.");
    }
  };

  return (
    <>
      <Header />

      <div className="container mx-auto px-4 mt-4">
        <button
          onClick={() => navigate("/all-rooms")}
          className="flex items-center gap-1 text-gray-600 hover:text-primary transition"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </button>
      </div>

      <main className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold drop-shadow-lg text-center mb-2">
          {room.name}
        </h2>
          
        <div className="max-w-5xl mx-auto mb-10 relative">
          {photos.length > 0 ? (
            <>
              <div className="grid grid-cols-4 gap-2">
                <div className="relative col-span-4 md:col-span-2 md:row-span-2">
                  <img
                    src={photos[0]}
                    alt={room.name}
                    className="w-full h-[400px] md:h-full object-cover rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                    onClick={() => setPhotoIndex(0)}
                  />
                  <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full font-semibold z-10">
                    KES {room.price_per_night.toLocaleString()}/night
                  </div>
                </div>

                {photos.slice(1, 5).map((photo, idx) => (
                  <div key={idx} className="relative col-span-2 md:col-span-1">
                    <img
                      src={photo}
                      alt={`${room.name} - view ${idx + 2}`}
                      className="w-full h-[120px] md:h-[195px] object-cover rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                      onClick={() => setPhotoIndex(idx + 1)}
                    />
                  </div>
                ))}
                
                {photos.length < 5 && Array.from({ length: 5 - photos.length }).map((_, idx) => (
                  <div key={`extra-${idx}`} className="relative col-span-2 md:col-span-1">
                    <img
                      src={photos[idx % photos.length]}
                      alt={`${room.name} - view`}
                      className="w-full h-[120px] md:h-[195px] object-cover rounded-lg shadow cursor-pointer hover:opacity-90 transition"
                      onClick={() => setPhotoIndex(idx % photos.length)}
                    />
                  </div>
                ))}
              </div>

              {/* Show all photos button - Airbnb style */}
              {photos.length > 5 && (
                <button
                  onClick={() => setShowAllPhotos(true)}
                  className="absolute bottom-4 right-4 bg-white border border-gray-800 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-50 transition flex items-center gap-2 font-semibold text-sm"
                >
                  <Grid3x3 className="h-4 w-4" />
                  Show all photos
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
        </div>

        {/* All Photos Dialog */}
        <Dialog open={showAllPhotos} onOpenChange={setShowAllPhotos}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{room.name} - All Photos</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {photos.map((photo, idx) => (
                <img
                  key={idx}
                  src={photo}
                  alt={`${room.name} - photo ${idx + 1}`}
                  className="w-full h-auto object-cover rounded-lg cursor-pointer hover:opacity-90 transition"
                  onClick={() => {
                    setPhotoIndex(idx);
                    setShowAllPhotos(false);
                  }}
                />
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Lightbox Modal */}
        {photoIndex !== null && photos.length > 0 && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setPhotoIndex(null)}
          >
            <div className="relative w-full max-w-2xl">
              <img
                src={photos[photoIndex]}
                alt={room.name}
                className="w-full max-h-[60vh] object-contain rounded-lg mx-auto"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                onClick={() => setPhotoIndex(null)}
                className="absolute -top-12 right-0 bg-white rounded-full p-2 hover:bg-gray-200 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 mb-6">
          <p className="text-muted-foreground mb-4">{room.description}</p>

          <div className="flex gap-6 text-sm mb-4">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" /> {room.beds} Bed{room.beds > 1 ? 's' : ''}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {room.amenities.map((a) => {
              const Icon = amenityIcons[a] || Wifi;
              return (
                <span
                  key={a}
                  className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-xs"
                >
                  <Icon className="h-3 w-3" />
                  {a}
                </span>
              );
            })}
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="font-semibold mb-3">Select Dates *</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <DatePicker
              selected={checkIn}
              onChange={(date) => setCheckIn(date)}
              placeholderText="Check-in"
              className="border rounded px-3 py-2 w-full"
            />
            <DatePicker
              selected={checkOut}
              onChange={(date) => setCheckOut(date)}
              placeholderText="Check-out"
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
          
          <a  href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleReservation}
            className="flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-full shadow transition"
          >
            <MessageCircle className="h-5 w-5" />
            Reserve the Room
          </a>
        </div>

        {/* Reviews Section */}
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="font-bold text-xl mb-4">Reviews ({reviews.length})</h3>

          {/* Add Review Form */}
          <form onSubmit={handleSubmitReview} className="mb-8 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-4">Leave a Review</h4>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reviewName">Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reviewName"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    placeholder="Your name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewEmail">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="reviewEmail"
                    type="email"
                    value={newReview.email}
                    onChange={(e) => setNewReview({ ...newReview, email: e.target.value })}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewRating">Rating *</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                      className="transition"
                    >
                      <Star
                        className={`h-6 w-6 ${
                          star <= newReview.rating
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewComment">Comment *</Label>
                <Textarea
                  id="reviewComment"
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience..."
                  className="min-h-[100px]"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmittingReview}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmittingReview ? "Posting..." : "Post Review"}
              </Button>
            </div>
          </form>

          {/* Display Reviews */}
          <div className="space-y-4">
            {reviewsLoading ? (
              <p className="text-muted-foreground text-center py-4">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="border-b pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold">{review.name}</p>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        ))}
                        {Array.from({ length: 5 - review.rating }).map((_, i) => (
                          <Star key={i + review.rating} className="h-4 w-4 text-gray-300" />
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteReview(review.id, review.email)}
                      className="text-destructive hover:text-destructive/80 transition"
                      title="Delete your review"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-foreground">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RoomDetail;