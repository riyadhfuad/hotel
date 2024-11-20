import React from 'react';
import RoomManagement from '../components/RoomManagement';
import ServiceManagement from '../components/ServiceManagement';

export default function Rooms() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">إدارة الغرف</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <RoomManagement />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">الخدمات الإضافية</h2>
        <div className="bg-white rounded-lg shadow-md p-6">
          <ServiceManagement />
        </div>
      </div>
    </div>
  );
}