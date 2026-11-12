import { Component, inject, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MenuService } from '../../services/menu.service';
import { Menu } from '../../models/menu.model';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';

@Component({
  selector: 'app-menu-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './menu-form-dialog.html',
  styleUrl: './menu-form-dialog.css'
})
export class MenuFormDialogComponent {
  private fb = inject(FormBuilder);
  private menuService = inject(MenuService);
  private dialogRef = inject(MatDialogRef<FormDialog>);

  menuForm: FormGroup;
  isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { menu?: Menu }) {
    this.isEditMode = !!data?.menu;
    
    this.menuForm = this.fb.group({
      nombre: [data?.menu?.nombre || '', Validators.required]
    });
  }

  onSubmit() {
    if (this.menuForm.valid) {
      const menuDto = this.menuForm.value;

      if (this.isEditMode && this.data.menu) {
        this.menuService.update(this.data.menu.codm, menuDto).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('❌ Error al actualizar menu:', err);
            this.dialogRef.close(false);
          }
        });
      } else {
        this.menuService.create(menuDto).subscribe({
          next: () => {
            this.dialogRef.close(true);
          },
          error: (err) => {
            console.error('❌ Error al crear menu:', err);
            this.dialogRef.close(false);
          }
        });
      }
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}