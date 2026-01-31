import { useState } from "react";
import { toast } from "sonner";
import { Edit3, Hash, Hotel, Trash2, Pencil } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRooms, type Room } from "@/lib/useRooms";
import { RoomEditForm } from "@/components/admin/RoomEditForm";

export default function AdminDashboardPage() {
  const { rooms, isLoading, deleteRoom, updateRoom } = useRooms();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  const handleDeleteClick = (room: Room) => {
    setSelectedRoom(room);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (room: Room) => {
    setSelectedRoom(room);
    setEditDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedRoom) return;

    const result = await deleteRoom(selectedRoom.id);
    
    if (result.success) {
      toast.success(`${selectedRoom.name} deleted successfully`);
      setDeleteDialogOpen(false);
      setSelectedRoom(null);
    } else {
      toast.error("Failed to delete room");
    }
  };

  const handleUpdate = async (updates: Partial<Omit<Room, 'id' | 'created_at' | 'updated_at'>>) => {
    if (!selectedRoom) return;

    const result = await updateRoom(selectedRoom.id, updates);
    
    if (result.success) {
      toast.success("Room updated successfully");
      setEditDialogOpen(false);
      setSelectedRoom(null);
    } else {
      toast.error("Failed to update room");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse text-muted-foreground">Loading rooms...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="rounded-2xl shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Rooms</CardTitle>
          </CardHeader>
          <CardContent className="flex items-end justify-between">
            <p className="text-4xl font-extrabold text-primary">{rooms.length}</p>
            <Hotel className="h-6 w-6 text-muted-foreground" />
          </CardContent>
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-extrabold">Rooms</h1>
          <p className="text-sm text-muted-foreground">Manage your room listings</p>
        </div>

        <div className="bg-background rounded-2xl border border-border shadow-card overflow-hidden">
          <div className="divide-y divide-border">
            {rooms.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <Hotel className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No rooms yet. Add your first room!</p>
              </div>
            ) : (
              rooms.map((room) => (
                <div key={room.id} className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-lg truncate">{room.name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Hash className="h-4 w-4" /> Room {room.number}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Edit3 className="h-4 w-4" /> KES {room.price_per_night.toLocaleString()}/night
                      </span>
                      <span className="inline-flex items-center gap-1">
                        {room.beds} Bed{room.beds > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() => handleEditClick(room)}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleDeleteClick(room)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{selectedRoom?.name}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="rounded-xl bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="rounded-2xl max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Room</DialogTitle>
            <DialogDescription>
              Update the details for {selectedRoom?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedRoom && (
            <RoomEditForm
              room={selectedRoom}
              onSave={handleUpdate}
              onCancel={() => setEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}