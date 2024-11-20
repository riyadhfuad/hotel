import React, { useState } from 'react';
import { X, User, Phone, CreditCard, Calendar, BedDouble, Receipt, FileText, UserCircle, LogOut } from 'lucide-react';
import { useServiceStore } from '../stores/serviceStore';
import { format } from 'date-fns';
import type { Customer } from '../types';

interface CustomerDetailsProps {
  customer: Customer;
  onClose: () => void;
}

export default function CustomerDetails({ customer, onClose }: CustomerDetailsProps) {
  const { services } = useServiceStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const customerServices = customer.services?.map(serviceBooking => {
    const service = services.find(s => s.id === serviceBooking.serviceId);
    return {
      ...service,
      price: serviceBooking.price
    };
  }).filter(Boolean) || [];

  const servicesTotal = customerServices.reduce((sum, service) => sum + (service?.price || 0), 0);
  const total = (customer.roomPrice || 0) + servicesTotal;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">تفاصيل العميل</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* معلومات العميل الأساسية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">اسم العميل</p>
                <p className="font-medium">{customer.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">رقم الجوال</p>
                <p className="font-medium">{customer.phone}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">رقم الهوية</p>
                <p className="font-medium">{customer.idNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">تاريخ الوصول</p>
                <p className="font-medium">{format(new Date(customer.checkIn), 'yyyy/MM/dd HH:mm')}</p>
              </div>
            </div>
          </div>

          {/* معلومات الغرفة والخدمات */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-4">
              <BedDouble className="w-6 h-6 text-gray-600" />
              <h3 className="font-semibold">تفاصيل الإقامة</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">الغرفة</p>
                <p className="font-medium">{customer.roomType} - {customer.roomId}</p>
                <p className="text-sm text-gray-600 mt-2">سعر الغرفة</p>
                <p className="font-medium">{customer.roomPrice} ريال</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">الخدمات الإضافية</p>
                {customerServices.length > 0 ? (
                  <div className="space-y-2">
                    {customerServices.map((service, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{service?.name}</span>
                        <span>{service?.price} ريال</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">لا توجد خدمات إضافية</p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-semibold">الإجمالي</span>
                <span className="font-bold text-lg">{total} ريال</span>
              </div>
            </div>
          </div>

          {/* المستندات */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-gray-600" />
              <h3 className="font-semibold">المستندات</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {customer.idDocument && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">صورة الهوية</p>
                  <img
                    src={customer.idDocument}
                    alt="صورة الهوية"
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(customer.idDocument)}
                  />
                </div>
              )}
              
              {customer.additionalDocuments.map((doc, index) => (
                <div key={index}>
                  <p className="text-sm text-gray-600 mb-2">{doc.type}</p>
                  <img
                    src={doc.file}
                    alt={doc.type}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setSelectedImage(doc.file)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* الملاحظات */}
          {customer.notes && (
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold mb-2">ملاحظات</h3>
              <p className="text-gray-700">{customer.notes}</p>
            </div>
          )}

          {/* معلومات المستخدم */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {customer.createdBy && (
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <UserCircle className="w-10 h-10 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">تم إنشاء السجل بواسطة</p>
                    <p className="font-medium">{customer.createdBy.name}</p>
                  </div>
                </div>
              )}
              
              {customer.status === 'checked_out' && customer.checkedOutBy && (
                <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-lg">
                  <LogOut className="w-10 h-10 text-gray-600" />
                  <div>
                    <p className="text-sm text-gray-600">تم تسجيل المغادرة بواسطة</p>
                    <p className="font-medium">{customer.checkedOutBy.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* معاينة الصور */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="صورة مكبرة"
            className="max-w-[90vw] max-h-[90vh] object-contain"
          />
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>
      )}
    </div>
  );
}