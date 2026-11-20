import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export const ChurchAvatar = ({
  name,
  coverUrl,
  className,
}: {
  name: string;
  coverUrl?: string | null;
  className?: string;
}) => {
  return (
    <Avatar
      className={cn(
        'size-11 sm:size-12 rounded-full border border-zinc-200/80 shadow-2xs shrink-0',
        className
      )}
    >
      <AvatarImage
        src={coverUrl || undefined}
        alt={name}
        className="object-cover size-full rounded-full"
      />
      <AvatarFallback className="bg-[#fef8ed] text-[#B8872E] font-semibold text-sm sm:text-sm">
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
