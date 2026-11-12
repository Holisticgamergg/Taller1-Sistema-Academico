import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DictaService } from '../../services/dicta.service';
import { Dicta } from '../../models/dicta.model';

@Component({
  selector: 'app-enable-dicta-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './enable-dicta-dialog.html',
  styleUrl: './enable-dicta-dialog.css',
})
export class EnableDictaDialogComponent {
  private dialogRef = inject(MatDialogRef<EnableDictaDialogComponent>);
  private dictaService = inject(DictaService);
  data = inject(MAT_DIALOG_DATA);

  asignacion: Dicta = this.data.asignacion;

  enableAsignacion(): void {
    this.dictaService
      .enable(
        this.asignacion.codmat,
        this.asignacion.codpar,
        this.asignacion.gestion,
        this.asignacion.login
      )
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error al habilitar asignación:', err);
          alert('Error al habilitar la asignación. Por favor, intente nuevamente.');
        },
      });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
