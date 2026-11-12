# 📘 Sistema de Gestión Académica - Frontend

Este proyecto es una aplicación web moderna desarrollada en **Angular 20.2.1** diseñada para la gestión integral de una institución educativa (Unidad Educativa Andalucía). El sistema permite administrar usuarios, roles, niveles académicos, materias, paralelos, asignación docente, inscripciones y evaluaciones.

## 🚀 Tecnologías Principales

*   **Framework:** Angular 20.2.1 (Standalone Components, Signals, Control Flow Syntax `@if`, `@for`).
*   **Lenguaje:** TypeScript.
*   **Estilos:** TailwindCSS + DaisyUI.
*   **Componentes UI:** Angular Material (Dialogs, Icons).
*   **Alertas:** SweetAlert2.
*   **Gestión de Estado:** Signals & Effects (Zone.js-less).
*   **Comunicación HTTP:** HttpClient con Interceptores.
*   **Backend:** Spring Boot REST API (localhost:8080).

---

## 🏛️ Arquitectura del Proyecto

El proyecto sigue una arquitectura modular basada en **Features** (Características), donde cada módulo encapsula su propia lógica, modelos, servicios y componentes.

### Estructura de Carpetas (`src/app/`)

*   **`core/`**: Elementos transversales y esenciales.
    *   `interceptors/`: Manejo de tokens (Auth) y errores globales.
    *   `services/`: Servicios globales (`AlertService`, `NotificationService`, `UserDetails`).
    *   `models/`: Modelos base (`AuthResponse`, `UserData`).
*   **`features/`**: Módulos funcionales del negocio (ver detalle abajo).
*   **`shared/`**: Componentes reutilizables (`TableComponent`, `Footer`, `Toolbar`, `Dialogs`).
*   **`environments/`**: Configuración de variables de entorno (API URL).

---

## 📦 Módulos Funcionales (Features)

### 1. 🔐 Autenticación (`auth-login`)
*   **Funcionalidad:** Inicio de sesión seguro.
*   **Características:**
    *   Validación de credenciales contra backend Spring Boot.
    *   Almacenamiento de Token JWT y datos de usuario en `SessionStorage`.
    *   Redirección basada en roles.
*   **🔄 Flujo de Datos:**
    1.  Usuario ingresa credenciales en `LoginFormComponent`.
    2.  `LoginApiService` envía POST a `/auth/login`.
    3.  Backend responde con JWT + UserData.
    4.  `UserDetails` guarda la sesión y `AuthInterceptor` intercepta futuras peticiones para inyectar el token.

### 2. 👥 Gestión de Usuarios (`users`)
*   **Funcionalidad:** CRUD completo de usuarios del sistema (Administrativos, Docentes, Estudiantes).
*   **Características:**
    *   Listado con filtros por búsqueda, tipo de personal y estado.
    *   Creación de usuarios con validación de duplicados.
    *   Edición de datos personales.
    *   Baja lógica (Deshabilitar) y Reactivación.
    *   Impresión de reportes de usuarios.
    *   **Tipos de usuario:** A (Administrativo), D (Docente), E (Estudiante).
*   **🔄 Flujo de Datos:**
    1.  `UsersMainPage` inicializa Signals (`users`, `isLoading`).
    2.  Effect dispara `UserService.getAll(filtros)`.
    3.  **Creación:** `UserFormDialog` recoge datos -> `UserService.create()` -> Backend valida unicidad -> Actualización de lista local.
    4.  **Eliminación:** `DisableUserDialog` confirma acción -> `UserService.delete()` (Soft Delete).

### 3. 🛡️ Roles y Permisos (`roles`, `usurol`, `rolme`, `menus`)
*   **Funcionalidad:** Sistema granular de control de acceso (RBAC).
*   **Módulos:**
    *   **Roles:** Definición de roles (ej: ADMIN, DOCENTE, ALUMNO).
    *   **UsuRol:** Asignación de roles a usuarios.
    *   **Menus:** Gestión dinámica de las opciones del menú lateral.
    *   **RolMe:** Asignación de menús visibles para cada rol.
*   **🔄 Flujo de Datos:**
    1.  **UsuRol:** Seleccionar Usuario -> Cargar Roles disponibles -> `UsuRolService.asignar()` -> Backend crea relación `usurol`.
    2.  **RolMe:** Seleccionar Rol -> Cargar Menús -> Checkbox Toggle -> `RolMeService.update()` -> Backend actualiza permisos.

### 4. 📚 Gestión Académica (`materias`, `niveles`, `paralelos`)
*   **Niveles:** Administración de niveles educativos (Primaria, Secundaria).
*   **Paralelos:** Gestión de divisiones de cursos (A, B, C) con filtros de estado (Todos, Bajas).
*   **Materias (Módulo Crítico):**
    *   Definición de materias (Nombre, Sigla, Nivel).
    *   **Edición de Código (PK):** Funcionalidad avanzada para cambiar la sigla de una materia y migrar todas sus relaciones históricas.
    *   **Mapa (Oferta):** Asignación de materias a paralelos por gestión.
    *   **Itemat (Evaluación):** Definición de ítems de evaluación y ponderaciones por materia.
*   **🔄 Flujo de Datos (Materias):**
    1.  `MateriasMainPage` carga lista maestra.
    2.  **Edición PK:** `MateriaFormDialog` detecta cambio de código -> `MateriaService.updateCodigo(dto)` -> Backend ejecuta transacción compleja (Migrar FKs + Borrar Old + Crear New).
    3.  **Sub-flujos:**
        *   Seleccionar Materia -> `MapaManager` carga paralelos asignados (`MapaService`).
        *   Seleccionar Materia -> `ItematManager` carga ítems de evaluación (`ItematService`).

### 5. 👨‍🏫 Asignación Docente (`dicta`) - FLUJO COMPLETO DETALLADO

**Descripción:** Módulo crítico que gestiona la asignación de profesores a clases específicas (Materia + Paralelo + Gestión). Cada asignación representa la responsabilidad de un docente sobre una materia en un paralelo durante una gestión académica.

**Archivos Principales:**
- `dicta-main-page.ts`: Listado y filtros
- `dicta-form-dialog.ts`: Formulario de asignación
- `dicta.service.ts`: Comunicación con backend
- `dicta.model.ts`: Interfaces TypeScript

#### 🗂️ Estructura de Datos (Tabla `dicta`)

**Clave Primaria Compuesta:**
```typescript
{
  codmat: string,    // Código de materia (ej: "MAT-101", "FIS-201")
  codpar: number,    // Código de paralelo (ej: 1, 2, 3)
  gestion: number,   // Año académico (ej: 2025)
  login: string      // Login del profesor (FK a usuarios)
}
```

**Campos Adicionales:**
- `estado`: 0 (Baja) | 1 (Activo)
- Campos calculados (join con otras tablas):
  - `nombreNivel`: Nombre del nivel (ej: "Primaria")
  - `nombreMateria`: Nombre completo de la materia
  - `nombreProfesor`: Nombre completo del docente
  - `nombreParalelo`: Nombre del paralelo (ej: "Paralelo A")

#### 🔄 FLUJO DE DATOS COMPLETO - CREACIÓN DE ASIGNACIÓN

**1. Pantalla Principal (`DictaMainPage`)**
```
Inicio de sesión
    ↓
DictaMainPage.ngOnInit()
    ├─ Cargar Niveles activos → NivelService.listarActivos()
    ├─ Configurar Effect reactivo (escucha cambios en filtros)
    └─ Cargar asignaciones iniciales → DictaService.getAll(filtroTexto, filtroEstado, filtroNivel)
         ↓
Backend responde con array de Dicta[]
    ├─ Cada objeto incluye datos de JOINs con:
    │   - Tabla materia → nombreMateria
    │   - Tabla persona → nombreProfesor
    │   - Tabla nivel → nombreNivel
    │   - Tabla mapa → nombreParalelo
    └─ Signal asignaciones.set(data)
         ↓
TableComponent renderiza filas con columnas:
    - Nivel, Materia, Profesor, Paralelo
    - Botones: Modificar (M), Baja (B), Habilitar (H)
```

**2. Usuario Click "Nueva Asignación"**
```
Click botón
    ↓
MatDialog.open(DictaFormDialogComponent, { data: { isEditing: false } })
    ↓
DictaFormDialogComponent.ngOnInit()
    ├─ 1. Cargar Profesores → UserService.getProfesores()
    │    └─ Filtra usuarios con tipoper = 'D' (Docentes)
    │
    ├─ 2. Cargar Clases Disponibles → cargarClasesDisponibles()
    │    ├─ a) Cargar Niveles Activos → NivelService.listarActivos()
    │    ├─ b) Cargar Todas las Materias Activas → MateriaService.getAll('', 1)
    │    └─ c) Generar Lista Combinada → generarClasesCombinadas()
    │         ↓
    │    FOR EACH materia:
    │         ├─ Consultar Paralelos asignados → MapaService.getByMateria(codmat)
    │         │    └─ Backend consulta tabla MAPA (relación materia-paralelo)
    │         │    └─ Retorna [{codmat, codpar, gestion, nombreParalelo, estado}]
    │         │
    │         ├─ FILTRAR solo mapas con estado = 1 (activos)
    │         │
    │         └─ FOR EACH mapa activo:
    │              └─ Crear objeto ClaseDisponibleExtended:
    │                   {
    │                     id: "MAT-101|2|2025",  // Separador | para evitar conflictos
    │                     codmat: "MAT-101",
    │                     codpar: 2,
    │                     gestion: 2025,
    │                     nombreNivel: "Primaria",
    │                     nombreMateria: "Matemáticas",
    │                     nombreParalelo: "Paralelo B",
    │                     displayText: "Primaria - Matemáticas - Paralelo B"
    │                   }
    │    END FOR
    │         ↓
    │    Signal clasesDisponibles.set([...todas las clases])
    │         ↓
    └─ Renderizar formulario con:
         - Select "Clase" → muestra clasesDisponibles() ordenado alfabéticamente
         - Select "Profesor" → muestra profesores()
```

