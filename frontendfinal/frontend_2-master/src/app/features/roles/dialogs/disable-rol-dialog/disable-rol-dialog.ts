import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RolService } from '../../services/rol.service';
import { RolComunicationService } from '../../services/rol-comunication.service';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-disable-rol-dialog',
  standalone: true,
  imports: [],
  templateUrl: './disable-rol-dialog.html',
  styleUrl: './disable-rol-dialog.css'
})
export class DisableRolDialog {
  private rolService = inject(RolService);
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  comunication = inject(RolComunicationService);

  disableRol() {
    const codr = this.comunication.selectedRol()?.codr;
    if (!codr) return;
    
    this.rolService.delete(codr).subscribe({
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
