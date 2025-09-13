'use client';

import { usePathname } from 'next/navigation';
import { Archive, Settings, Swords, Bot } from 'lucide-react';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons/Logo';
import { Separator } from '@/components/ui/separator';

const menuItems = [
  { href: '/operations', label: 'Operations', icon: Swords },
  { href: '/payloads', label: 'Payloads', icon: Archive },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-8 text-sidebar-primary" />
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold tracking-tight text-sidebar-primary">
              Red Team OS
            </h2>
          </div>
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
      </SidebarFooter>
    </Sidebar>
  );
}
