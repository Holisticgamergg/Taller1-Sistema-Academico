import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'end',
    verticalPosition: 'top',
  };

  showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      panelClass: ['snackbar-error'],
    });
  }

  showWarning(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      panelClass: ['snackbar-warning'],
    });
  }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      duration: 3000,
      panelClass: ['snackbar-success'],
    });
  }

  showInfo(message: string): void {
    this.snackBar.open(message, 'Cerrar', {
      ...this.defaultConfig,
      panelClass: ['snackbar-info'],
    });
  }
}
