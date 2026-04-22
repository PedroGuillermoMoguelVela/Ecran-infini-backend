# Écran Infini Backend

Backend completo para aplicación de búsqueda y reseñas de películas, construido con Node.js, Express y MongoDB.

## 🚀 Características

- ✅ **Autenticación JWT** - Registro y login de usuarios
- ✅ **Gestión de Películas** - CRUD completo con búsqueda por texto
- ✅ **Sistema de Reseñas** - Usuarios pueden reseñar películas (1-5 estrellas + comentario)
- ✅ **Favoritos** - Usuarios pueden guardar películas favoritas
- ✅ **Historial de Búsquedas** - Tracking de búsquedas del usuario
- ✅ **API RESTful** - Endpoints bien documentados

## 📋 Prerrequisitos

- Node.js (v14 o superior)
- MongoDB (local o Atlas)
- npm o yarn

## 🛠️ Instalación

1. **Clona o descarga el proyecto**
2. **Instala dependencias:**

   ```bash
   npm install
   ```

3. **Configura variables de entorno:**
   Crea un archivo `.env` en la raíz del proyecto:

   ```env
   MONGO_URI=mongodb://localhost:27017/ecran_infini
   JWT_SECRET=tu_clave_secreta_muy_segura_aqui
   PORT=3000
   ```

4. **Inicia MongoDB** (si usas local):

   ```bash
   brew services start mongodb-community@7.0
   ```

5. **Puebla la base de datos con películas:**

   ```bash
   node seedMovies.js
   ```

6. **Inicia el servidor:**
   ```bash
   npm start
   # o para desarrollo:
   npm run dev
   ```

## 📚 API Endpoints

### Autenticación

```
POST /api/auth/register  - Registrar usuario
POST /api/auth/login     - Iniciar sesión
```

### Películas

```
GET  /api/movies         - Obtener todas las películas
GET  /api/movies/search?q=query  - Buscar películas
GET  /api/movies/:id     - Obtener película por ID
```

### Reseñas (requiere autenticación)

```
POST /api/reviews        - Agregar reseña
GET  /api/reviews/movie/:movieId  - Obtener reseñas de película
GET  /api/reviews/user   - Obtener reseñas del usuario
PUT  /api/reviews/:id    - Actualizar reseña
DELETE /api/reviews/:id  - Eliminar reseña
```

### Favoritos (requiere autenticación)

```
POST   /api/favorites     - Agregar a favoritos
GET    /api/favorites     - Obtener favoritos del usuario
DELETE /api/favorites/:movieId  - Quitar de favoritos
GET    /api/favorites/check/:movieId  - Verificar si es favorito
```

### Historial de Búsquedas (requiere autenticación)

```
POST /api/search-history  - Registrar búsqueda
GET  /api/search-history  - Obtener historial
DELETE /api/search-history  - Limpiar historial
```

## 🔗 Conexión con Frontend

### 1. Incluye el archivo API

```html
<script src="frontend-api.js"></script>
```

### 2. Ejemplos de uso

#### Autenticación

```javascript
// Login
const result = await movieAPI.login("user@example.com", "password");
if (result.token) {
  console.log("Login exitoso");
}

// Registro
const result = await movieAPI.register(
  "user@example.com",
  "password",
  "Nombre",
);
```

#### Películas

```javascript
// Buscar películas
const movies = await movieAPI.searchMovies("kill bill");

// Obtener todas
const allMovies = await movieAPI.getAllMovies();
```

#### Funciones de usuario (requieren login)

```javascript
// Agregar reseña
await movieAPI.addReview(movieId, 5, "¡Excelente película!");

// Agregar a favoritos
await movieAPI.addToFavorites(movieId);

// Verificar favorito
const { isFavorite } = await movieAPI.checkIfFavorite(movieId);
```

### 3. Manejo de autenticación

```javascript
// El token se guarda automáticamente en localStorage
// La API lo incluye automáticamente en las peticiones

// Para verificar si usuario está autenticado
if (movieAPI.token) {
  // Usuario autenticado
}

// Para cerrar sesión
movieAPI.logout();
```

## 🗂️ Estructura del Proyecto

```
ecran-infini-backend/
├── models/           # Modelos de MongoDB
│   ├── users.js      # Usuario
│   ├── movies.js     # Películas
│   ├── reviews.js    # Reseñas
│   ├── favorites.js  # Favoritos
│   └── searchHistory.js  # Historial
├── routes/           # Rutas de la API
│   ├── auth.js       # Autenticación
│   ├── movies.js     # Películas
│   ├── reviews.js    # Reseñas
│   ├── favorites.js  # Favoritos
│   └── searchHistory.js  # Historial
├── middleware/       # Middleware
│   ├── authMiddleware.js  # Autenticación JWT
├── server.js         # Servidor principal
├── seedMovies.js     # Script para poblar DB
├── frontend-api.js   # Cliente API para frontend
├── package.json      # Dependencias
└── .env             # Variables de entorno
```

## 🔒 Seguridad

- **JWT Tokens** para autenticación
- **Bcrypt** para hash de contraseñas
- **Validación de datos** en todos los endpoints
- **CORS** configurado para desarrollo

## 🚀 Despliegue en Producción

1. **Configura variables de producción:**

   ```env
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/ecran_infini
   JWT_SECRET=clave_muy_segura_para_produccion
   PORT=3000
   NODE_ENV=production
   ```

2. **Configura CORS** para tu dominio:

   ```javascript
   const corsOptions = {
     origin: "https://tudominio.com",
     credentials: true,
   };
   app.use(cors(corsOptions));
   ```

3. **Usa un process manager:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name "ecran-infini"
   ```

## 🐛 Solución de Problemas

### Error de conexión MongoDB

- Verifica que MongoDB esté corriendo: `brew services list | grep mongodb`
- Revisa la URI de conexión en `.env`

### Error "Usuario no encontrado"

- Asegúrate de que el token JWT sea válido
- Verifica que el payload del token tenga `userId` (no `id`)

### CORS errors

- Para desarrollo local, CORS está abierto
- Para producción, configura origins específicos

## 📝 Notas de Desarrollo

- Las películas se buscan usando índices de texto de MongoDB
- Los tokens JWT expiran en 1 hora
- Las reseñas están limitadas a una por usuario por película
- Los favoritos evitan duplicados con índices únicos

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

¡Tu backend de películas está listo! 🎬🍿
