import { Component, input, output, signal } from '@angular/core';
import { Rol } from '../../models/rol.model';
import { TableComponent, TableInterface } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-roles-list-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './roles-list-page.html',
  styleUrl: './roles-list-page.css'
})
export class RolesListPageComponent {
  roles = input<Rol[]>([]);
  
  onEdit = output<any>();
  onDelete = output<any>();
  onEnable = output<any>();

  columns = signal<TableInterface[]>([
    {
      columnDef: 'codr',
      header: 'Código',
      cell: (r: Rol) => r.codr,
    },
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (r: Rol) => r.nombre,
    },
    {
      columnDef: 'estado',
      header: 'Estado',
      cell: (r: Rol) => r.estado,
    },
    {
      columnDef: 'm',
      header: 'M',
      cell: (r: Rol) => '',
    },
    {
      columnDef: 'b',
      header: 'B',
      cell: (r: Rol) => '',
    },
    {
      columnDef: 'h',
      header: 'H',
      cell: (r: Rol) => '',
    },
  ]);

  onTableAction(event: { action: string; row: Rol }) {
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
    }
  }
}
