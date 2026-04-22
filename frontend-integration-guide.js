// Ejemplo: Cómo integrar el backend en tu frontend existente
// Reemplaza tus películas hardcodeadas con llamadas al backend

// ============ ANTES (tu código actual) ============
// const movies = [
//   { title: "PERFECT BLUE", review: "..." },
//   { title: "KILL BILL", review: "..." },
//   // ... más películas
// ];

// ============ DESPUÉS (integrado con backend) ============

// 1. Incluye el archivo API en tu HTML
// <script src="ruta/a/frontend-api.js"></script>

// 2. Modifica tu código de búsqueda
async function searchMovies() {
    const query = document.getElementById('searchInput').value.trim();

    if (!query) {
        // Cargar todas las películas desde el backend
        loadAllMoviesFromBackend();
        return;
    }

    try {
        // Buscar en el backend
        const movies = await movieAPI.searchMovies(query);

        // Registrar la búsqueda si el usuario está autenticado
        if (movieAPI.token) {
            await movieAPI.recordSearch(query, movies.length);
        }

        // Mostrar resultados
        displayMovies(movies);

    } catch (error) {
        console.error('Error en búsqueda:', error);
        // Fallback a búsqueda local si falla el backend
        searchMoviesLocally(query);
    }
}

async function loadAllMoviesFromBackend() {
    try {
        const movies = await movieAPI.getAllMovies();
        displayMovies(movies);
    } catch (error) {
        console.error('Error cargando películas:', error);
        // Fallback a películas locales si falla el backend
        displayMovies(localMovies);
    }
}

// 3. Agrega funcionalidades de usuario a las tarjetas de películas
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    card.innerHTML = `
        <h3>${movie.title}</h3>
        <p>${movie.review}</p>
        <div class="movie-actions">
            ${movieAPI.token ? `
                <button onclick="addToFavorites('${movie._id}')">❤️ Favorito</button>
                <button onclick="addReview('${movie._id}')">⭐ Reseñar</button>
                <button onclick="showReviews('${movie._id}')">Ver Reseñas</button>
            ` : `
                <p><a href="#" onclick="showLoginPrompt()">Inicia sesión</a> para reseñar y guardar favoritos</p>
            `}
        </div>
    `;

    return card;
}

// 4. Funciones para funcionalidades de usuario
async function addToFavorites(movieId) {
    try {
        await movieAPI.addToFavorites(movieId);
        alert('Agregado a favoritos!');
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function addReview(movieId) {
    const rating = prompt('Puntuación (1-5):');
    const comment = prompt('Tu reseña:');

    if (rating && comment) {
        try {
            await movieAPI.addReview(movieId, parseInt(rating), comment);
            alert('Reseña agregada!');
        } catch (error) {
            alert('Error: ' + error.message);
        }
    }
}

async function showReviews(movieId) {
    try {
        const reviews = await movieAPI.getMovieReviews(movieId);

        const reviewsHtml = reviews.length > 0
            ? reviews.map(review =>
                `<div class="review">
                    <strong>${review.user.name}</strong> (${review.rating}⭐)
                    <p>${review.comment}</p>
                </div>`
            ).join('')
            : '<p>No hay reseñas aún</p>';

        // Muestra las reseñas en un modal o sección expandible
        showReviewsModal(reviewsHtml);
    } catch (error) {
        alert('Error cargando reseñas: ' + error.message);
    }
}

function showLoginPrompt() {
    alert('Para usar estas funciones, necesitas iniciar sesión o registrarte.');
    // Aquí puedes mostrar un modal de login
}

// 5. Autenticación
async function loginUser(email, password) {
    try {
        const result = await movieAPI.login(email, password);
        if (result.token) {
            // Recargar la página o actualizar la UI
            location.reload();
        } else {
            alert('Error en login');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

async function registerUser(name, email, password) {
    try {
        const result = await movieAPI.register(email, password, name);
        if (result.message === 'Usuario registrado') {
            alert('Usuario registrado! Ahora puedes iniciar sesión.');
        } else {
            alert('Error en registro');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function logoutUser() {
    movieAPI.logout();
    location.reload();
}

// 6. Inicialización
document.addEventListener('DOMContentLoaded', function() {
    // Verificar si hay un usuario autenticado
    if (movieAPI.token) {
        showUserAuthenticatedUI();
    } else {
        showGuestUI();
    }

    // Cargar películas desde el backend
    loadAllMoviesFromBackend();
});

// ============ MIGRACIÓN GRADUAL ============
// Si quieres migrar gradualmente:

// 1. Mantén tus películas locales como fallback
const localMovies = [
  { title: "PERFECT BLUE", review: "Un thriller psicológico animado..." },
  // ... tus películas actuales
];

// 2. Agrega un toggle para usar backend o local
let useBackend = true; // Cambia a false para usar datos locales

// 3. Modifica las funciones para que usen backend o local según la configuración
async function smartLoadMovies() {
    if (useBackend) {
        return loadAllMoviesFromBackend();
    } else {
        return displayMovies(localMovies);
    }
}

// Esto te permite probar el backend sin romper tu funcionalidad actual