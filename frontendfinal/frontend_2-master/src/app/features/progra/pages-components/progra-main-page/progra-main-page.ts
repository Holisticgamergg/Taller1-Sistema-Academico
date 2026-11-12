import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PrograService } from '../../services/progra.service';
import { NivelService } from '../../../niveles/services/nivel.service';
import { Progra } from '../../models/progra.model';
import { Nivel } from '../../../niveles/models/nivel.model';
import { PrograListPageComponent } from '../progra-list-page/progra-list-page';
import { PrograFormDialogComponent } from '../../dialogs/progra-form-dialog/progra-form-dialog';
import { DisablePrograDialogComponent } from '../../dialogs/disable-progra-dialog/disable-progra-dialog';
import { EnablePrograDialogComponent } from '../../dialogs/enable-progra-dialog/enable-progra-dialog';

@Component({
  selector: 'app-progra-main-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PrograListPageComponent
  ],
  templateUrl: './progra-main-page.html',
  styleUrl: './progra-main-page.css'
})
export class PrograMainPageComponent {
  private readonly prograService = inject(PrograService);
  private readonly nivelService = inject(NivelService);
  private readonly dialog = inject(MatDialog);

  // Signals
  inscripciones = signal<Progra[]>([]);
  niveles = signal<Nivel[]>([]);
  filtroTexto = signal<string>('');
  filtroEstado = signal<number>(2); 
  filtroNivel = signal<number | null>(null);
  isLoading = signal<boolean>(false);

  constructor() {
  
    this.nivelService.listarActivos().subscribe({
      next: (niveles) => this.niveles.set(niveles),
      error: (err) => console.error('Error al cargar niveles:', err)
    });

    effect(() => {
      const texto = this.filtroTexto();
      const estado = this.filtroEstado();
      const nivel = this.filtroNivel();
      
      this.cargarInscripciones(texto, estado, nivel);
    });
  }

  
  private cargarInscripciones(texto: string, estado: number, nivel: number | null): void {
    this.isLoading.set(true);
    this.prograService.getAll(texto, estado, nivel).subscribe({
      next: (inscripciones) => {
        this.inscripciones.set(inscripciones);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar inscripciones:', err);
        this.isLoading.set(false);
      }
    });
  }
  
onBuscarEnter(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.filtroTexto.set(input.value);
}
 
  onNuevaInscripcion(): void {
    const dialogRef = this.dialog.open(PrograFormDialogComponent, {
      width: '600px',
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarInscripciones(
          this.filtroTexto(),
          this.filtroEstado(),
          this.filtroNivel()
        );
      }
    });
  }

  onEditarInscripcion(inscripcion: Progra): void {
    const dialogRef = this.dialog.open(PrograFormDialogComponent, {
      width: '600px',
      data: { 
        isEdit: true,
        inscripcion: inscripcion
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarInscripciones(
          this.filtroTexto(),
          this.filtroEstado(),
          this.filtroNivel()
        );
      }
    });
  }

 
  onEliminarInscripcion(inscripcion: Progra): void {
    const dialogRef = this.dialog.open(DisablePrograDialogComponent, {
      width: '500px',
      data: inscripcion
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarInscripciones(
          this.filtroTexto(),
          this.filtroEstado(),
          this.filtroNivel()
        );
      }
    });
  }

  /**
   * Abre el diálogo para habilitar inscripción
   */
  onHabilitarInscripcion(inscripcion: Progra): void {
    const dialogRef = this.dialog.open(EnablePrograDialogComponent, {
      width: '500px',
      data: inscripcion
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.cargarInscripciones(
          this.filtroTexto(),
          this.filtroEstado(),
          this.filtroNivel()
        );
      }
    });
  }

  /**
   * Actualiza el filtro de búsqueda
   */
  onBuscar(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroTexto.set(input.value);
  }

  /**
   * Actualiza el filtro de estado usando radios
   */
  onCambiarEstadoRadio(estado: number): void {
    this.filtroEstado.set(estado);
  }

  /**
   * Actualiza el filtro de estado (método legacy para compatibilidad)
   */
  onCambiarEstado(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.filtroEstado.set(+input.value); // Convertir a number
  }

  /**
   * Actualiza el filtro de nivel
   */
  onCambiarNivel(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const valor = select.value;
    this.filtroNivel.set(valor ? +valor : null);
  }

  // Método para imprimir una inscripción individual
