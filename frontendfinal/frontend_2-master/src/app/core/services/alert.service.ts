import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {


  showError(message: string, title: string = 'Error'): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ef4444',
      customClass: {
        popup: 'swal-error-popup'
      }
    });
  }

 
  showSuccess(message: string, title: string = '¡Éxito!'): void {
    Swal.fire({
      icon: 'success',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#22c55e',
      timer: 3000,
      timerProgressBar: true
    });
  }


  showWarning(message: string, title: string = 'Advertencia'): void {
    Swal.fire({
      icon: 'warning',
      title: title,
      text: message,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#f59e0b'
    });
  }


  showInfo(message: string, title: string = 'Información'): void {
    Swal.fire({
      icon: 'info',
      title: title,
      text: message,
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#3b82f6'
    });
  }

 
  async confirm(
    message: string, 
    title: string = '¿Estás seguro?',
    confirmText: string = 'Sí, continuar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    const result = await Swal.fire({
      icon: 'question',
      title: title,
      text: message,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#007A5E',
      cancelButtonColor: '#ef4444',
      reverseButtons: true
    });
    return result.isConfirmed;
  }

  
  toast(message: string, icon: SweetAlertIcon = 'success'): void {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });

    Toast.fire({
      icon: icon,
      title: message
    });
  }


  showSessionExpired(text: string): void {

    Swal.fire({
      icon: 'warning',
      title: 'Sesión Expirada',
      text: text,
      confirmButtonText: 'Ir al Login',
      confirmButtonColor: '#007A5E',
      allowOutsideClick: false,
      allowEscapeKey: false
    });
  }

  
  showServerError(): void {
    Swal.fire({
      icon: 'error',
      title: 'Error del Servidor',
      text: 'Ha ocurrido un error inesperado en el servidor. Por favor, intenta más tarde.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ef4444'
    });
  }

 
  showConnectionError(): void {
    Swal.fire({
      icon: 'error',
      title: 'Error de Conexión',
      text: 'No se pudo conectar con el servidor. Verifica tu conexión a internet.',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#ef4444'
    });
  }
}
