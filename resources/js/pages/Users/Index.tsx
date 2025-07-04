import AppLayout from '@/layouts/app-layout';
import { Auth, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';
import { Pencil, Plus, Trash2, Eye } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Utilisateurs',
        href: '/utilisateurs',
    },
];

export default function UserIndex({ auth }: { auth: Auth }) {
    const { flash, users, succursales } = usePage<SharedData & { users: any[], succursales: any[] }>().props;

    flash.error && toast.error(flash.error);
    flash.success && toast.success(flash.success);

    const handleDelete = (id: number) => {
        router.delete(route('utilisateurs.destroy', id));
    };

    const handleRoleChange = (userId: number, newRole: string) => {
        router.patch(route('utilisateurs.update', userId), { role: newRole });
    };

    const handleStatusChange = (userId: number, isActive: boolean) => {
        router.patch(route('utilisateurs.update', userId), { is_active: isActive });
    };

    const handleSuccursaleChange = (userId: number, succursaleId: string) => {
        const id = succursaleId === 'null' ? null : succursaleId;
        router.patch(route('utilisateurs.update', userId), { succursale_id: id });
    };

    return (
        <AppLayout auth={auth} breadcrumbs={breadcrumbs}>
            <Head title="Utilisateurs" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Gestion des utilisateurs</h1>
                    <Link href={route('utilisateurs.create')}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter un utilisateur
                        </Button>
                    </Link>
                </div>
                <div className="rounded-lg border shadow-sm">
                    <Table>
                        <TableCaption>Liste des utilisateurs</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Nom</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Rôle</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Succursale</TableHead>
                                <TableHead>Date embauche</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>
                                        <Avatar>
                                            <AvatarImage src={user.avatar ? `/storage/${user.avatar}` : undefined} />
                                            <AvatarFallback>
                                                {user.name.split(' ').map((n: string) => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.role}
                                            onValueChange={(value) => handleRoleChange(user.id, value)}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Rôle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="gerant">Gérant</SelectItem>
                                                <SelectItem value="coiffeur">Coiffeur</SelectItem>
                                                <SelectItem value="caissier">Caissier</SelectItem>
                                                <SelectItem value="aucun">Aucun</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.is_active ? 'default' : 'secondary'}
                                            className="cursor-pointer"
                                            onClick={() => handleStatusChange(user.id, !user.is_active)}
                                        >
                                            {user.is_active ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Select
                                            value={user.succursale_id?.toString() || 'null'}
                                            onValueChange={(value) => handleSuccursaleChange(user.id, value)}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Succursale" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="null">Aucune succursale</SelectItem>
                                                {succursales.map((succursale) => (
                                                    <SelectItem key={succursale.id} value={succursale.id.toString()}>
                                                        {succursale.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                    <TableCell>
                                        {user.date_embauche ? format(new Date(user.date_embauche), 'PPP', { locale: fr }) : '-'}
                                    </TableCell>
                                    <TableCell className="flex gap-2">
                                        <Link href={route('utilisateurs.show', user.ref)}>
                                            <Button variant="outline" size="sm">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={route('utilisateurs.edit', user.ref)}>
                                            <Button variant="outline" size="sm">
                                                <Pencil className="h-4 w-4" />
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
                                                        Cette action supprimera définitivement l'utilisateur et ne pourra pas être annulée.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(user.id)}>
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
            </div>
        </AppLayout>
    );
}