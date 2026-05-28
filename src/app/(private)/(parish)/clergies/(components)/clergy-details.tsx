/*Tela em Desenvolvimento!!!!!*/

interface ClergyDetailsProps {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  onClose: () => void;
}

export default function Clergydetails({
  name,
  role,
  bio,
  photoUrl,
  onClose,
}: ClergyDetailsProps) {
  return (
    <div className="flex">
      <div className="w-80">
        <img
          src={photoUrl}
          alt={name}
          className="w-full h-64 object-cover rounded-lg"
        />
        <p>{name}</p>
        <p>{role}</p>
      </div>
      <div className="flex-1">
        <h1>biografia</h1>
        <p>{bio}</p>
      </div>
    </div>
  );
}
