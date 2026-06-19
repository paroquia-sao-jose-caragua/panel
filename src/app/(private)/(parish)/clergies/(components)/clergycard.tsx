import Link from 'next/link';

interface ClergyCardProps {
  name: string;
  role: string;
  title: string;
  photoUrl: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function Clergycard({
  name,
  role,
  title,
  photoUrl,
  onDelete,
  onEdit,
}: ClergyCardProps) {
  return (
    <Link
      href={`/clergies/clergy-details?name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(title)}&photoUrl=${encodeURIComponent(photoUrl)}`}
    >
      <div className="flex flex-col items-center gap-3 p-5 bg-white border border-gray-200 rounded-xl w-48">
        <img
          className="w-20 h-20 rounded-full object-cover"
          src={photoUrl}
          alt={name}
        />
        <p className="text-xs text-black">{role}</p>
        <p className="text-sm font-medium text-gray-800">{name}</p>
        <div className="flex gap-2">
          <button
            type="button"
            className="border border-red-400 text-red-400 px-3 py-1 rounded-md text-xs hover:bg-red-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            Excluir
          </button>
          <button
            type="button"
            className="border border-blue-400 text-blue-400 px-3 py-1 rounded-md text-xs hover:bg-blue-400 hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          >
            Editar
          </button>
        </div>
      </div>
    </Link>
  );
}
