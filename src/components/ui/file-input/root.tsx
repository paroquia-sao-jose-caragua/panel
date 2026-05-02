'use client';

import { uploadFileWithProgress } from '@/api/attachments/images/upload';
import { useFileInputStore } from '@/stores/useFileInputStore';
import {
  type ComponentProps,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
} from 'react';

export type RootProps = ComponentProps<'div'>;

type FileState = 'progress' | 'complete' | 'error';

type FileItem = {
  file: File;
  state: FileState;
  id: string;
  error?: string;
  progress?: number;
};

type FileInputContextType = {
  id: string;
  onFilesSelected: (files: File[], multiple: boolean) => void;
};

const FileInputContext = createContext({} as FileInputContextType);

export function Root(props: RootProps) {
  const id = useId();
  const { addFiles, updateFile, resetFiles } = useFileInputStore();

  const uploadFiles = useCallback(
    async (filesToUpload: FileItem[]) => {
      await Promise.all(
        filesToUpload.map(async (fileItem) => {
          try {
            const result = await uploadFileWithProgress(
              fileItem.file,
              (percent) => updateFile(fileItem.id, { progress: percent })
            );
            updateFile(fileItem.id, {
              state: 'complete',
              id: result.attachmentId,
            });
          } catch (err) {
            updateFile(fileItem.id, {
              state: 'error',
              error: String(err),
              progress: 0,
            });
          }
        })
      );
    },
    [updateFile]
  );

  const onFilesSelected = useCallback(
    (selectedFiles: File[], multiple: boolean) => {
      const newFileItems = selectedFiles.map((file) => ({
        file,
        state: 'progress' as FileState,
        id: crypto.randomUUID(),
        progress: 0,
      }));

      addFiles(newFileItems, multiple);

      uploadFiles(newFileItems);
    },
    [addFiles, uploadFiles]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    resetFiles();
  }, []);

  return (
    <FileInputContext.Provider value={{ id, onFilesSelected }}>
      <div {...props} />
    </FileInputContext.Provider>
  );
}

export const useFileInput = () => useContext(FileInputContext);
