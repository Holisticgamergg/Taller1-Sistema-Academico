import { Component, effect, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormDialog } from '../../../../shared/components/dialogs/form-dialog/form-dialog';
import { RegisterFormDialog } from '../../dialogs/register-form-dialog/register-form-dialog';
import { UsersListPage } from "../users-list-page/users-list-page";
import { ComunicationService } from '../../services/comunication-service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { Persona } from '../../../../core/models/user-data';

@Component({
  selector: 'app-users-main-page',
  imports: [MatIconModule, UsersListPage],
  templateUrl: './users-main-page.html',
  styleUrl: './users-main-page.css'
})
export class UsersMainPage implements OnInit, OnDestroy {
  private comunication = inject(ComunicationService)
  private refreshSubscription!: Subscription
  dialog = inject(MatDialog)

  onSearch = output<string>()
  query = signal<string>("")
  isLoading = signal<boolean>(false)
  hasError = signal<boolean>(false)

  selectedType: string = ''
  selectedState: string = ''

  onSelectChanges(event: Event) {
    const selectedElement = event.target as HTMLSelectElement
    this.selectedType = selectedElement.value
    this.fetchFilteredUsers()
  }

  onRadioChanges(event: Event) {
    const selectedElement = event.target as HTMLInputElement
    this.selectedState = selectedElement.value
    this.fetchFilteredUsers()
  }

  ngOnInit() {
    this.fetchUsers()

    this.refreshSubscription = this.comunication.usersListRefresh$
      .subscribe(() => {
        this.fetchUsers()
      })
  }

  ngOnDestroy() {
      if(this.refreshSubscription) this.refreshSubscription.unsubscribe()
  }

  fetchUsers() {
    this.isLoading.set(true)
    this.hasError.set(false)
    this.comunication.fetchUsers().subscribe({
        next: (data) => {
          this.comunication.users.set(data)
          this.isLoading.set(false)
        },
        error: (err) => {
          console.error('Error al cargar usuarios:', err)
          console.error('Verifica que el backend esté corriendo en http://localhost:8080/')
          this.comunication.users.set([])
          this.hasError.set(true)
          this.isLoading.set(false)
        }
    })
  }

  fetchFilteredUsers() {
    this.isLoading.set(true)
    this.hasError.set(false)
    this.comunication.fetchFilteredUsers(this.selectedType, Number(this.selectedState)).subscribe({
      next: (data) => {
        this.comunication.users.set(data)
        this.isLoading.set(false)
      },
      error: (err) => {
        console.error('Error al filtrar usuarios:', err)
        this.comunication.users.set([])
        this.hasError.set(true)
        this.isLoading.set(false)
      }
    })
  }

  opneDialogPersonalRegister() {
    this.dialog.open(FormDialog, {data: { content:  RegisterFormDialog }})
  }

onPrintList(): void {
    const usuariosAImprimir = this.comunication.users(); // Obtenemos la lista actual (ya filtrada por el backend si aplica)
    
    if (!usuariosAImprimir || usuariosAImprimir.length === 0) {
      alert('No hay datos para imprimir.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1100,height=800');
    if (!printWindow) {
        alert('Permite las ventanas emergentes para imprimir');
        return;
    }

    const html = this.generateListHTML(usuariosAImprimir);
    printWindow.document.write(html);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    };
  }

  private generateListHTML(usuarios: Persona[]): string {
    const fechaReporte = new Date().toLocaleString('es-BO');
    
    // Generamos las filas de la tabla
    const filasHtml = usuarios.map((u, index) => {
      const estadoClass = u.estado === 1 ? 'active' : 'inactive';
      const estadoTexto = u.estado === 1 ? 'ACTIVO' : 'BAJA';
      const tipo = u.tipo === 'A' ? 'Administrativo' : u.tipo === 'P' ? 'Profesor' : 'Estudiante';
      
      return `
        <tr>
          <td style="text-align: center;">${index + 1}</td>
          <td><strong>${u.ap} ${u.am || ''}</strong>, ${u.nombre}</td>
          <td>${(u as any).cedula || '-'}</td>
          <td>${u.telf || '-'}</td>
          <td><span class="badge badge-role">${tipo}</span></td>
          <td style="text-align: center;"><span class="badge badge-${estadoClass}">${estadoTexto}</span></td>
        </tr>
      `;
    }).join('');

    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Reporte de Usuarios - Sistema Académico</title>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; padding: 40px; }
          
          /* CABECERA */
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #0A1C2C; padding-bottom: 10px; margin-bottom: 20px; }
          .header-left h1 { color: #0A1C2C; margin: 0; font-size: 24px; text-transform: uppercase; }
          .header-left p { color: #007A5E; font-size: 12px; font-weight: bold; margin: 2px 0 0 0; }
          .header-right { text-align: right; font-size: 12px; color: #666; }

          /* TABLA */
          table { width: 100%; border-collapse: collapse; font-size: 13px; }
          thead { background-color: #0A1C2C; color: white; }
          th { padding: 12px 8px; text-align: left; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; }
          td { padding: 10px 8px; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
          tr:nth-child(even) { background-color: #f8fafc; }

          /* ESTILOS ESPECIFICOS */
          .badge { padding: 3px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; text-transform: uppercase; color: white; }
          .badge-active { background-color: #007A5E; }
          .badge-inactive { background-color: #dc2626; }
          .badge-role { background-color: #475569; }

          .footer { margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="header-left">
            <h1>Unidad Educativa Andalucía</h1>
            <p>Reporte General de Personal</p>
          </div>
          <div class="header-right">
            <p>Fecha: ${fechaReporte}</p>
            <p>Total registros: ${usuarios.length}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th>Apellidos y Nombres</th>
              <th>Cédula</th>
              <th>Teléfono</th>
              <th>Tipo</th>
              <th style="text-align: center;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${filasHtml}
          </tbody>
        </table>

        <div class="footer">
          Sistema de Gestión Académica - Documento generado automáticamente
        </div>
      </body>
      </html>
    `;
  }

}
