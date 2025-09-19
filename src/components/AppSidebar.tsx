
'use client';

import { usePathname } from 'next/navigation';
import { Archive, Settings, Swords, Bot, LogOut, Loader, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/Logo';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';

const menuItems = [
  { href: '/operations', label: 'Operations', icon: Swords },
  { href: '/payloads', label: 'Payloads', icon: Archive },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-sidebar-primary" />
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold tracking-tight text-sidebar-primary">
                Red Team OS
              </h2>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {loading ? (
                <Skeleton className="size-8 rounded-full" />
              ) : user ? (
                <button>
                  <Avatar className="size-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                    <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <div className="size-8 rounded-full bg-muted" />
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-medium">{user?.displayName}</p>
                <p className="text-xs text-muted-foreground font-normal">{user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <Separator />
      <SidebarFooter>
        <div className="flex items-center gap-3 p-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
          <Bot className="size-6 shrink-0"/>
          <div className="flex flex-col">
            <p className="text-sm font-medium">AI-Powered</p>
            <p className="text-xs text-muted-foreground">Using Gemini</p>
          </div>
        </div>
         <Button variant="ghost" onClick={toggleSidebar} className="w-full justify-start">
            {state === 'expanded' ? <PanelLeftClose /> : <PanelLeftOpen />}
            <span>Collapse</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
