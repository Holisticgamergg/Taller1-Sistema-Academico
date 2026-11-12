import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MenuService } from '../../services/menu.service';
import { MenuComunicationService } from '../../services/menu-comunication.service';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-enable-menu-dialog',
  standalone: true,
  imports: [],
  templateUrl: './enable-menu-dialog.html',
  styleUrl: './enable-menu-dialog.css'
})
export class EnableMenuDialog {
  private menuService = inject(MenuService);
  private dialogRef = inject(MatDialogRef<ConfirmationDialog>);
  comunication = inject(MenuComunicationService);

  enableMenu() {
    const id = this.comunication.selectedMenu()?.codm;
    if (!id) return;
    
    this.menuService.enable(id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('❌ Error al habilitar menu:', err);
        this.dialogRef.close(false);
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}