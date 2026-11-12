import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { DictaListPageComponent } from '../dicta-list-page/dicta-list-page';
import { DictaService } from '../../services/dicta.service';
import { NivelService } from '../../../niveles/services/nivel.service';
import { MatDialog } from '@angular/material/dialog';
import { Dicta } from '../../models/dicta.model';
import { Nivel } from '../../../niveles/models/nivel.model';
import { DictaFormDialogComponent } from '../../dialogs/dicta-form-dialog/dicta-form-dialog';
import { DisableDictaDialogComponent } from '../../dialogs/disable-dicta-dialog/disable-dicta-dialog';
import { EnableDictaDialogComponent } from '../../dialogs/enable-dicta-dialog/enable-dicta-dialog';

@Component({
  selector: 'app-dicta-main-page',
  standalone: true,
  imports: [DictaListPageComponent],
  templateUrl: './dicta-main-page.html',
  styleUrl: './dicta-main-page.css',
})
export class DictaMainPageComponent implements OnInit {
  private dictaService = inject(DictaService);
  private nivelService = inject(NivelService);
  private dialog = inject(MatDialog);

  // Signals
  asignaciones = signal<Dicta[]>([]);
  niveles = signal<Nivel[]>([]);
  filtroTexto = signal<string>('');
  filtroEstado = signal<number>(1); // 1=Activos, 0=Bajas, 2=Todos
  filtroNivel = signal<number | undefined>(undefined);
  isLoading = signal<boolean>(false);

  constructor() {
    // Effect para cargar asignaciones cuando cambien los filtros
    effect(() => {
      this.cargarAsignaciones();
    });
  }

  ngOnInit(): void {
    // Cargar niveles activos para el filtro
    this.nivelService.getAll('', 1).subscribe({
      next: (niveles) => {
        this.niveles.set(niveles);
      },
      error: (err) => {
        console.error('Error al cargar niveles:', err);
      },
    });
  }

  cargarAsignaciones(): void {
    this.isLoading.set(true);
    this.dictaService
      .getAll(this.filtroTexto(), this.filtroEstado(), this.filtroNivel())
      .subscribe({
        next: (asignaciones) => {
          this.asignaciones.set(asignaciones);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error al cargar asignaciones:', err);
          this.isLoading.set(false);
        },
      });
  }

  onSearchChange(searchTerm: string): void {
    this.filtroTexto.set(searchTerm);
  }

  onEstadoChange(estado: number): void {
    this.filtroEstado.set(estado);
  }

  onNivelChange(codNivel: number | undefined): void {
    this.filtroNivel.set(codNivel);
  }

  onNuevaAsignacion(): void {
    const dialogRef = this.dialog.open(DictaFormDialogComponent, {
      width: '600px',
      data: { isEditing: false },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarAsignaciones();
      }
    });
  }

  onEditarAsignacion(asignacion: Dicta): void {
    const dialogRef = this.dialog.open(DictaFormDialogComponent, {
      width: '600px',
      data: { isEditing: true, asignacion },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarAsignaciones();
      }
    });
  }

  onEliminarAsignacion(asignacion: Dicta): void {
    const dialogRef = this.dialog.open(DisableDictaDialogComponent, {
      width: '400px',
      data: { asignacion },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarAsignaciones();
      }
    });
  }

  onHabilitarAsignacion(asignacion: Dicta): void {
    const dialogRef = this.dialog.open(EnableDictaDialogComponent, {
      width: '400px',
      data: { asignacion },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarAsignaciones();
      }
    });
  }
  // Método para imprimir una asignación individual
printAsignacion(asignacion: Dicta): void {
  // Usar directamente los datos de la asignación para imprimir
  this.onPrintAsignacionDetails(asignacion);
}

