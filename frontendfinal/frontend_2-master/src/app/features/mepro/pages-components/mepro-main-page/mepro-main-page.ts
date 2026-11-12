import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuService } from '../../../menus/services/menu.service';
import { MeproService } from '../../services/mepro.service';
import { Menu } from '../../../menus/models/menu.model';
import { ProcesoAsignadoDto, MeproId } from '../../models/mepro.model';

@Component({
  selector: 'app-mepro-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mepro-main-page.html',
  styleUrl: './mepro-main-page.css'
})
export class MeproMainPageComponent {
  private menuService = inject(MenuService);
  private meproService = inject(MeproService);

  // Signals
  menus = signal<Menu[]>([]);
  procesos = signal<ProcesoAsignadoDto[]>([]);
  selectedMenu = signal<Menu | null>(null);
  
  // Filtros
  filtroMenu = signal<string>('');
  filtroProceso = signal<string>('');
  tipoAsignacion = signal<string>('TODOS');

  // Estados de carga
  loadingMenus = signal<boolean>(true);
  loadingProcesos = signal<boolean>(false);

  constructor() {
    // Effect 1: Cargar menús al inicio
    effect(() => {
      this.loadMenus();
    }, { allowSignalWrites: true });

    // Effect 2: Cargar procesos cuando cambie el menú seleccionado o los filtros
    effect(() => {
      const menu = this.selectedMenu();
      const filtro = this.filtroProceso();
      const tipo = this.tipoAsignacion();

      if (menu) {
        this.loadProcesos(menu.codm, filtro, tipo);
      } else {
        this.procesos.set([]);
      }
    }, { allowSignalWrites: true });
  }

