interface ClergyCardProps {
  name: string;
  role: string;
  photoUrl: string;
  onEdit: () => void;
  onDelete: () => void;
}

export default function Clergycard({
  name,
  role,
  photoUrl,
  onDelete,
  onEdit,
}: ClergyCardProps) {
  return (
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
          className="border border-red-400 text-red-400 px-3 py-1 rounded-md text-xs hover:bg-red-400 hover:text-white"
          onClick={onDelete}
        >
          Excluir
        </button>
        <button
          className="border border-blue-400 text-blue-400 px-3 py-1 rounded-md text-xs hover:bg-blue-400 hover:text-white"
          onClick={onEdit}
        >
          Editar
        </button>
      </div>
    </div>
  );
}
