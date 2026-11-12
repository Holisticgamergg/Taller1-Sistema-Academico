import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Menu, MenuDto } from '../models/menu.model';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}api/menus`;

  getAll(nombre: string, estado: number): Observable<any> {
    let params = new HttpParams();
    if (nombre) {
      params = params.set('nombre', nombre);
    }
    if (estado !== 2) {
      params = params.set('estado', estado.toString());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  create(menu: MenuDto): Observable<Menu> {
    return this.http.post<Menu>(this.apiUrl, menu);
  }

  update(id: number, menu: MenuDto): Observable<Menu> {
    return this.http.put<Menu>(`${this.apiUrl}/${id}`, menu);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  enable(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/habilitar`, null);
  }
}