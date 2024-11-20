import React, { useState, useMemo } from 'react';
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { Users, DollarSign } from 'lucide-react';
import { useCustomerStore } from '../stores/customerStore';
import StatsCard from '../components/StatsCard';

export default function Activity() {
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const customers = useCustomerStore((state) => state.customers);

  const calculateStats = (startDate: Date, endDate: Date) => {
    const periodCustomers = customers.filter(customer => {
      const checkIn = new Date(customer.checkIn);
      return checkIn >= startDate && checkIn <= endDate;
    });

    const roomRevenue = periodCustomers.reduce((sum, customer) => sum + (customer.roomPrice || 0), 0);
    const servicesRevenue = periodCustomers.reduce((sum, customer) => {
      return sum + (customer.services?.reduce((acc, service) => acc + service.price, 0) || 0);
    }, 0);

    return {
      period: format(startDate, 'yyyy/MM/dd'),
      roomRevenue,
      servicesRevenue,
      totalRevenue: roomRevenue + servicesRevenue,
      customerCount: periodCustomers.length
    };
  };

  const stats = useMemo(() => {
    const now = new Date();
    const periods: { start: Date; end: Date; }[] = [];

    switch (period) {
      case 'daily':
        for (let i = 0; i < 7; i++) {
          const date = subDays(now, i);
          periods.push({
            start: startOfDay(date),
            end: endOfDay(date)
          });
        }
        break;
      case 'weekly':
        for (let i = 0; i < 4; i++) {
          const date = subDays(now, i * 7);
          periods.push({
            start: startOfWeek(date),
            end: endOfWeek(date)
          });
        }
        break;
      case 'monthly':
        for (let i = 0; i < 6; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          periods.push({
            start: startOfMonth(date),
            end: endOfMonth(date)
          });
        }
        break;
    }

    return periods.map(({ start, end }) => calculateStats(start, end)).reverse();
  }, [period, customers]);

  const currentStats = stats[stats.length - 1];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">سجل الحركة</h1>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as typeof period)}
            className="bg-white border rounded-lg px-4 py-2"
          >
            <option value="daily">يومي</option>
            <option value="weekly">أسبوعي</option>
            <option value="monthly">شهري</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <StatsCard
          title="إجمالي الإيرادات"
          value={`${currentStats.totalRevenue} ريال`}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatsCard
          title="عدد النزلاء"
          value={currentStats.customerCount}
          icon={Users}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">تفاصيل الإيرادات</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الفترة</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">إيرادات الغرف</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">إيرادات الخدمات</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الإجمالي</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">عدد النزلاء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.map((stat, index) => (
                  <tr key={index} className={index === stats.length - 1 ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 text-sm text-gray-900">{stat.period}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{stat.roomRevenue} ريال</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{stat.servicesRevenue} ريال</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{stat.totalRevenue} ريال</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{stat.customerCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}