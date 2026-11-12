import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Item } from '../../models/item.model';
import { ItemService } from '../../services/item.service';
import { ItemsListPageComponent } from '../items-list-page/items-list-page';
import { ItemFormDialogComponent } from '../../dialogs/item-form-dialog/item-form-dialog';
import { DisableItemDialogComponent } from '../../dialogs/disable-item-dialog/disable-item-dialog';
import { EnableItemDialogComponent } from '../../dialogs/enable-item-dialog/enable-item-dialog';

@Component({
  selector: 'app-items-main-page',
  standalone: true,
  imports: [CommonModule, MatIconModule, ItemsListPageComponent],
  templateUrl: './items-main-page.html',
  styleUrls: ['./items-main-page.css'],
})
export class ItemsMainPageComponent {
  private itemService = inject(ItemService);
  private dialog = inject(MatDialog);

  items = signal<Item[]>([]);
  filtroNombre = signal<string>('');
  filtroEstado = signal<number>(2);
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.loadData();
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    this.hasError.set(false);

    const nombre = this.filtroNombre();
    const estado = this.filtroEstado();

    this.itemService.getAll(nombre, estado).subscribe({
      next: (items) => {
        this.items.set(items);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error cargando items:', error);
        this.hasError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  handleSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroNombre.set(input.value);
  }

  handleStateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroEstado.set(Number(input.value));
  }

  openForm(item?: Item): void {
    const dialogRef = this.dialog.open(ItemFormDialogComponent, {
      width: '500px',
      data: { item },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteItem(item: Item): void {
    const dialogRef = this.dialog.open(DisableItemDialogComponent, {
      width: '400px',
      data: { item },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }

  enableItem(item: Item): void {
    const dialogRef = this.dialog.open(EnableItemDialogComponent, {
      width: '400px',
      data: { item },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadData();
      }
    });
  }


  // Método para imprimir un item individual
printItem(item: Item): void {
  // Si necesitas obtener datos adicionales del backend
      this.onPrintItemDetails(item);
    }
  

// Método para imprimir lista completa de items (B18)
printListaItems(): void {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateListaItemsHTML();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private onPrintItemDetails(item: Item): void {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateItemPrintableHTML(item);
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private generateItemPrintableHTML(item: Item): string {
  const estado = item.estado === 1 ? 'Activo' : 'Inactivo';
  const fechaCreacion = new Date().toLocaleDateString('es-BO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detalles del Item - ${item.nombre}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 40px;
          background: #fff;
          color: #333;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #0A1C2C;
        }
        .header h1 {
          color: #0A1C2C;
          font-size: 28px;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        .header p {
          color: #007A5E;
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .content {
          max-width: 800px;
          margin: 0 auto;
        }
        .item-section {
          background-color: #f8fafc;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 30px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .item-title h2 {
          color: #0A1C2C;
          font-size: 24px;
          margin-bottom: 5px;
        }
        .badges {
          display: flex;
          gap: 10px;
        }
        .badge {
          display: inline-block;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          color: white;
        }
        .badge-active { background: #007A5E; }
        .badge-inactive { background: #dc2626; }
        .badge-codigo { background: #0A1C2C; }
        
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          color: #0A1C2C;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-left: 5px solid #007A5E;
          padding-left: 10px;
          text-transform: uppercase;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        .info-item {
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
        }
        .info-label {
          font-size: 11px;
          color: #64748b;
          font-weight: 700;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .info-value {
          font-size: 15px;
          color: #0f172a;
          font-weight: 500;
        }
        .footer {
          margin-top: 50px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
        }
        @media print {
          body { padding: 0; }
          .no-print { display: none; }
          .item-section { background-color: transparent; border: none; }
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="header">
          <h1>Unidad Educativa Andalucía</h1>
          <p>Ficha de Registro de Item</p>
        </div>

        <div class="item-section">
          <div class="item-header">
            <div class="item-title">
              <h2>${item.nombre}</h2>
              <div class="info-value">Sistema de Gestión Académica</div>
            </div>
            <div class="badges">
              <span class="badge ${item.estado === 1 ? 'badge-active' : 'badge-inactive'}">
                ${estado}
              </span>
              <span class="badge badge-codigo">Código: ${item.codi}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Información General del Item</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Código del Item</div>
                <div class="info-value">${item.codi}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Nombre del Item</div>
                <div class="info-value">${item.nombre}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Estado</div>
                <div class="info-value">${estado}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Fecha de Creación</div>
                <div class="info-value">${fechaCreacion}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="footer">
          Documento generado el ${new Date().toLocaleString('es-BO')}
        </div>
      </div>
    </body>
    </html>
  `;
}

private generateListaItemsHTML(): string {
  const currentDate = new Date().toLocaleString('es-BO');
  
  // Generar filas de la tabla
  const tableRows : string = this.items().map((item: Item): string => ` 
    <tr>
      <td>${item.codi}</td>
      <td>${item.nombre}</td>
      <td class="${item.estado === 1 ? 'status-active' : 'status-inactive'}">
        ${item.estado === 1 ? 'Activo' : 'Inactivo'}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lista de Items - Gestión Académica</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Arial, sans-serif;
          padding: 30px;
          background: #fff;
          color: #333;
          line-height: 1.4;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 3px solid #0A1C2C;
        }
        .header h1 {
          color: #0A1C2C;
          font-size: 24px;
          margin-bottom: 10px;
          text-transform: uppercase;
        }
        .institution {
          color: #007A5E;
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 12px;
        }
        th {
          background: #0A1C2C;
          color: white;
          padding: 12px 8px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
        }
        td {
          padding: 10px 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        tr:nth-child(even) {
          background: #f8fafc;
        }
        .footer {
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #64748b;
          font-size: 11px;
        }
        .summary {
          text-align: right;
          margin-bottom: 15px;
          font-size: 12px;
          color: #475569;
          font-weight: 500;
        }
        .status-active {
          color: #007A5E;
          font-weight: bold;
        }
        .status-inactive {
          color: #dc2626;
          font-weight: bold;
        }
        @media print {
          body { padding: 15px; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="institution">Unidad Educativa Andalucía</div>
        <h1>Gestión de Items - Lista Completa</h1>
        <div style="font-size: 12px; color: #64748b;">Generado: ${currentDate}</div>
      </div>

      <div class="summary">
        Total de items: ${this.items.length}
      </div>

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre del Item</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>

      <div class="footer">
        Sistema Académico - Unidad Educativa Andalucía © ${new Date().getFullYear()}
      </div>
    </body>
    </html>
  `;
}

}
