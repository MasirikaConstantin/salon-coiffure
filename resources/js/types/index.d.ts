import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href?: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[]; // Pour les sous-menus
    isOpen?: boolean; // Pour gérer l'état ouvert/fermé
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    flash: {
        error?: string;
        success?: string;
        message?: string;
    };
    succursales?: Succursale[];
    succursale?: Succursale;
    clients?: Client[];
    client?: Client;
    services?: Service[];
    service?: Service;
    [key: string]: unknown;
}

export type Client = {
    id: number;
    name: string;
    telephone: string | null;
    email: string | null;
    notes: string | null;
    ref: string;
    succursale_id: number | null;
    enregistrer_par_id: number | null;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    succursale?: Succursale;
    enregistre_par?: User;
};

export type Service = {
    id: number;
    name: string;
    description: string | null;
    duree_minutes: number;
    prix: number;
    actif: boolean;
    ref: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    enregistre_par?: User;
};

   
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    role: string;
    ref: string;
    is_active: boolean;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export type Succursale = {
    id: number;
    nom: string;
    adresse: string;
    telephone: string;
    email?: string;
    date_creation: string;
    ref: string;
    created_at: string;
    updated_at: string;
};
