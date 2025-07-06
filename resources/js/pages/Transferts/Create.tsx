import AppLayout from '@/layouts/app-layout';
import { Auth, SharedData, type BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Transferts',
        href: '/transferts',
    },
    {
        title: 'Nouveau transfert',
        href: '#',
    },
];

export default function TransfertCreate({ auth, produits, succursales, users }: { 
    auth: Auth;
    produits: any[];
    succursales: any[];
    users: any[];
}) {
    const { data, setData, post, processing, errors } = useForm({
        note: '',
        items: [{
            produit_id: '',
            quantite: 1,
            succursale_source_id: '',
            succursale_destination_id: '',
        }],
    });

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                produit_id: '',
                quantite: 1,
                succursale_source_id: '',
                succursale_destination_id: '',
            }
        ]);
    };

    const removeItem = (index: number) => {
        if (data.items.length <= 1) return;
        const newItems = [...data.items];
        newItems.splice(index, 1);
        setData('items', newItems);
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...data.items];
        newItems[index][field] = value;
        setData('items', newItems);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('transferts.store'), {
            onSuccess: () => toast.success('Transfert créé avec succès'),
            onError: () => toast.error('Une erreur est survenue'),
        });
    };

    return (
        <AppLayout auth={auth} breadcrumbs={breadcrumbs}>
            <Head title="Nouveau transfert" />
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Nouveau transfert</h1>
                    <Link href={route('transferts.index')}>
                        <Button variant="outline">Retour à la liste</Button>
                    </Link>
                </div>
                
                <form onSubmit={submit} className="grid gap-6">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="note">Note (optionnel)</Label>
                            <Input
                                id="note"
                                value={data.note}
                                onChange={(e) => setData('note', e.target.value)}
                            />
                            {errors.note && (
                                <p className="text-sm font-medium text-destructive">{errors.note}</p>
                            )}
                        </div>
                        
                        <div className="border rounded-lg p-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium">Produits à transférer</h3>
                                <Button type="button" size="sm" onClick={addItem}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ajouter un produit
                                </Button>
                            </div>
                            
                            {data.items.map((item, index) => (
                                <div key={index} className="grid gap-4 mb-4 p-4 border rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium">Produit #{index + 1}</h4>
                                        {data.items.length > 1 && (
                                            <Button 
                                                type="button" 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => removeItem(index)}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor={`produit-${index}`}>Produit</Label>
                                            <Select
                                                value={item.produit_id}
                                                onValueChange={(value) => updateItem(index, 'produit_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner un produit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {produits.map((produit) => (
                                                        <SelectItem key={produit.id} value={produit.id.toString()}>
                                                            {produit.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors[`items.${index}.produit_id`] && (
                                                <p className="text-sm font-medium text-destructive">
                                                    {errors[`items.${index}.produit_id`]}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor={`quantite-${index}`}>Quantité</Label>
                                            <Input
                                                id={`quantite-${index}`}
                                                type="number"
                                                min="1"
                                                value={item.quantite}
                                                onChange={(e) => updateItem(index, 'quantite', parseInt(e.target.value))}
                                            />
                                            {errors[`items.${index}.quantite`] && (
                                                <p className="text-sm font-medium text-destructive">
                                                    {errors[`items.${index}.quantite`]}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor={`source-${index}`}>Succursale source</Label>
                                            <Select
                                                value={item.succursale_source_id}
                                                onValueChange={(value) => updateItem(index, 'succursale_source_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Source" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {succursales.map((succursale) => (
                                                        <SelectItem key={succursale.id} value={succursale.id.toString()}>
                                                            {succursale.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors[`items.${index}.succursale_source_id`] && (
                                                <p className="text-sm font-medium text-destructive">
                                                    {errors[`items.${index}.succursale_source_id`]}
                                                </p>
                                            )}
                                        </div>
                                        
                                        <div className="grid gap-2">
                                            <Label htmlFor={`destination-${index}`}>Succursale destination</Label>
                                            <Select
                                                value={item.succursale_destination_id}
                                                onValueChange={(value) => updateItem(index, 'succursale_destination_id', value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Destination" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {succursales.map((succursale) => (
                                                        <SelectItem key={succursale.id} value={succursale.id.toString()}>
                                                            {succursale.nom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {errors[`items.${index}.succursale_destination_id`] && (
                                                <p className="text-sm font-medium text-destructive">
                                                    {errors[`items.${index}.succursale_destination_id`]}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {errors.items && (
                                <p className="text-sm font-medium text-destructive">{errors.items}</p>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                        <Button type="submit" disabled={processing}>
                            Enregistrer le transfert
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}