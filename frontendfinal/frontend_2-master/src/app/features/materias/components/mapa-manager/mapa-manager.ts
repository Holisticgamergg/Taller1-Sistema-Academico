import { ChangeDetectorRef, Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Materia } from '../../models/materia.model';
import { Mapa } from '../../models/mapa.model';
import { MapaService } from '../../services/mapa.service';
import { MatDialog } from '@angular/material/dialog';
import { MapaAsignacionDialogComponent } from '../../dialogs/mapa-asignacion-dialog/mapa-asignacion-dialog';

@Component({
  selector: 'app-mapa-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mapa-manager.html',
  styleUrls: ['./mapa-manager.css'],
})
export class MapaManagerComponent {
  materia = input.required<Materia>();
  onClose = output<void>();

  private mapaService = inject(MapaService);
  private dialog = inject(MatDialog);
  private cd=inject(ChangeDetectorRef);

  paralelos = signal<Mapa[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadParalelos();
  }

  loadParalelos(): void {
    this.isLoading.set(true);
    this.mapaService.getByMateria(this.materia().codmat).subscribe({
      next: (data) => {
        this.paralelos.set(data);
        this.isLoading.set(false);
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando paralelos:', err);
        this.isLoading.set(false);
        this.cd.detectChanges();
      },
    });
  }

  openAsignarDialog(): void {
    const dialogRef = this.dialog.open(MapaAsignacionDialogComponent, {
      width: '600px',
      data: { codmat: this.materia().codmat },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadParalelos();
      }
    });
  }

  eliminarParalelo(mapa: Mapa): void {
    const nombreParalelo = mapa.nombreParalelo ?? `código ${mapa.codpar}`;
    if (confirm(`¿Eliminar paralelo "${nombreParalelo}" de la materia?`)) {
      this.mapaService.delete(mapa.codmat, mapa.codpar, mapa.gestion).subscribe({
        next: () => {
          this.loadParalelos();
        },
        error: (err) => {
          console.error('Error eliminando paralelo:', err);
        },
      });
    }
  }

  cerrar(): void {
    this.onClose.emit();
  }
}
