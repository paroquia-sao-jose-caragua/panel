'use client';
import { useState } from 'react';
import { AppBreadcrumb } from '@/components/common/breadcrumb';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Church } from 'lucide-react';
import Clergycard from './(components)/clergycard';
import {
  Root as FileInputRoot,
  Trigger as FileInputTrigger,
  Control as FileInputControl,
  ImagePreview,
} from '@/components/ui/file-input';
import { useFileInputStore } from '@/stores/useFileInputStore';

export default function Clergies() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Pároco');
  const [title, setTitle] = useState('');
  const [clergies, setClergies] = useState<any[]>([]);
  const [editClergy, setEditClergy] = useState<any>(null);
  const { files } = useFileInputStore();

  function handleClose() {
    setIsOpen(false);
    setName('');
    setRole('Pároco');
    setTitle('');
    setEditClergy(null);
  }

  function handleSave() {
    const uploadedFile = files[0]?.file;
    const uploadedPreviewUrl = uploadedFile
      ? URL.createObjectURL(uploadedFile)
      : '';

    if (editClergy) {
      const newPhotoUrl = uploadedPreviewUrl || editClergy.photoUrl;

      if (!name || !role || !newPhotoUrl) {
        alert('Preencha os Campos Corretamente!');
        return;
      }

      setClergies(
        clergies.map((c) =>
          c.id === editClergy.id
            ? { ...c, name, role, title, photoUrl: newPhotoUrl }
            : c
        )
      );
      handleClose();
      return;
    }

    if (!name || !role || !uploadedPreviewUrl) {
      alert('Preencha os Campos Corretamente!');
      return;
    }

    setClergies([
      ...clergies,
      {
        id: Date.now(),
        name,
        role,
        title,
        photoUrl: uploadedPreviewUrl,
      },
    ]);
    handleClose();
  }

  function handleDelete(id: number) {
    setClergies(clergies.filter((clergy) => clergy.id !== id));
  }

  function handleEdit(clergy: any) {
    setEditClergy(clergy);
    setName(clergy.name);
    setRole(clergy.role);
    setTitle(clergy.title || '');
    setIsOpen(true);
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
            onClick={() => setIsOpen(true)}
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
              onDelete={() => handleDelete(clergy.id)}
              onEdit={() => handleEdit(clergy)}
              key={clergy.id}
              name={clergy.name}
              role={clergy.role}
              title={clergy.title}
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
            <input
              placeholder="Título (ex: Dom, Padre, Reverendíssimo)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
            <div className="flex flex-col gap-2">
              <span className="block text-sm text-zinc-700 font-semibold">
                Foto da Autoridade
              </span>
              <div className="flex flex-col sm:flex-row gap-4">
                <ImagePreview size="lg" />
                <div className="flex-1">
                  <FileInputRoot className="flex-1">
                    <FileInputTrigger />
                    <FileInputControl accept="image/png,image/jpeg" />
                  </FileInputRoot>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={handleClose}
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
