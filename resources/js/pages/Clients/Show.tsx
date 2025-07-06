import AppLayout from '@/layouts/app-layout';
import { Auth, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs = (clientName: string): BreadcrumbItem[] => [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Clients',
        href: '/clients',
    },
    {
        title: `Détails de ${clientName}`,
        href: '#',
    },
];

export default function ClientShow({ auth, client }: { auth: Auth; client: any }) {
    return (
        <AppLayout auth={auth} breadcrumbs={breadcrumbs(client.name)}>
            <Head title={`Détails de ${client.name}`} />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center gap-4">
                    <Link href={route('clients.index')}>
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Détails de {client.name}</h1>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations principales</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-4">
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Nom complet</p>
                                    <p>{client.name}</p>
                                </div>
                                {client.telephone && (
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium text-muted-foreground">Téléphone</p>
                                        <p>{client.telephone}</p>
                                    </div>
                                )}
                                {client.succursale && (
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium text-muted-foreground">Succursale</p>
                                        <p>{client.succursale.nom}</p>
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-4">
                                {client.email && (
                                    <div className="grid gap-1">
                                        <p className="text-sm font-medium text-muted-foreground">Email</p>
                                        <p>{client.email}</p>
                                    </div>
                                )}
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Enregistré par</p>
                                    <p>
                                        {client.enregistre_par ? (
                                            <Link href={route('utilisateurs.show', client.enregistre_par.ref)}>
                                                <Badge variant="outline">
                                                    {client.enregistre_par?.name}
                                                </Badge>
                                            </Link>
                                        ) : (
                                            'Système'
                                        )}
                                    </p>
                                </div>
                                <div className="grid gap-1">
                                    <p className="text-sm font-medium text-muted-foreground">Date de création</p>
                                    <p>{format(new Date(client.created_at), 'PPPp', { locale: fr })}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {client.notes && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Notes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="whitespace-pre-line">{client.notes}</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex justify-end gap-2">
                        <Link href={route('clients.index')}>
                            <Button variant="outline">Retour</Button>
                        </Link>
                        <Link href={route('clients.edit', client.ref)}>
                            <Button>Modifier</Button>
                        </Link>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}