import { create } from 'zustand';
import { Customer } from '../types';
import { useRoomStore } from './roomStore';
import { useServiceStore } from './serviceStore';
import { useAuthStore } from './authStore';

interface CustomerState {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'status'>) => void;
  removeCustomer: (id: number) => void;
  updateCustomer: (id: number, customer: Partial<Customer>) => void;
  checkoutCustomer: (id: number) => void;
}

export const useCustomerStore = create<CustomerState>((set, get) => ({
  customers: [
    {
      id: 1,
      name: 'أحمد محمد',
      idNumber: 'ID123456',
      phone: '0501234567',
      checkIn: '2024-03-10T12:00',
      roomType: 'مزدوجة',
      roomPrice: 500,
      roomId: 102,
      status: 'active',
      idDocument: '',
      additionalDocuments: [],
      services: [
        { serviceId: 1, price: 100, roomId: 102 },
        { serviceId: 2, price: 50, roomId: 102 }
      ],
      createdBy: {
        id: 1,
        name: 'مدير النظام',
        username: 'admin'
      }
    },
  ],
  addCustomer: (customer) => {
    const { services } = useServiceStore.getState();
    const { user } = useAuthStore.getState();
    
    const customerServices = customer.services?.map(serviceId => {
      const service = services.find(s => s.id === serviceId);
      return service ? {
        serviceId: service.id,
        price: service.price,
        roomId: customer.roomId
      } : null;
    }).filter(Boolean);

    if (customer.roomId) {
      useRoomStore.getState().updateRoomStatus(customer.roomId, 'occupied');
    }

    set((state) => ({
      customers: [
        ...state.customers,
        { 
          ...customer, 
          id: Math.max(0, ...state.customers.map(c => c.id)) + 1,
          status: 'active',
          services: customerServices,
          createdBy: user ? {
            id: user.id,
            name: user.name,
            username: user.username
          } : undefined
        },
      ],
    }));
  },
  removeCustomer: (id) => {
    const customer = get().customers.find(c => c.id === id);
    
    if (customer?.roomId && customer.status === 'active') {
      useRoomStore.getState().updateRoomStatus(customer.roomId, 'available');
    }

    set((state) => ({
      customers: state.customers.filter((c) => c.id !== id),
    }));
  },
  updateCustomer: (id, updatedCustomer) => {
    const currentCustomer = get().customers.find(c => c.id === id);
    
    if (currentCustomer?.roomId !== updatedCustomer.roomId) {
      if (currentCustomer?.roomId) {
        useRoomStore.getState().updateRoomStatus(currentCustomer.roomId, 'available');
      }
      if (updatedCustomer.roomId) {
        useRoomStore.getState().updateRoomStatus(updatedCustomer.roomId, 'occupied');
      }
    }

    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id ? { ...customer, ...updatedCustomer } : customer
      ),
    }));
  },
  checkoutCustomer: (id) => {
    const customer = get().customers.find(c => c.id === id);
    const { user } = useAuthStore.getState();
    
    if (customer?.roomId) {
      useRoomStore.getState().updateRoomStatus(customer.roomId, 'available');
    }

    set((state) => ({
      customers: state.customers.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              status: 'checked_out',
              checkOut: new Date().toISOString(),
              checkedOutBy: user ? {
                id: user.id,
                name: user.name,
                username: user.username
              } : undefined
            }
          : customer
      ),
    }));
  },
}));