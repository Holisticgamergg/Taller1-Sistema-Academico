# 🎓 Sistema de Gestión Académica — Taller 1

Aplicación **Full Stack** para la gestión integral de una institución educativa (**Unidad Educativa Andalucía**). Permite administrar usuarios, roles, niveles académicos, materias, paralelos, asignación docente, inscripciones de estudiantes y evaluaciones.

---

## 📁 Estructura del Repositorio

```
Taller1/
├── backend_2/          # API REST — Java 21 + Spring Boot 3
└── frontendfinal/      # SPA — Angular 20 + TailwindCSS
```

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Backend** | Java 21, Spring Boot 3.5.6, Spring Security + JWT |
| **Base de Datos** | PostgreSQL 16.4 (ORM: Hibernate / Spring Data JPA) |
| **Frontend** | Angular 20.2.1, TypeScript, Standalone Components, Signals |
| **Estilos** | TailwindCSS, DaisyUI, Angular Material |
| **Alertas** | SweetAlert2 |
| **Build** | Maven 3.9.x (backend), Angular CLI (frontend) |

---

## ⚙️ Arquitectura General

```
┌────────────────────────────────────────────────────────────┐
│                      FRONTEND (Angular)                    │
│  - Standalone Components + Signals (Zone.js-less)         │
│  - Auth Interceptor (JWT) + Global Error Interceptor      │
│  - TailwindCSS + DaisyUI UI                               │
└───────────────────────┬────────────────────────────────────┘
                        │ HTTP REST (JSON)
                        │ Authorization: Bearer <JWT>
┌───────────────────────▼────────────────────────────────────┐
│                     BACKEND (Spring Boot)                  │
│  - REST API en puerto 8080                                │
│  - Spring Security + JWT Filter                           │
│  - Feature-based Architecture (packages por módulo)       │
│  - Global Exception Handler (@RestControllerAdvice)       │
└───────────────────────┬────────────────────────────────────┘
                        │ JDBC / JPA
┌───────────────────────▼────────────────────────────────────┐
│                   BASE DE DATOS (PostgreSQL)               │
│  - Tablas: usuarios, roles, materias, paralelos, mapa,    │
│    dicta, progra, personal, items, general, etc.          │
└────────────────────────────────────────────────────────────┘
```

---

## 📦 Módulos del Sistema

### 🔐 Autenticación y Seguridad
- **Login con JWT:** El usuario se autentica vía `POST /auth/login`. El backend genera un token JWT válido por 10 horas.
- **RBAC (Control de Acceso por Roles):** Roles, menús dinámicos y asignación de permisos por rol.
- **Interceptores Angular:** `AuthInterceptor` inyecta el token en cada petición; `GlobalErrorInterceptor` captura errores HTTP globalmente.

### 👥 Gestión de Usuarios
CRUD completo de usuarios con tipos:
- **A** — Administrativo
- **D** — Docente
- **E** — Estudiante

Incluye baja lógica, reactivación y filtros avanzados.

### 📚 Gestión Académica

| Módulo | Descripción |
|--------|-------------|
| **Niveles** | Gestión de niveles educativos (semestres/años) |
| **Materias** | CRUD de materias con edición de clave primaria y migración de FKs |
| **Paralelos** | Gestión de divisiones de cursos (A, B, C) |
| **Mapa (Oferta Académica)** | Asigna materias + paralelos + gestión actual |
| **Dicta (Asignación Docente)** | Asigna profesores a clases (Materia + Paralelo + Gestión) |
| **Progra (Inscripciones)** | Inscripción masiva de estudiantes a niveles completos |
| **Itemat** | Configuración de ítems de evaluación y ponderaciones por materia |

### 📊 Evaluaciones
- **Items:** Catálogo global de tipos de evaluación (Examen, Práctica, Laboratorio).
- **ItemMat:** Asigna ítems a materias con ponderaciones; valida que la suma no supere el 100%.

---

## 🔄 Flujo Principal del Sistema

