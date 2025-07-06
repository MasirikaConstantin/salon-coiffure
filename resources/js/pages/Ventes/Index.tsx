import AppLayout from '@/layouts/app-layout';
import { Auth, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Eye, Search } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Ventes',
        href: '/ventes',
    },
];

export default function VenteIndex({ auth }: { auth: Auth }) {
    const { flash, ventes, filters } = usePage<SharedData & { 
        ventes: any, 
        filters: { search?: string } 
    }>().props;

    const [search, setSearch] = useState(filters.search || '');
    
    useEffect(() => {
        const timer = setTimeout(() => {
            router.get(route('ventes.index'), { search }, {
                preserveState: true,
                replace: true
            });
        }, 300);

        return () => clearTimeout(timer);
    }, [search]);

    flash.error && toast.error(flash.error);
    flash.success && toast.success(flash.success);

    const handleDelete = (ref: string) => {
        router.delete(route('ventes.destroy', ref));
    };

    return (
        <AppLayout auth={auth} breadcrumbs={breadcrumbs}>
            <Head title="Ventes" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Gestion des ventes</h1>
                    <div className="flex gap-2">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher..."
                                className="pl-9"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <Link href={route('ventes.create')}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nouvelle vente
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="rounded-lg border shadow-sm">
                    <Table>
                        <TableCaption>
                            {ventes.total > 0 ? (
                                `Affichage des ventes ${ventes.from} à ${ventes.to} sur ${ventes.total}`
                            ) : (
                                'Aucune vente trouvée'
                            )}
                        </TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-12">#</TableHead>
                                <TableHead>Référence</TableHead>
                                <TableHead>Client</TableHead>
                                <TableHead>Succursale</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Mode Paiement</TableHead>
                                <TableHead>Vendeur</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ventes.data.map((vente, index) => (
                                <TableRow key={vente.id}>
                                    <TableCell className="font-medium">
                                        {ventes.from + index}
                                    </TableCell>
                                    <TableCell className="font-medium">{vente.ref}</TableCell>
                                    <TableCell>{vente.client?.name || '-'}</TableCell>
                                    <TableCell>{vente.succursale?.nom || '-'}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('fr-FR', {
                                            style: 'currency',
                                            currency: 'EUR'
                                        }).format(vente.montant_total)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {vente.mode_paiement}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{vente.vendeur?.name || '-'}</TableCell>
                                    <TableCell>
                                        {format(new Date(vente.created_at), 'PP', { locale: fr })}
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <Link href={route('ventes.show', vente.ref)}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action supprimera définitivement la vente et ne pourra pas être annulée.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(vente.ref)}>
                                                        Supprimer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                {ventes.last_page > 1 && (
                    <div className="flex items-center justify-end">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious 
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (ventes.current_page > 1) {
                                                router.get(ventes.prev_page_url);
                                            }
                                        }}
                                        className={ventes.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                                
                                {Array.from({ length: ventes.last_page }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.get(ventes.path + '?page=' + page);
                                            }}
                                            isActive={page === ventes.current_page}
                                        >
                                            {page}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                
                                <PaginationItem>
                                    <PaginationNext 
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (ventes.current_page < ventes.last_page) {
                                                router.get(ventes.next_page_url);
                                            }
                                        }}
                                        className={ventes.current_page === ventes.last_page ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}