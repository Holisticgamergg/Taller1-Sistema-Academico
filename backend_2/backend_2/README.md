# Backend Sistema Académico (Backend 2)

Este proyecto es el backend para un sistema de gestión académica, desarrollado con **Java 21** y **Spring Boot 3**. Proporciona una API RESTful segura y robusta para gestionar usuarios, roles, materias, notas, personal y procesos académicos.

---

## 📑 Tabla de Contenidos

1. [Tecnologías Principales](#-tecnologías-principales)
2. [Estructura del Proyecto](#-estructura-del-proyecto)
3. [Módulos y Funcionalidades](#-módulos-y-funcionalidades)
4. [Flujo de Datos Detallado: Dicta y Progra](#-flujo-de-datos-detallado-dicta-y-progra)
5. [Manejo de Excepciones y Respuestas](#-manejo-de-excepciones-y-respuestas)
6. [Preguntas Frecuentes (FAQ)](#-preguntas-frecuentes-faq)
7. [Configuración y Ejecución](#-configuración-y-ejecución)

---

## 🛠️ Tecnologías Principales

- **Lenguaje:** Java 21
- **Framework:** Spring Boot 3.5.6
- **Base de Datos:** PostgreSQL 16.4
- **ORM:** Spring Data JPA / Hibernate 6.6.29
- **Seguridad:** Spring Security + JWT (JSON Web Tokens) v0.11.5
- **Build Tool:** Maven 3.9.x
- **Servidor:** Tomcat 10.1.46 (Embedded)

## 📂 Estructura del Proyecto

El proyecto sigue una arquitectura basada en **Features** (funcionalidades), donde cada módulo de negocio tiene su propio paquete dentro de `features/`.

```
src/main/java/com/proyecto/backend_2/
├── configurations/      # Configuraciones globales (Security, CORS, Web)
├── core/               # Núcleo del sistema (Auth, Date, Media)
├── dtos/               # Data Transfer Objects compartidos
├── features/           # Módulos de negocio (ver abajo)
└── ids/                # Claves compuestas (Composite Keys) para JPA
```

## 🚀 Módulos y Funcionalidades

### 1. Seguridad y Usuarios

- **Autenticación (`core/auth`):** Login y registro mediante JWT.
- **Usuarios (`features/users`):** Gestión de cuentas de usuario.
- **Roles (`features/roles`):** Definición de roles de usuario.
- **Asignación de Roles (`features/usurol`):** Relación N:M entre usuarios y roles.
- **Menús Dinámicos (`features/menus`, `features/rolme`):** Gestión de menús y permisos de acceso por rol.

### 2. Gestión Académica (Configuración)

- **Materias (`features/Materias`):**
  - **Entidad:** `MateriasModel` (Tabla: `materias`).
  - **Funcionalidad:** CRUD completo de materias. Permite crear materias asignándolas a un nivel específico.
  - **Lógica Clave:** Validación de unicidad del código de materia (`codmat`) y existencia del nivel (`codn`). Implementa filtros nativos por nombre y estado.
- **Paralelos (`features/Paralelos`):** Gestión de grupos/paralelos. Soporte para filtrado nativo compatible con PostgreSQL (`bytea` casting).
- **Niveles (`features/niveles`):** Gestión de niveles académicos (semestres/años).
- **Modalidades (`features/Modalidad`, `features/DModalidad`):** Configuración de modalidades de estudio.

### 3. Gestión Académica (Operativa)

- **Mapa de Materias (`features/Mapa`):**
  - **Entidad:** `MapaModel` (Tabla: `mapa`). Clave compuesta: `codmat` + `codpar` + `gestion`.
  - **Funcionalidad:** Define la oferta académica asignando paralelos a materias para una gestión específica.
  - **Lógica Clave:** Obtiene la gestión actual automáticamente desde la tabla `GENERAL`. Valida que no existan duplicados para la misma combinación materia-paralelo-gestión.
- **Dictado de Materias (`features/Dicta`):**
  - **Entidad:** `DictaModel` (Tabla: `dicta`). Clave compuesta: `codmat` + `codpar` + `gestion` + `login`.
  - **Funcionalidad:** Asigna docentes (Usuarios) a las clases definidas en el Mapa (Materia + Paralelo).
  - **Lógica Clave:** Valida que el profesor exista y que la clase (Mapa) esté activa. Permite reactivar asignaciones previas mediante cambio de estado.
- **Programación (`features/Progra`):**
  - **Entidad:** `PrograModel` (Tabla: `progra`). Clave compuesta: `codmat` + `codpar` + `gestion` + `codp`.
  - **Funcionalidad:** Gestiona la inscripción de estudiantes a las clases.
  - **Lógica Clave:** Verifica que la persona a inscribir sea un estudiante (tipo 'E'). Controla que no se dupliquen inscripciones activas para la misma clase.
- **Items por Materia (`features/ItemMat`):**
  - **Entidad:** `ItematModel` (Tabla: `itemat`). Clave compuesta: `codmat` + `codi` + `gestion`.
  - **Funcionalidad:** Configura los ítems de evaluación para una materia en la gestión actual.
  - **Lógica Clave:** Controla la ponderación total de los ítems, asegurando que la suma no exceda el 100%.

### 4. Administrativo

- **Personal (`features/personals`):** Gestión de información del personal (docentes, administrativos).
- **Items (`features/Items`):** Definición del catálogo de ítems de evaluación.

## ⚙️ Características Técnicas Destacadas

- **Manejo Global de Excepciones:** Implementado mediante `@RestControllerAdvice` para centralizar errores de negocio (`BusinessRuleException`) y errores de sistema, devolviendo respuestas JSON estandarizadas (`ApiErrorResponse`).
- **Consultas Nativas (Native Queries):** Uso extensivo de SQL nativo optimizado para PostgreSQL, incluyendo manejo de tipos específicos como `bytea` y `text` para búsquedas insensibles a mayúsculas/minúsculas.
- **Claves Compuestas:** Uso de clases `@IdClass` en el paquete `ids/` para manejar tablas con claves primarias compuestas (ej. `MapaId`, `NotaId`).
- **Transaccionalidad Manual:** Lógica personalizada para operaciones que JPA no maneja automáticamente por defecto, como la actualización de claves primarias referenciadas.

---

## 📊 Flujo de Datos Detallado: Dicta y Progra

### 🎓 Tabla DICTA (Asignación Docente)

**Propósito:** Asignar profesores a las clases (Materia + Paralelo + Gestión).

#### Estructura de la Tabla

```sql
CREATE TABLE dicta (
    codmat VARCHAR(15) NOT NULL,      -- Código de materia (FK → materias)
    codpar INTEGER NOT NULL,          -- Código de paralelo (FK → paralelos)
    gestion INTEGER NOT NULL,         -- Año académico (FK → general)
    login VARCHAR(10) NOT NULL,       -- Login del profesor (FK → usuarios)
    estado INTEGER NOT NULL,          -- 1=Activo, 0=Inactivo
    PRIMARY KEY (codmat, codpar, gestion, login),
    FOREIGN KEY (codmat, codpar, gestion) REFERENCES mapa(codmat, codpar, gestion)
);
```

#### Flujo Completo de Asignación Docente

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUJO DE ASIGNACIÓN DOCENTE                  │
└─────────────────────────────────────────────────────────────────┘

1. FRONTEND (Angular/Ionic)
   ↓
   POST /api/dicta
   Body: {
     "codmat": "MAT-101",
     "codpar": 1,
     "gestion": 2025,
     "login": "jperez"
   }
   ↓
2. CONTROLLER (DictaController.java)
   - Recibe DictaCreateDto
   - Llama a service.create(dto)
   ↓
3. SERVICE (DictaService.java)
   ┌─────────────────────────────────────────────────────────────┐
   │ VALIDACIONES                                                │
   ├─────────────────────────────────────────────────────────────┤
   │ A. Verificar si ya existe asignación:                       │
   │    - dictaRepo.existeAsignacion(codmat, codpar, gestion,    │
   │      login)                                                 │
   │    - Si existe y estado=1 → BusinessRuleException          │
   │    - Si existe y estado=0 → Reactivar (changeState a 1)    │
   │                                                             │
   │ B. Validar que el profesor exista:                          │
   │    - userRepo.findById(login)                               │
   │    - Si no existe → ResourceNotFoundException               │
   │                                                             │
   │ C. Validar que la clase (MAPA) exista:                      │
   │    - mapaRepo.findById(MapaId)                              │
   │    - Si no existe → ResourceNotFoundException               │
   │                                                             │
   │ D. Verificar que la clase esté activa:                      │
   │    - clase.getEstado() == 1                                 │
   │    - Si no → BusinessRuleException                          │
   └─────────────────────────────────────────────────────────────┘
   ↓
4. REPOSITORY (DictaRepository.java)
   - dictaRepo.save(dicta)
   ↓
5. BASE DE DATOS (PostgreSQL)
   - INSERT INTO dicta VALUES (...)
   ↓
6. RESPUESTA AL FRONTEND
   HTTP 200 OK
   Body: {
     "id": { "codmat": "MAT-101", "codpar": 1, ... },
     "profesor": { ... },
     "clase": { ... },
     "estado": 1
   }
```

#### ¿De dónde salen los datos de DICTA?

**Origen de cada campo:**

| Campo     | Origen                               | Descripción                                                            |
| --------- | ------------------------------------ | ---------------------------------------------------------------------- |
| `codmat`  | **MAPA** → MATERIAS                  | Código de la materia (seleccionado del dropdown de clases disponibles) |
| `codpar`  | **MAPA** → PARALELOS                 | Código del paralelo (ej. 1, 2, 3 para A, B, C)                         |
| `gestion` | **GENERAL** (tabla de configuración) | Año académico activo (ej. 2025)                                        |
| `login`   | **USUARIOS**                         | Identificador único del profesor                                       |
| `estado`  | Sistema                              | 1 = Asignación activa, 0 = Deshabilitada                               |

**Relaciones JPA:**

```java
@ManyToOne
@JoinColumns({
    @JoinColumn(name = "codmat", referencedColumnName = "codmat"),
    @JoinColumn(name = "codpar", referencedColumnName = "codpar"),
    @JoinColumn(name = "gestion", referencedColumnName = "gestion")
})
private MapaModel clase; // Relación hacia MAPA

@ManyToOne
@MapsId("login")
@JoinColumn(name = "login", nullable = false)
private UserModel profesor; // Relación hacia USUARIOS
```

---

### 🎒 Tabla PROGRA (Inscripción de Alumnos)

**Propósito:** Inscribir estudiantes a las clases (Materia + Paralelo + Gestión).

#### Estructura de la Tabla

```sql
CREATE TABLE progra (
    codmat VARCHAR(15) NOT NULL,      -- Código de materia (FK → materias)
    codpar INTEGER NOT NULL,          -- Código de paralelo (FK → paralelos)
    gestion INTEGER NOT NULL,         -- Año académico
    codp INTEGER NOT NULL,            -- Código del alumno (FK → personal)
    login VARCHAR(10),                -- Quién registró (auditoría)
    estado INTEGER NOT NULL,          -- 1=Activo, 0=Inactivo
    PRIMARY KEY (codmat, codpar, gestion, codp),
    FOREIGN KEY (codmat, codpar, gestion) REFERENCES mapa(codmat, codpar, gestion),
    FOREIGN KEY (codp) REFERENCES personal(codp)
);
```

#### Flujo Completo de Inscripción de Alumnos

```
┌─────────────────────────────────────────────────────────────────┐
│                  FLUJO DE INSCRIPCIÓN DE ALUMNOS                │
└─────────────────────────────────────────────────────────────────┘

1. FRONTEND (Angular)
   ↓
   POST /api/progra
   Body: {
     "codmat": "FIS-102",
     "codpar": 2,
     "gestion": 2025,
     "codp": 123
   }
   ↓
2. CONTROLLER (PrograController.java)
   - Recibe PrograCreateDto
   - Llama a service.create(dto)
   ↓
3. SERVICE (PrograService.java)
   ┌─────────────────────────────────────────────────────────────┐
   │ VALIDACIONES                                                │
   ├─────────────────────────────────────────────────────────────┤
   │ A. Verificar si ya existe inscripción:                      │
   │    - prograRepo.existeInscripcion(codmat, codpar, gestion,  │
   │      codp)                                                  │
   │    - Si existe y estado=1 → BusinessRuleException          │
   │    - Si existe y estado=0 → Reactivar (changeState a 1)    │
   │                                                             │
   │ B. Validar que el alumno exista y sea tipo 'E':            │
   │    - personalRepo.findById(codp)                            │
   │    - Si no existe → ResourceNotFoundException               │
   │    - Si tipo != 'E' → BusinessRuleException                 │
   │                                                             │
   │ C. Validar que la clase (MAPA) exista:                      │
   │    - mapaRepo.findById(MapaId)                              │
   │    - Si no existe → ResourceNotFoundException               │
   │                                                             │
   │ D. Verificar que la clase esté activa:                      │
   │    - clase.getEstado() == 1                                 │
   │    - Si no → BusinessRuleException                          │
   └─────────────────────────────────────────────────────────────┘
   ↓
4. REPOSITORY (PrograRepository.java)
   - prograRepo.save(progra)
   ↓
5. BASE DE DATOS (PostgreSQL)
   - INSERT INTO progra VALUES (...)
   ↓
6. RESPUESTA AL FRONTEND
   HTTP 200 OK
   Body: {
     "id": { "codmat": "FIS-102", "codpar": 2, ... },
     "alumno": { ... },
     "clase": { ... },
     "estado": 1
   }
```

#### ¿De dónde salen los datos de PROGRA?

**Origen de cada campo:**

| Campo     | Origen                                    | Descripción                          |
| --------- | ----------------------------------------- | ------------------------------------ |
| `codmat`  | **MAPA** → MATERIAS                       | Código de la materia                 |
| `codpar`  | **MAPA** → PARALELOS                      | Código del paralelo                  |
| `gestion` | **GENERAL**                               | Año académico activo                 |
| `codp`    | **PERSONAL** (tipo='E')                   | Código del alumno (solo estudiantes) |
| `login`   | **SecurityContext** (usuario autenticado) | Auditoría                            |
| `estado`  | Sistema                                   | 1 = Inscripción activa, 0 = Baja     |

**Relaciones JPA:**

```java
@ManyToOne
@JoinColumns({
    @JoinColumn(name = "codmat", referencedColumnName = "codmat"),
    @JoinColumn(name = "codpar", referencedColumnName = "codpar"),
    @JoinColumn(name = "gestion", referencedColumnName = "gestion")
})
private MapaModel clase; // Relación hacia MAPA

@ManyToOne
@MapsId("codp")
@JoinColumn(name = "codp", nullable = false)
private PersonalModel alumno; // Relación hacia PERSONAL (tipo='E')
```

---

### 🗺️ ¿De dónde sale la tabla MAPA?

**MAPA** es la tabla central que define la **oferta académica**. Relaciona:

```
MATERIAS + PARALELOS + GESTIÓN = CLASE
```

**Proceso de creación:**

```
1. Administrador crea MATERIAS (ej. "Matemáticas I")
2. Administrador crea PARALELOS (ej. "A", "B", "C")
3. Sistema obtiene GESTIÓN actual desde tabla GENERAL
4. Administrador ASIGNA paralelos a materias → Se crea MAPA

   Ejemplo:
   POST /api/mapa
   {
     "codmat": "MAT-101",
     "codpar": 1  // Paralelo "A"
   }

   El sistema automáticamente:
   - Obtiene gestion = 2025 (desde GENERAL)
   - Crea registro en MAPA (MAT-101, 1, 2025)
```

**Query de creación en MapaService:**

```java
Integer gestion = generalRepo.findFirstByOrderByGestionDesc()
    .map(GeneralModel::getGestion)
    .orElseThrow(() -> new RuntimeException("No hay gestión configurada"));
```

---

## 🚨 Manejo de Excepciones y Respuestas

### Arquitectura de Excepciones Globales

El sistema utiliza `@RestControllerAdvice` para centralizar el manejo de errores:

```java
@ControllerAdvice
public class GlobalExceptionHandler {

    // 404 NOT FOUND - Recurso no encontrado
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFoundException(
        ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ex.getMessage());
    }

    // 400 BAD REQUEST - Regla de negocio violada
    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<String> handleBusinessRuleException(
        BusinessRuleException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ex.getMessage());
    }

    // 401 UNAUTHORIZED - Credenciales inválidas
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<String> handleAuthenticationException(
        BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body("Login o password incorrectos");
    }

    // 400 BAD REQUEST - Otras excepciones de runtime
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(
        RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ex.getMessage());
    }
}
```

### Flujo de Mensajes: Backend → Frontend

```
┌──────────────────────────────────────────────────────────────┐
│           FLUJO DE MENSAJES DE ERROR AL FRONTEND             │
└──────────────────────────────────────────────────────────────┘

EJEMPLO 1: Profesor no encontrado
────────────────────────────────────
1. Frontend: POST /api/dicta { "login": "xxxxx", ... }
2. Service: userRepo.findById("xxxxx")
3. Service lanza:
   throw new ResourceNotFoundException("Profesor no encontrado: xxxxx")
4. GlobalExceptionHandler captura ResourceNotFoundException
5. Respuesta HTTP:
   Status: 404 NOT FOUND
   Body: "Profesor no encontrado: xxxxx"
6. Frontend recibe:
   error.status = 404
   error.error = "Profesor no encontrado: xxxxx"

EJEMPLO 2: Clase inactiva
────────────────────────────────────
1. Frontend: POST /api/dicta { ... }
2. Service: clase.getEstado() == 0
3. Service lanza:
   throw new BusinessRuleException("La clase no está activa")
4. GlobalExceptionHandler captura BusinessRuleException
5. Respuesta HTTP:
   Status: 400 BAD REQUEST
   Body: "La clase no está activa"
6. Frontend muestra mensaje al usuario

EJEMPLO 3: Login incorrecto
────────────────────────────────────
1. Frontend: POST /auth/login { "login": "admin", "password": "xxx" }
2. AuthenticationManager lanza BadCredentialsException
3. GlobalExceptionHandler captura
4. Respuesta HTTP:
   Status: 401 UNAUTHORIZED
   Body: "Login o password incorrectos"
5. Frontend redirige a login
```

## //la idea de aqui es que se activa automaticamente desde el global en el backend y el front solo lo recoge en globalinterceptor

## ❓ Preguntas Frecuentes (FAQ)

### 1. ¿Cómo funciona la autenticación JWT?

**Flujo completo:**

```
1. Usuario ingresa credenciales → POST /auth/login
2. AuthService valida con AuthenticationManager
3. Si válido → Genera token JWT usando JwtService
4. Token incluye: username, roles, expiración (firmado con clave secreta)
5. Frontend guarda token en localStorage
6. Próximas peticiones incluyen header:
   Authorization: Bearer <token>
7. JwtAuthenticationFilter intercepta:
   - Extrae token del header
   - Valida firma y expiración
   - Carga usuario en SecurityContext
8. Spring Security autoriza el acceso
```

**Código clave (JwtService):**

```java
public String getToken(UserDetails user) {
    return Jwts.builder()
        .setSubject(user.getUsername())
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10)) // 10 horas
        .signWith(getKey(), SignatureAlgorithm.HS256)
        .compact();
}
```

### 2. ¿Por qué se usa `@EmbeddedId` en lugar de `@IdClass`?

**Ventajas de `@EmbeddedId`:**

- Encapsulación: La clave compuesta es un objeto
- Type Safety: Evita confusiones con múltiples parámetros
- Facilita queries: `findById(new MapaId(codmat, codpar, gestion))`

**Ejemplo:**

```java
// En lugar de:
@IdClass(MapaId.class)
public class MapaModel {
    @Id String codmat;
    @Id Integer codpar;
    @Id Integer gestion;
}

// Usamos:
public class MapaModel {
    @EmbeddedId
    private MapaId id; // Objeto que encapsula los 3 campos
}
```

### 3. ¿Cómo se maneja CORS para la app móvil?

**Configuración en WebConfiguration.java:**

```java
@Configuration
public class WebConfiguration implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins(
                "http://localhost:4200",  // Angular
                "http://localhost:8100"   // Ionic
            )
            .allowedMethods("*")
            .allowedHeaders("*")
            .allowCredentials(false);
    }
}
```

### 4. ¿Las eliminaciones son físicas o lógicas?

**Depende del módulo:**

| Módulo       | Tipo de Eliminación       | Campo Estado |
| ------------ | ------------------------- | ------------ |
| **Dicta**    | **Física** (`deleteById`) | ❌ No aplica |
| **Progra**   | **Lógica** (`estado=0`)   | ✅ Sí        |
| **Mapa**     | **Lógica** (`estado=0`)   | ✅ Sí        |
| **Materias** | **Lógica** (`estado=0`)   | ✅ Sí        |
| **Personal** | **Lógica** (`estado=0`)   | ✅ Sí        |

**Dicta** usa eliminación física porque la asignación docente es temporal y no requiere historial.
ya que lo pidio en el nuevo documento

### 5. ¿Cómo se obtiene la gestión actual?

**Desde la tabla GENERAL:**

```java
public Integer obtenerGestionActual() {
    return generalRepo.findFirstByOrderByGestionDesc()
        .map(GeneralModel::getGestion)
        .orElseThrow(() -> new RuntimeException(
            "No hay gestión académica configurada"));
}
```

**Tabla GENERAL:**

```sql
CREATE TABLE general (
    gestion INTEGER PRIMARY KEY,  -- Año académico (ej. 2025)
    fecha_inicio DATE,
    fecha_fin DATE
);
```

### 6. ¿Cómo funciona el filtro de búsqueda?

**Query nativa con LOWER y CONCAT:**

```java
@Query(value = """
    SELECT ...
    WHERE (CAST(:filtro AS text) IS NULL OR
           LOWER(m.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')) OR
           LOWER(per.nombre) LIKE LOWER(CONCAT('%', :filtro, '%')))
    """, nativeQuery = true)