**3. Usuario Selecciona Clase y Profesor**
```
Usuario selecciona:
    - Clase: "Primaria - Matemáticas - Paralelo B" (id: "MAT-101|2|2025")
    - Profesor: "Juan Pérez" (login: "juan.p")
    ↓
FormControl.value = {
    clase: "MAT-101|2|2025",
    login: "juan.p"
}
    ↓
Click "Guardar" → onSubmit()
    ↓
Validar formulario → si válido → showConfirmModal.set(true)
    ↓
Modal de confirmación muestra:
    - Nivel - Materia - Paralelo: "Primaria - Matemáticas - Paralelo B"
    - Profesor: "Juan Pérez"
    ↓
Usuario confirma → onConfirm()
```

**4. Envío al Backend**
```
onConfirm()
    ├─ Extraer valores del formulario
    ├─ Parsear ID de clase → split('|')
    │   └─ claseId = "MAT-101|2|2025"
    │   └─ [codmat, codpar, gestion] = ["MAT-101", "2", "2025"]
    │
    ├─ Construir DTO:
    │   {
    │     codmat: "MAT-101",
    │     codpar: 2,
    │     gestion: 2025,
    │     login: "juan.p"
    │   }
    │
    └─ DictaService.create(dictaDto)
         ↓
    POST http://localhost:8080/api/dicta
    Body: { codmat, codpar, gestion, login }
    Headers: { Authorization: Bearer <JWT> }
         ↓
    Backend valida:
         ├─ Existe la materia con codmat?
         ├─ Existe el paralelo en tabla mapa?
         ├─ Existe el usuario con login y es docente?
         ├─ No existe asignación duplicada (PK compuesta única)?
         ├─ Validaciones de negocio (choque de horarios, carga máxima)
         └─ Si todo OK:
              ├─ INSERT INTO dicta (codmat, codpar, gestion, login, estado)
              │   VALUES ('MAT-101', 2, 2025, 'juan.p', 1)
              └─ Retorna objeto Dicta creado con JOINs
         ↓
    Success (201):
         ├─ AlertService.showSuccess("Asignación creada correctamente")
         ├─ dialogRef.close(true)
         └─ DictaMainPage recarga lista
    ↓
    Error (400/500):
         └─ GlobalErrorInterceptor captura
              └─ AlertService.showError(mensaje del backend)
```

#### 📊 RELACIÓN CON TABLA `MAPA`

**¿Qué es la tabla MAPA?**
La tabla `mapa` es la **oferta académica**. Define qué materias están disponibles en qué paralelos para una gestión específica.

**Estructura de MAPA:**
```typescript
{
  codmat: string,      // FK a materia (ej: "MAT-101")
  codpar: number,      // FK a paralelo (ej: 2)
  gestion: number,     // Año académico (ej: 2025)
  nombreParalelo: string,  // Nombre legible (ej: "Paralelo B")
  estado: number       // 0 (Baja) | 1 (Activo)
}
```

**Flujo de Creación de MAPA (en módulo Materias):**
```
MateriasMainPage → Seleccionar Materia → MapaManager
    ↓
Administrador asigna paralelos a la materia:
    - Materia: "Matemáticas" (MAT-101)
    - Paralelos disponibles: [A, B, C] (códigos 1, 2, 3)
    ↓
Seleccionar checkboxes → Submit
    ↓
MapaService.create({ codmat: "MAT-101", codpar: 2 })
    ↓
Backend crea registro en MAPA:
    INSERT INTO mapa (codmat, codpar, gestion, estado)
    VALUES ('MAT-101', 2, 2025, 1)
```

**¿Cómo se usa MAPA en DICTA?**
```
Cuando se crea una asignación docente:
    1. Frontend consulta MapaService.getByMateria("MAT-101")
    2. Backend retorna paralelos asignados a esa materia: [1, 2, 3]
    3. Frontend muestra solo esas opciones en el selector
    4. Usuario elige Paralelo B (codpar=2)
    5. Se crea el registro en DICTA con esos valores
```

**Filtro de Paralelos Activos:**
```typescript
// En dicta-form-dialog.ts
const mapasActivos = mapas.filter(mapa => mapa.estado === 1);
```
Solo los paralelos con `estado = 1` en MAPA aparecen como opciones en el formulario de DICTA.

#### 🔄 FLUJO DE EDICIÓN

**Diferencia clave:** Al editar, el campo "Clase" se deshabilita (no se puede cambiar la materia/paralelo), solo se puede cambiar el profesor asignado.

```
Click "Modificar" en tabla
    ↓
MatDialog.open(DictaFormDialogComponent, {
    data: { isEditing: true, asignacion: dictaSeleccionada }
})
    ↓
ngOnInit() detecta modo edición:
    ├─ Cargar clases disponibles (igual que creación)
    ├─ Construir ID de clase actual:
    │   claseId = `${codmat}|${codpar}|${gestion}`
    │   Ejemplo: "MAT-101|2|2025"
    │
    └─ Precargar formulario:
        dictaForm.patchValue({
            clase: "MAT-101|2|2025",  // Precargado
            login: "juan.p"            // Precargado
        })
    ↓
HTML: <select formControlName="clase" [disabled]="isEditing">
    └─ Campo deshabilitado en UI pero valor se mantiene
    ↓
Usuario cambia profesor → Guarda
    ↓
onConfirm():
    ├─ Detecta isEditing = true
    └─ DictaService.update(codmatOriginal, codparOriginal, gestionOriginal, loginOriginal, nuevoDictaDto)
         ↓
    PUT /api/dicta/{codmat}/{codpar}/{gestion}/{login}
    Body: { codmat, codpar, gestion, login: nuevoLogin }
         ↓
    Backend:
         ├─ DELETE FROM dicta WHERE codmat=X AND codpar=Y AND gestion=Z AND login=OLD
         └─ INSERT INTO dicta (codmat, codpar, gestion, login, estado) VALUES (X, Y, Z, NEW, 1)
```

#### 🗑️ FLUJO DE ELIMINACIÓN (FÍSICA)

```
Click "Baja" (B) en tabla
    ↓
MatDialog.open(DisableDictaDialogComponent, { data: dictaSeleccionada })
    ↓
Usuario confirma eliminación
    ↓
DictaService.delete(codmat, codpar, gestion, login)
    ↓
DELETE /api/dicta?codmat=MAT-101&codpar=2&gestion=2025&login=juan.p
    ↓
Backend ejecuta:
    DELETE FROM dicta
    WHERE codmat = 'MAT-101'
      AND codpar = 2
      AND gestion = 2025
      AND login = 'juan.p'
    ↓
Success: Registro eliminado permanentemente
    ↓
Frontend recarga lista → fila desaparece
```

**Nota:** Las eliminaciones en DICTA son **físicas** (DELETE real), no lógicas. El campo `estado` existe pero actualmente se usa filtrado por estado 0 (Bajas) o 2 (Todos).

#### 🔍 FILTROS Y BÚSQUEDA

**Filtros disponibles:**
1. **Búsqueda por texto:** Filtra por nombre de materia o profesor
2. **Filtro por Nivel:** Dropdown con niveles (Primaria, Secundaria)
3. **Filtro por Estado:** Radios (Todos, Bajas)

**Implementación reactiva:**
```typescript
// Effect observa cambios en signals
effect(() => {
  const texto = this.filtroTexto();
  const estado = this.filtroEstado();  // 0=Bajas, 2=Todos
  const nivel = this.filtroNivel();
  
  this.cargarAsignaciones(texto, estado, nivel);
});

// Servicio construye HttpParams dinámicamente
getAll(filtro: string, estado: number, codn?: number): Observable<Dicta[]> {
  let params = new HttpParams()
    .set('filtro', filtro)
    .set('estado', estado.toString());
  
  if (codn !== undefined) {
    params = params.set('codn', codn.toString());
  }
  
  return this.http.get<Dicta[]>(this.apiUrl, { params });
}
```

**Backend procesa filtros:**
```sql
SELECT d.*, m.nombre as nombreMateria, p.nombre as nombreProfesor, ...
FROM dicta d
JOIN materia m ON d.codmat = m.codmat
JOIN persona p ON d.login = p.login
WHERE (m.nombre LIKE %filtro% OR p.nombre LIKE %filtro%)
  AND (estado = :estado OR :estado = 2)
  AND (m.codn = :codn OR :codn IS NULL)
```

---

### 6. 📝 Inscripciones de Estudiantes (`progra`) - FLUJO COMPLETO DETALLADO

**Descripción:** Módulo que gestiona la inscripción de alumnos a niveles educativos, con asignación automática a todas las materias de ese nivel. Cada inscripción representa un estudiante matriculado en una materia específica de un paralelo durante una gestión.

**Archivos Principales:**
- `progra-main-page.ts`: Listado y filtros
- `progra-form-dialog.ts`: Formulario de inscripción masiva
- `progra.service.ts`: Comunicación con backend
- `progra.model.ts`: Interfaces TypeScript

#### 🗂️ Estructura de Datos (Tabla `progra`)

**Clave Primaria Compuesta:**
```typescript
{
  codmat: string,    // Código de materia (ej: "MAT-101")
  codpar: number,    // Código de paralelo (ej: 2)
  gestion: number,   // Año académico (ej: 2025)
  codp: number       // Código de persona (estudiante) - FK
}
```

**Campos Adicionales:**
- `login`: Login del profesor (opcional, legacy)
- `estado`: 0 (Baja) | 1 (Activo)
- Campos calculados (joins):
  - `nombreNivel`: Nivel académico
  - `nombreMateria`: Nombre de la materia
  - `nombreAlumno`: Nombre completo del estudiante
  - `nombreParalelo`: Nombre del paralelo

#### 🔄 FLUJO DE DATOS COMPLETO - INSCRIPCIÓN MASIVA POR NIVEL

**CAMBIO IMPORTANTE (Última Actualización):**
El formulario de inscripción fue **simplificado** para inscribir a un alumno en **todas las materias de un nivel** automáticamente, en lugar de inscripciones individuales por materia.

