import { DatePipe, NgClass } from '@angular/common';
import {
  Component,
  effect,
  input,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
export interface TableInterface {
  columnDef: string; //id unico de la columna
  header: string; //el texto de arriba,como el nombre
  cell: (row: any) => any;//funcion que recibe la fila y devuelve el valor a mostrar
}
@Component({
  selector: 'app-table',
  imports: [MatTableModule, MatPaginatorModule, MatIconModule],
  templateUrl: './table.html',
  styleUrl: './table.css',
})
export class TableComponent {
  //input como signals, el padre mete la informacion, si se cambia se actualiza automaticamente
  data = input<any[]>([]); //la lista de datos a mostrar
  columns = input<TableInterface[]>([]);//la configuracion de las columnas
  displayedColumns: any[] = [];
  dataSource: MatTableDataSource<any>;
  query = input<string>('');//el texto del buscador
  emitData = output<any>();//clic en la fila general
  
  // Para Maestro-Detalle de materias
  materiaSeleccionadaId = input<string>('');
  vistaActual = input<'NINGUNA' | 'PARALELOS' | 'ITEMS'>('NINGUNA');

//output, cuando el usuario hace click en algun boton, se emite el evento al padre

  onEdit = output<any>()//boton lapiz (editor, m)
  onDelete = output<any>()//boton basura (eliminar, b)
  onEnable = output<any>()//boton restaurar(habilitar, h)
  onView = output<any>()//boton visualizar/imprimir (v)
  onRegisterData = output<any>()
  onEditData = output<any>()
  onParalelos = output()//boton para gestionar paralelos
  onItems = output()//boton para gestionar items

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    //clase de angular material para manejar tablas
    this.dataSource = new MatTableDataSource(this.data());
  }

  loadData = effect(() => {
    //1. solo extrae los ids de las columnas
    this.displayedColumns = this.columns().map((c)=>c.columnDef)
    //2. actualiza los datos de la tabla
    this.dataSource.data = this.data();
  });

  ngAfterViewInit() {
    //conecta el paginador de material con la tabla
    this.dataSource.paginator = this.paginator;
  }

  applyFilter = effect(() => {
    this.dataSource.filter = this.query().trim().toLowerCase();
    
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  });
}