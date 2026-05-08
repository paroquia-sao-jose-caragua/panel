import { cn } from '@/lib/utils';

interface FieldSectionProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function FieldSection({
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
          <h3 className="text-zinc-800 text-lg font-bold">{title}</h3>
        </div>
        {description && (
          <p className="text-left text-sm font-normal text-muted-foreground mt-2">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
