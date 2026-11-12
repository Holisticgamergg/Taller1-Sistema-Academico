import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MapaService } from '../../services/mapa.service';
import { ParaleloService } from '../../../paralelos/services/paralelo.service';
import { Paralelo } from '../../../paralelos/models/paralelo.model';

@Component({
  selector: 'app-mapa-asignacion-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './mapa-asignacion-dialog.html',
  styleUrls: ['./mapa-asignacion-dialog.css'],
})
export class MapaAsignacionDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<MapaAsignacionDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);
  private mapaService = inject(MapaService);
  private paraleloService = inject(ParaleloService);

  paralelos = signal<Paralelo[]>([]);
  isLoading = signal<boolean>(false);
  selectedParalelo = signal<number | null>(null);

  ngOnInit(): void {
    this.loadParalelos();
  }

  loadParalelos(): void {
    this.isLoading.set(true);
    this.paraleloService.getAll('', 1).subscribe({
      next: (data) => {
        this.paralelos.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('MapaAsignacionDialog: Error cargando paralelos:', err);
        this.isLoading.set(false);
      },
    });
  }

  selectParalelo(codpar: number): void {
    this.selectedParalelo.set(codpar);
  }

  asignar(): void {
    if (!this.selectedParalelo()) return;

    this.isLoading.set(true);
    this.mapaService
      .create({ codmat: this.data.codmat, codpar: this.selectedParalelo()! })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error asignando paralelo:', err);
          this.isLoading.set(false);
        },
      });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
