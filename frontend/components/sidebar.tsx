'use client';

import { Button } from '@/components/ui/button';
import { 
  Inbox, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Folder, 
  MoreHorizontal 
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'inbox' | 'today' | 'upcoming' | 'completed';
  setActiveTab: (tab: 'inbox' | 'today' | 'upcoming' | 'completed') => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }: SidebarProps) {
  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold text-gray-800">Todo App</h1>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-600 hover:text-gray-900"
        >
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          <li>
            <button
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'inbox'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Inbox className="h-5 w-5" />
              {!collapsed && <span>Inbox</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('today')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'today'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-5 w-5" />
              {!collapsed && <span>Today</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'upcoming'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock className="h-5 w-5" />
              {!collapsed && <span>Upcoming</span>}
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('completed')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left ${
                activeTab === 'completed'
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <CheckCircle2 className="h-5 w-5" />
              {!collapsed && <span>Completed</span>}
            </button>
          </li>
        </ul>

        {!collapsed && (
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Projects
            </h3>
            <ul className="space-y-1">
              <li>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100">
                  <Folder className="h-5 w-5" />
                  <span>Work</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100">
                  <Folder className="h-5 w-5" />
                  <span>Personal</span>
                </button>
              </li>
              <li>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100">
                  <Folder className="h-5 w-5" />
                  <span>Shopping</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </div>
  );
}