import { create } from 'zustand';
import { Room } from '../types';

interface RoomState {
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id' | 'status'>) => void;
  removeRoom: (id: number) => void;
  updateRoomStatus: (id: number, status: 'available' | 'occupied') => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  rooms: [
    {
      id: 101,
      number: '101',
      type: 'مفردة',
      beds: 1,
      price: 300,
      status: 'available',
    },
    {
      id: 102,
      number: '102',
      type: 'مزدوجة',
      beds: 2,
      price: 500,
      status: 'occupied',
    },
  ],
  addRoom: (room) =>
    set((state) => ({
      rooms: [
        ...state.rooms,
        { 
          ...room, 
          id: Math.max(0, ...state.rooms.map(r => r.id)) + 1,
          status: 'available'
        },
      ],
    })),
  removeRoom: (id) =>
    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== id),
    })),
  updateRoomStatus: (id, status) =>
    set((state) => ({
      rooms: state.rooms.map((room) =>
        room.id === id ? { ...room, status } : room
      ),
    })),
}));