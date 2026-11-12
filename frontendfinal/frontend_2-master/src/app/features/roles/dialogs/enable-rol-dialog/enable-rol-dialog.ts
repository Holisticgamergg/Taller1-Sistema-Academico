import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../../services/rol.service';
import { RolComunicationService } from '../../services/rol-comunication.service';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-enable-rol-dialog',
  standalone: true,
  imports: [],
  templateUrl: './enable-rol-dialog.html',
  styleUrl: './enable-rol-dialog.css'
})
export class EnableRolDialog {
  private rolService = inject(RolService);
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  comunication = inject(RolComunicationService);

  enableRol() {
    const codr = this.comunication.selectedRol()?.codr;
    if (!codr) return;
    
    this.rolService.enable(codr).subscribe({
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
