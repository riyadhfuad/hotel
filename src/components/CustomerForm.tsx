import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { useRoomStore } from '../stores/roomStore';
import { useServiceStore } from '../stores/serviceStore';

interface CustomerFormProps {
  formData: {
    name: string;
    idNumber: string;
    phone: string;
    checkIn: string;
    checkInTime: string;
    roomId: number;
    roomType: string;
    roomPrice: number;
    idDocument: string;
    notes: string;
    additionalDocuments: { id: number; type: string; file: string }[];
    services: number[];
  };
  onSubmit: (data: any) => void;
  onClose: () => void;
  isEditing: boolean;
}

export default function CustomerForm({ formData: initialFormData, onSubmit, onClose, isEditing }: CustomerFormProps) {
  const [formData, setFormData] = useState(initialFormData);
  const { rooms } = useRoomStore();
  const { services } = useServiceStore();
  const [documentType, setDocumentType] = useState('');

  // When editing, show all rooms except those occupied by other customers
  const availableRooms = isEditing 
    ? rooms.filter(room => room.status === 'available' || room.id === formData.roomId)
    : rooms.filter(room => room.status === 'available');

  const handleRoomChange = (roomId: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      setFormData(prev => ({
        ...prev,
        roomId: room.id,
        roomType: room.type,
        roomPrice: room.price,
        services: prev.services // Preserve selected services
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'id') {
          setFormData(prev => ({ ...prev, idDocument: reader.result as string }));
        } else {
          const newDoc = {
            id: Math.random(),
            type: documentType,
            file: reader.result as string
          };
          setFormData(prev => ({
            ...prev,
            additionalDocuments: [...prev.additionalDocuments, newDoc]
          }));
          setDocumentType('');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeDocument = (id: number) => {
    setFormData(prev => ({
      ...prev,
      additionalDocuments: prev.additionalDocuments.filter(doc => doc.id !== id)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">
            {isEditing ? 'تعديل بيانات النزيل' : 'إضافة نزيل جديد'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

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
                رقم الهوية
              </label>
              <input
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                تاريخ الوصول
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="time"
                  value={formData.checkInTime}
                  onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الغرفة
              </label>
              <select
                value={formData.roomId}
                onChange={(e) => handleRoomChange(Number(e.target.value))}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">اختر الغرفة</option>
                {availableRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    غرفة {room.number} - {room.type} - {room.price} ريال
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                الخدمات الإضافية
              </label>
              <div className="space-y-2 border rounded p-2">
                {services.map((service) => (
                  <label key={service.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.id)}
                      onChange={(e) => {
                        const newServices = e.target.checked
                          ? [...formData.services, service.id]
                          : formData.services.filter(id => id !== service.id);
                        setFormData({ ...formData, services: newServices });
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{service.name} - {service.price} ريال</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              صورة الهوية
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, 'id')}
                className="hidden"
                id="idDocument"
              />
              <label
                htmlFor="idDocument"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200"
              >
                <Upload className="w-4 h-4" />
                رفع صورة
              </label>
              {formData.idDocument && (
                <img
                  src={formData.idDocument}
                  alt="صورة الهوية"
                  className="w-20 h-20 object-cover rounded"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              مستندات إضافية
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  placeholder="نوع المستند"
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, 'additional')}
                  className="hidden"
                  id="additionalDocument"
                  disabled={!documentType}
                />
                <label
                  htmlFor="additionalDocument"
                  className={`flex items-center gap-2 px-4 py-2 rounded cursor-pointer ${
                    documentType
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  رفع
                </label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {formData.additionalDocuments.map((doc) => (
                  <div key={doc.id} className="relative">
                    <img
                      src={doc.file}
                      alt={doc.type}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <span className="block text-sm text-gray-600 mt-1">{doc.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ملاحظات
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {isEditing ? 'تحديث' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}