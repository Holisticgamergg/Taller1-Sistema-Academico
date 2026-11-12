import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Progra, PrograCreateDto, AlumnoDto, ClaseDisponibleDto } from '../models/progra.model';

@Injectable({
  providedIn: 'root'
})
export class PrograService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}api/progra`;

  /**
   * Obtiene todas las inscripciones con filtros opcionales
   */
  getAll(searchTerm: string = '', estado: number = 2, codn: number | null = null): Observable<Progra[]> {
    let params = new HttpParams();
    
    if (searchTerm) {
      params = params.set('search', searchTerm);
    }
    // Solo enviar estado si no es 2 (Todos)
    if (estado !== 2) {
      params = params.set('estado', estado.toString());
    }
    if (codn !== null) {
      params = params.set('codn', codn.toString());
    }

    return this.http.get<Progra[]>(this.baseUrl, { params });
  }

  /**
   * Obtiene una inscripción específica por su clave compuesta
   */
  getById(codmat: number, codpar: number, gestion: number, codp: string): Observable<Progra> {
    return this.http.get<Progra>(`${this.baseUrl}/${codmat}/${codpar}/${gestion}/${codp}`);
  }

  /**
   * Crea una nueva inscripción
   */
  create(progra: PrograCreateDto): Observable<Progra> {
    return this.http.post<Progra>(this.baseUrl, progra);
  }

  /**
   * Actualiza una inscripción existente
   */
  update(codmat: string, codpar: number, gestion: number, codp: number, progra: PrograCreateDto): Observable<Progra> {
    return this.http.put<Progra>(`${this.baseUrl}/${codmat}/${codpar}/${gestion}/${codp}`, progra);
  }

  /**
   * Elimina (deshabilita) una inscripción
   */
  delete(codmat: string, codpar: number, gestion: number, codp: number): Observable<void> {
    const params = new HttpParams()
      .set('codmat', codmat)
      .set('codpar', codpar.toString())
      .set('gestion', gestion.toString())
      .set('codp', codp.toString());

    return this.http.delete<void>(this.baseUrl, { params });
  }

  /**
   * Habilita una inscripción previamente deshabilitada
   */
  enable(codmat: string, codpar: number, gestion: number, codp: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${codmat}/${codpar}/${gestion}/${codp}/habilitar`, {});
  }

  /**
   * Obtiene lista de estudiantes (Personal tipo 'E')
   */
  getEstudiantes(): Observable<AlumnoDto[]> {
    const params = new HttpParams()
      .set('tipo', 'E')
      .set('estado', '1');
    
    return this.http.get<AlumnoDto[]>(`${environment.apiUrl}api/personals/filter`, { params });
  }

  /**
   * Obtiene clases disponibles con información completa
   * (Nivel - Materia - Paralelo)
   */
  getClasesDisponibles(): Observable<ClaseDisponibleDto[]> {
    return this.http.get<ClaseDisponibleDto[]>(`${environment.apiUrl}api/dicta/clases-disponibles`);
  }
}
