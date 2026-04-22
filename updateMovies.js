require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/movies');

const movieData = [
  {
    title: 'AMERICAN PSYCHO',
    review: 'Una sátira oscura y sangrienta sobre la superficialidad y el vacío del yuppie neoyorquino.',
    director: 'Mary Harron',
    year: 2000,
    genre: ['Thriller', 'Sátira'],
    rating: 7.6,
    imageUrl: 'https://image.tmdb.org/t/p/w500/gaMi3P3d8TemH9qT7wlvC3d1sUh.jpg'
  },
  {
    title: 'BLACK SWAN',
    review: 'El descenso a la locura de una bailarina consumida por la búsqueda de la perfección.',
    director: 'Darren Aronofsky',
    year: 2010,
    genre: ['Drama', 'Psicológico'],
    rating: 8.0,
    imageUrl: 'https://image.tmdb.org/t/p/w500/hCkVrj63Hs091SNuFsVrCEi0CaS.jpg'
  },
  {
    title: 'BLUE JASMINE',
    review: 'El retrato tragicómico de una mujer de la alta sociedad lidiando con su caída en desgracia.',
    director: 'Woody Allen',
    year: 2013,
    genre: ['Drama'],
    rating: 7.3,
    imageUrl: 'https://image.tmdb.org/t/p/w500/xL6ht15drmAjh5ZBp0vWvfB12Xw.jpg'
  },
  {
    title: 'CRUEL INTENTIONS',
    review: 'Juegos de poder, seducción y manipulación entre los adolescentes de la élite de Manhattan.',
    director: 'Roger Kumble',
    year: 1999,
    genre: ['Drama', 'Romance'],
    rating: 6.6,
    imageUrl: 'https://image.tmdb.org/t/p/w500/6bPKDXMXpMKRr0uGSs6JfZT4VOy.jpg'
  },
  {
    title: 'EYES WIDE SHUT',
    review: 'Una odisea onírica y perturbadora sobre el matrimonio, los celos y el deseo oculto.',
    director: 'Stanley Kubrick',
    year: 1999,
    genre: ['Drama', 'Misterio'],
    rating: 6.9,
    imageUrl: 'https://image.tmdb.org/t/p/w500/lL0Ydmq7RcVEWqFz3V1YKdDJJb5.jpg'
  },
  {
    title: 'KILL BILL',
    review: 'Una épica historia de venganza llena de acción, sangre y referencias al cine de artes marciales.',
    director: 'Quentin Tarantino',
    year: 2003,
    genre: ['Acción', 'Thriller'],
    rating: 8.1,
    imageUrl: 'https://image.tmdb.org/t/p/w500/1JSZpg7awWN8BtMx8VGesas8Lmy.jpg'
  },
  {
    title: 'LOST IN TRANSLATION',
    review: 'Dos almas solitarias encuentran una conexión fugaz en medio del neón de Tokio.',
    director: 'Sofia Coppola',
    year: 2003,
    genre: ['Drama', 'Romance'],
    rating: 7.7,
    imageUrl: 'https://image.tmdb.org/t/p/w500/6wL4_9xKQFJW8jPeXRuFw5T4F3K.jpg'
  },
  {
    title: 'MARIA',
    review: 'Un intenso drama biográfico que explora la vida y el legado de una figura icónica.',
    director: 'Pablo Larraín',
    year: 2024,
    genre: ['Drama', 'Biográfico'],
    rating: 6.1,
    imageUrl: 'https://image.tmdb.org/t/p/w500/qMgwM8I8M8TCfb2yqXAMpJ6XLAH.jpg'
  },
  {
    title: 'MARIE ANTOINETTE',
    review: 'Una visión pop e incomprendida de la icónica reina de Francia, atrapada en el lujo.',
    director: 'Sofia Coppola',
    year: 2006,
    genre: ['Drama', 'Histórico'],
    rating: 6.4,
    imageUrl: 'https://image.tmdb.org/t/p/w500/qCFWF8W5nz0nS1yg4iJYpjlI4Ds.jpg'
  },
  {
    title: 'PERFECT BLUE',
    review: 'Un thriller psicológico animado que difumina la línea entre la realidad y la fantasía.',
    director: 'Satoshi  Kon',
    year: 1997,
    genre: ['Animé', 'Psicológico'],
    rating: 7.8,
    imageUrl: 'https://image.tmdb.org/t/p/w500/6wQ8R1F09w1RfOFVLCK3bI0KN8K.jpg'
  },
  {
    title: 'POOR THINGS',
    review: 'Un cuento de hadas surrealista y feminista sobre el despertar y la evolución de Bella Baxter.',
    director: 'Yorgos Lanthimos',
    year: 2023,
    genre: ['Drama', 'Fantasía'],
    rating: 7.5,
    imageUrl: 'https://image.tmdb.org/t/p/w500/A0bxC3zXJUyc1ojAKIB9aaJHmyB.jpg'
  },
  {
    title: 'PORTRAIT OF A LADY ON FIRE',
    review: 'Un romance de época visualmente deslumbrante que explora la mirada y el deseo.',
    director: 'Céline Sciamma',
    year: 2019,
    genre: ['Drama', 'Romance'],
    rating: 8.1,
    imageUrl: 'https://image.tmdb.org/t/p/w500/4XVeODxEhLzEVpWjzSPJw8yfH4F.jpg'
  },
  {
    title: 'REQUIEM FOR A DREAM',
    review: 'Un retrato visceral de la adicción y sus consecuencias devastadoras en cuatro vidas diferentes.',
    director: 'Darren Aronofsky',
    year: 2000,
    genre: ['Drama', 'Psicológico'],
    rating: 8.4,
    imageUrl: 'https://image.tmdb.org/t/p/w500/Wq0pVmP65KpN9xn7ggKbq4QwSUj.jpg'
  },
  {
    title: 'THE NEON DEMON',
    review: 'Un thriller visual que sumerge al espectador en el mundo tóxico y deslumbrante de la moda de Los Ángeles.',
    director: 'Nicolas Winding Refn',
    year: 2016,
    genre: ['Drama', 'Thriller'],
    rating: 6.3,
    imageUrl: 'https://image.tmdb.org/t/p/w500/eW9nFgYZMBgz0U3DyAg6oPvhYcf.jpg'
  }
];

async function seedDatabase() {
  try {
    console.log('Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecran_infini');

    console.log('Limpiando películas existentes...');
    await Movie.deleteMany({});

    console.log('Creando películas...');
    const created = await Movie.insertMany(movieData);
    console.log(`✅ ${created.length} películas creadas`);

    console.log('Verificando primera película...');
    const firstMovie = await Movie.findOne({ title: 'AMERICAN PSYCHO' });
    console.log({
      title: firstMovie.title,
      director: firstMovie.director,
      year: firstMovie.year,
      imageUrl: firstMovie.imageUrl ? 'Presente' : 'Ausente'
    });

    await mongoose.connection.close();
    console.log('✅ ¡Completado!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedDatabase();

