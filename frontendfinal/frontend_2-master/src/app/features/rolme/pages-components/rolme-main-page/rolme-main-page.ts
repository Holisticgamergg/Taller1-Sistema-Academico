import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RolService } from '../../../roles/services/rol.service';
import { RolmeService } from '../../services/rolme.service';
import { Rol } from '../../../roles/models/rol.model';
import { MenuAsignadoDto, RolmeId } from '../../models/rolme.model';

@Component({
  selector: 'app-rolme-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rolme-main-page.html',
  styleUrl: './rolme-main-page.css'
})
export class RolmeMainPageComponent {
  private rolService = inject(RolService);
  private rolmeService = inject(RolmeService);

  // Signals
  roles = signal<Rol[]>([]);
  menus = signal<MenuAsignadoDto[]>([]);
  selectedRol = signal<Rol | null>(null);
  
  // Filtros
  filtroRol = signal<string>('');
  filtroMenu = signal<string>('');
  tipoAsignacion = signal<string>('TODOS');

  // Estados de carga
  loadingRoles = signal<boolean>(true);
  loadingMenus = signal<boolean>(false);

  constructor() {
    // Effect 1: Cargar roles al inicio
    effect(() => {
      this.loadRoles();
    }, { allowSignalWrites: true });

    // Effect 2: Cargar menús cuando cambie el rol seleccionado o los filtros
    effect(() => {
      const rol = this.selectedRol();
      const filtro = this.filtroMenu();
      const tipo = this.tipoAsignacion();

      if (rol) {
        this.loadMenus(rol.codr, filtro, tipo);
      } else {
        this.menus.set([]);
      }
    }, { allowSignalWrites: true });
  }

  private loadRoles(): void {
    this.loadingRoles.set(true);
    this.rolService.getAll('', 1).subscribe({
      next: (data) => {

        const listaRoles =data.content || data || [];


        this.roles.set(listaRoles);
        this.loadingRoles.set(false);
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        this.loadingRoles.set(false);
      }
    });
  }

  private loadMenus(codr: number, filtro: string, tipo: string): void {
    this.loadingMenus.set(true);
    this.rolmeService.getMenusParaAsignar(codr, filtro, tipo).subscribe({
      next: (data) => {
        this.menus.set(data);
        this.loadingMenus.set(false);
      },
      error: (err) => {
        console.error('Error cargando menús:', err);
        this.loadingMenus.set(false);
      }
    });
  }

  // Métodos de UI
  onRolSelect(rol: Rol): void {
    this.selectedRol.set(rol);
  }

  onFiltroMenuCambio(valor: string): void {
    this.filtroMenu.set(valor);
  }

  onTipoAsignacionCambio(tipo: string): void {
    this.tipoAsignacion.set(tipo);
  }

  onMenuCheck(menu: MenuAsignadoDto, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    const rol = this.selectedRol();

    if (!rol) return;

    const id: RolmeId = {
      codr: rol.codr,
      codm: menu.codm
    };

    // Update optimista: actualizar la signal localmente
    const menusActuales = this.menus();
    const menuIndex = menusActuales.findIndex(m => m.codm === menu.codm);
    
    if (menuIndex !== -1) {
      const nuevoMenu = { ...menusActuales[menuIndex], asignado: isChecked };
      const nuevosMenus = [...menusActuales];
      nuevosMenus[menuIndex] = nuevoMenu;
      this.menus.set(nuevosMenus);
    }

    // Llamada al servidor
    if (isChecked) {
      this.rolmeService.asignar(id).subscribe({
        next: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          console.error('Error asignando menú:', err);
          // Revertir cambio optimista en caso de error
          if (menuIndex !== -1) {
            const nuevoMenu = { ...menusActuales[menuIndex], asignado: !isChecked };
            const nuevosMenus = [...menusActuales];
            nuevosMenus[menuIndex] = nuevoMenu;
            this.menus.set(nuevosMenus);
          }
        }
      });
    } else {
      this.rolmeService.desasignar(id).subscribe({
        next: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          console.error('Error desasignando menú:', err);
          // Revertir cambio optimista en caso de error
          if (menuIndex !== -1) {
            const nuevoMenu = { ...menusActuales[menuIndex], asignado: !isChecked };
            const nuevosMenus = [...menusActuales];
            nuevosMenus[menuIndex] = nuevoMenu;
            this.menus.set(nuevosMenus);
          }
        }
      });
    }
  }

  // Computed para filtrar roles
  get rolesFiltrados(): Rol[] {
    const filtro = this.filtroRol().toLowerCase();
    if (!filtro) return this.roles();
    return this.roles().filter(r => r.nombre.toLowerCase().includes(filtro));
  }

  // Método para imprimir el reporte de asignación de menús a rol (B18)