List<Object[]> findAllByFilters(@Param("filtro") String filtro);
```

//que significa todo ese desastre, que s eva concatenar donde sea un filtro de nombre de persoa o materia
**Solución para tipos `bytea` en PostgreSQL:**

```java
LOWER(CAST(p.nombre AS text)) // Convierte bytea → text antes de LOWER()
```

### 7. ¿Cómo se asigna el parámetro `search` al backend?

**Mapeo de parámetros:**

```java
@GetMapping
public ResponseEntity<List<PrograResponseDto>> getAll(
    @RequestParam(value = "search", required = false) String filtro) {
    // El parámetro URL ?search=texto se mapea a la variable 'filtro'
    return ResponseEntity.ok(service.getAll(null, filtro, 2));
}//aqui usamos el dos como para saltearnos la parte de que es un todos' (ya que en la doc original tenia solo valores de 0 y 1)
```

### 8. ¿Qué endpoints están disponibles para la app móvil?

**Endpoint especial para Ionic:**

```
GET /api/progra/mobile/alumno/{codp}/materias
```

**Respuesta:**

```json
[
  {
    "codmat": "MAT-101",
    "sigla": "MAT-101",
    "materia": "Matemáticas I",
    "nivel": "Primer Nivel",
    "paralelo": "1"
  }
]
```

---

## 🔧 Configuración y Ejecución

### Prerrequisitos

- JDK 21 instalado.
- PostgreSQL ejecutándose.

### Configuración

El archivo `src/main/resources/application.properties` debe contener las credenciales de la base de datos:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tu_base_de_datos
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
spring.jpa.hibernate.ddl-auto=update
```

### Ejecutar la aplicación

Usando Maven Wrapper:

```bash
./mvnw spring-boot:run
```

O compilar y ejecutar el JAR:

```bash
./mvnw clean package
java -jar target/backend_2-0.0.1-SNAPSHOT.jar
```
