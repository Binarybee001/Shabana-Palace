import { createContext, useContext, useMemo, useState } from "react";
import type { AdminMessage, AdminRoom, RoomAmenity } from "@/lib/admin/types";
import { initialMessages, initialRooms } from "@/lib/admin/mockData";

type AdminDataContextValue = {
  rooms: AdminRoom[];
  messages: AdminMessage[];
  addRoom: (room: Omit<AdminRoom, "id">) => void;
  updateRoom: (id: string, patch: Partial<Omit<AdminRoom, "id">>) => void;
  deleteRoom: (id: string) => void;
  addReply: (messageId: string, body: string) => void;
};

const AdminDataContext = createContext<AdminDataContextValue | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<AdminRoom[]>(initialRooms);
  const [messages, setMessages] = useState<AdminMessage[]>(initialMessages);

  const value = useMemo<AdminDataContextValue>(
    () => ({
      rooms,
      messages,
      addRoom: (room) => {
        const id = `room_${Date.now().toString(36)}`;
        setRooms((prev) => [{ id, ...room }, ...prev]);
      },
      updateRoom: (id, patch) => {
        setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
      },
      deleteRoom: (id) => {
        setRooms((prev) => prev.filter((r) => r.id !== id));
      },
      addReply: (messageId, body) => {
        setMessages((prev) =>
          prev.map((m) => {
            if (m.id !== messageId) return m;
            return {
              ...m,
              replies: [
                {
                  id: `reply_${Date.now().toString(36)}`,
                  body,
                  createdAt: new Date().toISOString(),
                },
                ...m.replies,
              ],
            };
          }),
        );
      },
    }),
    [rooms, messages],
  );

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within AdminDataProvider");
  return ctx;
}
