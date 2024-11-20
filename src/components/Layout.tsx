import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { 
  Hotel, 
  Users, 
  LayoutDashboard, 
  LogOut,
  BedDouble,
  UserCog,
  LineChart
} from 'lucide-react';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <Hotel className="w-8 h-8" />
            <span className="text-xl font-bold">نظام إدارة الفندق</span>
          </div>
          
          <nav className="space-y-2">
            <Link
              to="/"
              className={`flex items-center gap-2 p-3 rounded transition ${
                isActive('/') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>لوحة التحكم</span>
            </Link>
            
            <Link
              to="/customers"
              className={`flex items-center gap-2 p-3 rounded transition ${
                isActive('/customers') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
              }`}
            >
              <Users className="w-5 h-5" />
              <span>العملاء</span>
            </Link>

            {user?.role === 'admin' && (
              <>
                <Link
                  to="/rooms"
                  className={`flex items-center gap-2 p-3 rounded transition ${
                    isActive('/rooms') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                  }`}
                >
                  <BedDouble className="w-5 h-5" />
                  <span>إدارة الغرف</span>
                </Link>

                <Link
                  to="/activity"
                  className={`flex items-center gap-2 p-3 rounded transition ${
                    isActive('/activity') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                  }`}
                >
                  <LineChart className="w-5 h-5" />
                  <span>سجل الحركة</span>
                </Link>

                <Link
                  to="/users"
                  className={`flex items-center gap-2 p-3 rounded transition ${
                    isActive('/users') ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'
                  }`}
                >
                  <UserCog className="w-5 h-5" />
                  <span>إدارة المستخدمين</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="absolute bottom-0 w-64 p-4">
          <div className="flex items-center justify-between text-sm">
            <span>{user?.username}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300"
            >
              <LogOut className="w-4 h-4" />
              تسجيل خروج
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 bg-gray-100">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}