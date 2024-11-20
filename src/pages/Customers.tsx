import React, { useState } from 'react';
import { format } from 'date-fns';
import { 
  PlusCircle, 
  FileText, 
  Eye, 
  Edit2, 
  LogOut,
  Trash2
} from 'lucide-react';
import { useCustomerStore } from '../stores/customerStore';
import { useAuthStore } from '../stores/authStore';
import CustomerForm from '../components/CustomerForm';
import CustomerDetails from '../components/CustomerDetails';
import CustomerReport from '../components/CustomerReport';
import type { Customer } from '../types';

export default function Customers() {
  const [showForm, setShowForm] = useState(false);
  const [showReport, setShowReport] = useState<'detailed' | 'basic' | null>(null);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [filter, setFilter] = useState<'active' | 'checked_out'>('active');
  const { customers, addCustomer, updateCustomer, removeCustomer, checkoutCustomer } = useCustomerStore();
  const { user } = useAuthStore();

  const hasPermission = (permission: string) => {
    return user?.role === 'admin' || user?.permissions.includes(permission);
  };

  const filteredCustomers = customers.filter(
    (customer) => filter === 'active' 
      ? customer.status === 'active'
      : customer.status === 'checked_out'
  );

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      removeCustomer(id);
    }
  };

  const handleCheckout = (id: number) => {
    if (window.confirm('هل أنت متأكد من تسجيل مغادرة هذا العميل؟')) {
      checkoutCustomer(id);
    }
  };

  const handleSubmit = (formData: any) => {
    const checkInDateTime = `${formData.checkIn}T${formData.checkInTime}`;
    const customerData = {
      ...formData,
      checkIn: checkInDateTime,
    };

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, customerData);
    } else {
      addCustomer(customerData);
    }
    setShowForm(false);
    setEditingCustomer(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة العملاء</h1>
        <div className="flex gap-2">
          {hasPermission('add_customer') && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <PlusCircle className="w-5 h-5" />
              إضافة عميل
            </button>
          )}
          {hasPermission('view_reports') && (
            <button
              onClick={() => setShowReport('detailed')}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              <FileText className="w-5 h-5" />
              تصدير تقرير
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'active'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              النزلاء الحاليين
            </button>
            <button
              onClick={() => setFilter('checked_out')}
              className={`px-4 py-2 rounded-lg ${
                filter === 'checked_out'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              النزلاء المغادرين
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">#</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الاسم</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">رقم الهوية</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">رقم الجوال</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">تاريخ الوصول</th>
                {filter === 'checked_out' && (
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">تاريخ المغادرة</th>
                )}
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">رقم الغرفة</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">المبلغ المدفوع</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الملاحظات</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer, index) => {
                const servicesTotal = customer.services?.reduce((sum, service) => sum + service.price, 0) || 0;
                const total = (customer.roomPrice || 0) + servicesTotal;
                
                return (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.idNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {format(new Date(customer.checkIn), 'yyyy/MM/dd HH:mm')}
                    </td>
                    {filter === 'checked_out' && (
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {customer.checkOut && format(new Date(customer.checkOut), 'yyyy/MM/dd HH:mm')}
                      </td>
                    )}
                    <td className="px-6 py-4 text-sm text-gray-900">{customer.roomId || '-'}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{total} ريال</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {customer.notes ? (
                        <span className="inline-block max-w-xs truncate" title={customer.notes}>
                          {customer.notes}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowDetails(customer.id)}
                          className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                          title="عرض التفاصيل"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {filter === 'active' && (
                          <>
                            {hasPermission('edit_customer') && (
                              <button
                                onClick={() => handleEdit(customer)}
                                className="p-1 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                                title="تعديل"
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleCheckout(customer.id)}
                              className="p-1 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded"
                              title="تسجيل مغادرة"
                            >
                              <LogOut className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        {hasPermission('delete_customer') && (
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                            title="حذف"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <CustomerForm
          formData={editingCustomer ? {
            ...editingCustomer,
            checkInTime: format(new Date(editingCustomer.checkIn), 'HH:mm'),
            checkIn: format(new Date(editingCustomer.checkIn), 'yyyy-MM-dd'),
          } : {
            name: '',
            idNumber: '',
            phone: '',
            checkIn: format(new Date(), 'yyyy-MM-dd'),
            checkInTime: format(new Date(), 'HH:mm'),
            roomId: 0,
            roomType: '',
            roomPrice: 0,
            idDocument: '',
            notes: '',
            additionalDocuments: [],
            services: [],
          }}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingCustomer(null);
          }}
          isEditing={!!editingCustomer}
        />
      )}

      {showDetails !== null && (
        <CustomerDetails
          customer={customers.find((c) => c.id === showDetails)!}
          onClose={() => setShowDetails(null)}
        />
      )}

      {showReport && (
        <CustomerReport
          customers={filteredCustomers}
          type={showReport}
          onClose={() => setShowReport(null)}
        />
      )}
    </div>
  );
}