// plugins/toast.ts
export default defineNuxtPlugin((nuxtApp) => {
  const toast = {
    show(message: string, options: { type?: string; duration?: number } = {}) {
      const { type = 'default', duration = 3000 } = options;
      
      // Create toast element
      const toastElement = document.createElement('div');
      toastElement.className = `toast toast-${type} fixed right-4 top-4 p-4 rounded-md shadow-md max-w-sm z-50 text-sm font-medium transform transition-all duration-300 translate-y-0 opacity-0`;
      
      // Set background color based on type
      switch (type) {
        case 'success':
          toastElement.classList.add('bg-green-500', 'text-white');
          break;
        case 'error':
          toastElement.classList.add('bg-red-500', 'text-white');
          break;
        case 'info':
          toastElement.classList.add('bg-blue-500', 'text-white');
          break;
        default:
          toastElement.classList.add('bg-gray-700', 'text-white');
      }
      
      // Set message
      toastElement.textContent = message;
      
      // Append to document
      document.body.appendChild(toastElement);
      
      // Show animation
      setTimeout(() => {
        toastElement.classList.remove('translate-y-0', 'opacity-0');
        toastElement.classList.add('translate-y-4', 'opacity-100');
      }, 10);
      
      // Hide and remove
      setTimeout(() => {
        toastElement.classList.remove('translate-y-4', 'opacity-100');
        toastElement.classList.add('translate-y-0', 'opacity-0');
        
        setTimeout(() => {
          document.body.removeChild(toastElement);
        }, 300);
      }, duration);
    },
    
    success(message: string, duration = 3000) {
      this.show(message, { type: 'success', duration });
    },
    
    error(message: string, duration = 5000) {
      this.show(message, { type: 'error', duration });
    },
    
    info(message: string, duration = 3000) {
      this.show(message, { type: 'info', duration });
    }
  };

  nuxtApp.provide('toast', toast);
})
