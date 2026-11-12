import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthResponse } from '../models/auth-response';
import { Menu, Rol } from '../models/user-data';
import { Router } from '@angular/router';

@Injectable({providedIn: 'root'})
export class UserDetails {
    response = signal<AuthResponse | null>(null)
    isAuth = signal<boolean | false>(false)
    menus = signal<Menu[] | null>(null)
    roles = computed<Rol[]>(() => {
        return this.response()?.roles ?? []
    })

    private router = inject(Router)
    
    constructor() {
        const saved = sessionStorage.getItem('currentUser')
        if(saved) {
            const parsed: AuthResponse = JSON.parse(saved)
            this.response.set(parsed)
            this.isAuth.set(true)
        }
    }

    setCurrentSession(authResponse: AuthResponse) {
        sessionStorage.setItem('currentUser', JSON.stringify(authResponse))
        this.response.set(authResponse)
        this.isAuth.set(true)
    }
    
    getToken(): string | null {
        const currentUser = sessionStorage.getItem('currentUser')
        if(currentUser) {
            try {
                const authResponse: AuthResponse = JSON.parse(currentUser)
                return authResponse.token
            } catch (error) {
                //error al retornar el token
                return null
            }
        }
        return null
    }

    //no se nullea los menus por ahora
    logOut() {
        sessionStorage.removeItem('currentUser')
        this.response.set(null)
        this.isAuth.set(false)
        this.router.navigateByUrl('/')
    }

    getNameUser() {
        const resp = this.response();
        if (!resp || !resp.persona) {
            return 'Invitado';
        }
        return this.response()?.persona.nombre + ' ' + this.response()?.persona.ap + ' ' + this.response()?.persona.am
    }

    getlogin(): string {
        const resp = this.response();
        
        if (!resp) return 'Invitado';
        
        if (typeof resp.login === 'object' && resp.login?.login) {
            return resp.login.login;
        }
        if (typeof resp.login === 'string' && resp.login) {
            return resp.login;
        }
        if (resp.persona?.user?.login) {
            return resp.persona.user.login;
        }
        
        return 'Invitado';
    }
}