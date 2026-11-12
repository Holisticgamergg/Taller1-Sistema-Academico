import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NivelService } from '../../services/nivel.service';
import { NivelComunicationService } from '../../services/nivel-comunication.service';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-disable-nivel-dialog',
  standalone: true,
  imports: [],
  templateUrl: './disable-nivel-dialog.html',
  styleUrl: './disable-nivel-dialog.css'
})
export class DisableNivelDialog {
  private nivelService = inject(NivelService);
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  comunication = inject(NivelComunicationService);

  disableNivel() {
    const codn = this.comunication.selectedNivel()?.codn;
    if (!codn) return;
    
    this.nivelService.delete(codn).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.dialogRef.close(false);
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