// Método para imprimir lista completa de asignaciones (B18)
printListaAsignaciones(): void {
  const printWindow = window.open('', '_blank', 'width=1200,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateListaAsignacionesHTML();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private onPrintAsignacionDetails(asignacion: Dicta): void {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateAsignacionPrintableHTML(asignacion);
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private generateAsignacionPrintableHTML(asignacion: Dicta): string {
  const estado = asignacion.estado === 1 ? 'Activa' : 'Inactiva';
  const fechaCreacion = new Date().toLocaleDateString('es-BO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detalles de Asignación Docente</title>
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
          max-width: 900px;
          margin: 0 auto;
        }
        .asignacion-section {
          background-color: #f8fafc;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 30px;
        }
        .asignacion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .asignacion-title h2 {
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
        .badge-gestion { background: #0A1C2C; }
        
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
          .asignacion-section { background-color: transparent; border: none; }
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="header">
          <h1>Unidad Educativa Andalucía</h1>
          <p>Asignación Docente - Detalles</p>
        </div>

        <div class="asignacion-section">
          <div class="asignacion-header">
            <div class="asignacion-title">
              <h2>${asignacion.nombreMateria || 'Asignación'}</h2>
              <div class="info-value">Gestión: ${asignacion.gestion}</div>
            </div>
            <div class="badges">
              <span class="badge ${asignacion.estado === 1 ? 'badge-active' : 'badge-inactive'}">
                ${estado}
              </span>
              <span class="badge badge-gestion">Gestión ${asignacion.gestion}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Información de la Asignación</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Materia</div>
                <div class="info-value">${asignacion.nombreMateria || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Código Materia</div>
                <div class="info-value">${asignacion.codmat}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Profesor</div>
                <div class="info-value">${asignacion.nombreProfesor || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Usuario Profesor</div>
                <div class="info-value">${asignacion.login}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Paralelo</div>
                <div class="info-value">${asignacion.nombreParalelo || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Código Paralelo</div>
                <div class="info-value">${asignacion.codpar}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Nivel</div>
                <div class="info-value">${asignacion.nombreNivel || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Estado</div>
                <div class="info-value">${estado}</div>
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

private generateListaAsignacionesHTML(): string {
  const currentDate = new Date().toLocaleString('es-BO');
  const nivelSeleccionado = this.filtroNivel() 
    ? this.niveles().find(n => n.codn === this.filtroNivel())?.nombre || 'Todos los niveles'
    : 'Todos los niveles';
  
  // Generar filas de la tabla
  const tableRows: string = this.asignaciones().map((asignacion: Dicta): string => `
    <tr>
      <td>${asignacion.nombreNivel || 'N/A'}</td>
      <td>${asignacion.nombreMateria || 'N/A'}</td>
      <td>${asignacion.nombreProfesor || 'N/A'}</td>
      <td>${asignacion.nombreParalelo || 'N/A'}</td>
      <td>${asignacion.gestion}</td>
      <td class="${asignacion.estado === 1 ? 'status-active' : 'status-inactive'}">
        ${asignacion.estado === 1 ? 'Activa' : 'Inactiva'}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lista de Asignaciones Docentes - Gestión Académica</title>
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
        .filters-info {
          background: #f8fafc;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          border-left: 4px solid #007A5E;
        }
        .filters-info h3 {
          color: #0A1C2C;
          margin-bottom: 8px;
          font-size: 14px;
        }
        .filter-item {
          display: inline-block;
          margin-right: 20px;
          font-size: 12px;
        }
        .filter-label {
          font-weight: bold;
          color: #64748b;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 10px;
        }
        th {
          background: #0A1C2C;
          color: white;
          padding: 10px 6px;
          text-align: left;
          font-weight: 600;
          text-transform: uppercase;
        }
        td {
          padding: 8px 6px;
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
        <h1>Gestión de Asignaciones Docentes</h1>
        <div style="font-size: 12px; color: #64748b;">Generado: ${currentDate}</div>
      </div>

      <div class="filters-info">
        <h3>Filtros Aplicados</h3>
        <div class="filter-item">
          <span class="filter-label">Nivel:</span> 
          <span>${nivelSeleccionado}</span>
        </div>
        <div class="filter-item">
          <span class="filter-label">Estado:</span> 
        <div class="filter-item">
          <span class="filter-label">Texto búsqueda:</span> 
          <span>${this.filtroTexto() || 'Ninguno'}</span>
        </div>
          <span>${this.filtroTexto || 'Ninguno'}</span>
        </div>
      <div class="summary">
        Total de asignaciones: ${this.asignaciones().length}
      </div>
       

      <table>
        <thead>
          <tr>
            <th width="120">Nivel</th>
            <th width="180">Materia</th>
            <th width="180">Profesor</th>
            <th width="80">Paralelo</th>
            <th width="80">Gestión</th>
            <th width="80">Estado</th>
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

private obtenerTextoFiltroEstado(): string {
  switch (this.filtroEstado()) {
    case 1: return 'Activas';
    case 0: return 'Bajas';
    case 2: return 'Todos';
    default: return 'Todos';
  }
}}