**1. Pantalla Principal (`PrograMainPage`)**
```
Inicio
    ↓
PrograMainPage.constructor()
    ├─ Cargar Niveles → NivelService.listarActivos()
    └─ Effect reactivo (observa filtros)
         ↓
    effect(() => {
        const texto = this.filtroTexto();
        const estado = this.filtroEstado();  // 0=Bajas, 2=Todos
        const nivel = this.filtroNivel();
        
        this.cargarInscripciones(texto, estado, nivel);
    });
         ↓
PrograService.getAll(searchTerm, estado, codn)
    ↓
GET /api/progra?search={texto}&estado={estado}&codn={nivel}
    ↓
Backend ejecuta query con JOINs:
    SELECT p.*, m.nombre as nombreMateria, per.nombre as nombreAlumno, ...
    FROM progra p
    JOIN materia m ON p.codmat = m.codmat
    JOIN persona per ON p.codp = per.codp
    WHERE (m.nombre LIKE %search% OR per.nombre LIKE %search%)
      AND (p.estado = :estado OR :estado = 2)
      AND (m.codn = :codn OR :codn IS NULL)
    ↓
Frontend recibe Progra[] → Signal inscripciones.set(data)
    ↓
TableComponent renderiza:
    - Columnas: Nivel, Materia, Alumno, Paralelo
    - SIN columnas de acciones (Estado, M, B, H eliminadas)
```

**2. Usuario Click "Nueva Inscripción"**
```
Click botón
    ↓
MatDialog.open(PrograFormDialogComponent, { data: { isEdit: false } })
    ↓
PrograFormDialogComponent.ngOnInit()
    ├─ 1. Cargar Niveles Activos → NivelService.listarActivos()
    │
    ├─ 2. Cargar Todas las Materias → MateriaService.getAll('', 1)
    │    └─ Se usa internamente para generar inscripciones
    │
    └─ 3. Cargar Estudiantes → PrograService.getEstudiantes()
         ├─ Backend filtra personas con tipoper = 'E'
         └─ Frontend mapea: nombreCompleto = `${nombre} ${ap} ${am}`
         ↓
Renderizar formulario SIMPLIFICADO:
    - Select "Nivel" → niveles activos
    - Select "Alumno" → estudiantes con nombre completo
    
    [YA NO SE MUESTRAN:]
    ❌ Select Materia
    ❌ Select Paralelo
```

**3. Usuario Selecciona Nivel y Alumno**
```
Usuario selecciona:
    - Nivel: "Primaria" (codn: 1)
    - Alumno: "María López" (codp: 12345)
    ↓
FormControl.value = {
    codn: 1,
    codp: 12345
}
    ↓
Click "Guardar" → onSubmit()
    ↓
Validar formulario → showConfirmModal.set(true)
    ↓
Modal de confirmación muestra:
    - Nivel: "Primaria"
    - Alumno: "María López"
    - Mensaje: "El alumno será inscrito en TODAS las materias del nivel seleccionado. ¿Desea continuar?"
    ↓
Usuario confirma → onConfirm()
```

**4. Procesamiento Masivo (Frontend)**
```
async onConfirm() {
    const codn = +formValue.codn;  // Código del nivel (1)
    const codp = +formValue.codp;  // Código del alumno (12345)
    
    // 1. Filtrar materias del nivel seleccionado
    const materiasDelNivel = this.todasLasMaterias().filter(m => m.codn === codn);
    // Ejemplo resultado: [
    //   { codmat: "MAT-101", nombre: "Matemáticas", codn: 1 },
    //   { codmat: "LEN-101", nombre: "Lenguaje", codn: 1 },
    //   { codmat: "CS-101", nombre: "Ciencias Sociales", codn: 1 }
    // ]
    
    if (materiasDelNivel.length === 0) {
        AlertService.showError("No hay materias disponibles para este nivel");
        return;
    }
    
    // 2. Para cada materia, obtener paralelos disponibles
    let inscripcionesCreadas = 0;
    let errores = 0;
    
    for (const materia of materiasDelNivel) {
        // 2.1 Consultar paralelos asignados a esta materia
        const mapas = await MapaService.getByMateria(materia.codmat).toPromise();
        // Backend retorna: [{ codmat: "MAT-101", codpar: 1, gestion: 2025, estado: 1 }, ...]
        
        if (mapas && mapas.length > 0) {
            // 2.2 Inscribir en el PRIMER paralelo disponible
            const primerParalelo = mapas[0];
            
            const prograDto = {
                codmat: materia.codmat,        // "MAT-101"
                codpar: primerParalelo.codpar, // 1
                gestion: 2025,                 // Año actual
                codp: codp,                    // 12345
                login: ''                      // Campo legacy vacío
            };
            
            // 2.3 Enviar al backend
            try {
                await PrograService.create(prograDto).toPromise();
                inscripcionesCreadas++;
            } catch (error) {
                console.error(`Error inscribiendo en ${materia.codmat}:`, error);
                errores++;
            }
        }
    }
    
    // 3. Mostrar resultado
    if (inscripcionesCreadas > 0) {
        AlertService.showSuccess(
            `Alumno inscrito exitosamente en ${inscripcionesCreadas} materia(s)` +
            (errores > 0 ? `. ${errores} inscripción(es) fallaron.` : '')
        );
        dialogRef.close(true);
    } else {
        AlertService.showError("No se pudo crear ninguna inscripción");
    }
}
```

**5. Backend Procesa Cada Inscripción**
```
Para cada materia (MAT-101, LEN-101, CS-101):
    ↓
POST /api/progra
Body: {
    codmat: "MAT-101",
    codpar: 1,
    gestion: 2025,
    codp: 12345,
    login: ""
}
    ↓
Backend valida:
    ├─ Existe la materia?
    ├─ Existe el paralelo en MAPA?
    ├─ Existe el estudiante (codp)?
    ├─ No hay inscripción duplicada? (PK única)
    └─ Validaciones de negocio (cupos, prerequisitos)
         ↓
Si OK:
    INSERT INTO progra (codmat, codpar, gestion, codp, login, estado)
    VALUES ('MAT-101', 1, 2025, 12345, '', 1)
         ↓
Retorna Progra creado
    ↓
Frontend acumula éxitos y errores
    ↓
Muestra mensaje final con totales
```

#### 📊 RESULTADO FINAL EN LA TABLA

Después de inscribir a "María López" en "Primaria", la tabla `progra` tendrá:

| codmat | codpar | gestion | codp | nombreMateria | nombreAlumno | nombreParalelo |
|--------|--------|---------|------|---------------|--------------|----------------|
| MAT-101 | 1 | 2025 | 12345 | Matemáticas | María López | Paralelo A |
| LEN-101 | 1 | 2025 | 12345 | Lenguaje | María López | Paralelo A |
| CS-101 | 1 | 2025 | 12345 | Ciencias Sociales | María López | Paralelo A |

**Ventajas del Nuevo Enfoque:**
- ✅ Inscripción masiva en un solo paso
- ✅ Menos clicks para el usuario
- ✅ Consistencia: todos los alumnos de un nivel en el mismo paralelo base
- ✅ Simplifica el formulario

#### 🔍 FILTROS Y BÚSQUEDA

**Filtros disponibles:**
1. **Búsqueda por texto:** Nombre de alumno o materia
2. **Filtro por Nivel:** Dropdown de niveles
3. **Filtro por Estado:** Radios (Todos, Bajas)

**Implementación:**
```typescript
effect(() => {
  const texto = this.filtroTexto();
  const estado = this.filtroEstado();  // 0=Bajas, 2=Todos
  const nivel = this.filtroNivel();
  
  this.cargarInscripciones(texto, estado, nivel);
});
```

**Backend Query:**
```sql
SELECT p.*, m.nombre as nombreMateria, per.nombre || ' ' || per.ap as nombreAlumno
FROM progra p
JOIN materia m ON p.codmat = m.codmat
JOIN persona per ON p.codp = per.codp
WHERE (m.nombre LIKE %:texto% OR per.nombre LIKE %:texto%)
  AND (p.estado = :estado OR :estado = 2)
  AND (m.codn = :nivel OR :nivel IS NULL)
ORDER BY per.nombre, m.nombre
```

#### 🗑️ SIN OPERACIONES DE EDICIÓN/ELIMINACIÓN

**Decisión de Diseño (Última Actualización):**
Las inscripciones en `progra` **NO tienen botones de acciones** (Modificar, Baja, Habilitar) en la tabla.

**Razón:** Para modificar inscripciones, el proceso es:
1. Dar de baja al estudiante del nivel completo (backend batch)
2. Reinscribirlo con los cambios necesarios

**Código relevante:**
```typescript
// progra-list-page.ts
columns: TableInterface[] = [
  { columnDef: 'nombreNivel', header: 'Nivel', cell: (row) => row.nombreNivel },
  { columnDef: 'nombreMateria', header: 'Materia', cell: (row) => row.nombreMateria },
  { columnDef: 'nombreAlumno', header: 'Alumno', cell: (row) => row.nombreAlumno },
  { columnDef: 'nombreParalelo', header: 'Paralelo', cell: (row) => row.nombreParalelo }
  // SIN columnas de estado ni acciones
];
```

#### 🔗 RELACIÓN CON TABLA `MAPA` EN PROGRA

**Uso de MAPA:**
```
Al inscribir a un alumno:
    1. Frontend filtra materias por nivel (codn)
    2. Para cada materia, consulta MapaService.getByMateria(codmat)
    3. Backend retorna paralelos disponibles de esa materia
    4. Frontend selecciona el PRIMER paralelo del array
    5. Crea inscripción con ese codpar
```

**Ejemplo:**
```typescript
// Materia: Matemáticas (MAT-101)
MapaService.getByMateria("MAT-101") →
[
  { codmat: "MAT-101", codpar: 1, gestion: 2025, nombreParalelo: "Paralelo A", estado: 1 },
  { codmat: "MAT-101", codpar: 2, gestion: 2025, nombreParalelo: "Paralelo B", estado: 1 }
]

// Se usa mapas[0]:
prograDto = {
  codmat: "MAT-101",
  codpar: 1,  // Primer paralelo
  gestion: 2025,
  codp: 12345
}
```

---

