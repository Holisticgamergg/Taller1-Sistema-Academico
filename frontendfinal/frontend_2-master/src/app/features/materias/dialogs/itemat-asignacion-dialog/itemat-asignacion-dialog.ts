import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ItematService } from '../../services/itemat.service';
import { ItemService } from '../../../items/services/item.service';
import { Item } from '../../../items/models/item.model';
import { Itemat } from '../../models/itemat.model';

@Component({
  selector: 'app-itemat-asignacion-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule],
  templateUrl: './itemat-asignacion-dialog.html',
  styleUrls: ['./itemat-asignacion-dialog.css'],
})
export class ItematAsignacionDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<ItematAsignacionDialogComponent>);
  private data = inject(MAT_DIALOG_DATA);
  private itematService = inject(ItematService);
  private itemService = inject(ItemService);

  items = signal<Item[]>([]);
  itemsAsignados = signal<Itemat[]>([]);
  isLoading = signal<boolean>(false);
  selectedItem = signal<number | null>(null);
  ponderacion = signal<number>(0);
  
  // Señales para control del 100%
  totalAcumulado = signal<number>(0);
  saldoDisponible = signal<number>(100);
  errorPonderacion = signal<string>('');
  
  // Gestión actual
  gestionActual = new Date().getFullYear();

  ngOnInit(): void {
    this.loadItems();
    
    if (this.data.codmat) { 
      this.cargarItemsAsignados(this.data.codmat);
    }
  }
  
  /**
   * Carga los items ya asignados a la materia para calcular el saldo disponible
   * Solo suma los items ACTIVOS (estado === 1)
   */
  cargarItemsAsignados(codmat: string): void {
    this.itematService.getByMateria(codmat).subscribe({
      next: (items) => {
        this.itemsAsignados.set(items);
        // Calcular total acumulado SOLO de items ACTIVOS (estado === 1)
        const itemsActivos = items.filter(item => item.estado === 1);
        const total = itemsActivos.reduce((sum, item) => sum + (item.ponderacion || 0), 0);
        this.totalAcumulado.set(total);
        this.saldoDisponible.set(100 - total);
      },
      error: (err) => {
        console.error('Error cargando items asignados:', err);
      }
    });
  }

  loadItems(): void {
    this.isLoading.set(true);
    this.itemService.getAll('', 1).subscribe({
      next: (data) => {
        this.items.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('ItematAsignacionDialog: Error cargando items:', err);
        this.isLoading.set(false);
      },
    });
  }

  selectItem(codi: number): void {
    this.selectedItem.set(codi);
    this.validarPonderacion();
  }

  /**
   * Valida que la ponderación no exceda el 100%
   */
  validarPonderacion(): void {
    const nuevaPonderacion = this.ponderacion();
    const saldo = this.saldoDisponible();
    
    if (nuevaPonderacion > saldo) {
      this.errorPonderacion.set(`La ponderación excede el saldo disponible (${saldo}%). El total no puede superar el 100%.`);
    } else if (nuevaPonderacion <= 0) {
      this.errorPonderacion.set('La ponderación debe ser mayor a 0');
    } else {
      this.errorPonderacion.set('');
    }
  }

  /**
   * Actualiza la ponderación y valida
   */
  actualizarPonderacion(valor: number): void {
    this.ponderacion.set(valor);
    this.validarPonderacion();
  }

  /**
   * Verifica si el formulario es válido para asignar
   */
  puedeAsignar(): boolean {
    return (
      this.selectedItem() !== null &&
      this.ponderacion() > 0 &&
      this.ponderacion() <= this.saldoDisponible() &&
      !this.isLoading()
    );
  }

  asignar(): void {
    if (!this.puedeAsignar()) {
      if (this.ponderacion() > this.saldoDisponible()) {
        alert(`❌ Error: La ponderación (${this.ponderacion()}%) excede el saldo disponible (${this.saldoDisponible()}%). El total de items no puede superar el 100%.`);
      }
      return;
    }

    this.isLoading.set(true);
    this.itematService
      .create({
        codmat: this.data.codmat,
        codi: this.selectedItem()!,
        ponderacion: this.ponderacion(),
      })
      .subscribe({
        next: () => {
          this.isLoading.set(false);
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error asignando item:', err);
          this.isLoading.set(false);
          // Mostrar error del backend si existe
          const errorMsg = err.error?.message || 'Error al asignar el item. Verifica que la ponderación no exceda el 100%.';
          alert(`❌ ${errorMsg}`);
        },
      });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
