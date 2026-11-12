import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Materia } from '../../models/materia.model';
import { Itemat } from '../../models/itemat.model';
import { ItematService } from '../../services/itemat.service';
import { MatDialog } from '@angular/material/dialog';
import { ItematAsignacionDialogComponent } from '../../dialogs/itemat-asignacion-dialog/itemat-asignacion-dialog';

@Component({
  selector: 'app-itemat-manager',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './itemat-manager.html',
  styleUrls: ['./itemat-manager.css'],
})
export class ItematManagerComponent {
  materia = input.required<Materia>();
  onClose = output<void>();

  private itematService = inject(ItematService);
  private dialog = inject(MatDialog);

  items = signal<Itemat[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading.set(true);
    this.itematService.getByMateria(this.materia().codmat).subscribe({
      next: (data) => {
        this.items.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando items:', err);
        this.isLoading.set(false);
      },
    });
  }

  openAsignarDialog(): void {
    const dialogRef = this.dialog.open(ItematAsignacionDialogComponent, {
      width: '600px',
      data: { codmat: this.materia().codmat },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadItems();
      }
    });
  }

  eliminarItem(itemat: Itemat): void {
    const nombreItem = itemat.nombreItem ?? `código ${itemat.codi}`;
    if (confirm(`¿Eliminar item "${nombreItem}" de la materia?`)) {
      this.itematService.delete(itemat.codmat, itemat.codi).subscribe({
        next: () => {
          this.loadItems();
        },
        error: (err) => {
          console.error('Error eliminando item:', err);
        },
      });
    }
  }

  cerrar(): void {
    this.onClose.emit();
  }
}
