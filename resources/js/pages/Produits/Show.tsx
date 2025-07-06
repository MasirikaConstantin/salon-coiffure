import AppLayout from '@/layouts/app-layout';
import { Auth, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const breadcrumbs = (produitName: string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Produits',
        href: '/produits',
    },
    {
        title: `Détails de ${produitName}`,
        href: '#',
    },
];

export default function ProduitShow({ auth, produit }: { auth: Auth; produit: any }) {
    const marge = produit.prix_vente - produit.prix_achat;
    const margePourcentage = (marge / produit.prix_achat) * 100;

    return (
        <AppLayout auth={auth} breadcrumbs={breadcrumbs(produit.name)}>
            <Head title={`Détails de ${produit.name}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center gap-4">
                    <Link href={route('produits.index')}>
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Détails de {produit.name}</h1>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-col items-center gap-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={produit.avatar ? `/storage/${produit.avatar}` : undefined} />
                                    <AvatarFallback>
                                        {produit.name.split(' ').map((n: string) => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-center">{produit.name}</CardTitle>
                                <Badge variant={produit.actif ? 'default' : 'secondary'}>
                                    {produit.actif ? 'Actif' : 'Inactif'}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-4">
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Prix d'achat</p>
                                    <p>
                                        {new Intl.NumberFormat('fr-FR', {
                                            style: 'currency',
                                            currency: 'CDF'
                                        }).format(produit.prix_achat).replace('CDF', 'FC')}
                                    </p>
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Prix de vente</p>
                                    <p>
                                        {new Intl.NumberFormat('fr-FR', {
                                            style: 'currency',
                                            currency: 'CDF'
                                        }).format(produit.prix_vente).replace('CDF', 'FC')}
                                    </p>
                                </div>
                            </div>
                            <div className="grid gap-4">
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Marge</p>
                                    <p>
                                        <Badge variant={marge >= 0 ? 'default' : 'destructive'}>
                                            {new Intl.NumberFormat('fr-FR', {
                                                style: 'currency',
                                                currency: 'CDF'
                                            }).format(marge).replace('CDF', 'FC')} ({margePourcentage.toFixed(2)}%)
                                        </Badge>
                                    </p>
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Créé par</p>
                                    <p>
                                        {produit.user ? (
                                            <Badge variant="outline">
                                                {produit.user.name}
                                            </Badge>
                                        ) : 'Système'}
                                    </p>
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                                    <p>{format(new Date(produit.created_at), 'PPPp', { locale: fr })}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {produit.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-line">{produit.description}</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end gap-2">
                        <Link href={route('produits.index')}>
                            <Button variant="outline">Retour</Button>
                        </Link>
                        <Link href={route('produits.edit', produit.ref)}>
                            <Button>Modifier</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}