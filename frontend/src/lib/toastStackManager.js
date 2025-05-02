import toast from "react-hot-toast";

const MAX_TOASTS = 1;
const toastQueue = [];

export function showLimitedToast(contentFn, options = {}) {
  // Remove any toasts that were dismissed manually
  // Filter out toasts whose id no longer matches in the active set
  while (toastQueue.length >= MAX_TOASTS) {
    const idToDismiss = toastQueue.shift();
    toast.dismiss(idToDismiss);
  }

  const id = options?.id || `toast-${Date.now()}-${Math.random()}`;
  toast.custom(contentFn, { ...options, id });
  toastQueue.push(id);
}
