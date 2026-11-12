import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClaseDisponibleDto, Dicta, DictaCreateDto } from '../models/dicta.model';

@Injectable({
  providedIn: 'root',
})
export class DictaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/dicta`;

  /**
   * Obtiene todas las asignaciones con filtros opcionales
   */
  getAll(
    filtro: string = '',
    estado: number = 1,
    codn?: number
  ): Observable<Dicta[]> {
    let params = new HttpParams()
      .set('filtro', filtro)
      .set('estado', estado.toString());

    if (codn !== undefined && codn !== null) {
      params = params.set('codn', codn.toString());
    }

    return this.http.get<Dicta[]>(this.apiUrl, { params });
  }

  /**
   * Obtiene una asignación por su clave compuesta
   */
  getById(codmat: string, codpar: number, gestion: number, login: string): Observable<Dicta> {
    return this.http.get<Dicta>(
      `${this.apiUrl}/${codmat}/${codpar}/${gestion}/${login}`
    );
  }

  /**
   * Crea una nueva asignación
   */
  create(dicta: DictaCreateDto): Observable<Dicta> {
    return this.http.post<Dicta>(this.apiUrl, dicta);
  }

  /**
   * Actualiza una asignación existente
   */
  update(
    codmat: string,
    codpar: number,
    gestion: number,
    login: string,
    dicta: DictaCreateDto
  ): Observable<Dicta> {
    return this.http.put<Dicta>(
      `${this.apiUrl}/${codmat}/${codpar}/${gestion}/${login}`,
      dicta
    );
  }

  /**
   * Elimina (lógicamente) una asignación
   */
  delete(codmat: string, codpar: number, gestion: number, login: string): Observable<void> {
    const params = new HttpParams()
      .set('codmat', codmat)
      .set('codpar', codpar.toString())
      .set('gestion', gestion.toString())
      .set('login', login);

    return this.http.delete<void>(this.apiUrl, { params });
  }

  /**
   * Habilita una asignación
   */
  enable(codmat: string, codpar: number, gestion: number, login: string): Observable<Dicta> {
   const id = { codmat, codpar, gestion, login };
    return this.http.post<Dicta>(`${this.apiUrl}/habilitar`, id);
  }


  getClasesDisponibles(): Observable<ClaseDisponibleDto[]> {
    return this.http.get<ClaseDisponibleDto[]>(`${this.apiUrl}/clases`);
  }
}
