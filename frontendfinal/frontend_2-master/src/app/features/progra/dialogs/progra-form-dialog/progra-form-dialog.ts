import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrograService } from '../../services/progra.service';
import { PrograCreateDto, AlumnoDto } from '../../models/progra.model';
import { MateriaService } from '../../../materias/services/materia.service';
import { MapaService } from '../../../materias/services/mapa.service';
import { Materia } from '../../../materias/models/materia.model';
import { Mapa } from '../../../materias/models/mapa.model';
import { NivelService } from '../../../niveles/services/nivel.service';
import { Nivel } from '../../../niveles/models/nivel.model';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-progra-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './progra-form-dialog.html',
  styleUrl: './progra-form-dialog.css'
})
export class PrograFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly prograService = inject(PrograService);
  private readonly materiaService = inject(MateriaService);
  private readonly mapaService = inject(MapaService);
  private readonly nivelService = inject(NivelService);
  private readonly dialogRef = inject(MatDialogRef<PrograFormDialogComponent>);
  private readonly dialogData = inject(MAT_DIALOG_DATA);
  private readonly alertService = inject(AlertService);

  // Signals
  niveles = signal<Nivel[]>([]);
  todasLasMaterias = signal<Materia[]>([]); // Todas las materias
  materias = signal<Materia[]>([]); // Materias filtradas por nivel
  paralelos = signal<Mapa[]>([]);
  alumnos = signal<AlumnoDto[]>([]);
  isLoading = signal<boolean>(false);
  showConfirmModal = signal<boolean>(false);

  // Gestión actual (año actual)
  gestionActual = new Date().getFullYear();

  // Formulario
  prograForm = this.fb.group({
    codn: ['', Validators.required], // Nivel
    codp: ['', Validators.required]  // Alumno
  });

  // Indica si es edición o creación
  isEdit = false;

  ngOnInit(): void {
    this.isEdit = this.dialogData?.isEdit || false;

    // Cargar niveles activos
    this.nivelService.listarActivos().subscribe({
      next: (niveles) => this.niveles.set(niveles)
    });

    // Cargar todas las materias activas (para uso interno)
    this.materiaService.getAll('', 1).subscribe({
      next: (materias) => this.todasLasMaterias.set(materias)
    });

    // Cargar estudiantes
    this.prograService.getEstudiantes().subscribe({
      next: (estudiantes) => {
        const estudiantesConNombre = estudiantes.map(est => ({
          ...est,
          nombreCompleto: `${est.nombre} ${est.ap || ''} ${est.am || ''}`.trim()
        }));
        this.alumnos.set(estudiantesConNombre);
      }
    });

    // Si es edición, cargar datos (edición deshabilitada para inscripción masiva)
    if (this.isEdit && this.dialogData?.inscripcion) {
      const inscripcion = this.dialogData.inscripcion;
      
      // Buscar el nivel de la materia
      const materiaOriginal = this.todasLasMaterias().find(
        (m: Materia) => m.codmat === inscripcion.codmat
      );
      
      if (materiaOriginal) {
        this.prograForm.patchValue({
          codn: materiaOriginal.codn.toString(),
          codp: inscripcion.codp.toString()
        });
      }
    }
  }

  /**
   * Carga paralelos disponibles para una materia
   */
  cargarParalelos(codmat: string): void {
    this.mapaService.getByMateria(codmat).subscribe({
      next: (paralelos) => this.paralelos.set(paralelos),
      error: () => this.paralelos.set([])
    });
  }

  /**
   * Obtiene el texto del nivel seleccionado
   */
  getNivelTexto(): string {
    const codn = this.prograForm.value.codn;
    const nivel = this.niveles().find(n => n.codn?.toString() === codn);
    return nivel ? nivel.nombre : '';
  }

  /**
   * Obtiene el nombre completo del alumno seleccionado
   */
  getAlumnoTexto(): string {
    const codp = this.prograForm.value.codp;
    const alumno = this.alumnos().find(a => a.codp?.toString() === codp);
    return alumno ? alumno.nombreCompleto || `${alumno.nombre} ${alumno.ap || ''}`.trim() : '';
  }

  /**
   * Muestra el modal de confirmación
   */
  onSubmit(): void {
    if (this.prograForm.valid) {
      this.showConfirmModal.set(true);
    }
  }

  /**
   * Cancela el modal de confirmación
   */
  onCancelConfirm(): void {
    this.showConfirmModal.set(false);
  }

  /**
   * Confirma y guarda la inscripción masiva (todas las materias del nivel)
   */
  async onConfirm(): Promise<void> {
    if (!this.prograForm.valid) return;

    const formValue = this.prograForm.getRawValue();
    const codn = +formValue.codn!;
    const codp = +formValue.codp!;

    this.isLoading.set(true);

    try {
      // Obtener todas las materias del nivel seleccionado
      const materiasDelNivel = this.todasLasMaterias().filter(m => m.codn === codn);

      if (materiasDelNivel.length === 0) {
        this.alertService.showError('No hay materias disponibles para este nivel');
        this.isLoading.set(false);
        return;
      }

      // Para cada materia, obtener sus paralelos y crear inscripciones
      let inscripcionesCreadas = 0;
      let errores = 0;

      for (const materia of materiasDelNivel) {
        try {
          // Obtener paralelos de la materia
          const mapas = await this.mapaService.getByMateria(materia.codmat).toPromise();

          if (mapas && mapas.length > 0) {
            // Inscribir en el primer paralelo de cada materia
            const primerParalelo = mapas[0];
            
            const prograDto: PrograCreateDto = {
              codmat: materia.codmat,
              codpar: primerParalelo.codpar,
              gestion: this.gestionActual,
              codp: codp,
              login: ''
            };

            await this.prograService.create(prograDto).toPromise();
            inscripcionesCreadas++;
          }
        } catch (error) {
          console.error(`Error al inscribir en materia ${materia.codmat}:`, error);
          errores++;
        }
      }

      this.isLoading.set(false);
      
      if (inscripcionesCreadas > 0) {
        this.alertService.showSuccess(
          `Alumno inscrito exitosamente en ${inscripcionesCreadas} materia(s)` +
          (errores > 0 ? `. ${errores} inscripción(es) fallaron.` : '')
        );
        this.dialogRef.close(true);
      } else {
        this.alertService.showError('No se pudo crear ninguna inscripción');
      }
    } catch (error) {
      this.isLoading.set(false);
      this.alertService.showError('Error al procesar las inscripciones');
    }
  }

  /**
   * Cierra el diálogo sin guardar
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
