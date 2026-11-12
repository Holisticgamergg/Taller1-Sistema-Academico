import { Component, input, output, signal } from '@angular/core';
import { Item } from '../../models/item.model';
import { TableComponent, TableInterface } from '../../../../shared/components/table/table';

@Component({
  selector: 'app-items-list-page',
  standalone: true,
  imports: [TableComponent],
  templateUrl: './items-list-page.html',
  styleUrls: ['./items-list-page.css'],
})
export class ItemsListPageComponent {
  items = input<Item[]>([]);
  
  onEdit = output<any>();
  onDelete = output<any>();
  onEnable = output<any>();

  columns = signal<TableInterface[]>([
    {
      columnDef: 'codi',
      header: 'Código',
      cell: (i: Item) => i.codi,
    },
    {
      columnDef: 'nombre',
      header: 'Nombre Item',
      cell: (i: Item) => i.nombre,
    },
    {
      columnDef: 'estado',
      header: 'Estado',
      cell: (i: Item) => i.estado,
    },
    {
      columnDef: 'm',
      header: 'M',
      cell: (i: Item) => '',
    },
    {
      columnDef: 'b',
      header: 'B',
      cell: (i: Item) => '',
    },
    {
      columnDef: 'h',
      header: 'H',
      cell: (i: Item) => '',
    },
  ]);

  onTableAction(event: { action: string; row: Item }) {
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
