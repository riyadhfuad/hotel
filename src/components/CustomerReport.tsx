import React from 'react';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Customer } from '../types';
import { useServiceStore } from '../stores/serviceStore';

interface CustomerReportProps {
  customers: Customer[];
  type: 'detailed' | 'basic';
  onClose: () => void;
}

export default function CustomerReport({ customers, type, onClose }: CustomerReportProps) {
  const { services } = useServiceStore();

  const exportToPDF = () => {
    // Create new document
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Set up the document for RTL
    doc.setR2L(true);

    // Set font size for title
    doc.setFontSize(16);

    // Add title
    const title = 'تقرير النزلاء';
    const date = format(new Date(), 'yyyy/MM/dd');
    
    // Calculate text width for centering
    const titleWidth = doc.getStringUnitWidth(title) * doc.getFontSize() / doc.internal.scaleFactor;
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - titleWidth) / 2;

    // Add title and date
    doc.text(title, titleX, 20);
    doc.setFontSize(12);
    doc.text(`التاريخ: ${date}`, 20, 30);

    // Prepare table data
    const tableData = customers.map(customer => {
      const servicesTotal = customer.services?.reduce((sum, service) => sum + service.price, 0) || 0;
      const total = (customer.roomPrice || 0) + servicesTotal;

      if (type === 'basic') {
        return [
          customer.name,
          customer.idNumber,
          customer.phone,
          format(new Date(customer.checkIn), 'yyyy/MM/dd HH:mm'),
          customer.roomId?.toString() || '-'
        ];
      }

      return [
        customer.name,
        customer.idNumber,
        customer.phone,
        format(new Date(customer.checkIn), 'yyyy/MM/dd HH:mm'),
        customer.roomId ? `${customer.roomType} - ${customer.roomId}` : '-',
        `${customer.roomPrice} ريال`,
        `${servicesTotal} ريال`,
        `${total} ريال`
      ];
    });

    // Define columns based on report type
    const columns = type === 'basic' 
      ? ['الاسم', 'رقم الهوية', 'رقم الجوال', 'تاريخ الوصول', 'رقم الغرفة']
      : ['الاسم', 'رقم الهوية', 'رقم الجوال', 'تاريخ الوصول', 'الغرفة', 'سعر الغرفة', 'الخدمات الإضافية', 'الإجمالي'];

    // Add table
    (doc as any).autoTable({
      head: [columns],
      body: tableData,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 10,
        halign: 'right',
        cellPadding: 5,
        overflow: 'linebreak',
        font: 'helvetica'
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontSize: 12,
        halign: 'right',
        font: 'helvetica'
      },
      margin: { right: 15, left: 15 },
      tableWidth: 'auto'
    });

    // Save the PDF
    doc.save(`تقرير-النزلاء-${date}.pdf`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-6">تصدير التقرير</h2>
        <p className="text-gray-600 mb-6">
          {type === 'detailed'
            ? 'سيتم تصدير تقرير مفصل يحتوي على جميع بيانات النزلاء'
            : 'سيتم تصدير تقرير مختصر يحتوي على البيانات الأساسية للنزلاء'}
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            إلغاء
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            تصدير PDF
          </button>
        </div>
      </div>
    </div>
  );
}