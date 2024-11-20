import React from 'react';
import { Users, Hotel, DollarSign, BedDouble } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import { useCustomerStore } from '../stores/customerStore';
import { useRoomStore } from '../stores/roomStore';
import { startOfDay, endOfDay } from 'date-fns';

export default function Dashboard() {
  const customers = useCustomerStore((state) => state.customers.filter(c => c.status === 'active'));
  const allCustomers = useCustomerStore((state) => state.customers);
  const rooms = useRoomStore((state) => state.rooms);
  
  // حساب إيرادات اليوم لجميع العمليات (تسجيل دخول أو مغادرة)
  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  
  const todayRevenue = allCustomers.reduce((sum, customer) => {
    const checkInDate = new Date(customer.checkIn);
    const checkOutDate = customer.checkOut ? new Date(customer.checkOut) : null;
    
    // إضافة الإيرادات إذا كان تسجيل الدخول أو المغادرة في نفس اليوم
    if ((checkInDate >= todayStart && checkInDate <= todayEnd) || 
        (checkOutDate && checkOutDate >= todayStart && checkOutDate <= todayEnd)) {
      const roomRevenue = customer.roomPrice || 0;
      const servicesRevenue = customer.services?.reduce((acc, service) => acc + service.price, 0) || 0;
      return sum + roomRevenue + servicesRevenue;
    }
    return sum;
  }, 0);

  const stats = {
    totalRooms: rooms.length,
    occupiedRooms: rooms.filter(room => room.status === 'occupied').length,
    availableRooms: rooms.filter(room => room.status === 'available').length,
    todayRevenue,
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة التحكم</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatsCard
          title="إجمالي الغرف"
          value={stats.totalRooms}
          icon={Hotel}
          color="bg-blue-500"
        />
        <StatsCard
          title="الغرف المشغولة"
          value={stats.occupiedRooms}
          icon={BedDouble}
          color="bg-red-500"
        />
        <StatsCard
          title="الغرف المتاحة"
          value={stats.availableRooms}
          icon={Hotel}
          color="bg-green-500"
        />
        <StatsCard
          title="إيرادات اليوم"
          value={`${stats.todayRevenue} ريال`}
          icon={DollarSign}
          color="bg-purple-500"
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">النزلاء الحاليين</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الاسم</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">رقم الغرفة</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">سعر الغرفة</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الخدمات الإضافية</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الإجمالي</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => {
                const servicesTotal = customer.services?.reduce((sum, service) => sum + service.price, 0) || 0;
                const total = (customer.roomPrice || 0) + servicesTotal;
                return (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.roomId || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.roomPrice} ريال</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{servicesTotal} ريال</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{total} ريال</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}