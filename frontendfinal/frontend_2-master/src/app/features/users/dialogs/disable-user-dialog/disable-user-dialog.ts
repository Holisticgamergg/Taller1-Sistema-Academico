import { Component, inject } from '@angular/core';
import { UserApiService } from '../../services/user-service';
import { MatDialogRef } from '@angular/material/dialog';
import { ComunicationService } from '../../services/comunication-service';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-disable-user-dialog',
  imports: [],
  templateUrl: './disable-user-dialog.html',
  styleUrl: './disable-user-dialog.css'
})
export class DisableUserDialog {
  private userService = inject(UserApiService)
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>)
  comunication = inject(ComunicationService)

  disableUser() {
    const codp = Number(this.comunication.selectedUser()?.codp)
    this.userService.disableUser(codp, 0).subscribe({
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
