import { Component, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon'
import { RouterLink } from '@angular/router';
import { UserDetails } from '../../../../core/services/user-details';
import { ToolbarMenu } from '../toolbar-menu/toolbar-menu';

@Component({
  selector: 'app-toolbar-page',
  imports: [ToolbarMenu, MatIconModule, RouterLink],
  templateUrl: './toolbar-page.html',
  styleUrl: './toolbar-page.css'
})
export class ToolbarPage {
  user = inject(UserDetails)
  selectedRole = signal<number | null>(null)

  constructor() {
    effect(() => {
      if(!this.user.isAuth()) {
        this.selectedRole.set(null)
      }
    })
  }

  onRoleChange(event: Event) {
    const selectedValue = Number((event.target as HTMLSelectElement).value)
    if(this.user.isAuth()) {
      this.selectedRole.set(selectedValue === 0 ? null: selectedValue)
    }
  }
}
