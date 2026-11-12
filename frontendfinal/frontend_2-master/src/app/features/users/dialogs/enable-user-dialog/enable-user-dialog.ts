import { Component, inject } from '@angular/core';
import { UserApiService } from '../../services/user-service';
import { ComunicationService } from '../../services/comunication-service';
import { MatDialogRef } from '@angular/material/dialog';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-enable-user-dialog',
  imports: [],
  templateUrl: './enable-user-dialog.html',
  styleUrl: './enable-user-dialog.css'
})
export class EnableUserDialog {
  private userService = inject(UserApiService)
  comunication = inject(ComunicationService)
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>)

  enableUser() {
    const codp = Number(this.comunication.selectedUser()?.codp)
    this.userService.enableUser(codp, 1).subscribe({
      next: () => {
        this.comunication.notifyUsersListRefresh()
        this.close()
      }, 
      error: () => {
        this.close()
      }
    })
  }

  close() {
    this.dialogRef.close()
  }
}
