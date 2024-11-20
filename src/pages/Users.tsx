import React from 'react';
import UserManagement from '../components/UserManagement';

export default function Users() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">إدارة المستخدمين</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <UserManagement />
      </div>
    </div>
  );
}