### 7. 📊 Banco de Ítems (`items`)
*   **Funcionalidad:** Catálogo global de tipos de evaluación (Examen, Práctica, Laboratorio).
*   **Uso:** Estos ítems se utilizan luego en el módulo de Materias para definir la ponderación.
*   **🔄 Flujo de Datos:**
    1.  CRUD simple: `ItemService` gestiona la tabla `item` (código, nombre).
    2.  Estos datos alimentan los selectores en `ItematManager` (Módulo Materias).

---

## 🛠️ Características Técnicas Destacadas

### 🔄 Manejo de Errores Global
Implementación de un `GlobalErrorInterceptor` que captura errores HTTP (401, 403, 404, 500) y muestra alertas visuales amigables usando **SweetAlert2** a través del `AlertService`, evitando que la aplicación se rompa silenciosamente.

### 🖨️ Sistema de Reportes
Generación de reportes en HTML imprimible directamente desde el navegador para:
*   Listas de usuarios.
*   Listas de inscritos.
*   Boletas de inscripción individuales.
*   Cargas horarias docentes.

### ⚡ Reactividad con Signals
Uso extensivo de **Angular Signals** para el manejo del estado de los componentes, reduciendo la necesidad de `Zone.js` y mejorando el rendimiento en la detección de cambios.

### 🎨 UI/UX Consistente
*   Diseño unificado con TailwindCSS.
*   Feedback visual de carga (`isLoading`).
*   Diálogos modales para todas las operaciones de escritura (Crear, Editar, Eliminar).
*   Validaciones de formularios reactivos en tiempo real.

---

## 🎨 Estilos y Paleta de Colores

### Colores Corporativos
| Color | Código Hex | Uso |
|-------|-----------|-----|
| **Verde Primario** | `#007A5E` | Botones de acción, headers, elementos destacados |
| **Verde Oscuro** | `#00624b` | Hover en botones, efectos secundarios |
| **Azul Marino** | `#0A1C2C` | Textos principales, títulos, fondos oscuros |
| **Gris Claro** | `#f8fafc`, `#e2e8f0` | Fondos de formularios, separadores |
| **Rojo de Alerta** | `#dc2626` | Estados inactivos, eliminación, errores |
| **Verde de Éxito** | `#007A5E` | Confirmaciones, estados activos |

### Framework de Estilos
*   **TailwindCSS:** Utilidades CSS para construcción rápida de layouts responsivos.
*   **DaisyUI:** Componentes pre-diseñados (botones, inputs, selects, modales) basados en Tailwind.
*   **Angular Material:** Diálogos modales (`MatDialog`) e iconos (`MatIcon`).
*   **Custom CSS:** Archivos `.css` por componente para estilos específicos.

### Componentes Visuales Reutilizables
*   **Botones:** `btn bg-[#007A5E] hover:bg-[#00624b]` (Acción) | `btn btn-error` (Peligro)
*   **Input/Select:** `input input-bordered` | `select select-bordered`
*   **Tabla:** `TableComponent` con headers oscuros, filas alternadas, acciones contextsuales.
*   **Diálogos:** Centrados, con padding consistente, botones alineados.
*   **Cards:** Sombra suave (`shadow-md`), borde redondeado (`rounded-lg`), fondo blanco.

---

## 📖 Información Detallada de Módulos

### 1. 🔐 Autenticación (`auth-login`)
**Archivos:** `login-form.component.ts`, `login-api.service.ts`

#### Funcionalidad Completa
El módulo de autenticación es la puerta de entrada del sistema. Valida credenciales contra el backend y establece una sesión segura.

#### Características Detalladas
*   **Validación de Credenciales:** Input de usuario/email y contraseña con validación en tiempo real.
*   **Almacenamiento Seguro:** Token JWT almacenado en `sessionStorage` (no persiste al cerrar navegador, mejora seguridad).
*   **Manejo de Errores:** Captura de códigos HTTP específicos (401, 403) y mensajes legibles al usuario.
*   **Redirección Inteligente:** Redirige a dashboard según el rol del usuario logueado.

#### Flujo de Datos Detallado
```
Usuario ingresa credenciales (usuario, contraseña)
         ↓
LoginFormComponent valida formato básico
         ↓
LoginApiService.login(credenciales) → POST /auth/login
         ↓
Backend valida contra BD
         ↓
Si exitoso: Responde con {token, usuario, roles}
Si falla: Error 401 (Credenciales inválidas)
         ↓
UserDetails.setAuth() almacena en sessionStorage
         ↓
AuthInterceptor intercepta futuras peticiones e inyecta token en header Authorization
```

#### Componentes Involucrados
*   `LoginFormComponent`: Formulario reactivo con validaciones.
*   `LoginApiService`: Comunicación HTTP.
*   `UserDetails`: Gestor de sesión global.
*   `AuthInterceptor`: Inyección automática de token.

---

### 2. 👥 Gestión de Usuarios (`users`)
**Archivos:** `users-main-page.ts`, `user.service.ts`, Diálogos (`register-form-dialog`, `modif-user-form-dialog`)

#### Funcionalidad Completa
CRUD integral de usuarios con soporte para tres tipos: Administrativos, Públicos y Estudiantes. Incluye edición de datos personales y baja lógica.

#### Características Detalladas
*   **Listado Filtrado:** Búsqueda por nombre/login, tipo de personal (A/P/E), estado (Activo/Inactivo).
*   **Creación con Validación:** Formularios reactivos con validación de cédula única, campos obligatorios.
*   **Edición de Datos:** Modificación de información personal (nombre, teléfono, dirección, género).
*   **Baja Lógica (Soft Delete):** No elimina físicamente; marca como inactivo.
*   **Reactivación:** Los usuarios inactivos pueden ser reactivados.
*   **Reportes:** Generación de listados imprimibles en HTML.

#### Flujo de Datos Detallado
```
Pantalla Principal (UsersMainPage)
  ├─ Signal: users[] (lista), filtroTexto, filtroTipo, filtroEstado
  └─ Effect: observa cambios en filtros → UserService.getAll(filtros) → actualiza users[]

Crear Usuario:
  └─ Click "Nuevo Personal" → RegisterFormDialog
       ├─ Inputs: cédula, nombre, apellidos, teléfono, tipo (A/P/E)
       └─ Submit → UserService.create(userDto)
            └─ POST /api/users → Backend valida cédula única
                 └─ Success: AlertService.showSuccess() → Recargar lista
                 └─ Error: GlobalErrorInterceptor captura → AlertService.showError()

Editar Usuario:
  └─ Click Editar fila → ModifUserFormDialog
       ├─ Precarga datos del usuario seleccionado
       └─ Submit → UserService.update(userId, userDto)

Eliminar Usuario:
  └─ Click Eliminar → DisableUserDialog
       └─ Confirmar → UserService.delete(userId)
            └─ Backend: UPDATE users SET estado=0 WHERE id=?
```

#### Entidades de Datos
```typescript
interface User {
  login: string;              // Cédula (Clave Primaria)
  email?: string;
  persona: Persona;           // Relación 1:1 con Persona
  estado: number;             // 1=Activo, 0=Inactivo
  tipo: string;               // 'A'=Admin, 'P'=Público, 'E'=Estudiante
}

interface Persona {
  nombre: string;
  ap: string;                 // Apellido Paterno
  am: string;                 // Apellido Materno
  fnac: Date;                 // Fecha de Nacimiento
  genero: string;             // 'M'=Masculino, 'F'=Femenino
  direc: string;              // Dirección
  telf: string;               // Teléfono
  ecivil: string;             // 'S'=Soltero, 'C'=Casado, 'D'=Divorciado
}
```

---

### 3. 🛡️ Roles y Permisos (RBAC)
**Módulos:** `roles`, `usurol`, `rolme`, `menus`

#### Funcionalidad Completa
Sistema granular de control de acceso donde se definen roles, se asignan a usuarios, y se configura qué menús ve cada rol.

#### Características Detalladas por Submódulo

**Roles:**
*   Definición de roles jerárquicos (ADMIN, DOCENTE, ALUMNO, etc.).
*   Cada rol representa un conjunto de permisos implícitos.

**UsuRol (Asignación de Roles a Usuarios):**
*   Un usuario puede tener múltiples roles.
*   Sincronización con el backend en tiempo real.
*   Interfaz de checkbox o drag-drop.

**Menus:**
*   Menús del sistema definibles dinámicamente.
*   Cada menú corresponde a un módulo (Usuarios, Materias, etc.).

**RolMe (Asignación de Menús a Roles):**
*   Define qué menús ve cada rol en la barra lateral.
*   Un menú puede estar visible para múltiples roles.

#### Flujo de Datos Detallado
```
Asignar Rol a Usuario:
  └─ Seleccionar Usuario en UsuRolPage
       ├─ Cargar Roles disponibles: RolService.getAll()
       └─ Checkear/Desmarcar roles
            └─ Submit → UsuRolService.asignarRoles(userId, roleIds[])
                 └─ POST /api/usurol → Backend crea entradas en tabla usurol

Configurar Menús por Rol:
  └─ Seleccionar Rol en RolMePage
       ├─ Cargar Menús: MenuService.getAll()
       └─ Toggle visibilidad de menús (Checkboxes)
            └─ Submit → RolMeService.updatePermisos(roleId, menuIds[])
                 └─ PUT /api/rolme → Backend actualiza relaciones
```

#### Entidades Clave
```typescript
interface Rol {
  codRol: string;             // 'ADMIN', 'DOCENTE', 'ALUMNO'
  descripcion: string;
  estado: number;
}

interface UsuRol {
  id: { login: string; codRol: string };  // Clave compuesta
  usuario: User;
  rol: Rol;
}

interface Menu {
  codMenu: string;            // 'usuarios', 'materias', 'dicta'
  nombre: string;
  ruta: string;               // '/usuarios', '/materias'
  icono: string;              // Material Icon
}

interface RolMe {
  id: { codRol: string; codMenu: string };
  rol: Rol;
  menu: Menu;
}
```

---

### 4. 📚 Gestión Académica (`materias`, `niveles`, `paralelos`)

#### 4.1 Niveles (`niveles`)
**Archivos:** `nivel.service.ts`, `niveles-main-page.ts`

