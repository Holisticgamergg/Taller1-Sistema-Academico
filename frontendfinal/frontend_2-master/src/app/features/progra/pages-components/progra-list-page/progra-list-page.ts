import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Progra } from '../../models/progra.model';
import { TableComponent, TableInterface } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-progra-list-page',
  standalone: true,
  imports: [CommonModule, TableComponent],
  templateUrl: './progra-list-page.html',
  styleUrl: './progra-list-page.css'
})
export class PrograListPageComponent {
  // Inputs
  inscripciones = input.required<Progra[]>();

  // Outputs
  editar = output<Progra>();
  eliminar = output<Progra>();
  habilitar = output<Progra>();

  // Configuración de columnas para la tabla
  columns: TableInterface[] = [
    {
      columnDef: 'nombreNivel',
      header: 'Nivel',
      cell: (row: Progra) => row.nombreNivel || 'N/A'
    },
    {
      columnDef: 'nombreMateria',
      header: 'Materia',
      cell: (row: Progra) => row.nombreMateria || 'N/A'
    },
    {
      columnDef: 'nombreAlumno',
      header: 'Alumno',
      cell: (row: Progra) => row.nombreAlumno || 'N/A'
    },
    {
      columnDef: 'nombreParalelo',
      header: 'Paralelo',
      cell: (row: Progra) => row.nombreParalelo || 'N/A'
    }
  ];

  /**
   * Maneja el evento de edición desde la tabla
   */
  edit(inscripcion: Progra): void {
    this.editar.emit(inscripcion);
  }

  /**
   * Maneja el evento de eliminación desde la tabla
   */
  deletePr(inscripcion: Progra): void {
    this.eliminar.emit(inscripcion);
  }

  /**
   * Maneja el evento de habilitación desde la tabla
   */
  enable(inscripcion: Progra): void {
    this.habilitar.emit(inscripcion);
  }
}
