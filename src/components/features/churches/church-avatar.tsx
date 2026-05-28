import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ChurchAvatar = ({
  name,
  coverUrl,
}: {
  name: string;
  coverUrl: string;
}) => {
  return (
    <Avatar>
      <AvatarImage src={coverUrl} alt={name} />
      <AvatarFallback>
        {name
          .split(' ')
          .slice(0, 2)
          .map((word) => word[0])
          .join('')
          .toUpperCase()}
      </AvatarFallback>
    </Avatar>
  );
};
