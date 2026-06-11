'use client';
import { useState } from 'react';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { Describe } from '@/components/ui/typography/describe';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Church } from 'lucide-react';
import Clergycard from './(components)/clergycard';
import { link } from 'fs';

const clergies = [
  {
    name: 'Altair Santos',
    role: 'Pároco',
    photoUrl:
      'https://images.pexels.com/photos/28143097/pexels-photo-28143097/free-photo-of-igreja-capela-catedral-retrato.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export default function Clergies() {
  const [isOpen, setisOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [clergies, setClergies] = useState([
    {
      id: 1,
      name: 'Altair Santos',
      role: 'Pároco',
      photoUrl:
        'https://images.pexels.com/photos/28143097/pexels-photo-28143097/free-photo-of-igreja-capela-catedral-retrato.jpeg',
    },
  ]);
  const [editClergy, setEditClergy] = useState<any>(null);

  function handleSave() {
    if (!name || !role || !photoUrl) {
      alert('Preencha os Campos Corretamente!');
      return;
    }
    if (editClergy) {
      setClergies(
        clergies.map((c) =>
          c.id === editClergy.id ? { ...c, name, role, photoUrl } : c
        )
      );
      setisOpen(false);
      setEditClergy(null);
      setName('');
      setRole('');
      setPhotoUrl('');
      return;
    }
    setClergies([
      ...clergies,
      {
        id: clergies.length + 1,
        name,
        role,
        photoUrl,
      },
    ]);
    setisOpen(false);
    setName('');
    setRole('');
    setPhotoUrl('');
  }

  function handleDelet(id: number) {
    setClergies(clergies.filter((clergy) => clergy.id !== id));
  }

  function handleEdit(clergy: any) {
    setEditClergy(clergy);
    setName(clergy.name);
    setRole(clergy.role);
    setPhotoUrl(clergy.photoUrl);
    setisOpen(true);
  }

  return (
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <AppBreadcrumb
        links={[{ key: 'origin', href: '/', title: 'Paróquia', icon: Church }]}
      />
      <div className="flex items-center justify-between">
        <TypographyH1>Autoridades</TypographyH1>

        <div className="flex items-center justify-end mb-6">
          <button
            className="bg-amber-800 text-white px-4 py-2 rounded-md text-sm"
            onClick={() => setisOpen(true)}
          >
            Adicionar Autoridade
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-6 py-6">
        {clergies.length === 0 ? (
          <p className="text-gray-400 text-sm">
            Nenhuma autoridade cadastrada.
          </p>
        ) : (
          clergies.map((clergy) => (
            <Clergycard
              onDelete={() => handleDelet(clergy.id)}
              onEdit={() => handleEdit(clergy)}
              key={clergy.id}
              name={clergy.name}
              role={clergy.role}
              photoUrl={clergy.photoUrl}
            />
          ))
        )}
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-96 flex flex-col gap-4">
            <h2 className="text-lg font-medium">
              {editClergy ? 'Editar Autoridade' : 'Adicionar Autoridade'}
            </h2>
            <input
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
            <select
              className="border rounded-md px-3 py-2 text-sm w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option>Pároco</option>
              <option>Diácono</option>
              <option>Bispo Diocesano</option>
              <option>Diácono Permanente</option>
              <option>Sumo Pontífice</option>
            </select>
            <input
              placeholder="URL da foto"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setisOpen(false);
                  setName('');
                  setRole('');
                  setPhotoUrl('');
                  setEditClergy(null);
                }}
                className="px-4 py-2 text-sm rounded-md border"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm rounded-md bg-amber-800 text-white"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
