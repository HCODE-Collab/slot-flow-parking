
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

type SidebarItem = {
  title: string;
  href: string;
  roles: string[];
};

const items: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'My Vehicles',
    href: '/vehicles',
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'Parking Slots',
    href: '/slots',
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'My Requests',
    href: '/requests',
    roles: ['USER', 'ADMIN'],
  },
  {
    title: 'Manage Users',
    href: '/users',
    roles: ['ADMIN'],
  },
  {
    title: 'System Logs',
    href: '/logs',
    roles: ['ADMIN'],
  },
];

export function Sidebar() {
  const { user } = useAuth();
  const role = user?.role || 'USER';
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const filteredItems = items.filter(item => item.roles.includes(role));
  
  return (
    <div
      className={cn(
        "h-screen bg-muted/40 border-r flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && (
          <h2 className="text-lg font-semibold">
            <span className="text-primary">Park</span>Pro
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto"
        >
          {collapsed ? "→" : "←"}
        </Button>
      </div>
      <div className="space-y-1 py-4 flex-1 overflow-y-auto">
        {filteredItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center py-3 px-4 text-sm group hover:bg-muted/80 hover:text-foreground",
                isActive ? "bg-muted text-foreground font-medium" : "text-muted-foreground",
                collapsed ? "justify-center" : ""
              )
            }
          >
            <div className={cn("flex items-center", collapsed ? "" : "gap-3")}>
              <div className="w-2 h-2 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
              {!collapsed && <span>{item.title}</span>}
            </div>
          </NavLink>
        ))}
      </div>
      <div className="p-4 border-t">
        {!collapsed && (
          <div className="text-xs text-muted-foreground">
            <p>Logged in as:</p>
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs opacity-50">{role}</p>
          </div>
        )}
      </div>
    </div>
  );
}
