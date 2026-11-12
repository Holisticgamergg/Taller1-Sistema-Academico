import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Itemat, ItematDto } from '../models/itemat.model';

@Injectable({
  providedIn: 'root',
})
export class ItematService {
  private http = inject(HttpClient);
  private apiUrl = `${(environment as any).apiUrl}api/itemat`;

  getByMateria(codmat: string): Observable<Itemat[]> {
    return this.http.get<Itemat[]>(`${this.apiUrl}/materia/${codmat}`);
  }

  create(itemat: ItematDto): Observable<Itemat> {
    return this.http.post<Itemat>(this.apiUrl, itemat);
  }

  update(codmat: string, codi: number, ponderacion: number): Observable<Itemat> {
    return this.http.put<Itemat>(`${this.apiUrl}/${codmat}/${codi}`, { ponderacion });
  }

  delete(codmat: string, codi: number): Observable<void> {
    const params = new HttpParams()
      .set('codmat', codmat)
      .set('codi', codi.toString());
    return this.http.delete<void>(this.apiUrl, { params });
  }
}
