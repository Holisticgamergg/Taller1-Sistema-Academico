import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Materia } from '../../models/materia.model';
import { MateriaService } from '../../services/materia.service';

export interface DisableMateriaDialogData {
  materia: Materia;
}

@Component({
  selector: 'app-disable-materia-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './disable-materia-dialog.html',
  styleUrls: ['./disable-materia-dialog.css'],
})
export class DisableMateriaDialogComponent {
  private dialogRef = inject(MatDialogRef<DisableMateriaDialogComponent>);
  private materiaService = inject(MateriaService);
  public data: DisableMateriaDialogData = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.materiaService.delete(this.data.materia.codmat).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error deshabilitando materia:', error);
        this.dialogRef.close(false);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
