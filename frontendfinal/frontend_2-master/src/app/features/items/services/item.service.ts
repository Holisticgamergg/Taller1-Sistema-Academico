import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Item, ItemDto } from '../models/item.model';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private http = inject(HttpClient);
  private apiUrl = `${(environment as any).apiUrl}api/items`;


  getAll(nombre?: string, estado?: number): Observable<Item[]> {
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }
    if (estado !== undefined && estado !== null && estado !== 2) {
      params = params.set('estado', estado.toString());
    }
    return this.http.get<Item[]>(this.apiUrl, { params });
  }

  create(item: ItemDto): Observable<Item> {
    return this.http.post<Item>(this.apiUrl, item);
  }

  update(codi: number, item: ItemDto): Observable<Item> {
    return this.http.put<Item>(`${this.apiUrl}/${codi}`, item);
  }

  delete(codi: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${codi}`, {});
  }

  enable(codi: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${codi}/habilitar`, {});
  }

  listarActivos(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.apiUrl}`, {
      params: new HttpParams().set('estado', '1')
    });
  }
}
