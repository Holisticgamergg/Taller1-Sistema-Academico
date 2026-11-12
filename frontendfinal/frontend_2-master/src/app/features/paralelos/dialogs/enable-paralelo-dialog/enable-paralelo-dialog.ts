import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ParaleloService } from '../../services/paralelo.service';
import { ParaleloComunicationService } from '../../services/paralelo-comunication.service';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-enable-paralelo-dialog',
  standalone: true,
  imports: [],
  templateUrl: './enable-paralelo-dialog.html',
  styleUrl: './enable-paralelo-dialog.css'
})
export class EnableParaleloDialog {
  private paraleloService = inject(ParaleloService);
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  comunication = inject(ParaleloComunicationService);

  enableParalelo() {
    const codpar = this.comunication.selectedParalelo()?.codpar;
    if (!codpar) return;
    
    this.paraleloService.enable(codpar).subscribe({
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