printAsignacionMenusRol(): void {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateAsignacionMenusRolHTML();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private generateAsignacionMenusRolHTML(): string {
  const currentDate = new Date().toLocaleString('es-BO');
  
  // Obtener el rol seleccionado actualmente
  const rolSeleccionado = this.selectedRol();
  const nombreRolSeleccionado = rolSeleccionado ? rolSeleccionado.nombre : 'No seleccionado';
  const codigoRolSeleccionado = rolSeleccionado ? rolSeleccionado.codr : 'N/A';
  
  // Separar menús asignados y no asignados
  const menusAsignados = this.menus().filter(m => m.asignado);
  const menusNoAsignados = this.menus().filter(m => !m.asignado);

  // Generar filas para menús asignados
  const filasAsignados = menusAsignados.map(menu => `
    <tr>
      <td>${menu.codm}</td>
      <td>${menu.nombre}</td>
      <td class="status-active">✓ Asignado</td>
    </tr>
  `).join('');

  // Generar filas para menús no asignados
  const filasNoAsignados = menusNoAsignados.map(menu => `
    <tr>
      <td>${menu.codm}</td>
      <td>${menu.nombre}</td>
      <td class="status-inactive">No asignado</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Asignación de Menús a Rol - Gestión Académica</title>
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
        .rol-info {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          border-left: 4px solid #007A5E;
        }
        .rol-info h3 {
          color: #0A1C2C;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .rol-details {
          display: grid;
          grid-template-columns: auto auto;
          gap: 15px;
          font-size: 14px;
        }
        .rol-detail-item {
          display: flex;
          gap: 8px;
        }
        .rol-detail-label {
          font-weight: bold;
          color: #64748b;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          color: #0A1C2C;
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
          text-transform: uppercase;
        }
        .summary {
          display: flex;
          justify-content: space-between;
          margin-bottom: 15px;
          font-size: 14px;
          color: #475569;
          font-weight: 500;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 11px;
        }
        th {
          background: #0A1C2C;
          color: white;
          padding: 10px 8px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
        }
        td {
          padding: 8px 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        tr:nth-child(even) {
          background: #f8fafc;
        }
        .status-active {
          color: #007A5E;
          font-weight: bold;
        }
        .status-inactive {
          color: #dc2626;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          padding-top: 15px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          color: #64748b;
          font-size: 11px;
        }
        .no-data {
          text-align: center;
          padding: 20px;
          color: #64748b;
          font-style: italic;
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
        <h1>Asignación de Menús a Roles</h1>
        <div style="font-size: 12px; color: #64748b;">Generado: ${currentDate}</div>
      </div>

      <div class="rol-info">
        <h3>Rol Seleccionado</h3>
        <div class="rol-details">
          <div class="rol-detail-item">
            <span class="rol-detail-label">Rol:</span>
            <span>${nombreRolSeleccionado}</span>
          </div>
          <div class="rol-detail-item">
            <span class="rol-detail-label">Código:</span>
            <span>${codigoRolSeleccionado}</span>
          </div>
          <div class="rol-detail-item">
            <span class="rol-detail-label">Total Menús:</span>
            <span>${this.menus().length}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Menús Asignados al Rol</div>
        
        ${menusAsignados.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th width="80">Código</th>
                <th>Nombre del Menú</th>
                <th width="100">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filasAsignados}
            </tbody>
          </table>
        ` : `
          <div class="no-data">No hay menús asignados a este rol</div>
        `}
      </div>

      <div class="section">
        <div class="section-title">Menús No Asignados al Rol</div>
      
        ${menusNoAsignados.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th width="80">Código</th>
                <th>Nombre del Menú</th>
                <th width="100">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filasNoAsignados}
            </tbody>
          </table>
        ` : `
          <div class="no-data">Todos los menús están asignados a este rol</div>
        `}
      </div>

      <div class="footer">
        Sistema Académico - Unidad Educativa Andalucía © ${new Date().getFullYear()}
      </div>
    </body>
    </html>
  `;
}

}
