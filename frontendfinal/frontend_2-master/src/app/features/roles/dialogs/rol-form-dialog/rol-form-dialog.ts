import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RolService } from '../../services/rol.service';
import { Rol, RolDto } from '../../models/rol.model';

@Component({
  selector: 'app-rol-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rol-form-dialog.html',
  styleUrl: './rol-form-dialog.css'
})
export class RolFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private rolService = inject(RolService);
  private dialogRef = inject(MatDialogRef<RolFormDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  rolForm!: FormGroup;
  isEditMode = false;
  rolId?: number;

  ngOnInit() {
    this.isEditMode = !!this.data?.rol;
    this.rolId = this.data?.rol?.codr;

    this.rolForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });

    if (this.isEditMode && this.data.rol) {
      this.rolForm.patchValue({
        nombre: this.data.rol.nombre
      });
    }
  }

  submit() {
    if (this.rolForm.invalid) {
      return;
    }

    const rolDto: RolDto = {
      nombre: this.rolForm.value.nombre
    };

    if (this.isEditMode && this.rolId) {
      this.rolService.update(this.rolId, rolDto).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('❌ Error al actualizar rol:', err);
        }
      });
    } else {
      this.rolService.create(rolDto).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('❌ Error al crear rol:', err);
        }
      });
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
