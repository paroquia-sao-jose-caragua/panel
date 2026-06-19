'use client';
import { useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { TypographyH1 } from '@/components/ui/typography/h1';
import {
  Pencil,
  Upload,
  Download,
  Trash2,
  Copy,
  Share2,
  Save,
} from 'lucide-react';

export default function Clergydetails() {
  const searchParams = useSearchParams();

  const [photo, setPhoto] = useState(searchParams.get('photoUrl') || '');
  const [bio, setBio] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(searchParams.get('name') || '');
  const [role, setRole] = useState(searchParams.get('role') || '');
  const [title, setTitle] = useState(searchParams.get('title') || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  function handleUploadPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  }

  function handleDownloadPhoto() {
    if (!photo) return;
    const a = document.createElement('a');
    a.href = photo;
    a.download = `${name || 'foto'}.jpg`;
    a.click();
  }

  function handleEditOrSave() {
    if (isEditing) {
      if (!name.trim()) {
        alert('O nome não pode ficar vazio!');
        return;
      }
    }
    setIsEditing((prev) => !prev);
  }

  function handleSaveDraft() {
    alert('Rascunho salvo! (conecte à API para persistir)');
  }

  function handlePublish() {
    alert('Autoridade publicada! (conecte à API para persistir)');
  }

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(bio);
      alert('Biografia copiada!');
    } catch {
      alert('Não foi possível copiar.');
    }
  }

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title: name, text: bio });
    } else {
      await navigator.clipboard.writeText(bio);
      alert('Texto copiado para compartilhar!');
    }
  }

  return (
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-3 w-64">
          <img
            src={photo}
            alt={name}
            className="w-40 h-40 rounded-full object-cover"
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleUploadPhoto}
          />

          <div className="flex gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Trocar foto"
            >
              <Upload size={16} />
            </button>
            <button onClick={handleDownloadPhoto} title="Baixar foto">
              <Download size={16} />
            </button>
            <button onClick={() => setPhoto('')} title="Excluir foto">
              <Trash2 size={16} />
            </button>
          </div>

          <div className="w-full">
            <p className="text-xs text-gray-400">Cargo</p>
            {isEditing ? (
              <select
                className="text-sm border rounded-md px-3 py-2 w-full"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Pároco</option>
                <option>Diácono</option>
                <option>Bispo Diocesano</option>
                <option>Diácono Permanente</option>
                <option>Sumo Pontífice</option>
              </select>
            ) : (
              <p className="text-sm border rounded-md px-3 py-2">{role}</p>
            )}
          </div>

          <div className="w-full">
            <p className="text-xs text-gray-400">Título</p>
            {isEditing ? (
              <input
                className="text-sm border rounded-md px-3 py-2 w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            ) : (
              <p className="text-sm border rounded-md px-3 py-2">
                {title || '—'}
              </p>
            )}
          </div>

          <div className="w-full">
            <p className="text-xs text-gray-400">Nome</p>
            {isEditing ? (
              <input
                className="text-sm border rounded-md px-3 py-2 w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            ) : (
              <p className="text-xs border px-3 py-2">{name}</p>
            )}
          </div>

          <div className="w-full">
            <p className="text-xs text-gray-400 mb-1">Biografia</p>
            <textarea
              className="text-sm border rounded-md px-3 py-2 w-full h-32 resize-none"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Escreva a biografia aqui..."
            />
            <button
              onClick={handleEditOrSave}
              className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 mt-1"
            >
              {isEditing ? (
                <>
                  <Save size={16} />
                  Salvar
                </>
              ) : (
                <>
                  <Pencil size={16} />
                  Editar
                </>
              )}
            </button>
          </div>
        </div>

        <div className="flex-1">
          <TypographyH1>{name}</TypographyH1>
          <div className="flex justify-end gap-2 mb-2">
            <button onClick={handleCopy}>
              <Copy size={16} />
            </button>
            <button onClick={handleShare}>
              <Share2 size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {bio || 'Nenhuma biografia cadastrada ainda.'}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-8">
        <button
          onClick={handleSaveDraft}
          className="bg-white text-black px-3 py-2 rounded-md border text-sm"
        >
          Salvar Rascunho
        </button>
        <button
          onClick={handlePublish}
          className="bg-amber-800 text-white px-3 py-2 rounded-md text-sm"
        >
          Publicar Agora
        </button>
      </div>
    </main>
  );
}
