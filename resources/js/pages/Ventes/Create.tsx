import AppLayout from '@/layouts/app-layout';
import { Auth, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ChevronLeft, Plus, Minus, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Ventes',
        href: '/ventes',
    },
    {
        title: 'Nouvelle vente',
        href: '/ventes/create',
    },
];

type Item = {
    produit_id?: string;
    service_id?: string;
    quantite: number;
    prix_unitaire: number;
    remise: number;
    montant_total: number;
    type: 'produit' | 'service';
    nom: string;
};

export default function VenteCreate({ auth }: { auth: Auth }) {
    const { clients, succursales, produits, services, modes_paiement } = usePage<SharedData>().props;

    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        succursale_id: '',
        remise: 0,
        montant_total: 0,
        mode_paiement: 'espèces',
        items: [] as Item[],
    });

    const [selectedProduit, setSelectedProduit] = useState('');
    const [selectedService, setSelectedService] = useState('');

    const handleAddItem = () => {
        if (!selectedProduit && !selectedService) return;

        const type = selectedProduit ? 'produit' : 'service';
        const id = selectedProduit || selectedService;
        const collection = type === 'produit' ? produits : services;
        const item = collection.find(i => i.id == id);

        if (!item) return;

        const newItem: Item = {
            [type === 'produit' ? 'produit_id' : 'service_id']: id,
            quantite: 1,
            prix_unitaire: type === 'produit' ? item.prix_vente : item.prix,
            remise: 0,
            montant_total: type === 'produit' ? item.prix_vente : item.prix,
            type,
            nom: item.name,
        };

        setData({
            ...data,
            items: [...data.items, newItem],
            montant_total: data.montant_total + newItem.montant_total,
        });

        setSelectedProduit('');
        setSelectedService('');
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...data.items];
        const removedItem = newItems.splice(index, 1)[0];
        
        setData({
            ...data,
            items: newItems,
            montant_total: data.montant_total - removedItem.montant_total,
        });
    };

    const handleUpdateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        const oldItem = { ...newItems[index] };
        
        newItems[index] = {
            ...oldItem,
            [field]: value,
        };

        // Recalculer le montant total de l'item
        if (field === 'quantite' || field === 'prix_unitaire' || field === 'remise') {
            const quantite = field === 'quantite' ? value : newItems[index].quantite;
            const prix = field === 'prix_unitaire' ? value : newItems[index].prix_unitaire;
            const remise = field === 'remise' ? value : newItems[index].remise;
            
            newItems[index].montant_total = (prix * quantite) - remise;
        }

        // Recalculer le montant total de la vente
        const newMontantTotal = newItems.reduce((sum, item) => sum + item.montant_total, 0) - data.remise;

        setData({
            ...data,
            items: newItems,
            montant_total: newMontantTotal > 0 ? newMontantTotal : 0,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Préparer les données pour l'envoi
        const formData = {
            ...data,
            items: data.items.map(item => ({
                produit_id: item.type === 'produit' ? item.produit_id : null,
                service_id: item.type === 'service' ? item.service_id : null,
                quantite: item.quantite,
                prix_unitaire: item.prix_unitaire,
                remise: item.remise,
                montant_total: item.montant_total,
            })),
        };

        post(route('ventes.store'), {
            data: formData,
            onError: () => {
                toast.error('Veuillez corriger les erreurs dans le formulaire');
            },
        });
    };

    return (
        <AppLayout auth={auth} breadcrumbs={breadcrumbs}>
            <Head title="Nouvelle vente" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center gap-4">
                    <Link href={route('ventes.index')}>
                        <Button variant="outline" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">Nouvelle vente</h1>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-6">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="client_id">Client (optionnel)</Label>
                            <Select
                                value={data.client_id}
                                onValueChange={(value) => setData('client_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un client" />
                                </SelectTrigger>
                                <SelectContent>
                                    {clients.map((client) => (
                                        <SelectItem key={client.id} value={client.id.toString()}>
                                            {client.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.client_id && <p className="text-sm text-red-500">{errors.client_id}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="succursale_id">Succursale (optionnel)</Label>
                            <Select
                                value={data.succursale_id}
                                onValueChange={(value) => setData('succursale_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez une succursale" />
                                </SelectTrigger>
                                <SelectContent>
                                    {succursales.map((succursale) => (
                                        <SelectItem key={succursale.id} value={succursale.id.toString()}>
                                            {succursale.nom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.succursale_id && <p className="text-sm text-red-500">{errors.succursale_id}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Ajouter un produit ou service</Label>
                        <div className="flex gap-2">
                            <Select
                                value={selectedProduit}
                                onValueChange={setSelectedProduit}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un produit" />
                                </SelectTrigger>
                                <SelectContent>
                                    {produits.map((produit) => (
                                        <SelectItem key={produit.id} value={produit.id.toString()}>
                                            {produit.name} - {new Intl.NumberFormat('fr-FR', {
                                                style: 'currency',
                                                currency: 'EUR'
                                            }).format(produit.prix_vente)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={selectedService}
                                onValueChange={setSelectedService}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map((service) => (
                                        <SelectItem key={service.id} value={service.id.toString()}>
                                            {service.name} - {new Intl.NumberFormat('fr-FR', {
                                                style: 'currency',
                                                currency: 'EUR'
                                            }).format(service.prix)} ({service.duree_minutes} min)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Button type="button" onClick={handleAddItem}>
                                <Plus className="h-4 w-4 mr-2" />
                                Ajouter
                            </Button>
                        </div>
                    </div>

                    {data.items.length > 0 && (
                        <div className="rounded-lg border shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Nom</TableHead>
                                        <TableHead>Quantité</TableHead>
                                        <TableHead>Prix unitaire</TableHead>
                                        <TableHead>Remise</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Badge variant={item.type === 'produit' ? 'default' : 'secondary'}>
                                                    {item.type === 'produit' ? 'Produit' : 'Service'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{item.nom}</TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.quantite}
                                                    onChange={(e) => handleUpdateItem(index, 'quantite', parseInt(e.target.value))}
                                                    className="w-20"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.prix_unitaire}
                                                    onChange={(e) => handleUpdateItem(index, 'prix_unitaire', parseFloat(e.target.value))}
                                                    className="w-24"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    step="0.01"
                                                    value={item.remise}
                                                    onChange={(e) => handleUpdateItem(index, 'remise', parseFloat(e.target.value))}
                                                    className="w-24"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {new Intl.NumberFormat('fr-FR', {
                                                    style: 'currency',
                                                    currency: 'EUR'
                                                }).format(item.montant_total)}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleRemoveItem(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="grid gap-2">
                            <Label htmlFor="remise">Remise globale (€)</Label>
                            <Input
                                id="remise"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.remise}
                                onChange={(e) => setData('remise', parseFloat(e.target.value))}
                            />
                            {errors.remise && <p className="text-sm text-red-500">{errors.remise}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="mode_paiement">Mode de paiement</Label>
                            <Select
                                value={data.mode_paiement}
                                onValueChange={(value) => setData('mode_paiement', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un mode de paiement" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modes_paiement.map((mode) => (
                                        <SelectItem key={mode} value={mode}>
                                            {mode.charAt(0).toUpperCase() + mode.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.mode_paiement && <p className="text-sm text-red-500">{errors.mode_paiement}</p>}
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="montant_total">Montant total</Label>
                        <Input
                            id="montant_total"
                            type="number"
                            min="0"
                            step="0.01"
                            value={data.montant_total}
                            readOnly
                            className="font-bold text-lg"
                        />
                        {errors.montant_total && <p className="text-sm text-red-500">{errors.montant_total}</p>}
                    </div>

                    <div className="flex justify-end gap-2">
                        <Link href={route('ventes.index')}>
                            <Button variant="outline">Annuler</Button>
                        </Link>
                        <Button type="submit" disabled={processing || data.items.length === 0}>
                            {processing ? 'Enregistrement...' : 'Enregistrer la vente'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}