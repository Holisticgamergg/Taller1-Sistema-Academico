import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NivelService } from '../../services/nivel.service';
import { Nivel, NivelDto } from '../../models/nivel.model';

@Component({
  selector: 'app-nivel-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './nivel-form-dialog.html',
  styleUrl: './nivel-form-dialog.css'
})
export class NivelFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private nivelService = inject(NivelService);
  private dialogRef = inject(MatDialogRef<NivelFormDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  nivelForm!: FormGroup;
  isEditMode = false;
  nivelId?: number;

  ngOnInit() {
    this.isEditMode = !!this.data?.nivel;
    this.nivelId = this.data?.nivel?.codn;

    this.nivelForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]]
    });

    if (this.isEditMode && this.data.nivel) {
      this.nivelForm.patchValue({
        nombre: this.data.nivel.nombre
      });
    }
  }

  submit() {
    if (this.nivelForm.invalid) {
      return;
    }

    const nivelDto: NivelDto = {
      nombre: this.nivelForm.value.nombre
    };

    if (this.isEditMode && this.nivelId) {
      this.nivelService.update(this.nivelId, nivelDto).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('❌ Error al actualizar nivel:', err);
        }
      });
    } else {
      this.nivelService.create(nivelDto).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('❌ Error al crear nivel:', err);
        }
      });
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
