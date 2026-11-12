import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Materia, MateriaDto, UpdateCodigoMateriaDto } from '../../models/materia.model';
import { MateriaService } from '../../services/materia.service';
import { NivelService } from '../../../niveles/services/nivel.service';
import { Nivel } from '../../../niveles/models/nivel.model';
import { AlertService } from '../../../../core/services/alert.service';

export interface MateriaFormDialogData {
  materia?: Materia;
}

@Component({
  selector: 'app-materia-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './materia-form-dialog.html',
  styleUrls: ['./materia-form-dialog.css'],
})
export class MateriaFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<MateriaFormDialogComponent>);
  private materiaService = inject(MateriaService);
  private nivelService = inject(NivelService);
  private alertService = inject(AlertService);
  public data: MateriaFormDialogData = inject(MAT_DIALOG_DATA);

  materiaForm!: FormGroup;
  niveles = signal<Nivel[]>([]);
  isEditing = false;
  isLoading = signal(false);
  
  // Guarda el código original para detectar cambios
  private originalCodmat: string = '';

  ngOnInit(): void {
    this.isEditing = !!this.data.materia;
    this.originalCodmat = this.data.materia?.codmat || '';
    
    // El campo codmat ahora está HABILITADO incluso en modo edición
    this.materiaForm = this.fb.group({
      codmat: [this.data.materia?.codmat || '', [Validators.required]],
      nombre: [this.data.materia?.nombre || '', [Validators.required]],
      codn: [this.data.materia?.codn || '', [Validators.required]],
    });

    this.loadNiveles();
  }

  loadNiveles(): void {
    this.nivelService.listarActivos().subscribe({
      next: (niveles) => {
        this.niveles.set(niveles);
      }
    });
  }

  onSubmit(): void {
    if (this.materiaForm.valid) {
      const formValue = this.materiaForm.getRawValue();
      this.isLoading.set(true);

      if (this.isEditing) {
        const newCodmat = formValue.codmat.trim();
        const codigoHaCambiado = newCodmat !== this.originalCodmat;

        if (codigoHaCambiado) {
          // El código cambió - usar endpoint especial para cambio de PK
          const updateDto: UpdateCodigoMateriaDto = {
            oldCodmat: this.originalCodmat,
            newCodmat: newCodmat,
            nombre: formValue.nombre,
            codn: formValue.codn
          };

          this.materiaService.updateCodigo(updateDto).subscribe({
            next: (materia) => {
              this.alertService.showSuccess('Código de materia actualizado correctamente');
              this.isLoading.set(false);
              this.dialogRef.close(materia);
            },
            error: () => {
              this.isLoading.set(false);
            }
          });
        } else {
          // El código NO cambió - actualización normal
          const materiaDto: MateriaDto = {
            codmat: this.originalCodmat,
            nombre: formValue.nombre,
            codn: formValue.codn
          };

          this.materiaService.update(this.originalCodmat, materiaDto).subscribe({
            next: (materia) => {
              this.alertService.showSuccess('Materia actualizada correctamente');
              this.isLoading.set(false);
              this.dialogRef.close(materia);
            },
            error: () => {
              this.isLoading.set(false);
            }
          });
        }
      } else {
        // Crear nueva materia
        const materiaDto: MateriaDto = formValue;

        this.materiaService.create(materiaDto).subscribe({
          next: (materia) => {
            this.alertService.showSuccess('Materia creada correctamente');
            this.isLoading.set(false);
            this.dialogRef.close(materia);
          },
          error: () => {
            this.isLoading.set(false);
          }
        });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
  
  // Helper para mostrar si el código ha cambiado
  get codigoHaCambiado(): boolean {
    const currentCodmat = this.materiaForm.get('codmat')?.value?.trim() || '';
    return this.isEditing && currentCodmat !== this.originalCodmat;
  }
}
