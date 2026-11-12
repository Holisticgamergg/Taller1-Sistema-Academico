import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DictaService } from '../../services/dicta.service';
import { Dicta } from '../../models/dicta.model';

@Component({
  selector: 'app-disable-dicta-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './disable-dicta-dialog.html',
  styleUrl: './disable-dicta-dialog.css',
})
export class DisableDictaDialogComponent {
  private dialogRef = inject(MatDialogRef<DisableDictaDialogComponent>);
  private dictaService = inject(DictaService);
  data = inject(MAT_DIALOG_DATA);

  asignacion: Dicta = this.data.asignacion;

  disableAsignacion(): void {
    this.dictaService
      .delete(
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
          console.error('Error al eliminar asignación:', err);
          alert('Error al eliminar la asignación. Por favor, intente nuevamente.');
        },
      });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}
