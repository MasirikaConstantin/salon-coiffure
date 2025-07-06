import AppLayout from '@/layouts/app-layout';
import { Auth, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs = (venteRef: string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Ventes',
        href: '/ventes',
    },
    {
        title: `Vente ${venteRef}`,
        href: '#',
    },
];

export default function VenteShow({ auth, vente }: { auth: Auth; vente: any }) {
    return (
        <AppLayout auth={auth} breadcrumbs={breadcrumbs(vente.ref)}>
            <Head title={`Détails de la vente ${vente.ref}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center gap-4">
                    <Link href={route('ventes.index')}>
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Détails de la vente {vente.ref}</h1>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations générales</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-4">
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Client</p>
                                    <p>{vente.client?.name || 'Aucun client'}</p>
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Succursale</p>
                                    <p>{vente.succursale?.nom || 'Aucune succursale'}</p>
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Vendeur</p>
                                    <p>{vente.vendeur?.name || 'Inconnu'}</p>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Date</p>
                                    <p>{format(new Date(vente.created_at), 'PPPp', { locale: fr })}</p>
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Mode de paiement</p>
                                    <Badge variant="outline">
                                        {vente.mode_paiement}
                                    </Badge>
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Remise globale</p>
                                    <p>
                                        {new Intl.NumberFormat('fr-FR', {
                                            style: 'currency',
                                            currency: 'EUR'
                                        }).format(vente.remise)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Détails des articles</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Quantité</TableHead>
                                        <TableHead>Prix unitaire</TableHead>
                                        <TableHead>Remise</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vente.items.map((item: any) => (
                                        <TableRow key={item.id}>
                                            <TableCell>
                                                <Badge variant={item.produit_id ? 'default' : 'secondary'}>
                                                    {item.produit_id ? 'Produit' : 'Service'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {item.produit?.name || item.service?.name}
                                            </TableCell>
                                            <TableCell>{item.quantite}</TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('fr-FR', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                }).format(item.prix_unitaire)}
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('fr-FR', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                }).format(item.remise)}
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('fr-FR', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                }).format(item.montant_total)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Récapitulatif</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">Total articles</p>
                                <p className="font-medium">
                                    {new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }).format(vente.items.reduce((sum: number, item: any) => sum + (item.prix_unitaire * item.quantite), 0))}
                                </p>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-medium">Remise globale</p>
                                <p className="font-medium text-red-500">
                                    - {new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }).format(vente.remise)}
                                </p>
                            </div>
                            <div className="flex justify-between items-center border-t pt-2 mt-2">
                                <p className="text-lg font-bold">Montant total</p>
                                <p className="text-lg font-bold">
                                    {new Intl.NumberFormat('fr-FR', {
                                        style: 'currency',
                                        currency: 'EUR'
                                    }).format(vente.montant_total)}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-2">
                        <Link href={route('ventes.index')}>
                            <Button variant="outline">Retour</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}