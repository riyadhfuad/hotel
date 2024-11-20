import { create } from 'zustand';
import { User, Permission, Role } from '../types';

interface AuthState {
  user: User | null;
  users: User[];
  permissions: Permission[];
  roles: Role[];
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: number, userData: Partial<User>) => void;
  removeUser: (id: number) => void;
  toggleUserStatus: (id: number) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  users: [
    {
      id: 1,
      username: 'admin',
      password: 'admin',
      role: 'admin',
      name: 'مدير النظام',
      createdAt: '2024-03-10',
      status: 'active',
      permissions: ['all'],
    },
    {
      id: 2,
      username: 'staff',
      password: 'staff',
      role: 'receptionist',
      name: 'موظف الاستقبال',
      createdAt: '2024-03-10',
      status: 'active',
      permissions: ['view_customers', 'add_customer', 'edit_customer'],
    },
  ],
  permissions: [
    { id: 'all', name: 'كافة الصلاحيات', description: 'الوصول الكامل لجميع الميزات' },
    { id: 'view_customers', name: 'عرض العملاء', description: 'عرض قائمة العملاء وتفاصيلهم' },
    { id: 'add_customer', name: 'إضافة عميل', description: 'إضافة عملاء جدد' },
    { id: 'edit_customer', name: 'تعديل العملاء', description: 'تعديل بيانات العملاء' },
    { id: 'delete_customer', name: 'حذف العملاء', description: 'حذف العملاء من النظام' },
    { id: 'manage_rooms', name: 'إدارة الغرف', description: 'إدارة الغرف وأسعارها' },
    { id: 'manage_services', name: 'إدارة الخدمات', description: 'إدارة الخدمات الإضافية' },
    { id: 'view_reports', name: 'عرض التقارير', description: 'الوصول للتقارير والإحصائيات' },
    { id: 'manage_users', name: 'إدارة المستخدمين', description: 'إدارة حسابات المستخدمين' },
  ],
  roles: [
    {
      id: 'admin',
      name: 'مدير النظام',
      permissions: ['all'],
    },
    {
      id: 'manager',
      name: 'مدير',
      permissions: ['view_customers', 'add_customer', 'edit_customer', 'delete_customer', 'manage_rooms', 'manage_services', 'view_reports'],
    },
    {
      id: 'receptionist',
      name: 'موظف استقبال',
      permissions: ['view_customers', 'add_customer', 'edit_customer'],
    },
  ],
  isAuthenticated: false,
  login: async (username, password) => {
    set((state) => {
      const user = state.users.find(
        (u) => u.username === username && u.password === password && u.status === 'active'
      );
      if (user) {
        return { user, isAuthenticated: true };
      }
      throw new Error('بيانات الدخول غير صحيحة');
    });
  },
  logout: () => set({ user: null, isAuthenticated: false }),
  addUser: (userData) =>
    set((state) => ({
      users: [
        ...state.users,
        {
          ...userData,
          id: Math.max(0, ...state.users.map((u) => u.id)) + 1,
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
    })),
  updateUser: (id, userData) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...userData } : user
      ),
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
  toggleUserStatus: (id) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id
          ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
          : user
      ),
    })),
}));