**Características:**
*   CRUD básico de niveles educativos (Primaria, Secundaria, Técnico).
*   Sin dependencias críticas (otros módulos dependen de niveles, pero no viceversa).

**Flujo:**
```
Crear Nivel → NivelFormDialog → NivelService.create({nombre, codn})
Usar en: Filtros de Materias, Paralelos, Inscripciones
```

---

#### 4.2 Paralelos (`paralelos`)
**Archivos:** `paralelo.service.ts`, `paralelos-main-page.ts`

**Características:**
*   Gestión de divisiones de cursos (A, B, C, ...).
*   Filtros por búsqueda y estado (Activo/Inactivo/Todos).
*   Estados: Activo (1) | Inactivo (0) | Todos (2).

**Entidad:**
```typescript
interface Paralelo {
  codpar: number;             // ID único
  nombre: string;             // 'A', 'B', 'C'
  estado: number;             // 1=Activo, 0=Inactivo
  nivel?: Nivel;              // Relación opcional
}
```

**Flujo de Datos:**
```
ParalelosMainPage
  ├─ Signals: paralelos[], filtroNombre, filtroEstado
  ├─ Effect: filtroEstado.value → ParaleloService.getAll(nombre, estado)
  │    └─ Si estado=2: Sin parámetro (backend devuelve todos)
  │    └─ Si estado=0 o 1: Con parámetro estado
  └─ Actualiza lista en tiempo real

Problema Conocido:
  → El filtro de estado no funciona correctamente (investigación en curso)
  → Solución: Verificar que backend reciba parámetro 'estado' correctamente
```

---

#### 4.3 Materias (Módulo Crítico) (`materias`)
**Archivos:** `materia.service.ts`, `materias-main-page.ts`, Componentes: `itemat-manager`, `mapa-manager`

**Características Principales:**
*   Definición de asignaturas (Nombre, Sigla/Código, Nivel).
*   **Edición Avanzada de Código (PK):** Cambio de sigla con migración de todas las relaciones.
*   **Mapa (Oferta Académica):** Asignación de materias a paralelos por gestión.
*   **Itemat (Ponderación de Evaluación):** Definición de ítems de evaluación y pesos.

**Entidades:**
```typescript
interface Materia {
  codmat: string;             // Clave Primaria (Ej: 'MAT-101')
  nombre: string;
  codn: number;               // FK a Nivel
  estado: number;             // 1=Activo, 0=Inactivo
}

interface UpdateCodigoMateriaDto {
  oldCodmat: string;
  newCodmat: string;
  nombre: string;
  codn: number;
}

interface Mapa {
  codmat: string;             // Clave compuesta
  codpar: number;             // Clave compuesta
  gestion: number;
  nombreParalelo?: string;    // Denormalizado
  estado: number;
}

interface Itemat {
  codmat: string;             // Clave compuesta
  codi: number;               // Clave compuesta (FK a Item)
  ponderacion: number;        // Peso en evaluación (0-100)
  nombreItem?: string;        // Denormalizado
  estado: number;
}
```

**Flujo de Datos Completo:**
```
MateriasMainPage (Maestro)
  ├─ Signals: materias[], materiaSeleccionada, vistaDetalle ('NINGUNA'|'PARALELOS'|'ITEMS')
  └─ Tabla con acciones: Editar, Eliminar, Ver Paralelos, Ver Items
       ├─ Seleccionar Materia → vistaDetalle='PARALELOS'
       │    └─ MapaManager carga: MapaService.getByMateria(codmat)
       │         ├─ Muestra paralelos asignados a esta materia
       │         └─ Opciones: Agregar paralelo, Eliminar asignación
       │
       └─ Seleccionar Materia → vistaDetalle='ITEMS'
            └─ ItematManager carga: ItematService.getByMateria(codmat)
                 ├─ Muestra ítems de evaluación y sus pesos
                 └─ Opciones: Agregar ítem, Editar ponderación, Eliminar

OPERACIÓN CRÍTICA: Edición de Código (PK)
  └─ Click Editar en MateriaFormDialog
       ├─ Detecta si codmat cambió
       │    └─ if (codmat.old !== codmat.new) {
       │         └─ MateriaService.updateCodigo(UpdateCodigoMateriaDto)
       │              └─ PUT /api/materias/cambiar-codigo
       │                   └─ Backend ejecuta transacción:
       │                        1. INSERT INTO materia (codmat_new, nombre, codn)
       │                        2. UPDATE paralelo SET codmat=codmat_new WHERE codmat=codmat_old
       │                        3. UPDATE dicta SET codmat=codmat_new WHERE codmat=codmat_old
       │                        4. UPDATE progra SET codmat=codmat_new WHERE codmat=codmat_old
       │                        5. UPDATE itemat SET codmat=codmat_new WHERE codmat=codmat_old
       │                        6. DELETE FROM materia WHERE codmat=codmat_old
       └─ Frontend muestra advertencia: "El código cambiará de X a Y"
```

---

### 5. 👨‍🏫 Asignación Docente (`dicta`)
**Archivos:** `dicta.service.ts`, `dicta-main-page.ts`, `dicta-form-dialog.ts`

**Características:**
*   Asignación de docentes a materias en paralelos específicos.
*   Validación de no-choque (un profesor no puede estar en dos lugares simultáneamente).
*   Búsqueda de docentes y filtrado avanzado.
*   Historial por gestión académica.

**Entidad:**
```typescript
interface Dicta {
  codmat: string;             // Clave compuesta
  codpar: number;             // Clave compuesta
  gestion: number;            // Clave compuesta
  login: string;              // Clave compuesta (FK a Usuario)
  estado: number;             // 1=Activo, 0=Inactivo
  
  // Denormalizados para visualización
  nombreNivel?: string;
  nombreMateria?: string;
  nombreProfesor?: string;
  nombreParalelo?: string;
}
```

**Flujo de Datos:**
```
DictaMainPage
  ├─ Carga lista de asignaciones vigentes
  ├─ Filtros: texto (materia/profesor), nivel, estado
  │
  └─ Nueva Asignación:
       └─ DictaFormDialog
            ├─ Select Nivel → Filtra materias (MateriaService)
            ├─ Select Materia → Filtra paralelos (MapaService.getByMateria)
            ├─ Select Paralelo → Búsqueda Docente (UserService)
            └─ Submit → DictaService.create(DictaCreateDto)
                 └─ POST /api/dicta → Backend valida disponibilidad
                      └─ Si hay choque: Error 409 (Conflict)
                      └─ Si OK: Crea dicta, AlertService.showSuccess()
```

---

### 6. 📝 Inscripciones (`progra`)
**Archivos:** `progra.service.ts`, `progra-main-page.ts`, `progra-form-dialog.ts`

**Características:**
*   Matriculación de estudiantes a materias.
*   Filtros por Nivel, Materia, Estado.
*   Reportes individuales y listas de curso.
*   Validación de cupos y cruces de materias.

**Entidad:**
```typescript
interface Progra {
  codmat: string;             // Clave compuesta
  codpar: number;             // Clave compuesta
  gestion: number;            // Clave compuesta
  codp: number;               // Clave compuesta (FK a Persona/Estudiante)
  estado: string;             // 'A'=Activa, 'I'=Inactiva
  
  // Denormalizados
  nombreNivel?: string;
  nombreMateria?: string;
  nombreAlumno?: string;
  nombreParalelo?: string;
}
```

**Flujo de Datos:**
```
PrograMainPage
  ├─ Signals: inscripciones[], filtroTexto, filtroNivel, filtroEstado
  ├─ Filters en grid de 3 columnas
  │    ├─ Búsqueda libre
  │    ├─ Dropdown Nivel (filtra dinámicamente)
  │    └─ Dropdown Estado
  │
  └─ Nueva Inscripción:
       └─ PrograFormDialog
            ├─ Search Estudiante (búsqueda por nombre/cédula)
            ├─ Select Nivel → Filtra materias disponibles
            ├─ Select Materia → Filtra paralelos (via Mapa)
            ├─ Select Paralelo
            └─ Submit → PrograService.create(PrograCreateDto)
                 └─ POST /api/progra → Backend valida:
                      ├─ ¿Estudiante existe?
                      ├─ ¿Paralelo existe?
                      ├─ ¿Ya inscrito? (Evita duplicados)
                      └─ Si todo OK: Crea progra, muestra éxito
```

**Reportes:**
```
Print Inscripción Individual:
  └─ Genera HTML con datos de la inscripción seleccionada
       ├─ Datos del alumno (nombre, código, información personal)
       ├─ Datos de la inscripción (materia, paralelo, nivel, gestión)
       └─ Botón Imprimir abre PrintDialog del navegador

Print Lista de Inscripciones:
  └─ Tabla HTML con todas las inscripciones (filtradas)
       ├─ Columnas: Nivel, Materia, Alumno, Paralelo, Gestión, Estado
       ├─ Resumen: Total de inscripciones
       └─ Headers corporativos con branding
```

---

### 7. 📊 Banco de Ítems (`items`)
**Archivos:** `item.service.ts`, `items-main-page.ts`

**Características:**
*   CRUD de tipos de evaluación globales.
*   Catálogo reutilizable en el módulo de Materias.
*   Ejemplos: "Examen Final", "Prácticas", "Laboratorio", "Asistencia".

**Entidad:**
```typescript
interface Item {
  codi: number;               // ID único
  nombre: string;             // "Examen Final", "Prácticas", etc.
  estado: number;             // 1=Activo, 0=Inactivo
}
```

**Flujo:**
```
ItemsMainPage → CRUD simple
  ├─ Crear Item: ItemFormDialog → ItemService.create()
  ├─ Editar Item: Inline o Dialog
  └─ Eliminar Item: Soft Delete (estado=0)

Uso en Materias:
  └─ ItematManager (dentro de MateriasMainPage)
       └─ Dropdown de Items cargado desde ItemService.getAll(estado=1)
            └─ Usuario selecciona items y define ponderación
```

---

## 🚀 Instalación y Ejecución

1.  **Requisitos:** Node.js (v18+), Angular CLI (v18+).
2.  **Instalar dependencias:**
    ```bash
    npm install
    ```
