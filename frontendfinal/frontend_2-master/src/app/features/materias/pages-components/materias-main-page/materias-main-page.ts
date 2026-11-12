import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Materia } from '../../models/materia.model';
import { MateriaService } from '../../services/materia.service';
import { MateriasListPageComponent } from '../materias-list-page/materias-list-page';
import { MateriaFormDialogComponent } from '../../dialogs/materia-form-dialog/materia-form-dialog';
import { DisableMateriaDialogComponent } from '../../dialogs/disable-materia-dialog/disable-materia-dialog';
import { EnableMateriaDialogComponent } from '../../dialogs/enable-materia-dialog/enable-materia-dialog';
import { MapaManagerComponent } from '../../components/mapa-manager/mapa-manager';
import { ItematManagerComponent } from '../../components/itemat-manager/itemat-manager';

type VistaDetalle = 'NINGUNA' | 'PARALELOS' | 'ITEMS';

@Component({
  selector: 'app-materias-main-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MateriasListPageComponent,
    MapaManagerComponent,
    ItematManagerComponent,
  ],
  templateUrl: './materias-main-page.html',
  styleUrls: ['./materias-main-page.css'],
})
export class MateriasMainPageComponent {
  private materiaService = inject(MateriaService);
  private dialog = inject(MatDialog);

  materias = signal<Materia[]>([]);
  filtroNombre = signal<string>('');
  filtroEstado = signal<number>(2);
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);

  // Maestro-Detalle
  vistaDetalle = signal<VistaDetalle>('NINGUNA');
  materiaSeleccionada = signal<Materia | null>(null);

  constructor() {
    effect(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const nombre = this.filtroNombre();
    const estado = this.filtroEstado();

    this.materiaService.getAll(nombre, estado).subscribe({
      next: (materias) => {
        this.materias.set(materias);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando materias:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  onFiltroNombreChange(value: string): void {
    this.filtroNombre.set(value);
  }

  onFiltroEstadoChange(value: number): void {
    this.filtroEstado.set(value);
  }

  openForm(materia?: Materia): void {
    const dialogRef = this.dialog.open(MateriaFormDialogComponent, {
      width: '500px',
      data: { materia },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteMateria(materia: Materia): void {
    const dialogRef = this.dialog.open(DisableMateriaDialogComponent, {
      width: '400px',
      data: { materia },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  enableMateria(materia: Materia): void {
    const dialogRef = this.dialog.open(EnableMateriaDialogComponent, {
      width: '400px',
      data: { materia },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  gestionarParalelos(materia: Materia): void {
    this.materiaSeleccionada.set(materia);
    this.vistaDetalle.set('PARALELOS');
  }

  gestionarItems(materia: Materia): void {
    this.materiaSeleccionada.set(materia);
    this.vistaDetalle.set('ITEMS');
  }

  onCloseDetalle(): void {
    this.vistaDetalle.set('NINGUNA');
    this.materiaSeleccionada.set(null);
  }
}
