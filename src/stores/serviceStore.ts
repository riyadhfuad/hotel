import { create } from 'zustand';
import { Service, ServiceBooking } from '../types';

interface ServiceState {
  services: Service[];
  bookings: ServiceBooking[];
  addService: (service: Omit<Service, 'id'>) => void;
  removeService: (id: number) => void;
  updateService: (id: number, service: Partial<Service>) => void;
  bookService: (booking: Omit<ServiceBooking, 'id'>) => void;
  removeBooking: (serviceId: number, roomId: number) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  services: [
    {
      id: 1,
      name: 'سرير إضافي',
      price: 100,
      description: 'سرير مفرد إضافي للغرفة',
      type: 'bed',
    },
    {
      id: 2,
      name: 'خدمة الإنترنت',
      price: 50,
      description: 'إنترنت فائق السرعة',
      type: 'internet',
    },
  ],
  bookings: [],
  addService: (service) =>
    set((state) => ({
      services: [
        ...state.services,
        { ...service, id: Math.max(0, ...state.services.map((s) => s.id)) + 1 },
      ],
    })),
  removeService: (id) =>
    set((state) => ({
      services: state.services.filter((service) => service.id !== id),
    })),
  updateService: (id, updatedService) =>
    set((state) => ({
      services: state.services.map((service) =>
        service.id === id ? { ...service, ...updatedService } : service
      ),
    })),
  bookService: (booking) =>
    set((state) => ({
      bookings: [...state.bookings, booking],
    })),
  removeBooking: (serviceId, roomId) =>
    set((state) => ({
      bookings: state.bookings.filter(
        (booking) => !(booking.serviceId === serviceId && booking.roomId === roomId)
      ),
    })),
}));