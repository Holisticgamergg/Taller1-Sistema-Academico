import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { DictaService } from '../../services/dicta.service';
import { UserApiService } from '../../../users/services/user-service';
import { ClaseDisponibleDto, Dicta, DictaCreateDto } from '../../models/dicta.model';
import { Persona } from '../../../../core/models/user-data';
import { CommonModule } from '@angular/common';
import { MateriaService } from '../../../materias/services/materia.service';
import { MapaService } from '../../../materias/services/mapa.service';
import { NivelService } from '../../../niveles/services/nivel.service';
import { Nivel } from '../../../niveles/models/nivel.model';
import { AlertService } from '../../../../core/services/alert.service';

// Interface para la lista combinada
interface ClaseDisponibleExtended {
  id: string; // "codmat|codpar|gestion" (usar | porque codmat puede contener -)
  codmat: string;
  codpar: number;
  gestion: number;
  nombreNivel: string;
  nombreMateria: string;
  nombreParalelo: string;
  displayText: string; // "Nivel - Materia - Paralelo"
}

@Component({
  selector: 'app-dicta-form-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './dicta-form-dialog.html',
  styleUrl: './dicta-form-dialog.css',
})
export class DictaFormDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<DictaFormDialogComponent>);
  private dictaService = inject(DictaService);
  private userService = inject(UserApiService);
  private materiaService = inject(MateriaService);
  private mapaService = inject(MapaService);
  private nivelService = inject(NivelService);
  private alertService = inject(AlertService);
  data = inject(MAT_DIALOG_DATA);

  // Signals
  niveles = signal<Nivel[]>([]);
  profesores = signal<Persona[]>([]);
  clases = signal<ClaseDisponibleDto[]>([]);
  todasLasMaterias = signal<any[]>([]); // Todas las materias cargadas
  materias = signal<any[]>([]); // Materias filtradas por nivel
  paralelos = signal<any[]>([]);
  clasesDisponibles = signal<ClaseDisponibleExtended[]>([]); // Lista combinada Nivel-Materia-Paralelo
  isLoading = signal<boolean>(false);
  isLoadingClases = signal<boolean>(false);
  showConfirmModal = signal<boolean>(false);

  // Form
  dictaForm!: FormGroup;
  isEditing = false;
  asignacionOriginal?: Dicta;
  gestionActual = new Date().getFullYear(); // Gestión actual

  ngOnInit(): void {
    this.isEditing = this.data?.isEditing ?? false;
    this.asignacionOriginal = this.data?.asignacion;

    // Inicializar formulario con un solo campo "clase"
    this.dictaForm = this.fb.group({
      clase: ['', Validators.required], // ID compuesto "codmat-codpar-gestion"
      login: ['', Validators.required],
    });

    // Cargar profesores
    this.userService.getProfesores().subscribe({
      next: (profesores) => this.profesores.set(profesores)
    });

    // Cargar clases disponibles (combinación de Nivel-Materia-Paralelo)
    this.cargarClasesDisponibles();

    // Si es edición, cargar datos
    if (this.isEditing && this.asignacionOriginal) {
      setTimeout(() => {
        const claseId = `${this.asignacionOriginal!.codmat}|${this.asignacionOriginal!.codpar}|${this.asignacionOriginal!.gestion}`;
        this.dictaForm.patchValue({
          clase: claseId,
          login: this.asignacionOriginal!.login,
        });
      }, 500);
    }
  }

  /**
   * Carga todas las combinaciones disponibles de Nivel-Materia-Paralelo
   */
  cargarClasesDisponibles(): void {
    this.isLoadingClases.set(true);
    
    // Cargar niveles
    this.nivelService.listarActivos().subscribe({
      next: (niveles) => {
        this.niveles.set(niveles);
        
        // Cargar todas las materias activas
        this.materiaService.getAll('', 1).subscribe({
          next: (materias) => {
            this.todasLasMaterias.set(materias);
            
            // Cargar todos los mapas (relaciones materia-paralelo)
            this.generarClasesCombinadas(niveles, materias);
          },
          error: () => this.isLoadingClases.set(false)
        });
      },
      error: () => this.isLoadingClases.set(false)
    });
  }

  /**
   * Genera la lista combinada de clases consultando los mapas de cada materia
   */
  async generarClasesCombinadas(niveles: Nivel[], materias: any[]): Promise<void> {
    const clasesTemp: ClaseDisponibleExtended[] = [];
    
    // Por cada materia, cargar sus paralelos asociados
    for (const materia of materias) {
      try {
        const mapas = await this.mapaService.getByMateria(materia.codmat).toPromise();
        
        if (mapas && mapas.length > 0) {
          const nivel = niveles.find(n => n.codn === materia.codn);
          
          // Filtrar solo mapas activos (estado === 1)
          const mapasActivos = mapas.filter(mapa => mapa.estado === 1);
          
          for (const mapa of mapasActivos) {
            // ID compuesto: codmat|codpar|gestion (usar | porque codmat puede contener guiones)
            const claseId = `${materia.codmat}|${mapa.codpar}|${this.gestionActual}`;
            
            clasesTemp.push({
              id: claseId,
              codmat: materia.codmat,
              codpar: mapa.codpar,
              gestion: this.gestionActual,
              nombreNivel: nivel?.nombre || 'Sin nivel',
              nombreMateria: materia.nombre,
              nombreParalelo: mapa.nombreParalelo || `Paralelo ${mapa.codpar}`,
              displayText: `${nivel?.nombre || 'Sin nivel'} - ${materia.nombre} - ${mapa.nombreParalelo || `Paralelo ${mapa.codpar}`}`
            });
          }
        }
      } catch (error) {
        console.error(`Error cargando paralelos para materia ${materia.codmat}:`, error);
      }
    }
    
    // Ordenar alfabéticamente
    clasesTemp.sort((a, b) => a.displayText.localeCompare(b.displayText));
    
    this.clasesDisponibles.set(clasesTemp);
    this.isLoadingClases.set(false);
  }

  cargarParalelos(codmat: string): void {
    this.mapaService.getByMateria(codmat).subscribe({
      next: (mapas) => this.paralelos.set(mapas),
      error: () => this.paralelos.set([])
    });
  }

  onSubmit(): void {
    if (this.dictaForm.invalid) {
      return;
    }

    this.showConfirmModal.set(true);
  }

  onConfirm(): void {
    this.showConfirmModal.set(false);
    this.isLoading.set(true);

    // Extraer codmat, codpar y gestion del ID de clase seleccionado
    const formValue = this.dictaForm.getRawValue();
    const claseId = formValue.clase; // Formato: "codmat|codpar|gestion"
    const [codmat, codparStr, gestionStr] = claseId.split('|');

    const dictaDto: DictaCreateDto = {
      codmat: codmat,
      codpar: +codparStr,
      gestion: +gestionStr,
      login: formValue.login,
    };

    const request$ = this.isEditing && this.asignacionOriginal
      ? this.dictaService.update(
          this.asignacionOriginal.codmat,
          this.asignacionOriginal.codpar,
          this.asignacionOriginal.gestion,
          this.asignacionOriginal.login,
          dictaDto
        )
      : this.dictaService.create(dictaDto);

    request$.subscribe({
      next: () => {
        const mensaje = this.isEditing ? 'Asignación actualizada correctamente' : 'Asignación creada correctamente';
        this.alertService.showSuccess(mensaje);
        this.isLoading.set(false);
        this.dialogRef.close(true);
      },
      error: () => this.isLoading.set(false)
    });
  }

  onCancelConfirm(): void {
    this.showConfirmModal.set(false);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  // Helper para obtener el nombre del profesor
  getNombreProfesor(login: string): string {
    const profesor = this.profesores().find((p) => p.user?.login === login);
    return profesor ? `${profesor.nombre} ${profesor.ap} ${profesor.am}` : login;
  }

  // Helper para obtener el texto de una clase a partir de su ID
  getClaseTexto(claseId: string): string {
    const clase = this.clasesDisponibles().find(c => c.id === claseId);
    return clase ? clase.displayText : claseId;
  }
}
