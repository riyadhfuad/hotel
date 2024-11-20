import React, { useState } from 'react';
import { useRoomStore } from '../stores/roomStore';
import { PlusCircle, Trash2, BedDouble, AlertCircle } from 'lucide-react';

export default function RoomManagement() {
  const { rooms, addRoom, removeRoom } = useRoomStore();
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    number: '',
    type: 'مفردة',
    beds: 1,
    price: 300,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addRoom(formData);
    setShowForm(false);
    setFormData({
      number: '',
      type: 'مفردة',
      beds: 1,
      price: 300,
    });
  };

  const handleRemoveRoom = (id: number) => {
    const room = rooms.find(r => r.id === id);
    if (room?.status === 'occupied') {
      setError('لا يمكن حذف الغرفة لأنها محجوزة حالياً. يجب إخلاء الغرفة أولاً.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    if (window.confirm('هل أنت متأكد من حذف هذه الغرفة؟')) {
      removeRoom(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">الغرف</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <PlusCircle className="w-4 h-4" />
          إضافة
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">إضافة غرفة جديدة</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">رقم الغرفة</label>
                <input
                  type="text"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">نوع الغرفة</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({
                    ...formData,
                    type: e.target.value,
                    price: e.target.value === 'مفردة' ? 300 : 500,
                    beds: e.target.value === 'مفردة' ? 1 : 2
                  })}
                  className="w-full p-2 border rounded"
                >
                  <option value="مفردة">مفردة</option>
                  <option value="مزدوجة">مزدوجة</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عدد الأسرّة</label>
                <input
                  type="number"
                  min="1"
                  max="4"
                  value={formData.beds}
                  onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  حفظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {rooms.map((room) => (
          <div
            key={room.id}
            className={`p-3 rounded-lg border ${
              room.status === 'occupied' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">غرفة {room.number}</h4>
                  <span className={`text-xs px-2 py-0.5 rounded ${
                    room.status === 'available' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}>
                    {room.status === 'available' ? 'متاحة' : 'مشغولة'}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  <div className="flex items-center gap-1">
                    <BedDouble className="w-4 h-4" />
                    <span>{room.beds}</span>
                  </div>
                  <div>{room.price} ريال</div>
                </div>
              </div>
              <button
                onClick={() => handleRemoveRoom(room.id)}
                className={`text-red-600 hover:text-red-800 ${
                  room.status === 'occupied' ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={room.status === 'occupied'}
                title={room.status === 'occupied' ? 'لا يمكن حذف غرفة محجوزة' : 'حذف الغرفة'}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}