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
        title: 'Inventaire',
        icon: Package,
        items: [
          {
            title: 'Produits',
            href: '/products',
            icon: ShoppingBasket,
          },
          {
            title: 'Stock',
            href: '/inventory',
            icon: Warehouse,
          },
          {
            title: 'Commandes',
            href: '/orders',
            icon: Truck,
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