printInscripcion(inscripcion: Progra): void {
  // Usar los datos de la inscripción directamente
  this.onPrintInscripcionDetails(inscripcion);
}

// Método para imprimir lista completa de inscripciones (B18)
printListaInscripciones(): void {
  const printWindow = window.open('', '_blank', 'width=1200,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateListaInscripcionesHTML();
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private onPrintInscripcionDetails(inscripcion: Progra): void {
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const html = this.generateInscripcionPrintableHTML(inscripcion);
  printWindow.document.write(html);
  printWindow.document.close();

  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
}

private generateInscripcionPrintableHTML(inscripcion: Progra): string {
  const estado = String(inscripcion.estado) === '1' ? 'Activa' : 'Inactiva';
  const fechaCreacion = new Date().toLocaleDateString('es-BO', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Detalles de Inscripción de Alumno</title>
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
        .inscripcion-section {
          background-color: #f8fafc;
          padding: 25px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 30px;
        }
        .inscripcion-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .inscripcion-title h2 {
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
        .alumno-info {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          margin-top: 10px;
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
          .inscripcion-section { background-color: transparent; border: none; }
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="header">
          <h1>Unidad Educativa Andalucía</h1>
          <p>Inscripción de Alumno - Detalles</p>
        </div>

        <div class="inscripcion-section">
          <div class="inscripcion-header">
            <div class="inscripcion-title">
              <h2>${inscripcion.nombreMateria || 'Inscripción'}</h2>
              <div class="info-value">Gestión: ${inscripcion.gestion}</div>
            </div>
            <div class="badges">
              <span class="badge ${String(inscripcion.estado) === '1' ? 'badge-active' : 'badge-inactive'}">
                ${estado}
              </span>
              <span class="badge badge-gestion">Gestión ${inscripcion.gestion}</span>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Información del Alumno</div>
            <div class="alumno-info">
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Alumno</div>
                  <div class="info-value">${inscripcion.nombreAlumno || 'N/A'}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Código Alumno</div>
                  <div class="info-value">${inscripcion.codp}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Información de la Inscripción</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Materia</div>
                <div class="info-value">${inscripcion.nombreMateria || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Código Materia</div>
                <div class="info-value">${inscripcion.codmat}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Paralelo</div>
                <div class="info-value">${inscripcion.nombreParalelo || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Código Paralelo</div>
                <div class="info-value">${inscripcion.codpar}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Nivel</div>
                <div class="info-value">${inscripcion.nombreNivel || 'N/A'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Gestión</div>
                <div class="info-value">${inscripcion.gestion}</div>
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

private generateListaInscripcionesHTML(): string {
  const currentDate = new Date().toLocaleString('es-BO');
  const nivelSeleccionado = this.filtroNivel()
  ? this.niveles().find(n => n.codn === this.filtroNivel())?.nombre || 'Todos los niveles'
    : 'Todos los niveles';

      const totalInscripciones = this.inscripciones().length;

  
  // Generar filas de la tabla
  const tableRows = this.inscripciones().map((inscripcion: Progra): string => `
    <tr>
      <td>${inscripcion.nombreNivel || 'N/A'}</td>
      <td>${inscripcion.nombreMateria || 'N/A'}</td>
      <td>${inscripcion.nombreAlumno || 'N/A'}</td>
      <td>${inscripcion.nombreParalelo || 'N/A'}</td>
      <td>${inscripcion.gestion}</td>
      <td class="${String(inscripcion.estado) === '1' ? 'status-active' : 'status-inactive'}">
        ${String(inscripcion.estado) === '1' ? 'Activa' : 'Inactiva'}
      </td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lista de Inscripciones de Alumnos - Gestión Académica</title>
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
        <h1>Gestión de Inscripciones de Alumnos</h1>
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
          <span>${this.obtenerTextoFiltroEstado()}</span>
        </div>
        <div class="filter-item">
          <span class="filter-label">Texto búsqueda:</span> 
          <span>${this.filtroTexto || 'Ninguno'}</span>
        </div>
      </div>

      <div class="summary">
        Total de inscripciones: ${totalInscripciones}
      </div>

      <table>
        <thead>
          <tr>
            <th width="120">Nivel</th>
            <th width="180">Materia</th>
            <th width="180">Alumno</th>
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
}

}
