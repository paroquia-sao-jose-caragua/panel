'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export interface ConfirmDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  button?: React.ElementType<React.ComponentProps<typeof Button>>;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  isPending?: boolean;
  onConfirm: () => void | Promise<void>;
  children?: React.ReactNode;
}

export const ConfirmDialog = ({
  open,
  onOpenChange,
  trigger,
  button: TriggerButton,
  title,
  description,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
  isPending = false,
  onConfirm,
  children,
}: ConfirmDialogProps) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    await onConfirm();
    if (!isPending && !isControlled) {
      setInternalOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      {!trigger && TriggerButton && (
        <DialogTrigger asChild>
          <TriggerButton />
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children && <div className="py-2">{children}</div>}

        <DialogFooter className="flex flex-row items-center justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => handleOpenChange(false)}
            >
              {cancelText}
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={variant}
            isLoading={isPending}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export interface DeleteConfirmationDialogProps
  extends Partial<ConfirmDialogProps> {
  onConfirm: () => void | Promise<void>;
  itemName?: string;
}

export const DeleteConfirmationDialog = ({
  title = 'Confirmar Exclusão',
  description,
  confirmText = 'Excluir',
  cancelText = 'Cancelar',
  variant = 'destructive',
  itemName,
  ...props
}: DeleteConfirmationDialogProps) => {
  const finalDescription =
    description ||
    (itemName
      ? `Esta ação não pode ser desfeita. Deseja realmente excluir "${itemName}" permanentemente?`
      : 'Esta ação não pode ser desfeita. Deseja realmente excluir este item permanentemente?');

  return (
    <ConfirmDialog
      title={title}
      description={finalDescription}
      confirmText={confirmText}
      cancelText={cancelText}
      variant={variant}
      {...props}
    />
  );
};

export default ConfirmDialog;
