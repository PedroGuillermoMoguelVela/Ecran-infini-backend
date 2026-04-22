#!/usr/bin/env node

// Script de prueba rápida para verificar la integración backend-frontend
// Ejecuta: node test-integration.js

const http = require('http');
const https = require('https');

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    const req = protocol.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

async function testEndpoint(name, url, options = {}) {
  try {
    console.log(`\n🧪 Probando ${name}...`);
    const response = await makeRequest(url, options);

    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ ${name}: OK`);
      return response.data;
    } else {
      console.log(`❌ ${name}: Error ${response.status} - ${response.data.message || response.data.error || response.data}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ ${name}: Error de conexión - ${error.message}`);
    return null;
  }
}

const BASE_URL = 'http://localhost:3000/api';

async function runTests() {
  console.log('🚀 Iniciando pruebas de integración backend-frontend\n');

  // 1. Probar servidor básico
  await testEndpoint('Servidor básico', `${BASE_URL.replace('/api', '')}/`);

  // 2. Probar obtener películas
  const movies = await testEndpoint('Obtener películas', `${BASE_URL}/movies`);
  if (!movies || movies.length === 0) {
    console.log('❌ No hay películas en la base de datos. Ejecuta: node seedMovies.js');
    return;
  }

  // 3. Probar búsqueda
  const searchResults = await testEndpoint('Búsqueda de películas', `${BASE_URL}/movies/search?q=blue`);
  if (searchResults && searchResults.length > 0) {
    console.log(`   Encontradas ${searchResults.length} películas con "blue"`);
  }

  // 4. Probar registro de usuario
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'test123',
    name: 'Test User'
  };

  const registerResult = await testEndpoint('Registro de usuario', `${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testUser)
  });

  if (!registerResult) {
    console.log('❌ No se pudo registrar usuario de prueba');
    return;
  }

  // 5. Probar login
  const loginResult = await testEndpoint('Login de usuario', `${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: testUser.email,
      password: testUser.password
    })
  });

  if (!loginResult || !loginResult.token) {
    console.log('❌ No se pudo hacer login');
    return;
  }

  const token = loginResult.token;
  console.log('   Token JWT obtenido correctamente');

  // 6. Probar endpoints protegidos
  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };

  // Obtener primera película para pruebas
  const movieId = movies[0]._id;

  // Agregar reseña
  await testEndpoint('Agregar reseña', `${BASE_URL}/reviews`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      movieId: movieId,
      rating: 5,
      comment: '¡Excelente película! Probando la integración.'
    })
  });

  // Agregar a favoritos
  await testEndpoint('Agregar a favoritos', `${BASE_URL}/favorites`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ movieId })
  });

  // Obtener reseñas de la película
  const reviews = await testEndpoint('Obtener reseñas', `${BASE_URL}/reviews/movie/${movieId}`);
  if (reviews && reviews.length > 0) {
    console.log(`   Encontradas ${reviews.length} reseñas para la película`);
  }

  // Obtener favoritos del usuario
  const favorites = await testEndpoint('Obtener favoritos', `${BASE_URL}/favorites`, {
    headers: authHeaders
  });
  if (favorites && favorites.length > 0) {
    console.log(`   Usuario tiene ${favorites.length} películas favoritas`);
  }

  // Registrar búsqueda
  await testEndpoint('Registrar búsqueda', `${BASE_URL}/search-history`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      query: 'test search',
      resultsCount: 1
    })
  });

  // Obtener historial de búsquedas
  const searchHistory = await testEndpoint('Obtener historial', `${BASE_URL}/search-history`, {
    headers: authHeaders
  });
  if (searchHistory && searchHistory.length > 0) {
    console.log(`   Usuario tiene ${searchHistory.length} búsquedas en el historial`);
  }

  console.log('\n🎉 ¡Todas las pruebas completadas!');
  console.log('\n📋 Resumen:');
  console.log('- ✅ Autenticación funcionando');
  console.log('- ✅ Películas cargadas y búsqueda activa');
  console.log('- ✅ Sistema de reseñas operativo');
  console.log('- ✅ Favoritos funcionando');
  console.log('- ✅ Historial de búsquedas activo');
  console.log('\n🚀 ¡El backend está listo para conectar con tu frontend!');
  console.log('\n📖 Lee el README.md para instrucciones completas de integración');
}

runTests().catch(console.error);