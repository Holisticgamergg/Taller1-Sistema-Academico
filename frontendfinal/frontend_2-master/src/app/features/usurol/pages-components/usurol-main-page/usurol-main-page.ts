import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComunicationService } from '../../../users/services/comunication-service';
import { UsurolService } from '../../services/usurol.service';
import { Persona } from '../../../../core/models/user-data';
import { RolAsignadoDto, UsurolId } from '../../models/usurol.model';

@Component({
  selector: 'app-usurol-main-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usurol-main-page.html',
  styleUrl: './usurol-main-page.css'
})
export class UsurolMainPageComponent {
  private comunicationService = inject(ComunicationService);
  private usurolService = inject(UsurolService);

  // Signals
  usuarios = signal<Persona[]>([]);
  roles = signal<RolAsignadoDto[]>([]);
  selectedUser = signal<Persona | null>(null);
  
  // Filtros
  filtroUsuario = signal<string>('');
  filtroRol = signal<string>('');
  tipoAsignacion = signal<string>('TODOS');

  // Estados de carga
  loadingUsuarios = signal<boolean>(true);
  loadingRoles = signal<boolean>(false);

  constructor() {
    // Effect 1: Cargar usuarios al inicio
    effect(() => {
      this.loadUsuarios();
    }, { allowSignalWrites: true });

    // Effect 2: Cargar roles cuando cambie el usuario seleccionado o los filtros
    effect(() => {
      const user = this.selectedUser();
      const filtro = this.filtroRol();
      const tipo = this.tipoAsignacion();

      if (user) {
        this.loadRoles(user.user.login, filtro, tipo);
      } else {
        this.roles.set([]);
      }
    }, { allowSignalWrites: true });
  }

  private loadUsuarios(): void {
    this.loadingUsuarios.set(true);
    this.comunicationService.fetchUsers().subscribe({
      next: (data) => {
        this.usuarios.set(data);
        this.loadingUsuarios.set(false);
      },
      error: (err) => {
        console.error('Error cargando usuarios:', err);
        this.loadingUsuarios.set(false);
      }
    });
  }

  private loadRoles(login: string, filtro: string, tipo: string): void {
    this.loadingRoles.set(true);
    this.usurolService.getRolesParaAsignar(login, filtro, tipo).subscribe({
      next: (data) => {
        this.roles.set(data);
        this.loadingRoles.set(false);
      },
      error: (err) => {
        console.error('Error cargando roles:', err);
        this.loadingRoles.set(false);
      }
    });
  }

  // Métodos de UI
  onUserSelect(user: Persona): void {
    this.selectedUser.set(user);
  }

  onFiltroRolCambio(valor: string): void {
    this.filtroRol.set(valor);
  }

  onTipoAsignacionCambio(tipo: string): void {
    this.tipoAsignacion.set(tipo);
  }