  private loadMenus(): void {
    this.loadingMenus.set(true);
    this.menuService.getAll('', 1).subscribe({
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

  private loadProcesos(codm: number, filtro: string, tipo: string): void {
    this.loadingProcesos.set(true);
    this.meproService.getProcesosParaAsignar(codm, filtro, tipo).subscribe({
      next: (data) => {
        this.procesos.set(data);
        this.loadingProcesos.set(false);
      },
      error: (err) => {
        console.error('Error cargando procesos:', err);
        this.loadingProcesos.set(false);
      }
    });
  }

  // Métodos de UI
  onMenuSelect(menu: Menu): void {
    this.selectedMenu.set(menu);
  }

  onFiltroProcesoCambio(valor: string): void {
    this.filtroProceso.set(valor);
  }

  onTipoAsignacionCambio(tipo: string): void {
    this.tipoAsignacion.set(tipo);
  }

  onProcesoCheck(proceso: ProcesoAsignadoDto, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    const menu = this.selectedMenu();

    if (!menu) return;

    const id: MeproId = {
      codm: menu.codm,
      codp: proceso.codp
    };

    // Update optimista: actualizar la signal localmente
    const procesosActuales = this.procesos();
    const procesoIndex = procesosActuales.findIndex(p => p.codp === proceso.codp);
    
    if (procesoIndex !== -1) {
      const nuevoProceso = { ...procesosActuales[procesoIndex], asignado: isChecked };
      const nuevosProcesos = [...procesosActuales];
      nuevosProcesos[procesoIndex] = nuevoProceso;
      this.procesos.set(nuevosProcesos);
    }

    // Llamada al servidor
    if (isChecked) {
      this.meproService.asignarProceso(id).subscribe({
        next: () => {
          setTimeout(() => { window.location.reload(); }, 1000);
        },
        error: (err) => {
          console.error('Error asignando proceso:', err);
          // Revertir cambio optimista en caso de error
          if (procesoIndex !== -1) {
            const nuevoProceso = { ...procesosActuales[procesoIndex], asignado: !isChecked };
            const nuevosProcesos = [...procesosActuales];
            nuevosProcesos[procesoIndex] = nuevoProceso;
            this.procesos.set(nuevosProcesos);
          }
        }
      });
    } else {
      this.meproService.desasignarProceso(id).subscribe({
        next: () => {
          setTimeout(() => { window.location.reload(); }, 1000);
        },
        error: (err) => {
          console.error('Error desasignando proceso:', err);
          // Revertir cambio optimista en caso de error
          if (procesoIndex !== -1) {
            const nuevoProceso = { ...procesosActuales[procesoIndex], asignado: !isChecked };
            const nuevosProcesos = [...procesosActuales];
            nuevosProcesos[procesoIndex] = nuevoProceso;
            this.procesos.set(nuevosProcesos);
          }
        }
      });
    }
  }

  // Computed para filtrar menús
  get menusFiltrados(): Menu[] {
    const filtro = this.filtroMenu().toLowerCase();
    if (!filtro) return this.menus();
    return this.menus().filter(m => m.nombre.toLowerCase().includes(filtro));
  }

  // Método para imprimir el reporte de asignación de procesos a menú (B18)
printAsignacionProcesosMenu(): void {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateAsignacionProcesosMenuHTML();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private generateAsignacionProcesosMenuHTML(): string {
  const currentDate = new Date().toLocaleString('es-BO');
  
  // Obtener el menú seleccionado actualmente
  const menuSeleccionado = this.selectedMenu();
  const nombreMenuSeleccionado = menuSeleccionado ? menuSeleccionado.nombre : 'No seleccionado';
  
  // Separar procesos asignados y no asignados
  const procesosAsignados = this.procesos().filter(p => p.asignado);
  const procesosNoAsignados = this.procesos().filter(p => !p.asignado);

  // Generar filas para procesos asignados
  const filasAsignados = procesosAsignados.map(proceso => `
    <tr>
      <td>${proceso.codp}</td>
      <td>${proceso.nombre}</td>
      <td>${proceso.enlace || 'N/A'}</td>
      <td>${proceso.ayuda || 'N/A'}</td>
      <td class="status-active">✓ Asignado</td>
    </tr>
  `).join('');

  // Generar filas para procesos no asignados
  const filasNoAsignados = procesosNoAsignados.map(proceso => `
    <tr>
      <td>${proceso.codp}</td>
      <td>${proceso.nombre}</td>
      <td>${proceso.enlace || 'N/A'}</td>
      <td>${proceso.ayuda || 'N/A'}</td>
      <td class="status-inactive">No asignado</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Asignación de Procesos a Menú - Gestión Académica</title>
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
        .menu-info {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          border-left: 4px solid #007A5E;
        }
        .menu-info h3 {
          color: #0A1C2C;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .menu-details {
          display: grid;
          grid-template-columns: auto auto;
          gap: 15px;
          font-size: 14px;
        }
        .menu-detail-item {
          display: flex;
          gap: 8px;
        }
        .menu-detail-label {
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
        <h1>Asignación de Procesos a Menús</h1>
        <div style="font-size: 12px; color: #64748b;">Generado: ${currentDate}</div>
      </div>

      <div class="menu-info">
        <h3>Menú Seleccionado</h3>
        <div class="menu-details">
          <div class="menu-detail-item">
            <span class="menu-detail-label">Menú:</span>
            <span>${nombreMenuSeleccionado}</span>
          </div>
          <div class="menu-detail-item">
            <span class="menu-detail-label">Total Procesos:</span>
            <span>${this.procesos().length}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-title">Procesos Asignados al Menú</div>
        <div class="summary">
          <span>Total procesos asignados: ${procesosAsignados.length}</span>
        </div>
        ${procesosAsignados.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th width="80">Código</th>
                <th>Nombre del Proceso</th>
                <th>Enlace</th>
                <th>Ayuda</th>
                <th width="100">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filasAsignados}
            </tbody>
          </table>
        ` : `
          <div class="no-data">No hay procesos asignados a este menú</div>
        `}
      </div>

      <div class="section">
        <div class="section-title">Procesos No Asignados al Menú</div>
        <div class="summary">
          <span>Total procesos no asignados: ${procesosNoAsignados.length}</span>
        </div>
        ${procesosNoAsignados.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th width="80">Código</th>
                <th>Nombre del Proceso</th>
                <th>Enlace</th>
                <th>Ayuda</th>
                <th width="100">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filasNoAsignados}
            </tbody>
          </table>
        ` : `
          <div class="no-data">Todos los procesos están asignados a este menú</div>
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
