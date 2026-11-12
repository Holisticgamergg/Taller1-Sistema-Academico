export interface RegisterPersonalRequest {
    persona: PersonalData
    cedula: string
}

export interface PersonalData {
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
}