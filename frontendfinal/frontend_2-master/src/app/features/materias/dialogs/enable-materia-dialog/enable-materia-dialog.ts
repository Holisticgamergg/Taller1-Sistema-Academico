import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Materia } from '../../models/materia.model';
import { MateriaService } from '../../services/materia.service';

export interface EnableMateriaDialogData {
  materia: Materia;
}

@Component({
  selector: 'app-enable-materia-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './enable-materia-dialog.html',
  styleUrls: ['./enable-materia-dialog.css'],
})
export class EnableMateriaDialogComponent {
  private dialogRef = inject(MatDialogRef<EnableMateriaDialogComponent>);
  private materiaService = inject(MateriaService);
  public data: EnableMateriaDialogData = inject(MAT_DIALOG_DATA);

  onConfirm(): void {
    this.materiaService.enable(this.data.materia.codmat).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        console.error('Error habilitando materia:', error);
        this.dialogRef.close(false);
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
