import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Materia, MateriaDto, UpdateCodigoMateriaDto } from '../models/materia.model';

@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private http = inject(HttpClient);
  private apiUrl = `${(environment as any).apiUrl}api/materias`;

  getAll(nombre?: string, estado?: number): Observable<Materia[]> {
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }
    if (estado !== undefined && estado !== null && estado !== 2) {
      params = params.set('estado', estado.toString());
    }
    return this.http.get<Materia[]>(this.apiUrl, { params });
  }

  create(materia: MateriaDto): Observable<Materia> {
    return this.http.post<Materia>(this.apiUrl, materia);
  }

  update(codmat: string, materia: MateriaDto): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/${codmat}`, materia);
  }

  /**
   * Actualiza el código de la materia (cambio de PK)
   * El backend debe:
   * 1. Crear nueva materia con el nuevo código
   * 2. Migrar todas las relaciones (dicta, progra, mapa, itemat)
   * 3. Eliminar la materia antigua
   */
  updateCodigo(dto: UpdateCodigoMateriaDto): Observable<Materia> {
    return this.http.put<Materia>(`${this.apiUrl}/cambiar-codigo`, dto);
  }

  delete(codmat: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codmat}`, {});
  }

  enable(codmat: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${codmat}/habilitar`, {});
  }
}
