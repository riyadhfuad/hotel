// Previous types remain the same...

export interface Customer {
  id: number;
  name: string;
  idNumber: string;
  phone: string;
  checkIn: string;
  checkOut?: string;
  roomId?: number;
  roomType: string;
  roomPrice: number;
  idDocument: string;
  notes?: string;
  status: 'active' | 'checked_out';
  additionalDocuments: { id: number; type: string; file: string; }[];
  services?: { serviceId: number; price: number; roomId: number; }[];
  createdBy?: {
    id: number;
    name: string;
    username: string;
  };
  checkedOutBy?: {
    id: number;
    name: string;
    username: string;
  };
}