  onRolCheck(rol: RolAsignadoDto, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
    const user = this.selectedUser();

    if (!user) return;

    const id: UsurolId = {
      codr: rol.codr,
      login: user.user.login
    };

    // Update optimista: actualizar la signal localmente
    const rolesActuales = this.roles();
    const rolIndex = rolesActuales.findIndex(r => r.codr === rol.codr);
    
    if (rolIndex !== -1) {
      const nuevoRol = { ...rolesActuales[rolIndex], asignado: isChecked };
      const nuevosRoles = [...rolesActuales];
      nuevosRoles[rolIndex] = nuevoRol;
      this.roles.set(nuevosRoles);
    }

    // Llamada al servidor
    if (isChecked) {
      this.usurolService.asignar(id).subscribe({
        next: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          console.error('Error asignando rol:', err);
          // Revertir cambio optimista en caso de error
          if (rolIndex !== -1) {
            const nuevoRol = { ...rolesActuales[rolIndex], asignado: !isChecked };
            const nuevosRoles = [...rolesActuales];
            nuevosRoles[rolIndex] = nuevoRol;
            this.roles.set(nuevosRoles);
          }
        }
      });
    } else {
      this.usurolService.desasignar(id).subscribe({
        next: () => {
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        },
        error: (err) => {
          console.error('Error desasignando rol:', err);
          // Revertir cambio optimista en caso de error
          if (rolIndex !== -1) {
            const nuevoRol = { ...rolesActuales[rolIndex], asignado: !isChecked };
            const nuevosRoles = [...rolesActuales];
            nuevosRoles[rolIndex] = nuevoRol;
            this.roles.set(nuevosRoles);
          }
        }
      });
    }
  }

  // Computed para filtrar usuarios
  get usuariosFiltrados(): Persona[] {
    const filtro = this.filtroUsuario().toLowerCase();
    // Filtrar solo usuarios que tengan user con login
    const usuariosConLogin = this.usuarios().filter(u => u.user && u.user.login);
    
    if (!filtro) return usuariosConLogin;
    
    return usuariosConLogin.filter(u => 
      u.nombre.toLowerCase().includes(filtro) || 
      u.ap.toLowerCase().includes(filtro) ||
      u.am.toLowerCase().includes(filtro) ||
      u.user.login.toLowerCase().includes(filtro)
    );
  }

  printAsignacionRolesUsuario(): void {
  const printWindow = window.open('', '_blank', 'width=1100,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateAsignacionRolesUsuarioHTML();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private generateAsignacionRolesUsuarioHTML(): string {
  const currentDate = new Date().toLocaleString('es-BO');
  
  // Obtener el usuario seleccionado actualmente
  const usuarioSeleccionado = this.selectedUser();
  const nombreUsuarioSeleccionado = usuarioSeleccionado ? usuarioSeleccionado.nombre : 'No seleccionado';
  const loginUsuarioSeleccionado = usuarioSeleccionado ? usuarioSeleccionado.user.login : 'N/A';
  
  // Separar roles asignados y no asignados
  const rolesAsignados = this.roles().filter(r => r.asignado);
  const rolesNoAsignados = this.roles().filter(r => !r.asignado);

  // Generar filas para roles asignados
  const filasAsignados = rolesAsignados.map(rol => `
    <tr>
      <td>${rol.codr}</td>
      <td>${rol.nombre}</td>
      <td class="status-active">✓ Asignado</td>
    </tr>
  `).join('');

  // Generar filas para roles no asignados
  const filasNoAsignados = rolesNoAsignados.map(rol => `
    <tr>
      <td>${rol.codr}</td>
      <td>${rol.nombre}</td>
      <td class="status-inactive">No asignado</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Asignación de Roles a Usuario - Gestión Académica</title>
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
        .usuario-info {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          border-left: 4px solid #007A5E;
        }
        .usuario-info h3 {
          color: #0A1C2C;
          margin-bottom: 8px;
          font-size: 16px;
        }
        .usuario-details {
          display: grid;
          grid-template-columns: auto auto;
          gap: 15px;
          font-size: 14px;
        }
        .usuario-detail-item {
          display: flex;
          gap: 8px;
        }
        .usuario-detail-label {
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
        <h1>Asignación de Roles a Usuarios</h1>
        <div style="font-size: 12px; color: #64748b;">Generado: ${currentDate}</div>
      </div>

      <div class="usuario-info">
        <h3>Usuario Seleccionado</h3>
        <div class="usuario-details">
          <div class="usuario-detail-item">
            <span class="usuario-detail-label">Usuario:</span>
            <span>${nombreUsuarioSeleccionado}</span>
          </div>
          <div class="usuario-detail-item">
            <span class="usuario-detail-label">Login:</span>
            <span>${loginUsuarioSeleccionado}</span>
          </div>
          
        </div>
      </div>

      <div class="section">
        <div class="section-title">Roles Asignados al Usuario</div>
        ${rolesAsignados.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th width="80">Código</th>
                <th>Nombre del Rol</th>
                <th width="100">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filasAsignados}
            </tbody>
          </table>
        ` : `
          <div class="no-data">No hay roles asignados a este usuario</div>
        `}
      </div>

      <div class="section">
        <div class="section-title">Roles No Asignados al Usuario</div>
       
        ${rolesNoAsignados.length > 0 ? `
          <table>
            <thead>
              <tr>
                <th width="80">Código</th>
                <th>Nombre del Rol</th>
                <th width="100">Estado</th>
              </tr>
            </thead>
            <tbody>
              ${filasNoAsignados}
            </tbody>
          </table>
        ` : `
          <div class="no-data">Todos los roles están asignados a este usuario</div>
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
