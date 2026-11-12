import { Component, input, output, signal } from '@angular/core';
import { Nivel } from '../../models/nivel.model';
import { TableComponent, TableInterface } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-niveles-list-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './niveles-list-page.html',
  styleUrl: './niveles-list-page.css'
})
export class NivelesListPageComponent {
  niveles = input<Nivel[]>([]);
  
  onEdit = output<any>();
  onDelete = output<any>();
  onEnable = output<any>();

  columns = signal<TableInterface[]>([
    {
      columnDef: 'codn',
      header: 'Código',
      cell: (n: Nivel) => n.codn,
    },
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (n: Nivel) => n.nombre,
    },
    {
      columnDef: 'estado',
      header: 'Estado',
      cell: (n: Nivel) => n.estado,
    },
    {
      columnDef: 'm',
      header: 'M',
      cell: (n: Nivel) => '',
    },
    {
      columnDef: 'b',
      header: 'B',
      cell: (n: Nivel) => '',
    },
    {
      columnDef: 'h',
      header: 'H',
      cell: (n: Nivel) => '',
    },
  ]);
}
