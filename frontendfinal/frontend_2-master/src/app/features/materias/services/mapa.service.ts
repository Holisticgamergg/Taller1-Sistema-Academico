import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Mapa, MapaDto } from '../models/mapa.model';

@Injectable({
  providedIn: 'root',
})
export class MapaService {
  private http = inject(HttpClient);
  private apiUrl = `${(environment as any).apiUrl}api/mapa`;

  getByMateria(codmat: string): Observable<Mapa[]> {
    return this.http.get<Mapa[]>(`${this.apiUrl}/materia/${codmat}`);
  }

  create(mapa: MapaDto): Observable<Mapa> {
    return this.http.post<Mapa>(this.apiUrl, mapa);
  }

  delete(codmat: string, codpar: number, gestion:number): Observable<void> {
    const params = new HttpParams()
      .set('codmat', codmat)
      .set('codpar', codpar.toString())
      .set('gestion', gestion.toString());
      
    return this.http.delete<void>(this.apiUrl, { params });
  }
}
