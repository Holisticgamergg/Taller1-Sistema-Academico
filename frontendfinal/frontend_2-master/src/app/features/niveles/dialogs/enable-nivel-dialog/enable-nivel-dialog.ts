import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { NivelService } from '../../services/nivel.service';
import { NivelComunicationService } from '../../services/nivel-comunication.service';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-enable-nivel-dialog',
  standalone: true,
  imports: [],
  templateUrl: './enable-nivel-dialog.html',
  styleUrl: './enable-nivel-dialog.css'
})
export class EnableNivelDialog {
  private nivelService = inject(NivelService);
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  comunication = inject(NivelComunicationService);

  enableNivel() {
    const codn = this.comunication.selectedNivel()?.codn;
    if (!codn) return;
    
    this.nivelService.enable(codn).subscribe({
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
