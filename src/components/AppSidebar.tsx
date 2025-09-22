
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
import { cn } from '@/lib/utils';

const menuItems = [
  { href: '/operations', label: 'Operations', icon: Swords },
  { href: '/payloads', label: 'Payloads', icon: Archive },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, loading, signOut } = useAuth();
  const { state, toggleSidebar } = useSidebar();

  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className={cn("flex items-center", isCollapsed && "justify-center")}>
        <div className={cn("flex items-center gap-2", isCollapsed && "gap-0")}>
            <Logo className="size-8 text-sidebar-primary" />
            <div className={cn("flex flex-col duration-200", isCollapsed && "hidden")}>
              <h2 className="text-xl font-semibold tracking-tight text-sidebar-primary">
                Red Team OS
              </h2>
            </div>
        </div>
        <div className={cn(isCollapsed && "hidden")}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {loading ? (
                <Skeleton className="size-8" />
              ) : user ? (
                <button>
                  <Avatar className="size-8">
                    <AvatarImage src={user.photoURL || ''} alt={user.displayName || ''} />
                    <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                </button>
              ) : (
                <div className="size-8 bg-muted" />
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
        <div className={cn("flex items-center gap-3 p-2 bg-sidebar-accent text-sidebar-accent-foreground", isCollapsed && "justify-center")}>
          <Bot className="size-6 shrink-0"/>
          <div className={cn("flex flex-col duration-200", isCollapsed && "hidden")}>
            <p className="text-lg font-medium">AI-Powered</p>
            <p className="text-sm text-muted-foreground">Using Gemini</p>
          </div>
        </div>
         <Button variant="ghost" onClick={toggleSidebar} className="w-full justify-start">
            {state === 'expanded' ? <PanelLeftClose /> : <PanelLeftOpen />}
            <span className={cn(isCollapsed && "hidden")}>Collapse</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
