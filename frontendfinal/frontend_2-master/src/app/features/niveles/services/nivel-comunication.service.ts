import { Injectable, signal } from '@angular/core';
import { Nivel } from '../models/nivel.model';

@Injectable({
  providedIn: 'root'
})
export class NivelComunicationService {
  selectedNivel = signal<Nivel | null>(null);
}
