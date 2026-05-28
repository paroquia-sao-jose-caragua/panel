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

export const ConfirmDialog = ({
  button: TriggerButton,
  title,
  description,
  confirmButtonTitle,
  children,
  onConfirm,
}: {
  button: React.ElementType<React.ComponentProps<typeof Button>>;
  title: string;
  description?: string;
  confirmButtonTitle?: string;
  children?: React.ReactNode;
  onConfirm?: () => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TriggerButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogContent>{children}</DialogContent>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button">Cancelar</Button>
          </DialogClose>
          <Button type="button" onClick={onConfirm}>
            {confirmButtonTitle || 'Confirmar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