3.  **Ejecutar en desarrollo:**
    ```bash
    ng serve -o
    ```
4.  **Configuración:**
    Verificar `src/environments/environment.ts` para apuntar al backend correcto (por defecto `http://localhost:8080/`).

---

## 🤝 Contribución
Este frontend está diseñado para trabajar en conjunto con un backend **Spring Boot**. Cualquier cambio en los modelos de datos (DTOs) debe reflejarse en ambos lados para mantener la integridad.

---

## ❓ PREGUNTAS FRECUENTES (FAQ)

### 1. ¿De dónde sale la tabla `MAPA`? ¿Qué función cumple?

**Respuesta Técnica:**

La tabla `MAPA` es una **tabla de relación many-to-many** (muchos a muchos) que conecta las tablas `materia` y `paralelo`, agregando la dimensión temporal de `gestion` (año académico). Su función es definir la **oferta académica**.

**Estructura:**
```sql
CREATE TABLE mapa (
    codmat VARCHAR(20),      -- FK a tabla materia
    codpar INT,              -- FK a tabla paralelo
    gestion INT,             -- Año académico (ej: 2025)
    nombreParalelo VARCHAR(50),  -- Campo calculado/join
    estado INT DEFAULT 1,    -- 0=Inactivo, 1=Activo
    PRIMARY KEY (codmat, codpar, gestion),
    FOREIGN KEY (codmat) REFERENCES materia(codmat),
    FOREIGN KEY (codpar) REFERENCES paralelo(codpar)
);
```

**¿Por qué existe?**

Sin `MAPA`, no sabríamos:
- ¿Qué materias se dictan en qué paralelos?
- ¿Qué paralelos están disponibles para una materia específica en una gestión?

**Ejemplo del mundo real:**
```
Gestión 2025:
    - Matemáticas (MAT-101) se dicta en Paralelo A, B y C
    - Física (FIS-201) solo se dicta en Paralelo A y B
    
Tabla MAPA tendría:
    (MAT-101, 1, 2025, "Paralelo A", 1)
    (MAT-101, 2, 2025, "Paralelo B", 1)
    (MAT-101, 3, 2025, "Paralelo C", 1)
    (FIS-201, 1, 2025, "Paralelo A", 1)
    (FIS-201, 2, 2025, "Paralelo B", 1)
```

**¿Cómo se crea un registro en MAPA?**

Desde el módulo **Materias** (`MateriasMainPage`):
```
1. Administrador selecciona una materia (ej: "Matemáticas")
2. Click "Asignar Paralelos" → Abre MapaManager
3. Se muestran checkboxes con todos los paralelos disponibles
4. Selecciona: [Paralelo A ✓] [Paralelo B ✓] [Paralelo C ✗]
5. Click "Guardar" → MapaService.create()
6. Backend crea 2 registros en MAPA:
   INSERT INTO mapa VALUES ('MAT-101', 1, 2025, 1);
   INSERT INTO mapa VALUES ('MAT-101', 2, 2025, 1);
```

**¿Cómo se usa en DICTA y PROGRA?**

**En DICTA (Asignación de docentes):**
```typescript
// dicta-form-dialog.ts
MapaService.getByMateria("MAT-101").subscribe(mapas => {
  // Backend retorna: [{codmat: "MAT-101", codpar: 1}, {codmat: "MAT-101", codpar: 2}]
  // Solo estos paralelos aparecen como opciones para asignar docente
  this.paralelos.set(mapas.filter(m => m.estado === 1));
});
```

**En PROGRA (Inscripción de estudiantes):**
```typescript
// progra-form-dialog.ts
for (const materia of materiasDelNivel) {
  const mapas = await MapaService.getByMateria(materia.codmat).toPromise();
  const primerParalelo = mapas[0];  // Se inscribe en el primer paralelo disponible
  
  PrograService.create({
    codmat: materia.codmat,
    codpar: primerParalelo.codpar,  // Viene de MAPA
    codp: codigoAlumno
  });
}
```

**Ventaja del diseño:**
- ✅ Flexibilidad: Cada materia puede tener paralelos diferentes cada gestión
- ✅ Control: Solo se pueden asignar docentes/estudiantes a combinaciones válidas en MAPA
- ✅ Auditoría: Campo `estado` permite deshabilitar paralelos sin eliminar registros

---

### 2. ¿Cómo llegan los mensajes del backend al frontend?

**Respuesta Técnica:**

Los mensajes del backend se transmiten al frontend a través de un flujo de **Interceptores HTTP → Servicio Centralizado → Alertas Visuales**. Este mecanismo captura tanto respuestas exitosas como errores.

**Arquitectura del Flujo:**

```
Backend (Spring Boot)
    ↓ HTTP Response
    ↓ Status Code: 200/201/400/401/403/500
    ↓ Body: { message: "Usuario creado correctamente" } o { error: "Email duplicado" }
    ↓
Angular HttpClient
    ↓
INTERCEPTOR 1: AuthInterceptor (auth-token.ts)
    ├─ Agrega headers: Authorization: Bearer {JWT}
    └─ Pasa al siguiente interceptor
    ↓
INTERCEPTOR 2: GlobalErrorInterceptor
    ├─ Observa la respuesta con catchError()
    ├─ Si Success (2xx): Pasa al componente
    └─ Si Error (4xx/5xx):
         ├─ Extrae mensaje del backend
         ├─ AlertService.showError(mensaje)
         └─ Retorna throwError()
    ↓
Componente (ej: UserService.create())
    ├─ subscribe({
    │   next: (data) => AlertService.showSuccess("Usuario creado"),
    │   error: (err) => // Ya fue manejado por interceptor
    │ })
    └─ SweetAlert2 muestra popup visual
```

**Código Detallado:**

**1. Backend envía mensaje:**
```java
// Spring Boot - UserController.java
@PostMapping("/api/usuarios")
public ResponseEntity<?> crearUsuario(@RequestBody UserDto dto) {
    try {
        User user = userService.create(dto);
        return ResponseEntity.status(201).body(
            Map.of("message", "Usuario creado correctamente", "data", user)
        );
    } catch (DuplicateEmailException e) {
        return ResponseEntity.status(400).body(
            Map.of("error", "El email ya está registrado")
        );
    }
}
```

**2. GlobalErrorInterceptor captura respuestas:**
```typescript
// src/app/core/interceptors/global-error.interceptor.ts
export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let mensajeError = 'Error desconocido';

      // Extraer mensaje del backend
      if (error.error?.error) {
        mensajeError = error.error.error;  // "El email ya está registrado"
      } else if (error.error?.message) {
        mensajeError = error.error.message;
      } else if (error.message) {
        mensajeError = error.message;
      }

      // Casos especiales por código HTTP
      switch (error.status) {
        case 401:
          mensajeError = 'Credenciales inválidas';
          sessionStorage.clear();
          router.navigate(['/login']);
          break;
        case 403:
          mensajeError = 'No tienes permisos para esta acción';
          break;
        case 404:
          mensajeError = 'Recurso no encontrado';
          break;
        case 500:
          mensajeError = 'Error interno del servidor';
          break;
      }

      // Mostrar alerta visual
      alertService.showError(mensajeError);

      return throwError(() => error);
    })
  );
};
```

**3. AlertService muestra el mensaje:**
```typescript
// src/app/shared/services/alert.service.ts
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
  showError(mensaje: string): void {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje,  // "El email ya está registrado"
      confirmButtonColor: '#dc2626',
      confirmButtonText: 'Aceptar'
    });
  }

  showSuccess(mensaje: string): void {
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: mensaje,  // "Usuario creado correctamente"
      confirmButtonColor: '#007A5E',
      timer: 3000,
      showConfirmButton: false
    });
  }
}
```

**4. Componente subscribe al servicio:**
```typescript
// user-service.ts
create(dto: UserDto): Observable<User> {
  return this.http.post<User>(this.apiUrl, dto);
}

// register-form-dialog.ts
onConfirm(): void {
  this.userService.create(this.formValue).subscribe({
    next: (user) => {
      this.alertService.showSuccess('Usuario registrado correctamente');
      this.dialogRef.close(true);
    },
    error: (err) => {
      // GlobalErrorInterceptor ya mostró el error
      // Aquí solo se logea o se hace cleanup
      console.error('Error en registro:', err);
    }
  });
}
```

**Flujo Visual para el Usuario:**

```
Usuario hace click "Guardar"
    ↓
Loading spinner (opcional)
    ↓
Backend procesa (0.5-2 segundos)
    ↓
CASO ÉXITO:
    → Popup verde con ícono ✓
    → Título: "Éxito"
    → Mensaje: "Usuario creado correctamente"
    → Se cierra automáticamente en 3 segundos
    → Formulario se cierra
    → Tabla se recarga

CASO ERROR:
    → Popup rojo con ícono ✗
    → Título: "Error"
    → Mensaje: "El email ya está registrado"
    → Botón "Aceptar" (color rojo #dc2626)
    → Formulario permanece abierto
    → Foco en campo con error
```

**Ventajas de este diseño:**
- ✅ **Centralización:** Un solo lugar maneja todos los errores HTTP
- ✅ **Consistencia:** Todos los mensajes se ven iguales (SweetAlert2)
- ✅ **Separación de responsabilidades:** Componentes no manejan errores HTTP manualmente
- ✅ **UX mejorada:** Mensajes claros en español sin códigos técnicos
- ✅ **Logging automático:** Todos los errores pasan por el interceptor

---

### 3. ¿Cómo funciona la excepción `BadCredentials` en el login?

**Respuesta Técnica:**

La excepción `BadCredentialsException` es lanzada por **Spring Security** cuando las credenciales de login (usuario/contraseña) no coinciden con la base de datos. El flujo completo involucra backend, interceptor y frontend.

**Arquitectura del Flujo:**

