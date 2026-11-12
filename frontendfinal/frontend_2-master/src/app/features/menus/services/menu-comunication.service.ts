import { Injectable, signal } from '@angular/core';
import { Menu } from '../models/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuComunicationService {
  selectedMenu = signal<Menu | null>(null);
}