import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrograService } from '../../services/progra.service';
import { Progra } from '../../models/progra.model';

@Component({
  selector: 'app-enable-progra-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './enable-progra-dialog.html',
  styleUrl: './enable-progra-dialog.css'
})
export class EnablePrograDialogComponent {
  private readonly prograService = inject(PrograService);
  private readonly dialogRef = inject(MatDialogRef<EnablePrograDialogComponent>);
  public readonly data: Progra = inject(MAT_DIALOG_DATA);

  isLoading = false;

  /**
   * Confirma la habilitación de la inscripción
   */
  onConfirm(): void {
    this.isLoading = true;
    
    this.prograService.enable(
      this.data.codmat,
      this.data.codpar,
      this.data.gestion,
      this.data.codp
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error al habilitar inscripción:', err);
        this.isLoading = false;
      }
    });
  }

  /**
   * Cancela la operación
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