```
1. FRONTEND: Usuario envía credenciales
    ↓
login-form.ts → LoginApiService.login({ login, password })
    ↓
POST http://localhost:8080/api/auth/login
Body: { login: "juan.perez", password: "wrongPassword" }
    ↓

2. BACKEND: Spring Security valida credenciales
    ↓
AuthController.java → authenticationManager.authenticate()
    ↓
UserDetailsService busca usuario en DB
    ├─ SELECT * FROM user WHERE login = 'juan.perez'
    ├─ Usuario encontrado → Comparar password
    └─ Password NO coincide → LANZA BadCredentialsException
    ↓
@ExceptionHandler captura la excepción
    ↓
return ResponseEntity.status(401).body({
    error: "Credenciales inválidas",
    timestamp: "2025-01-15T10:30:00"
});
    ↓

3. FRONTEND: GlobalErrorInterceptor captura HTTP 401
    ↓
catchError((error: HttpErrorResponse) => {
    if (error.status === 401) {
        alertService.showError('Credenciales inválidas');
        sessionStorage.clear();
        router.navigate(['/login']);
    }
});
    ↓

4. UI: SweetAlert2 muestra popup rojo
    ↓
Popup:
    - Ícono: ✗ (rojo)
    - Título: "Error"
    - Mensaje: "Credenciales inválidas"
    - Botón: "Aceptar"
    ↓
Usuario ve error → Vuelve a intentar con credenciales correctas
```

**Código Detallado:**

**BACKEND - AuthController.java:**
```java
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Spring Security valida credenciales
            Authentication auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    request.getLogin(),
                    request.getPassword()
                )
            );
            
            // Si llega aquí, credenciales correctas
            UserDetails userDetails = (UserDetails) auth.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);
            
            return ResponseEntity.ok(new AuthResponse(jwt, userDetails));
            
        } catch (BadCredentialsException e) {
            // Credenciales incorrectas
            return ResponseEntity.status(401).body(
                Map.of("error", "Credenciales inválidas")
            );
        }
    }
}
```

**BACKEND - CustomUserDetailsService.java:**
```java
@Service
public class CustomUserDetailsService implements UserDetailsService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {
        User user = userRepository.findByLogin(login)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        
        return org.springframework.security.core.userdetails.User
            .withUsername(user.getLogin())
            .password(user.getPassword())  // Password hasheado con BCrypt
            .authorities(user.getRoles())
            .build();
    }
}
```

**FRONTEND - login-api-service.ts:**
```typescript
@Injectable({ providedIn: 'root' })
export class LoginApiService {
  private apiUrl = 'http://localhost:8080/api/auth';
  
  constructor(private http: HttpClient) {}
  
  login(credentials: { login: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }
}
```

**FRONTEND - login-form.ts:**
```typescript
onSubmit(): void {
  if (this.loginForm.invalid) return;
  
  const { login, password } = this.loginForm.value;
  
  this.loginService.login({ login, password }).subscribe({
    next: (response: AuthResponse) => {
      // Guardar token en sessionStorage
      sessionStorage.setItem('authToken', response.token);
      sessionStorage.setItem('userData', JSON.stringify(response.user));
      
      // Redirigir al home
      this.router.navigate(['/home']);
    },
    error: (err) => {
      // GlobalErrorInterceptor ya mostró "Credenciales inválidas"
      console.error('Error de login:', err);
      
      // Limpiar formulario (opcional)
      this.loginForm.patchValue({ password: '' });
    }
  });
}
```

**FRONTEND - GlobalErrorInterceptor:**
```typescript
export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const alertService = inject(AlertService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // BadCredentials o token expirado
        const mensaje = error.error?.error || 'Credenciales inválidas';
        
        alertService.showError(mensaje);
        
        // Limpiar sesión
        sessionStorage.clear();
        
        // Redirigir a login
        router.navigate(['/login']);
      }
      
      return throwError(() => error);
    })
  );
};
```

**¿Por qué BadCredentialsException específicamente?**

Spring Security tiene una jerarquía de excepciones de autenticación:
- `AuthenticationException` (padre)
  - `BadCredentialsException` → Contraseña incorrecta
  - `UsernameNotFoundException` → Usuario no existe
  - `AccountExpiredException` → Cuenta expirada
  - `DisabledException` → Cuenta deshabilitada

**Decisión de diseño:** Por seguridad, se mapean **todas** a `BadCredentialsException` para no revelar si el usuario existe o no.

```java
// NO hacer esto (inseguro):
if (!userExists) {
    throw new UsernameNotFoundException("El usuario no existe");
}

// HACER esto (seguro):
if (!userExists || !passwordMatches) {
    throw new BadCredentialsException("Credenciales inválidas");
}
```

**Comparación de Passwords:**

```java
// Spring Security usa BCryptPasswordEncoder
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

// Al registrar usuario:
String hashedPassword = encoder.encode("123456");
// Resultado: "$2a$10$N9qo8uLOickgx2ZMRZoMye8uECFpTj2VxAkC2Vq/5bN7pOvN9uWEK"

user.setPassword(hashedPassword);
userRepository.save(user);

// Al hacer login:
boolean matches = encoder.matches(
    "123456",  // Password ingresado
    "$2a$10$N9qo8uLOickgx2ZMRZoMye8uECFpTj2VxAkC2Vq/5bN7pOvN9uWEK"  // Hash en DB
);

if (!matches) {
    throw new BadCredentialsException("Credenciales inválidas");
}
```

**Timeline del error completo:**

```
T=0ms:    Usuario escribe "juan.perez" / "wrongPass" → Click "Ingresar"
T=10ms:   POST /api/auth/login enviado
T=150ms:  Backend recibe request
T=200ms:  UserDetailsService.loadUserByUsername("juan.perez")
T=250ms:  SELECT * FROM user WHERE login = 'juan.perez'
T=300ms:  Usuario encontrado en DB
T=350ms:  BCryptPasswordEncoder.matches("wrongPass", "$2a$10$hash...")
T=400ms:  Match = false → throw BadCredentialsException
T=410ms:  @ExceptionHandler captura → ResponseEntity.status(401)
T=450ms:  Response HTTP 401 enviado a frontend
T=500ms:  GlobalErrorInterceptor.catchError() ejecutado
T=510ms:  AlertService.showError("Credenciales inválidas")
T=520ms:  sessionStorage.clear()
T=530ms:  router.navigate(['/login'])
T=600ms:  SweetAlert2 popup aparece en pantalla
T=∞:      Usuario ve mensaje y puede volver a intentar
```

**Ventajas de este flujo:**
- ✅ **Seguridad:** No revela si el usuario existe
- ✅ **UX clara:** Mensaje en español sin tecnicismos
- ✅ **Centralizado:** Un solo lugar maneja errores 401
- ✅ **Limpieza automática:** SessionStorage se limpia al detectar 401
- ✅ **Redirección automática:** Vuelve a login si hay error de autenticación

---

### 4. ¿Cómo funcionan los Signals y Effects en este proyecto?

**Respuesta Técnica:**

Los **Signals** son el nuevo sistema de reactividad de Angular (desde v16+) que reemplaza parcialmente a RxJS Observables para gestión de estado local. Los **Effects** son funciones que se ejecutan automáticamente cuando un signal cambia.

**Diferencia con RxJS:**

| Característica | RxJS Observables | Angular Signals |
|---------------|------------------|-----------------|
| Reactividad | Pull-based (subscribe) | Push-based (automático) |
| Uso | Datos asíncronos (HTTP) | Estado sincrónico (UI) |
| Sintaxis | `subscribe()`, `pipe()` | `signal()`, `computed()`, `effect()` |
| Performance | Puede causar renders innecesarios | Granular, solo afecta lo que cambió |
| Change Detection | Zone.js | Zoneless (experimental) |

**Código de Ejemplo - Filtros en `DictaMainPage`:**

```typescript
export class DictaMainPage {
  // 1. SIGNALS: Estado reactivo
  filtroTexto = signal<string>('');        // Input de búsqueda
  filtroEstado = signal<number>(2);        // 0=Bajas, 2=Todos
  filtroNivel = signal<number | undefined>(undefined);  // Nivel seleccionado
  
  asignaciones = signal<Dicta[]>([]);      // Datos de la tabla
  niveles = signal<Nivel[]>([]);           // Opciones del dropdown
  
  constructor(
    private dictaService: DictaService,
    private nivelService: NivelService
  ) {
    // 2. EFFECT: Observa cambios en CUALQUIER signal usado dentro
    effect(() => {
      // Estas 3 líneas REGISTRAN dependencias
      const texto = this.filtroTexto();    // Dependencia 1
      const estado = this.filtroEstado();  // Dependencia 2
      const nivel = this.filtroNivel();    // Dependencia 3
      
      // Cuando CUALQUIERA cambie, este effect se re-ejecuta
      this.cargarAsignaciones(texto, estado, nivel);
    });
  }
  
  ngOnInit(): void {
    // Cargar niveles UNA VEZ al iniciar
    this.nivelService.listarActivos().subscribe(data => {
      this.niveles.set(data);
    });
  }
  
  // Método llamado por el effect
  cargarAsignaciones(texto: string, estado: number, nivel?: number): void {
    this.dictaService.getAll(texto, estado, nivel).subscribe(data => {
      this.asignaciones.set(data);  // Actualiza signal → UI se re-renderiza
    });
  }
  
  // Métodos vinculados a la UI
  onTextoBusquedaCambia(nuevoTexto: string): void {
    this.filtroTexto.set(nuevoTexto);  // Cambia signal → Effect se dispara
  }
  
  onEstadoCambia(nuevoEstado: number): void {
    this.filtroEstado.set(nuevoEstado);  // Cambia signal → Effect se dispara
  }
  
  onNivelCambia(nuevoNivel: number | undefined): void {
    this.filtroNivel.set(nuevoNivel);  // Cambia signal → Effect se dispara
  }
}
```

**HTML Template con Signals:**

