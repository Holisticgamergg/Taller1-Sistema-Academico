import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrograService } from '../../services/progra.service';
import { Progra } from '../../models/progra.model';

@Component({
  selector: 'app-disable-progra-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disable-progra-dialog.html',
  styleUrl: './disable-progra-dialog.css'
})
export class DisablePrograDialogComponent {
  private readonly prograService = inject(PrograService);
  private readonly dialogRef = inject(MatDialogRef<DisablePrograDialogComponent>);
  public readonly data: Progra = inject(MAT_DIALOG_DATA);

  isLoading = false;

  /**
   * Confirma la eliminación de la inscripción
   */
  onConfirm(): void {
    this.isLoading = true;
    
    this.prograService.delete(
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
        console.error('Error al eliminar inscripción:', err);
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
