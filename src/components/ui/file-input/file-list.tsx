'use client';

import { useAutoAnimate } from '@formkit/auto-animate/react';
import FileItem from './file-item';
import { useFileInputStore } from '@/stores/useFileInputStore';

export function FileList() {
  const { files } = useFileInputStore();
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="mt-4 space-y-3">
      {files.map(({ id, file, progress, state }) => {
        return (
          <FileItem
            key={id}
            id={id}
            url={URL.createObjectURL(file)}
            name={file.name}
            size={file.size}
            progress={progress ?? 0}
            state={state}
          />
        );
      })}
    </div>
  );
}
