import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { FieldLabel } from './field';

interface FieldSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  isOptional?: boolean;
}

export function FieldSection({
  isOptional,
  title,
  description,
  icon,
  children,
  className,
}: FieldSectionProps) {
  return (
    <div
      data-slot="field-section"
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 pb-5',
        className
      )}
    >
      <div>
        <div className="flex items-center gap-2">
          {icon && <span className="shrink-0">{icon}</span>}
          <FieldLabel className="flex items-center gap-2">
            {title} {isOptional && <Badge variant="secondary">Opcional</Badge>}
          </FieldLabel>
        </div>
        {description && (
          <p className="text-left text-md text-zinc-600 font-normal mt-2">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
