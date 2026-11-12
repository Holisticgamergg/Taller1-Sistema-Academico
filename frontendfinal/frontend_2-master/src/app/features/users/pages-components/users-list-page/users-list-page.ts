import { Component, effect, inject, input, signal, ViewChild, viewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { ComunicationService } from '../../services/comunication-service';
import { UserApiService } from '../../services/user-service';
import { Persona } from '../../../../core/models/user-data';
import { MatDialog } from '@angular/material/dialog';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';
import { DisableUserDialog } from '../../dialogs/disable-user-dialog/disable-user-dialog';
import { ConfirmationDialog } from '../../../../shared/components/dialogs/confirmation-dialog/confirmation-dialog';
import { EnableUserDialog } from '../../dialogs/enable-user-dialog/enable-user-dialog';
import { RegisterDataFormDialog } from '../../dialogs/register-data-form-dialog/register-data-form-dialog';
import { ModifDataFormDialog } from '../../dialogs/modif-data-form-dialog/modif-data-form-dialog';
import { ModifUserFormDialog } from '../../dialogs/modif-user-form-dialog/modif-user-form-dialog';
import { TableComponent } from "../../../../shared/components/table/table";

@Component({
  selector: 'app-users-list-page',
  imports: [MatPaginatorModule, MatTableModule, MatIconModule, TableComponent],
  templateUrl: './users-list-page.html',
  styleUrl: './users-list-page.css'
})
export class UsersListPage {
  private comunication = inject(ComunicationService)
  private userService = inject(UserApiService)
  paginator = viewChild(MatPaginator)
  dataSource = new MatTableDataSource<Persona>()
  displayedColumns: string[] = ['photo', 'name', 'state', 'actions']
  dialog = inject(MatDialog)

  usuarios = signal<Persona[]>([])

  query = input<string>("")

  columns=signal<any[]>([
    {
      columnDef: 'foto',
      header: 'Foto',
      cell: (p: Persona) => p.foto,
    },
    {
      columnDef: 'nombre',
      header: 'Nombre',
      cell: (p: Persona) => p.nombre + ' ' + p.ap + ' ' + p.am,
    },
    {
      columnDef: 'estado',
      header: 'Estado',
      cell: (p: Persona) => p.estado,
    },
    {
      columnDef: 'm',
      header: 'M',
      cell: (p: Persona) => "",
    },
    {
      columnDef: 'b',
      header: 'B',
      cell: (p: Persona) => "",
    },
    {
      columnDef: 'h',
      header: 'H',
      cell: (p: Persona) => "",
    },
    {
      columnDef: 'v',
      header: 'V',
      cell: (p: Persona) => "",
    },
    {
      columnDef: 'k',
      header: 'K',
      cell: (p: Persona) => p.user,
    },
  ]) 

  constructor() {
    effect(() => {
      this.obtenerPersonas()
      const usersList = this.comunication.users() || []
      this.dataSource.data = usersList
      const paginationInstance = this.paginator()
      if(paginationInstance) this.dataSource.paginator = paginationInstance
      if(this.dataSource.paginator) this.dataSource.paginator.firstPage()
    }, { allowSignalWrites: true })
  }

  obtenerPersonas(){
    this.usuarios.set(this.comunication.users()??[])
  }

  edit(p :any){
    this.comunication.selectedUser.set(p)
    this.dialog.open(FormDialog, {data: { content: ModifUserFormDialog }})
  }

  delete(p: any) {
    this.comunication.selectedUser.set(p)
    this.dialog.open(ConfirmationDialog, {data: { content: DisableUserDialog }})
  }

  enable(p: any) {
    this.comunication.selectedUser.set(p)
    this.dialog.open(ConfirmationDialog, {data: { content: EnableUserDialog }})
  }

  registerData(p: any) {
    this.comunication.selectedUser.set(p)
    this.dialog.open(FormDialog, {data: { content: RegisterDataFormDialog }})
  }

  editData(p: any) {
    this.comunication.selectedUser.set(p)
    this.dialog.open(FormDialog, {data: { content: ModifDataFormDialog }})
  }

  print(p: Persona): void {
    // Obtener datos completos del usuario incluyendo cédula
    this.userService.getPersonalById(p.codp).subscribe({
      next: (response: any) => {
        // El backend devuelve { persona: {...}, cedula: "..." }
        const fullPersona = response.persona || response;
        const cedula = response.cedula || null;
        
        // Agregar la cédula al objeto persona
        if (cedula && fullPersona) {
          fullPersona.cedula = cedula;
        }
        
        this.onPrintDetails(fullPersona);
      },
      error: (err: any) => {
        console.error('Error obteniendo datos completos, usando datos parciales:', err);
        // Fallback: usar los datos parciales
        this.onPrintDetails(p);
      }
    });
  }  onPrintDetails(personal: Persona): void {
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (!printWindow) {
      alert('Por favor, permite las ventanas emergentes para imprimir');
      return;
    }

    const html = this.generatePrintableHTML(personal);
    printWindow.document.write(html);
    printWindow.document.close();

    // Esperar a que cargue y luego abrir el diálogo de impresión
    printWindow.onload = () => {
      printWindow.focus();
      // Un pequeño timeout asegura que los estilos/imágenes se rendericen antes de imprimir
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  }

  private generatePrintableHTML(personal: Persona): string {
    const fotoUrl = this.getFotoUrl(personal.foto);
    const estadoCivil = this.getEstadoCivilText(personal.ecivil);
    const genero = this.getGeneroText(personal.genero);
    const tipo = this.getTipoText(personal.tipo);
    const estado = personal.estado === 1 ? 'Activo' : 'Inactivo';
    // Validar fecha antes de convertir
    const fechaNac = personal.fnac ? new Date(personal.fnac).toLocaleDateString('es-BO', {
      year: 'numeric', month: 'long', day: 'numeric'
    }) : 'No especificado';

    const nombreCompleto = `${personal.nombre} ${personal.ap} ${personal.am}`;
    // Obtener cédula de múltiples ubicaciones posibles
    const cedula = (personal as any).cedula || personal.datos?.id?.cedula || 'No Registrada';

    // Aquí va tu plantilla HTML con los colores corporativos
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Detalles de Personal - ${nombreCompleto}</title>
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
            border-bottom: 3px solid #0A1C2C; /* Navy Blue */
          }
          .header h1 {
            color: #0A1C2C; /* Navy Blue */
            font-size: 28px;
            margin-bottom: 5px;
            text-transform: uppercase;
          }
          .header p {
            color: #007A5E; /* Verde Esmeralda */
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .content {
            max-width: 800px;
            margin: 0 auto;
          }
          .photo-section {
            display: flex;
            gap: 30px;
            margin-bottom: 30px;
            align-items: center;
            background-color: #f8fafc;
            padding: 20px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
          }
          .photo {
            width: 150px;
            height: 150px;
            border-radius: 50%; /* Foto redonda moderna */
            object-fit: cover;
            border: 4px solid #007A5E; /* Borde Verde */
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .basic-info {
            flex: 1;
          }
          .basic-info h2 {
            color: #0A1C2C;
            font-size: 26px;
            margin-bottom: 10px;
          }
          .badges {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
          }
          .badge {
            display: inline-block;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            text-transform: uppercase;
            color: white;
          }
          .badge-active { background: #007A5E; }
          .badge-inactive { background: #dc2626; }
          .badge-tipo { background: #0A1C2C; }
          
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
            padding: 5px 0;
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
            .photo-section { background-color: transparent; border: none; }
          }
        </style>
      </head>
      <body>
        <div class="content">
          <div class="header">
            <h1>Unidad Educativa Andalucía</h1>
            <p>Ficha de Registro de Personal</p>
          </div>

          <div class="photo-section">
            <img src="${fotoUrl}" alt="Foto" class="photo" onerror="this.src='/assets/default-user-icon.png'">
            <div class="basic-info">
              <h2>${nombreCompleto}</h2>
              <div class="badges">
                <span class="badge ${personal.estado === 1 ? 'badge-active' : 'badge-inactive'}">
                  ${estado}
                </span>
                <span class="badge badge-tipo">${tipo}</span>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Código Personal</div>
                  <div class="info-value">${personal.codp}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Cédula de Identidad</div>
                  <div class="info-value">${(cedula) || 'No Registrada'}</div>
                </div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Datos Personales</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Nombre</div>
                <div class="info-value">${personal.nombre}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Apellidos</div>
                <div class="info-value">${personal.ap} ${personal.am}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Fecha de Nacimiento</div>
                <div class="info-value">${fechaNac}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Estado Civil</div>
                <div class="info-value">${estadoCivil}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Género</div>
                <div class="info-value">${genero}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Datos de Contacto</div>
            <div class="info-grid">
              <div class="info-item">
                <div class="info-label">Teléfono</div>
                <div class="info-value">${personal.telf || 'No especificado'}</div>
              </div>
              <div class="info-item">
                <div class="info-label">Dirección</div>
                <div class="info-value">${personal.direc || 'No especificado'}</div>
              </div>
            </div>
          </div>

          ${personal.user ? `
            <div class="section">
              <div class="section-title">Credenciales de Acceso</div>
              <div class="info-grid">
                <div class="info-item">
                  <div class="info-label">Usuario</div>
                  <div class="info-value">${personal.user.login}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Estado Acceso</div>
                  <div class="info-value" style="color: #059669;">✓ Activo</div>
                </div>
              </div>
            </div>
          ` : ''}

          <div class="footer">
            Documento generado el ${new Date().toLocaleString('es-BO')}
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // --- Helpers para textos ---
  private getFotoUrl(foto?: string): string {
    // Si tienes la URL completa, úsala. Si es solo el nombre, concatena tu base URL
    if (!foto) return '/assets/default-user-icon.png';
    return foto.startsWith('http') ? foto : `http://localhost:8080/media/${foto}`;
  }

  private getEstadoCivilText(ecivil?: string): string {
    const map: any = { 'S': 'Soltero(a)', 'C': 'Casado(a)', 'D': 'Divorciado(a)', 'V': 'Viudo(a)' };
    return ecivil ? (map[ecivil] || ecivil) : 'No especificado';
  }

  private getGeneroText(genero?: string): string {
    const map: any = { 'M': 'Masculino', 'F': 'Femenino' };
    return genero ? (map[genero] || genero) : 'No especificado';
  }

  private getTipoText(tipo?: string): string {
    const map: any = { 'A': 'Administrativo', 'P': 'Profesor', 'E': 'Estudiante' };
    return tipo ? (map[tipo] || tipo) : 'No especificado';
  }
  private getCedula(personal: Persona): string {
    if(personal.datos?.id?.cedula){
      return personal.datos.id.cedula;
    }
    return 'No Registrada';
  }

}
