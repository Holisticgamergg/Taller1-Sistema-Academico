import { Component, effect, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MenuService } from '../../services/menu.service';
import { MenuComunicationService } from '../../services/menu-comunication.service';
import { Menu } from '../../models/menu.model';
import { MenusListPageComponent } from '../menus-list-page/menus-list-page';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';
import { MenuFormDialogComponent } from '../../dialogs/menu-form-dialog/menu-form-dialog';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';
import { DisableMenuDialog } from '../../dialogs/disable-menu-dialog/disable-menu-dialog';
import { EnableMenuDialog } from '../../dialogs/enable-menu-dialog/enable-menu-dialog';

@Component({
  selector: 'app-menus-main-page',
  standalone: true,
  imports: [MatIconModule, MenusListPageComponent],
  templateUrl: './menus-main-page.html',
  styleUrl: './menus-main-page.css'
})
export class MenusMainPageComponent {
  private menuService = inject(MenuService);
  private menuComunication = inject(MenuComunicationService);
  private dialog = inject(MatDialog);

  menus = signal<Menu[]>([]);
  filtroNombre = signal<string>('');
  filtroEstado = signal<number>(2);
  isLoading = signal<boolean>(false);
  hasError = signal<boolean>(false);

  constructor() {
    effect(() => {
      this.loadData();
    });
  }

  loadData() {
    this.isLoading.set(true);
    this.hasError.set(false);

    this.menuService.getAll(this.filtroNombre(), this.filtroEstado()).subscribe({
      next: (data) => {
        this.menus.set(data.content || data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al cargar menus:', err);
        console.error('📋 Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });
        if (err.status === 403) {
          console.error('🔒 Error 403: Necesitas iniciar sesión primero');
        }
        this.menus.set([]);
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  handleSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filtroNombre.set(input.value);
  }

  handleStateChange(event: Event) {
    const radio = event.target as HTMLInputElement;
    this.filtroEstado.set(Number(radio.value));
  }

  openForm(menu?: Menu) {
    const dialogRef = this.dialog.open(FormDialog, {
      data: { content: MenuFormDialogComponent, menu }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteMenu(menu: Menu) {
    this.menuComunication.selectedMenu.set(menu);
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { content: DisableMenuDialog }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  enableMenu(menu: Menu) {
    this.menuComunication.selectedMenu.set(menu);
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { content: EnableMenuDialog }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  // Método para imprimir un menú individual
printMenu(menu: Menu): void {
  // Usar los datos del menú directamente sin llamada adicional al backend
  this.onPrintMenuDetails(menu);
}

// Método para imprimir lista completa de menús (B18)
printListaMenus(): void {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateListaMenusHTML();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private onPrintMenuDetails(menu: Menu): void {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateMenuPrintableHTML(menu);
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private generateMenuPrintableHTML(menu: Menu): string {
  const estado = menu.estado === 1 ? 'Activo' : 'Inactivo';
  const fechaCreacion = new Date().toLocaleDateString('es-BO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detalles del Menú - ${menu.nombre}</title>
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
        .menu-section {
          background-color: #f8fafc;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 30px;
        }
        .menu-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .menu-title h2 {
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
          .menu-section { background-color: transparent; border: none; }
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="header">
          <h1>Unidad Educativa Andalucía</h1>
          <p>Ficha de Registro de Menú</p>
        </div>

        <div class="menu-section">
          <div class="menu-header">
            <div class="menu-title">
              <h2>${menu.nombre}</h2>
              <div class="info-value">Sistema de Gestión Académica</div>
            </div>
            <div class="badges">
              <span class="badge ${menu.estado === 1 ? 'badge-active' : 'badge-inactive'}">
                ${estado}
              </span>
              <span class="badge badge-codigo">Código: ${menu.codm}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Información General del Menú</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Código del Menú</div>
                <div class="info-value">${menu.codm}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Nombre del Menú</div>
                <div class="info-value">${menu.nombre}</div>
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

private generateListaMenusHTML(): string {
  const currentDate = new Date().toLocaleString('es-BO');
  
  // Generar filas de la tabla
  const tableRows: string = this.menus().map((menu: Menu): string => `
    <tr>
      <td>${menu.codm}</td>
      <td>${menu.nombre}</td>
      <td class="${menu.estado === 1 ? 'status-active' : 'status-inactive'}">
        ${menu.estado === 1 ? 'Activo' : 'Inactivo'}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lista de Menús - Gestión Académica</title>
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
        <h1>Gestión de Menús - Lista Completa</h1>
        <div style="font-size: 12px; color: #64748b;">Generado: ${currentDate}</div>
      </div>

      

      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre del Menú</th>
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