import { formatBytes } from '@/utils/formatBytes';
import { CheckCircle2, Trash2 } from 'lucide-react';
import { tv, type VariantProps } from 'tailwind-variants';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCallback } from 'react';
import { useFileInputStore } from '@/stores/useFileInputStore';
import { Button } from '../button';

const fileItem = tv({
  slots: {
    container:
      'bg-white group flex items-start gap-4 rounded-lg border border-zinc-200 p-4',
    icon: 'rounded-full border-4 border-brand-100 bg-brand-200 p-2 text-brand-600',
    deleteButton: '',
  },

  variants: {
    state: {
      progress: {
        container: '',
      },
      complete: { container: 'border-brand-500' },
      error: {
        container: 'bg-error-25 border-error-300',
        icon: 'border-error-50 bg-error-100 text-error-600',
        deleteButton: 'text-error-700 hover:text-error-900',
      },
    },
  },

  defaultVariants: {
    state: 'progress',
  },
});

export interface FileItemProps extends VariantProps<typeof fileItem> {
  id: string;
  url: string;
  name: string;
  size: number;
  progress: number;
}

export default function FileItem({
  id,
  url,
  name,
  size,
  state,
  progress,
}: FileItemProps) {
  const { container, deleteButton } = fileItem({ state });
  const { removeFile } = useFileInputStore();

  const handleRemoveFile = useCallback(() => {
    removeFile(id);
  }, [id, removeFile]);

  return (
    <div className={container()}>
      <Image src={url} width={70} height={50} alt="" className="rounded" />

      {state === 'error' ? (
        <div className="flex flex-1 flex-col items-start gap-1">
          <div className="flex flex-col">
            <span className="text-error-700 text-sm font-medium">
              Upload failed, please try again.
            </span>
            <span className="text-error-600 text-sm">{name}</span>
          </div>

          <button
            type="button"
            className="text-error-700 hover:text-error-900 text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-start gap-1">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-zinc-700">{name}</span>
            <span className="text-sm text-zinc-500">{formatBytes(size)}</span>
          </div>

          <div className="flex w-full items-center gap-3">
            <div className="h-2 flex-1 rounded-full bg-zinc-100">
              <motion.div
                className="h-2 rounded-full bg-brand-600"
                initial={{ width: 0 }}
                animate={{
                  width: `${progress ?? (state === 'complete' ? 100 : 0)}%`,
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <span className="text-sm font-medium text-zinc-700">
              {progress ?? (state === 'complete' ? 100 : 0)}%
            </span>
          </div>
        </div>
      )}

      {state === 'complete' ? (
        <Button
          type="button"
          variant="ghost"
          className={deleteButton()}
          onClick={handleRemoveFile}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      ) : (
        <CheckCircle2 className="h-5 w-5 fill-brand-600 text-white" />
      )}
    </div>
  );
}
