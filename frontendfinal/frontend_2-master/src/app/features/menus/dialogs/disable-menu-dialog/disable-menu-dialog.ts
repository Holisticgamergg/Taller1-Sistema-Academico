import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MenuService } from '../../services/menu.service';
import { MenuComunicationService } from '../../services/menu-comunication.service';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-disable-menu-dialog',
  standalone: true,
  imports: [],
  templateUrl: './disable-menu-dialog.html',
  styleUrl: './disable-menu-dialog.css'
})
export class DisableMenuDialog {
  private menuService = inject(MenuService);
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  comunication = inject(MenuComunicationService);

  disableMenu() {
    const id = this.comunication.selectedMenu()?.codm;
    if (!id) return;
    
    this.menuService.delete(id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('❌ Error al eliminar menu:', err);
        this.dialogRef.close(false);
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}