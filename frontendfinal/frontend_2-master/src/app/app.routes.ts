import { Routes } from '@angular/router';
import { Home } from './shared/components/statics/home/home';
import { Contacts } from './shared/components/statics/contacts/contacts';
import { UsersMainPage } from './features/users/pages-components/users-main-page/users-main-page';
import { RolesMainPageComponent } from './features/roles/pages-components/roles-main-page/roles-main-page';
import { ParalelosMainPageComponent } from './features/paralelos/pages-components/paralelos-main-page/paralelos-main-page';
import { MenusMainPageComponent } from './features/menus/pages-components/menus-main-page/menus-main-page';
import { MeproMainPageComponent } from './features/mepro/pages-components/mepro-main-page/mepro-main-page';
import { RolmeMainPageComponent } from './features/rolme/pages-components/rolme-main-page/rolme-main-page';
import { UsurolMainPageComponent } from './features/usurol/pages-components/usurol-main-page/usurol-main-page';
import { NivelesMainPageComponent } from './features/niveles/pages-components/niveles-main-page/niveles-main-page';
import { MateriasMainPageComponent } from './features/materias/pages-components/materias-main-page/materias-main-page';
import { ItemsMainPageComponent } from './features/items/pages-components/items-main-page/items-main-page';
import { DictaMainPageComponent } from './features/dicta/pages-components/dicta-main-page/dicta-main-page';
import { PrograMainPageComponent } from './features/progra/pages-components/progra-main-page/progra-main-page';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'contacts', component: Contacts },
    { path: 'users', component: UsersMainPage },
    { path: 'admin/usuarios', component: UsersMainPage },
    { path: 'admin/roles', component: RolesMainPageComponent },
    { path: 'admin/paralelos', component: ParalelosMainPageComponent },
    { path: 'admin/menus', component: MenusMainPageComponent },
    { path: 'admin/mepro', component: MeproMainPageComponent },
    { path: 'admin/rolme', component: RolmeMainPageComponent },
    { path: 'admin/usurol', component: UsurolMainPageComponent },
    { path: 'admin/niveles', component: NivelesMainPageComponent },
    { path: 'admin/materias', component: MateriasMainPageComponent },
    { path: 'admin/items', component: ItemsMainPageComponent },
    { path: 'admin/dicta', component: DictaMainPageComponent },
    { path: 'admin/progra', component: PrograMainPageComponent },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];
