import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AlertService } from '../services/alert.service';
import { ApiErrorResponse } from '../models/api-error-response';

export const GlobalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      switch (error.status) {
        case 400: // Bad Request - Validaciones del backend
          const apiError400 = error.error as ApiErrorResponse;
          errorMessage = apiError400?.message || 'Solicitud inválida';
          
          // Si hay múltiples errores de validación, mostrarlos
          if (apiError400?.errors && apiError400.errors.length > 0) {
            errorMessage = apiError400.errors.join('\n');
          }
          // Popup rojo en el centro de la pantalla
          alertService.showError(errorMessage, 'Error de Validación');
          break;

        case 401: // Unauthorized - Sesión expirada
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          alertService.showSessionExpired(error.error);
          router.navigate(['/login']);
          break;

        case 403: // Forbidden - Sin permisos
          alertService.showError('No tiene permisos para realizar esta acción', 'Acceso Denegado');
          break;

        case 404: // Not Found - Recurso no encontrado
          const apiError404 = error.error as ApiErrorResponse;
          errorMessage = apiError404?.message || 'Recurso no encontrado';
          alertService.showError(errorMessage, 'No Encontrado');
          break;

        case 409: // Conflict - Conflicto (duplicados, etc.)
          const apiError409 = error.error as ApiErrorResponse;
          errorMessage = apiError409?.message || 'Conflicto con el estado actual del recurso';
          alertService.showError(errorMessage, 'Conflicto');
          break;

        case 422: // Unprocessable Entity - Error de validación
          const apiError422 = error.error as ApiErrorResponse;
          errorMessage = apiError422?.message || 'Error de validación';
          alertService.showError(errorMessage, 'Datos Inválidos');
          break;

        case 500: // Internal Server Error
          alertService.showServerError();
          break;

        case 502: // Bad Gateway
        case 503: // Service Unavailable
        case 504: // Gateway Timeout
          alertService.showError('El servidor no está disponible. Intente más tarde.', 'Servidor No Disponible');
          break;

        case 0: // Network Error (sin conexión)
          alertService.showConnectionError();
          break;

        default:
          alertService.showError('Ha ocurrido un error inesperado', 'Error');
          break;
      }

      // Re-lanzar el error para que el componente pueda manejarlo si lo necesita
      return throwError(() => error);
    })
  );
};
