import { Injectable, signal } from '@angular/core';
import { Paralelo } from '../models/paralelo.model';

@Injectable({
  providedIn: 'root'
})
export class ParaleloComunicationService {
  selectedParalelo = signal<Paralelo | null>(null);
}
