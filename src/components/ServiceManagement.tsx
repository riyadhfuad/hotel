import React, { useState } from 'react';
import { useServiceStore } from '../stores/serviceStore';
import { PlusCircle, Trash2, Edit2, Wifi, BedDouble, Package } from 'lucide-react';
import type { Service } from '../types';

export default function ServiceManagement() {
  const { services, addService, removeService, updateService } = useServiceStore();
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '0',
    description: '',
    type: 'other' as const,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const serviceData = {
      ...formData,
      price: parseInt(formData.price) || 0,
    };
    
    if (editingService) {
      updateService(editingService.id, serviceData);
    } else {
      addService(serviceData);
    }
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: '',
      price: '0',
      description: '',
      type: 'other',
    });
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      price: service.price.toString(),
      description: service.description,
      type: service.type,
    });
    setShowForm(true);
  };

  const getServiceIcon = (type: Service['type']) => {
    switch (type) {
      case 'bed':
        return <BedDouble className="w-5 h-5" />;
      case 'internet':
        return <Wifi className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">الخدمات الإضافية</h2>
        <button
          onClick={() => {
            setEditingService(null);
            setFormData({
              name: '',
              price: '0',
              description: '',
              type: 'other',
            });
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <PlusCircle className="w-5 h-5" />
          إضافة خدمة
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingService ? 'تعديل خدمة' : 'إضافة خدمة جديدة'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  اسم الخدمة
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  نوع الخدمة
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value as Service['type'] })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="bed">سرير إضافي</option>
                  <option value="internet">خدمة الإنترنت</option>
                  <option value="other">خدمة أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingService(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingService ? 'تحديث' : 'حفظ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {getServiceIcon(service.type)}
                <h3 className="font-semibold">{service.name}</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => removeService(service.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm mt-2">{service.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-semibold">{service.price} ريال</span>
              <span className="text-sm text-gray-500">
                {service.type === 'bed'
                  ? 'سرير إضافي'
                  : service.type === 'internet'
                  ? 'خدمة الإنترنت'
                  : 'خدمة أخرى'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}