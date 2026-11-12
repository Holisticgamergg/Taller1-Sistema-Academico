import { Component, input, output, signal } from '@angular/core';
import { Dicta } from '../../models/dicta.model';
import { TableComponent, TableInterface } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-dicta-list-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './dicta-list-page.html',
  styleUrl: './dicta-list-page.css',
})
export class DictaListPageComponent {
  // Inputs
  asignaciones = input.required<Dicta[]>();

  // Outputs
  editar = output<Dicta>();
  eliminar = output<Dicta>();
  habilitar = output<Dicta>();

  // Configuración de columnas para app-table
  columns = signal<TableInterface[]>([
    {
      columnDef: 'nombreNivel',
      header: 'Nivel',
      cell: (row: Dicta) => row.nombreNivel ?? 'N/A',
    },
    {
      columnDef: 'nombreMateria',
      header: 'Materia',
      cell: (row: Dicta) => row.nombreMateria ?? 'N/A',
    },
    {
      columnDef: 'nombreProfesor',
      header: 'Profesor',
      cell: (row: Dicta) => row.nombreProfesor ?? 'N/A',
    },
    {
      columnDef: 'nombreParalelo',
      header: 'Paralelo',
      cell: (row: Dicta) => row.nombreParalelo ?? 'N/A',
    },
    {
      columnDef: 'm',
      header: 'M',
      cell: (row: Dicta) => '',
    },
    {
      columnDef: 'b',
      header: 'B',
      cell: (row: Dicta) => '',
    },
    {
      columnDef: 'h',
      header: 'H',
      cell: (row: Dicta) => '',
    },
  ]);

  edit(asignacion: Dicta): void {
    this.editar.emit(asignacion);
  }

  delete(asignacion: Dicta): void {
    this.eliminar.emit(asignacion);
  }

  enable(asignacion: Dicta): void {
    this.habilitar.emit(asignacion);
  }
}
