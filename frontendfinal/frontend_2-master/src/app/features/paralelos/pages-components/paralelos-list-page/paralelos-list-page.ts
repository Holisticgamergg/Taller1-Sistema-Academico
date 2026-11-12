import { Component, input, output, signal } from '@angular/core';
import { Paralelo } from '../../models/paralelo.model';
import { TableComponent, TableInterface } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-paralelos-list-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './paralelos-list-page.html',
  styleUrl: './paralelos-list-page.css'
})
export class ParalelosListPageComponent {
  paralelos = input<Paralelo[]>([]);
  
  onEdit = output<any>();
  onDelete = output<any>();
  onEnable = output<any>();

  columns = signal<TableInterface[]>([
    {
      columnDef: 'codpar',
      header: 'Código',
      cell: (p: Paralelo) => p.codpar,
    },
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (p: Paralelo) => p.nombre,
    },
    {
      columnDef: 'estado',
      header: 'Estado',
      cell: (p: Paralelo) => p.estado,
    },
    {
      columnDef: 'm',
      header: 'M',
      cell: (p: Paralelo) => '',
    },
    {
      columnDef: 'b',
      header: 'B',
      cell: (p: Paralelo) => '',
    },
    {
      columnDef: 'h',
      header: 'H',
      cell: (p: Paralelo) => '',
    },
  ]);
}
