import { Persona, Rol, Usuario } from "./user-data";

export interface AuthResponse {
    persona: Persona
    token: string
    roles: Rol[]
    login: Usuario
}