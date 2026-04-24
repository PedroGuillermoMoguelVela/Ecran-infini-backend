require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/movies');

const moviesData = [
  {
    title: "PERFECT BLUE",
    review: "Un thriller psicológico animado que difumina la línea entre la realidad y la fantasía.",
    imageUrl: "./img/PerfectBluw.jpg"
  },
  {
    title: "KILL BILL",
    review: "Una épica historia de venganza llena de acción, sangre y referencias al cine de artes marciales.",
    imageUrl: "./img/killBill.jpg"
  },
  {
    title: "PORTRAIT OF A LADY ON FIRE",
    review: "Un romance de época visualmente deslumbrante que explora la mirada y el deseo.",
    imageUrl: "./img/PortraitOf.webp"
  },
  {
    title: "BLUE JASMINE",
    review: "El retrato tragicómico de una mujer de la alta sociedad lidiando con su caída en desgracia.",
    imageUrl: "./img/Blue jasmine.webp"
  },
  {
    title: "EYES WIDE SHUT",
    review: "Una odisea onírica y perturbadora sobre el matrimonio, los celos y el deseo oculto.",
    imageUrl: "./img/eyes.webp"
  },
  {
    title: "BLACK SWAN",
    review: "El descenso a la locura de una bailarina consumida por la búsqueda de la perfección.",
    imageUrl: "./img/blackSwan.webp"
  },
  {
    title: "MARIA",
    review: "Un intenso drama biográfico que explora la vida y el legado de una figura icónica.",
    imageUrl: "./img/maria.jpeg"
  },
  {
    title: "AMERICAN PSYCHO",
    review: "Una sátira oscura y sangrienta sobre la superficialidad y el vacío del yuppie neoyorquino.",
    imageUrl: "./img/AmericanPsycho.png"
  },
  {
    title: "MARIE ANTOINETTE",
    review: "Una visión pop e incomprendida de la icónica reina de Francia, atrapada en el lujo.",
    imageUrl: "./img/Marie Antoinette.jpg"
  },
  {
    title: "LOST IN TRANSLATION",
    review: "Dos almas solitarias encuentran una conexión fugaz en medio del neón de Tokio.",
    imageUrl: "./img/LostIn.jpg"
  },
  {
    title: "CRUEL INTENTIONS",
    review: "Juegos de poder, seducción y manipulación entre los adolescentes de la élite de Manhattan.",
    imageUrl: "./img/Cruel intentions .webp"
  },
  {
    title: "POOR THINGS",
    review: "Un cuento de hadas surrealista y feminista sobre el despertar y la evolución de Bella Baxter.",
    imageUrl: "./img/Poorthings.jpg"
  }
];

async function seedMovies() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Conectado a MongoDB');

    // Limpiar colección existente
    await Movie.deleteMany({});
    console.log('Colección limpiada');

    // Insertar películas
    const movies = await Movie.insertMany(moviesData);
    console.log(` Insertadas ${movies.length} películas`);

    console.log('Películas insertadas:');
    movies.forEach(movie => console.log(`- ${movie.title}`));

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Conexión cerrada');
  }
}

seedMovies();
