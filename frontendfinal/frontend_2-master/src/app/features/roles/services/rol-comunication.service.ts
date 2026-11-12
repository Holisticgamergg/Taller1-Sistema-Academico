import { Injectable, signal } from '@angular/core';
import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolComunicationService {
  selectedRol = signal<Rol | null>(null);
}