```html
<!-- dicta-main-page.html -->
<div class="filtros">
  <!-- Input de búsqueda -->
  <input 
    type="text" 
    [value]="filtroTexto()"
    (input)="onTextoBusquedaCambia($event.target.value)"
    placeholder="Buscar por materia o profesor"
  />
  
  <!-- Radio buttons de estado -->
  <div class="radios">
    <label>
      <input 
        type="radio" 
        [checked]="filtroEstado() === 2"
        (change)="onEstadoCambia(2)"
      />
      Todos
    </label>
    <label>
      <input 
        type="radio" 
        [checked]="filtroEstado() === 0"
        (change)="onEstadoCambia(0)"
      />
      Bajas
    </label>
  </div>
  
  <!-- Select de nivel -->
  <select (change)="onNivelCambia($event.target.value ? +$event.target.value : undefined)">
    <option value="">Todos los niveles</option>
    @for (nivel of niveles(); track nivel.codn) {
      <option [value]="nivel.codn" [selected]="filtroNivel() === nivel.codn">
        {{ nivel.nombre }}
      </option>
    }
  </select>
</div>

<!-- Tabla con datos reactivos -->
<app-table
  [data]="asignaciones()"
  [columns]="columns"
  (onEdit)="abrirFormularioEdicion($event)"
/>
```

**Flujo de Reactividad Completo:**

```
1. INICIALIZACIÓN
    ↓
constructor() ejecuta effect()
    ├─ Lee filtroTexto() = ''
    ├─ Lee filtroEstado() = 2
    ├─ Lee filtroNivel() = undefined
    └─ Llama cargarAsignaciones('', 2, undefined)
         ↓
    dictaService.getAll('', 2, undefined)
         ↓
    Backend retorna todas las asignaciones activas
         ↓
    asignaciones.set(data)
         ↓
    UI renderiza tabla con 100 filas

2. USUARIO ESCRIBE EN BÚSQUEDA ("Matemáticas")
    ↓
(input)="onTextoBusquedaCambia('Matemáticas')"
    ↓
filtroTexto.set('Matemáticas')  ← Signal cambia
    ↓
Effect detecta cambio automáticamente
    ├─ Lee filtroTexto() = 'Matemáticas'  ← NUEVO VALOR
    ├─ Lee filtroEstado() = 2              ← Mismo valor
    ├─ Lee filtroNivel() = undefined       ← Mismo valor
    └─ Llama cargarAsignaciones('Matemáticas', 2, undefined)
         ↓
    Backend retorna solo asignaciones con "Matemáticas"
         ↓
    asignaciones.set(filteredData)
         ↓
    UI re-renderiza tabla con 5 filas

3. USUARIO CAMBIA ESTADO A "BAJAS"
    ↓
(change)="onEstadoCambia(0)"
    ↓
filtroEstado.set(0)  ← Signal cambia
    ↓
Effect detecta cambio automáticamente
    ├─ Lee filtroTexto() = 'Matemáticas'   ← Mismo valor
    ├─ Lee filtroEstado() = 0              ← NUEVO VALOR
    ├─ Lee filtroNivel() = undefined       ← Mismo valor
    └─ Llama cargarAsignaciones('Matemáticas', 0, undefined)
         ↓
    Backend retorna asignaciones de Matemáticas dadas de BAJA
         ↓
    asignaciones.set(bajaData)
         ↓
    UI re-renderiza tabla con 2 filas
```

**Computed Signals (valores derivados):**

```typescript
export class DictaMainPage {
  asignaciones = signal<Dicta[]>([]);
  
  // Computed: se recalcula automáticamente cuando asignaciones() cambia
  totalAsignaciones = computed(() => this.asignaciones().length);
  
  asignacionesActivas = computed(() => 
    this.asignaciones().filter(a => a.estado === 1)
  );
  
  asignacionesPorNivel = computed(() => {
    const agrupado = new Map<string, number>();
    this.asignaciones().forEach(a => {
      const count = agrupado.get(a.nombreNivel) || 0;
      agrupado.set(a.nombreNivel, count + 1);
    });
    return agrupado;
  });
}
```

```html
<!-- UI usa computed signals como cualquier signal -->
<p>Total de asignaciones: {{ totalAsignaciones() }}</p>
<p>Asignaciones activas: {{ asignacionesActivas().length }}</p>

<div>
  @for (nivel of asignacionesPorNivel() | keyvalue; track nivel.key) {
    <span>{{ nivel.key }}: {{ nivel.value }}</span>
  }
</div>
```

**Ventajas de Signals en este proyecto:**
- ✅ **Reactividad automática:** No hay que llamar `subscribe()` manualmente en el template
- ✅ **Performance:** Solo se re-renderiza lo que cambió
- ✅ **Código más limpio:** Menos boilerplate que RxJS
- ✅ **Debugging:** Más fácil rastrear cambios de estado
- ✅ **Type-safe:** TypeScript infiere tipos automáticamente

**Cuándo usar Signals vs RxJS:**
- **Signals:** Estado local del componente, valores síncronos, UI reactiva
- **RxJS:** Llamadas HTTP, WebSockets, eventos complejos, operadores (debounce, throttle)

**Ejemplo combinado:**
```typescript
// RxJS para HTTP
this.userService.getAll().pipe(
  debounceTime(300),
  distinctUntilChanged()
).subscribe(users => {
  // Signal para estado
  this.users.set(users);  // → UI se actualiza automáticamente
});
```

---

### 5. ¿Por qué se cambió el separador de ID de `-` a `|` en Dicta?

**Respuesta Técnica:**

El cambio se debió a un **conflicto de parsing** causado por códigos de materias que contienen guiones internos (ej: `"MAT-101"`, `"FIS-201"`).

**Problema Original:**

```typescript
// ANTES: Usar guion como separador
const claseId = `${codmat}-${codpar}-${gestion}`;
// Ejemplo: "MAT-101-2-2025"

// Al parsear:
const partes = claseId.split('-');
// Resultado: ["MAT", "101", "2", "2025"]  ← ¡4 elementos en lugar de 3!
```

**Consecuencia:**
```typescript
const [codmat, codpar, gestion] = claseId.split('-');
// codmat = "MAT"        ← INCORRECTO (debería ser "MAT-101")
// codpar = "101"        ← INCORRECTO (debería ser 2)
// gestion = "2"         ← INCORRECTO (debería ser 2025)
```

**Solución: Cambiar separador a `|` (pipe):**

```typescript
// DESPUÉS: Usar pipe como separador
const claseId = `${codmat}|${codpar}|${gestion}`;
// Ejemplo: "MAT-101|2|2025"

// Al parsear:
const partes = claseId.split('|');
// Resultado: ["MAT-101", "2", "2025"]  ← ✅ 3 elementos correctos

const [codmat, codpar, gestion] = partes;
// codmat = "MAT-101"    ← ✅ CORRECTO
// codpar = "2"          ← ✅ CORRECTO
// gestion = "2025"      ← ✅ CORRECTO
```

**Implementación en `dicta-form-dialog.ts`:**

```typescript
// Generación de IDs
generarClasesCombinadas(): void {
  this.todasLasMaterias().forEach(materia => {
    this.mapaService.getByMateria(materia.codmat).subscribe(mapas => {
      const mapasActivos = mapas.filter(m => m.estado === 1);
      
      mapasActivos.forEach(mapa => {
        this.clasesDisponibles.update(current => [...current, {
          id: `${materia.codmat}|${mapa.codpar}|${mapa.gestion}`,  // Pipe separator
          codmat: materia.codmat,
          codpar: mapa.codpar,
          gestion: mapa.gestion,
          nombreNivel: materia.nombreNivel,
          nombreMateria: materia.nombre,
          nombreParalelo: mapa.nombreParalelo,
          displayText: `${materia.nombreNivel} - ${materia.nombre} - ${mapa.nombreParalelo}`
        }]);
      });
    });
  });
}

// Parsing de IDs
onConfirm(): void {
  const claseId = this.dictaForm.value.clase;
  const [codmat, codparStr, gestionStr] = claseId.split('|');  // Split by pipe
  
  const dictaDto: DictaRequest = {
    codmat: codmat,
    codpar: +codparStr,      // Convertir a número
    gestion: +gestionStr,    // Convertir a número
    login: this.dictaForm.value.login
  };
  
  this.dictaService.create(dictaDto).subscribe(/* ... */);
}
```

**Casos de prueba:**

| Código Materia | Paralelo | Gestión | ID Antiguo (❌) | ID Nuevo (✅) |
|----------------|----------|---------|----------------|--------------|
| MAT-101 | 2 | 2025 | MAT-101-2-2025 | MAT-101\|2\|2025 |
| FIS-201 | 1 | 2025 | FIS-201-1-2025 | FIS-201\|1\|2025 |
| CS-INTRO-1A | 3 | 2025 | CS-INTRO-1A-3-2025 | CS-INTRO-1A\|3\|2025 |

**¿Por qué pipe (`|`) y no otro símbolo?**

Opciones consideradas:
- `:` → Usado en URLs y paths
- `;` → Usado en CSS y SQL
- `/` → Usado en paths y fechas
- `_` → Podría aparecer en códigos de materias
- `|` → **Poco probable en códigos académicos**, fácil de leer, estándar en algunos parsers

**Alternativa sin separadores (JSON):**

```typescript
// Otra opción: Usar objeto JSON como ID
const claseId = JSON.stringify({ codmat, codpar, gestion });
// Ejemplo: '{"codmat":"MAT-101","codpar":2,"gestion":2025}'

// Al parsear:
const clase = JSON.parse(claseId);
// clase.codmat = "MAT-101" ✅
// clase.codpar = 2 ✅
// clase.gestion = 2025 ✅
```

**¿Por qué NO se usó JSON?**
- ❌ IDs muy largos en HTML
- ❌ Más verboso
- ❌ Mayor tamaño en memoria
- ✅ Pipe es más simple y legible

**Lecciones aprendidas:**
1. Siempre validar separadores con datos reales del sistema
2. Evitar usar caracteres que puedan aparecer en los valores
3. Documentar decisiones de diseño en comentarios
4. Preferir soluciones simples sobre complejas

---

## 📚 Recursos Adicionales

- [Angular Signals Documentation](https://angular.dev/guide/signals)
- [Angular HTTP Interceptors](https://angular.dev/guide/http/interceptors)
- [SweetAlert2 Documentation](https://sweetalert2.github.io/)
- [TailwindCSS + DaisyUI](https://daisyui.com/)
- [Spring Security BadCredentials](https://docs.spring.io/spring-security/reference/servlet/authentication/passwords/index.html)

---
