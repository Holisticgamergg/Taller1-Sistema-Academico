import { Component, input, output, signal } from '@angular/core';
import { Menu } from '../../models/menu.model';
import { TableComponent, TableInterface } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-menus-list-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './menus-list-page.html',
  styleUrl: './menus-list-page.css'
})
export class MenusListPageComponent {
  menus = input<Menu[]>([]);
  isLoading = input<boolean>(false);
  hasError = input<boolean>(false);

  onEdit = output<any>();
  onDelete = output<any>();
  onEnable = output<any>();

  columns = signal<TableInterface[]>([
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (m: Menu) => m.nombre,
    },
    {
      columnDef: 'estado',
      header: 'Estado',
      cell: (m: Menu) => m.estado,
    },
    {
      columnDef: 'm',
      header: 'M',
      cell: (m: Menu) => '',
    },
    {
      columnDef: 'b',
      header: 'B',
      cell: (m: Menu) => '',
    },
    {
      columnDef: 'h',
      header: 'H',
      cell: (m: Menu) => '',
    },
  ]);

  onTableAction(event: { action: string; row: Menu }) {
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