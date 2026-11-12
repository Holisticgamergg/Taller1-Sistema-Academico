import { Component, input, output, signal } from '@angular/core';
import { Materia } from '../../models/materia.model';
import { TableComponent, TableInterface } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-materias-list-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './materias-list-page.html',
  styleUrls: ['./materias-list-page.css'],
})
export class MateriasListPageComponent {
  materias = input<Materia[]>([]);
  materiaSeleccionadaId = input<string>('');
  vistaActual = input<'NINGUNA' | 'PARALELOS' | 'ITEMS'>('NINGUNA');
  
  onEdit = output<any>();
  onDelete = output<any>();
  onEnable = output<any>();
  onParalelos = output<any>();
  onItems = output<any>();

  columns = signal<TableInterface[]>([
    {
      columnDef: 'codmat',
      header: 'Código',
      cell: (m: Materia) => m.codmat,
    },
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: Materia) => m.nombre,
    },
    {
      columnDef: 'estado',
      header: 'Estado',
      cell: (m: Materia) => m.estado,
    },
    {
      columnDef: 'm',
      header: 'M',
      cell: (m: Materia) => '',
    },
    {
      columnDef: 'b',
      header: 'B',
      cell: (m: Materia) => '',
    },
    {
      columnDef: 'h',
      header: 'H',
      cell: (m: Materia) => '',
    },
    {
      columnDef: 'paralelos',
      header: 'Paralelos',
      cell: (m: Materia) => '',
    },
    {
      columnDef: 'items',
      header: 'Items',
      cell: (m: Materia) => '',
    },
  ]);

  onTableAction(event: { action: string; row: Materia }) {
    switch (event.action) {
      case 'edit':
        this.onEdit.emit(event.row);
        break;
      case 'delete':
        this.onDelete.emit(event.row);
        break;
      case 'enable':
        this.onEnable.emit(event.row);
        break;
      case 'paralelos':
        this.onParalelos.emit(event.row);
        break;
      case 'items':
        this.onItems.emit(event.row);
        break;
    }
  }
}
