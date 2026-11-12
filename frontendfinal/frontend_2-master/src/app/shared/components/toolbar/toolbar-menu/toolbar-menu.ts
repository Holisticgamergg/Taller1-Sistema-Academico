import { Component, effect, inject, input } from '@angular/core';
import { UserDetails } from '../../../../core/services/user-details';
import { Menu } from '../../../../core/models/user-data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-toolbar-menu',
  imports: [RouterLink],
  templateUrl: './toolbar-menu.html',
  styleUrl: './toolbar-menu.css'
})
export class ToolbarMenu {
  selectedRole = input<number | null>(null)
  user = inject(UserDetails)

  constructor() {
    effect(() => {
      if(!this.user.isAuth() || !this.selectedRole()) {
        this.user.menus.set([])
        return
      }
      const newMenus = this.updateMenus(this.selectedRole())
      this.user.menus.set(newMenus)
    })
  }

  private updateMenus(id: number | null): Menu[] {
    if(!id) return []
    const roles = this.user.roles() ?? []
    const selectedRol = roles.find((rol) => rol.codr === id)
    return selectedRol?.menus || []
  }
}
