import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParaleloService } from '../../services/paralelo.service';
import { Paralelo, ParaleloDto } from '../../models/paralelo.model';

@Component({
  selector: 'app-paralelo-form-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './paralelo-form-dialog.html',
  styleUrl: './paralelo-form-dialog.css'
})
export class ParaleloFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private paraleloService = inject(ParaleloService);
  private dialogRef = inject(MatDialogRef<ParaleloFormDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);

  paraleloForm!: FormGroup;
  isEditMode = false;
  paraleloId?: number;

  ngOnInit() {
    this.isEditMode = !!this.data?.paralelo;
    this.paraleloId = this.data?.paralelo?.codpar;

    this.paraleloForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(1)]]
    });

    if (this.isEditMode && this.data.paralelo) {
      this.paraleloForm.patchValue({
        nombre: this.data.paralelo.nombre
      });
    }
  }

  submit() {
    if (this.paraleloForm.invalid) {
      return;
    }

    const paraleloDto: ParaleloDto = {
      nombre: this.paraleloForm.value.nombre
    };

    if (this.isEditMode && this.paraleloId) {
      this.paraleloService.update(this.paraleloId, paraleloDto).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('❌ Error al actualizar paralelo:', err);
        }
      });
    } else {
      this.paraleloService.create(paraleloDto).subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('❌ Error al crear paralelo:', err);
        }
      });
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
