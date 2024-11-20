import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { PlusCircle, Trash2, UserCircle, Edit2, Lock, Mail, Phone } from 'lucide-react';
import type { User } from '../types';

export default function UserManagement() {
  const { users, roles, permissions, addUser, updateUser, removeUser, toggleUserStatus, user: currentUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'receptionist',
    name: '',
    email: '',
    phone: '',
    status: 'active' as const,
    permissions: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      role: 'receptionist',
      name: '',
      email: '',
      phone: '',
      status: 'active',
      permissions: [],
    });
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      role: user.role,
      name: user.name,
      email: user.email || '',
      phone: user.phone || '',
      status: user.status,
      permissions: user.permissions || [],
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      removeUser(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">إدارة المستخدمين</h3>
        <button
          onClick={() => {
            setEditingUser(null);
            setFormData({
              username: '',
              password: '',
              role: 'receptionist',
              name: '',
              email: '',
              phone: '',
              status: 'active',
              permissions: [],
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5" />
          إضافة مستخدم
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold mb-6">
              {editingUser ? 'تعديل مستخدم' : 'إضافة مستخدم جديد'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المستخدم
                  </label>
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    كلمة المرور {editingUser && '(اتركها فارغة للإبقاء على كلمة المرور الحالية)'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                    required={!editingUser}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الجوال
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الدور الوظيفي
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => {
                      const selectedRole = roles.find(r => r.id === e.target.value);
                      setFormData({
                        ...formData,
                        role: e.target.value as User['role'],
                        permissions: selectedRole?.permissions || []
                      });
                    }}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الحالة
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">نشط</option>
                    <option value="inactive">غير نشط</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الصلاحيات
                </label>
                <div className="grid grid-cols-2 gap-2 bg-gray-50 p-4 rounded-lg">
                  {permissions.map((permission) => (
                    <label key={permission.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission.id)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...formData.permissions, permission.id]
                            : formData.permissions.filter(p => p !== permission.id);
                          setFormData({ ...formData, permissions: newPermissions });
                        }}
                        disabled={formData.role === 'admin'}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-sm text-gray-500">{permission.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingUser ? 'تحديث' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className={`p-4 rounded-lg border ${
              user.status === 'active' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <UserCircle className="w-10 h-10 text-gray-600" />
                <div>
                  <h4 className="font-medium text-lg">{user.name}</h4>
                  <p className="text-sm text-gray-600">{user.username}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                    {user.email && (
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    )}
                    {user.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {currentUser?.id !== user.id && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="text-blue-600 hover:text-blue-800"
                    title="تعديل"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => toggleUserStatus(user.id)}
                    className={`${
                      user.status === 'active' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                    }`}
                    title={user.status === 'active' ? 'إيقاف' : 'تنشيط'}
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="text-red-600 hover:text-red-800"
                    title="حذف"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
            <div className="mt-3">
              <span className={`inline-block px-2 py-1 rounded text-sm ${
                user.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
              }`}>
                {user.status === 'active' ? 'نشط' : 'غير نشط'}
              </span>
              <span className="mr-2 text-sm text-gray-600">
                {roles.find(r => r.id === user.role)?.name}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}