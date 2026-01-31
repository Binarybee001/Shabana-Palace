import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export interface Room {
  id: string;
  name: string;
  number: string;
  price_per_night: number;
  beds: number;
  description: string;
  amenities: string[];
  photos: string[];
  created_at: string;
  updated_at: string;
}

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRooms(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms');
    } finally {
      setIsLoading(false);
    }
  };

  const addRoom = async (room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .insert([room])
        .select()
        .single();

      if (error) throw error;

      setRooms([data, ...rooms]);
      return { success: true, data };
    } catch (err) {
      console.error('Error adding room:', err);
      return { success: false, error: err };
    }
  };

  const updateRoom = async (id: string, updates: Partial<Omit<Room, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setRooms(rooms.map(r => r.id === id ? data : r));
      return { success: true, data };
    } catch (err) {
      console.error('Error updating room:', err);
      return { success: false, error: err };
    }
  };

  const deleteRoom = async (id: string) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setRooms(rooms.filter(r => r.id !== id));
      return { success: true };
    } catch (err) {
      console.error('Error deleting room:', err);
      return { success: false, error: err };
    }
  };

  return { rooms, isLoading, error, fetchRooms, addRoom, updateRoom, deleteRoom };
}