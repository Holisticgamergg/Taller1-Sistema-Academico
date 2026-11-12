export interface Persona {
    codp: number
    nombre: string
    ap: string
    am: string
    estado: number
    fnac: Date
    ecivil: string
    genero: string
    direc: string
    telf: string
    tipo: string
    foto: string
    user: Usuario
    datos: Datos
}

export interface Usuario {
    login: string
    state: number
    username: string
}

export interface Id {
  codp: number
  cedula: string
}

export  interface Datos {
  id: Id;
}

export interface Proceso {
  nombre: string
  ayuda: string
  enlace: string
}

export interface Menu {
  codm: number
  nombre: string
  procesos: Proceso[]
}

export interface Rol {
    codr: number
    nombre: string
    estado: number
    menus: Menu[]
}