import { toast as sonnerToast } from 'sonner';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export function useToast() {
  const toast = ({ title, description, variant = 'default', duration = 4000 }: ToastOptions) => {
    if (variant === 'destructive') {
      sonnerToast.error(title || 'Error', {
        description,
        duration,
      });
    } else {
      sonnerToast.success(title || 'Success', {
        description,
        duration,
      });
    }
  };

  return { toast };
} 