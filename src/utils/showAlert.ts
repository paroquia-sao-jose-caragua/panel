import { toast } from 'sonner';

let lastMessage = '';
let lastTime = 0;

export const showAlert = (message: string) => {
  if (typeof window === 'undefined' || !message) return;

  const now = Date.now();
  // Prevent duplicate toasts with the exact same text within 800ms
  if (message === lastMessage && now - lastTime < 800) {
    return;
  }
  lastMessage = message;
  lastTime = now;

  const lower = message.toLowerCase();
  if (
    lower.includes('erro') ||
    lower.includes('falha') ||
    lower.includes('não foi possível')
  ) {
    toast.error(message);
  } else if (
    lower.includes('sucesso') ||
    lower.includes('salvo') ||
    lower.includes('agendado') ||
    lower.includes('confirmado') ||
    lower.includes('atualizado') ||
    lower.includes('removido') ||
    lower.includes('excluído') ||
    lower.includes('realizado')
  ) {
    toast.success(message);
  } else if (lower.includes('atenção') || lower.includes('aviso')) {
    toast.warning(message);
  } else {
    toast(message);
  }
};
