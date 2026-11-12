import { Component, effect, inject, OnDestroy, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { RolService } from '../../services/rol.service';
import { RolComunicationService } from '../../services/rol-comunication.service';
import { Rol } from '../../models/rol.model';
import { RolesListPageComponent } from '../roles-list-page/roles-list-page';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';
import { RolFormDialogComponent } from '../../dialogs/rol-form-dialog/rol-form-dialog';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';
import { DisableRolDialog } from '../../dialogs/disable-rol-dialog/disable-rol-dialog';
import { EnableRolDialog } from '../../dialogs/enable-rol-dialog/enable-rol-dialog';

@Component({
  selector: 'app-roles-main-page',
  standalone: true,
  imports: [MatIconModule, RolesListPageComponent],
  templateUrl: './roles-main-page.html',
  styleUrl: './roles-main-page.css'
})
export class RolesMainPageComponent {
  private rolService = inject(RolService);
  private rolComunication = inject(RolComunicationService);
  private dialog = inject(MatDialog);

  roles = signal<Rol[]>([]);
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

    this.rolService.getAll(this.filtroNombre(), this.filtroEstado()).subscribe({
      next: (data) => {
        this.roles.set(data.content || data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('❌ Error al cargar roles:', err);
        console.error('📋 Detalles del error:', {
          status: err.status,
          statusText: err.statusText,
          message: err.message,
          url: err.url
        });
        if (err.status === 403) {
          console.error('🔒 Error 403: Necesitas iniciar sesión primero');
        }
        this.roles.set([]);
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

  openForm(rol?: Rol) {
    const dialogRef = this.dialog.open(FormDialog, {
      data: { content: RolFormDialogComponent, rol }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  deleteRol(rol: Rol) {
    this.rolComunication.selectedRol.set(rol);
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { content: DisableRolDialog }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  enableRol(rol: Rol) {
    this.rolComunication.selectedRol.set(rol);
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: { content: EnableRolDialog }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

// Método para imprimir un rol individual (similar a tu print para Persona)
printRol(rol: Rol): void {
  // Imprimir directamente con los datos disponibles del rol
  this.onPrintRolDetails(rol);
}

// Método para imprimir lista completa de roles (B18)
printListaRoles(): void {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateListaRolesHTML();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private onPrintRolDetails(rol: Rol): void {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateRolPrintableHTML(rol);
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private generateRolPrintableHTML(rol: Rol): string {
  const estado = rol.estado === 1 ? 'Activo' : 'Inactivo';
  const fechaCreacion = new Date().toLocaleDateString('es-BO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detalles del Rol - ${rol.nombre}</title>
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
        .rol-section {
          background-color: #f8fafc;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 30px;
        }
        .rol-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .rol-title h2 {
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
          .rol-section { background-color: transparent; border: none; }
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="header">
          <h1>Unidad Educativa Andalucía</h1>
          <p>Ficha de Registro de Rol</p>
        </div>

        <div class="rol-section">
          <div class="rol-header">
            <div class="rol-title">
              <h2>${rol.nombre}</h2>
              <div class="info-value">Sistema de Gestión Académica</div>
            </div>
            <div class="badges">
              <span class="badge ${rol.estado === 1 ? 'badge-active' : 'badge-inactive'}">
                ${estado}
              </span>
              <span class="badge badge-codigo">Código: ${rol.codr}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Información General del Rol</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Código del Rol</div>
                <div class="info-value">${rol.codr}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Nombre del Rol</div>
                <div class="info-value">${rol.nombre}</div>
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

private generateListaRolesHTML(): string {
  const currentDate = new Date().toLocaleString('es-BO');
  
  // Generar filas de la tabla
  const tableRows: string = this.roles().map((rol: Rol): string => `
    <tr>
      <td>${rol.codr}</td>
      <td>${rol.nombre}</td>
      <td class="${rol.estado === 1 ? 'status-active' : 'status-inactive'}">
        ${rol.estado === 1 ? 'Activo' : 'Inactivo'}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lista de Roles - Gestión Académica</title>
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
        <h1>Gestión de Roles - Lista Completa</h1>
        <div style="font-size: 12px; color: #64748b;">Generado: ${currentDate}</div>
      </div>


      <table>
        <thead>
          <tr>
            <th>Código</th>
            <th>Nombre del Rol</th>
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