```
[Login] ──→ JWT generado
     │
     ▼
[Dashboard] con menús según rol
     │
     ├──→ [Materias] → Crear/editar materia
     │         └──→ [Mapa] Asignar paralelos a materia
     │
     ├──→ [Dicta] Asignar docente a clase (Materia+Paralelo)
     │
     ├──→ [Progra] Inscribir alumno en nivel
     │         └──→ Se crea registro en PROGRA por cada materia del nivel
     │
     └──→ [ItemMat] Configurar evaluaciones por materia
```

---

## 🚀 Cómo Levantar el Proyecto

### Prerrequisitos

- **JDK 21** instalado y en PATH
- **Node.js 18+** y **Angular CLI** (`npm install -g @angular/cli`)
- **PostgreSQL 16** ejecutándose localmente

---

### 1. Backend (Spring Boot)

```bash
cd backend_2/backend_2
```

Configura `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tu_base_de_datos
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
```

Ejecuta con Maven Wrapper:

```bash
# En Linux/Mac
./mvnw spring-boot:run

# En Windows
mvnw.cmd spring-boot:run
```

La API queda disponible en `http://localhost:8080`.

---

### 2. Frontend (Angular)

```bash
cd frontendfinal/frontend_2-master
npm install
ng serve
```

La aplicación queda disponible en `http://localhost:4200`.

---

## 🌐 Endpoints API Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/auth/login` | Autenticación, retorna JWT |
| `GET` | `/api/users` | Listar usuarios |
| `GET/POST` | `/api/materias` | CRUD materias |
| `GET/POST` | `/api/mapa` | Oferta académica |
| `GET/POST` | `/api/dicta` | Asignaciones docentes |
| `GET/POST` | `/api/progra` | Inscripciones alumnos |
| `GET` | `/api/progra/mobile/alumno/{codp}/materias` | Materias del alumno (app móvil) |
| `GET/POST` | `/api/items` | Catálogo de ítems de evaluación |
| `GET/POST` | `/api/personals` | Gestión de personal |
| `GET/POST` | `/api/niveles` | Gestión de niveles |
| `GET/POST` | `/api/paralelos` | Gestión de paralelos |

---

## 🔒 Seguridad

- **JWT (JSON Web Tokens):** Firmados con HS256, expiración de 10 horas.
- **Spring Security:** Filtro `JwtAuthenticationFilter` en cada request.
- **CORS configurado** para `localhost:4200` (Angular) y `localhost:8100` (Ionic).
- **Manejo global de excepciones:**
  - `404` → `ResourceNotFoundException`
  - `400` → `BusinessRuleException`
  - `401` → `BadCredentialsException`

---

## 🗄️ Modelo de Datos (Tablas Clave)

```
GENERAL ─────────────────── Gestión académica activa (año)
    │
MATERIAS ─── NIVELES        Catálogo de materias por nivel
    │
MAPA ────────────────────── Oferta: Materia + Paralelo + Gestión
    │              │
  DICTA          PROGRA
  (docentes)    (alumnos)
    │
USUARIOS ─── ROLES          Usuarios del sistema y sus permisos
    │
PERSONAL ────────────────── Datos personales (tipo A/D/E)
    │
ITEMS ─── ITEMAT            Evaluaciones por materia
```

---

## 🎨 Diseño UI

| Color | Hex | Uso |
|-------|-----|-----|
| Verde Primario | `#007A5E` | Botones, headers |
| Verde Oscuro | `#00624B` | Hover, efectos |
| Azul Marino | `#0A1C2C` | Títulos, fondos |
| Rojo Alerta | `#dc2626` | Errores, bajas |

---

## 📄 Documentación Detallada

- 📘 **Backend:** [`backend_2/backend_2/README.md`](./backend_2/backend_2/README.md)
- 📗 **Frontend:** [`frontendfinal/frontend_2-master/README.md`](./frontendfinal/frontend_2-master/README.md)
- 📙 **Módulo Inscripciones:** [`frontendfinal/frontend_2-master/B17-PROGRA-DOCUMENTACION.md`](./frontendfinal/frontend_2-master/B17-PROGRA-DOCUMENTACION.md)

---

## 👨‍💻 Autores

Proyecto desarrollado como **Taller 1** del ciclo académico.

- GitHub: [@Holisticgamergg](https://github.com/Holisticgamergg)
