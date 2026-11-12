# B-17. INSCRIPCIÓN ALUMNOS - Frontend Completado ✅

## 📦 Módulo Creado: `features/progra`

### ✅ Componentes Implementados

#### 1. **Modelos** (`progra.model.ts`)
- `Progra`: Interfaz completa con campos de visualización
- `PrograCreateDto`: DTO para crear/actualizar inscripciones
- `AlumnoDto`: DTO para estudiantes (Personal tipo 'E')
- `ClaseDisponibleDto`: DTO para clases con formato "Nivel - Materia - Paralelo"

#### 2. **Servicio** (`progra.service.ts`)
Métodos implementados:
- ✅ `getAll(searchTerm, estado, codn)`: Obtiene inscripciones con filtros
- ✅ `getById(codmat, codpar, gestion, codp)`: Obtiene inscripción específica
- ✅ `create(progra)`: Crea nueva inscripción
- ✅ `update(...)`: Actualiza inscripción existente
- ✅ `delete(...)`: Elimina (deshabilita) inscripción
- ✅ `enable(...)`: Habilita inscripción
- ✅ `getEstudiantes()`: Obtiene lista de estudiantes (tipo 'E')
- ✅ `getClasesDisponibles()`: Obtiene clases con formato completo

#### 3. **Componentes Smart/Dumb**

**PrograMainPageComponent** (Smart):
- Filtros: Nivel, Estado, Búsqueda de texto
- Signals: inscripciones, niveles, filtros, isLoading
- Effect: Recarga automática al cambiar filtros
- Manejo de diálogos CRUD

**PrograListPageComponent** (Dumb):
- Tabla con columnas: nombreNivel, nombreMateria, nombreAlumno, nombreParalelo, estado, acciones
- Outputs: editar, eliminar, habilitar
- Integración con `TableComponent`

#### 4. **Diálogos**

**PrograFormDialogComponent**:
- Select `clase`: Muestra "Nivel - Materia - Paralelo"
- Select `codp`: Muestra nombre completo del alumno
- Modal de confirmación antes de guardar
- Desglosa `claseKey` en `codmat`, `codpar`, `gestion`

**DisablePrograDialogComponent**:
- Confirmación para eliminar inscripción
- Muestra información completa de la inscripción

**EnablePrograDialogComponent**:
- Confirmación para habilitar inscripción
- Muestra información completa de la inscripción

#### 5. **Ruta Registrada**
```typescript
{ path: 'admin/progra', component: PrograMainPageComponent }
```

---

## 🔗 Endpoints Backend Requeridos

### 1. **GET /api/progra**
Obtiene todas las inscripciones con filtros opcionales.

**Query Params:**
- `search` (opcional): Texto de búsqueda
- `estado` (opcional): "0" o "1"
- `codn` (opcional): Código de nivel

**Response:** `Progra[]`
```json
[
  {
    "codmat": 1,
    "codpar": 1,
    "gestion": 2025,
    "codp": "E001",
    "estado": "1",
    "nombreNivel": "Primaria",
    "nombreMateria": "Matemáticas",
    "nombreAlumno": "Juan Pérez García",
    "nombreParalelo": "A"
  }
]
```

### 2. **GET /api/progra/:codmat/:codpar/:gestion/:codp**
Obtiene una inscripción específica.

**Response:** `Progra`

### 3. **POST /api/progra**
Crea una nueva inscripción.

**Body:** `PrograCreateDto`
```json
{
  "codmat": 1,
  "codpar": 1,
  "gestion": 2025,
  "codp": "E001"
}
```

**Response:** `Progra`

### 4. **PUT /api/progra/:codmat/:codpar/:gestion/:codp**
Actualiza una inscripción existente.

**Body:** `PrograCreateDto`
**Response:** `Progra`

### 5. **DELETE /api/progra/:codmat/:codpar/:gestion/:codp**
Elimina (deshabilita) una inscripción.

**Response:** `void` (204 No Content)

### 6. **PATCH /api/progra/:codmat/:codpar/:gestion/:codp/enable**
Habilita una inscripción previamente deshabilitada.

**Response:** `Progra`

### 7. **GET /api/personals/filter?tipo=E&estado=1**
Obtiene lista de estudiantes activos.

**Response:** `AlumnoDto[]`
```json
[
  {
    "codp": "E001",
    "nombre": "Juan",
    "apellidop": "Pérez",
    "apellidom": "García"
  }
]
```

### 8. **GET /api/dicta/clases-disponibles**
Obtiene clases disponibles con formato completo.

**Response:** `ClaseDisponibleDto[]`
```json
[
  {
    "codmat": 1,
    "codpar": 1,
    "gestion": 2025,
    "codn": 1,
    "nombreNivel": "Primaria",
    "nombreMateria": "Matemáticas",
    "nombreParalelo": "A",
    "claseKey": "1-1-2025",
    "claseTexto": "Primaria - Matemáticas - A"
  }
]
```

---

## 🎨 Colores Corporativos Aplicados

- **Títulos:** Navy Blue `#0A1C2C`
- **Botones de acción:** Verde Esmeralda `#007A5E`
- **Fondo general:** `#007A5E`
- **Estados:**
  - Activo: Verde `bg-green-100 text-green-800`
  - Inactivo: Rojo `bg-red-100 text-red-800`

---

## ✅ Arquitectura Aplicada

- ✅ **Standalone Components**
- ✅ **Signals** para estado reactivo
- ✅ **Effects** para recarga automática
- ✅ **Smart/Dumb Pattern**
- ✅ **Reactive Forms**
- ✅ **Modal de confirmación**
- ✅ **Reutilización de TableComponent**
- ✅ **Consistencia con módulo Dicta**

---

## 🚀 Próximos Pasos

1. **Backend:** Implementar los 8 endpoints listados arriba
2. **Frontend:** Probar flujo completo:
   - Crear inscripción
   - Editar inscripción
   - Eliminar inscripción
   - Habilitar inscripción
   - Filtrar por nivel/estado/texto
3. **Verificar:** Endpoint `/api/dicta/clases-disponibles` o adaptarlo según backend

---

## 📝 Notas Importantes

- El formulario usa un **select combinado** "Nivel - Materia - Paralelo" que se desglosa al enviar
- Los estudiantes se cargan desde `/api/personals/filter` con `tipo='E'`
- El campo `gestion` se extrae automáticamente del `claseKey`
- La tabla muestra información enriquecida (nombres, no solo códigos)

¡El módulo está completo y listo para integración con el backend! 🎉
