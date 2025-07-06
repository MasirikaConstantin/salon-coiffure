import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Calendar, Folder, HomeIcon, LayoutGrid, Package, Scissors, ShoppingBasket, Truck, UserCheck2, UserCog, Users, Warehouse } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },

    {
        title: 'Gestion Salon',
        icon: Scissors,
        items: [
          
          {
            title: 'Rendez-vous',
            href: '/appointments',
            icon: Calendar,
          },
          {
            title: 'Clients',
            href: '/clients',
            icon: Users,
          },
          {
            title: 'Employés',
            href: '/employees',
            icon: UserCog,
          },
        ],
      },
      {
        title: 'Les Produits',
        icon: Package,
        items: [
          {
            title: 'Produits',
            href: '/produits',
            icon: ShoppingBasket,
          },
          {
            title: 'Stock',
            href: '/stocks',
            icon: Warehouse,
          },
          {
            title: 'Stock-Succursale',
            href: '/stock-succursales',
            icon: Warehouse,
          },
          {
            title: 'Transferts',
            href: '/transferts',
            icon: Truck,
          },
        ],
      },
      {
        title: 'Ventes',
        icon: ShoppingBasket,
        items: [
          {
            title: 'Ventes',
            href: '/ventes',
            icon: ShoppingBasket,
          },
        ],
      },
      {
        title: 'Administration',
        icon: UserCheck2,
        items: [
          {
            title: 'Utilisateurs',
            href: '/utilisateurs',
            icon: UserCog,
          },
          
          {
            title: 'Services',
            href: '/services',
            icon: Scissors,
          },
          {
            title: 'Succursale',
            href: '/succursales',
            icon: HomeIcon,
          },
          
        ],

      }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}


