/*Tela em Desenvolvimento!!!!!*/
'use client';

import Clergycard from '../(components)/clergycard';
import { TypographyH1 } from '@/components/ui/typography/h1';
import { Pencil, Upload, Trash2, Copy, Share2 } from 'lucide-react';

export default function Clergydetails() {
  const clergy = {
    name: 'Altair Santos',
    role: 'Pároco',
    title: 'Dom',
    photoUrl:
      'https://images.pexels.com/photos/28143097/pexels-photo-28143097/free-photo-of-igreja-capela-catedral-retrato.jpeg',
  };
  function handleEdit() {
    alert('Editando Autoridade');
  }
  function handleSaveDraft() {
    alert('Rascunho Salvo');
  }
  function handlePublish() {
    alert('Autoridade Publicada');
  }
  function handleDeletePhoto() {
    alert('Foto Deletada');
  }
  function handleUploudPhoto() {
    alert('Foto Carregada');
  }
  function handlecopy() {
    alert('Texto Copiado');
  }
  function handleShare() {
    alert('Compartilhar texto');
  }

  return (
    <main className="max-w-300 w-full px-4 pt-30 pb-12 lg:col-start-2 lg:px-8 lg:pt-8 mx-auto">
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-3 w-64">
          <img
            src={clergy.photoUrl}
            alt={clergy.name}
            className="w-40 h-40 rounded-full object-cover"
          />

          <div className="flex gap-2">
            <button onClick={handleUploudPhoto}>
              <Upload size={16} />
            </button>
            <button onClick={handleDeletePhoto}>
              <Trash2 size={16} />
            </button>
          </div>
          <div className="w-full">
            <p className="text-xs text-gray-400">Cargo</p>
            <p className="text-sm border rounded-md px-3 py-2">{clergy.role}</p>
          </div>
          <div className="w-full">
            <p className="text-xs text-gray-400">Titulo</p>
            <p className="text-sm border rounded-md px-3 py-2">
              {clergy.title}
            </p>
          </div>
          <div className="w-full">
            <p className="text-xs text-gray-400">Nome</p>
            <p className="text-xs border px-3 py-2">{clergy.name}</p>
          </div>
          <div className="w-full">
            <p className="text-xs text-gray-400"></p>
            <h1>biografia</h1>
            <textarea className="text-sm border rounded-md px-3 py-2 w-full h-32" />
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 border rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
            >
              <div className="flex items-center gap-2">
                <Pencil size={16} />
                Editar
              </div>
            </button>{' '}
          </div>
        </div>
        <div>
          <TypographyH1>Padre Altair Santos</TypographyH1>
          <div className="flex justify-end gap-2">
            <button onClick={handlecopy}>
              <Copy size={16} />
            </button>
            <button onClick={handleShare}>
              <Share2 size={16} />
            </button>
          </div>
          <p className="gap-2">
            Padre Altair Santos nasceu em Caraguatatuba, São Paulo, e foi
            ordenado sacerdote em 1995. Atua como pároco da Paróquia São José há
            mais de 20 anos, dedicando sua vida ao serviço da comunidade local.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-8">
        <button
          onClick={handleSaveDraft}
          className="bg-white text-black px-1 py-1 rounded-md"
        >
          Salvar Rascunho
        </button>
        <button
          onClick={handlePublish}
          className="bg-amber-800 text-white px-1 py-1 rounded-md"
        >
          Publicar Agora
        </button>
      </div>
    </main>
  );
}
