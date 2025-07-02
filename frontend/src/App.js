import React, { useState, useEffect } from 'react';
import './App.css';
import { NetflixHeader, HeroBanner, ContentRow, LoadingSpinner, NetflixFooter } from './components';

const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Mock data for fallback
const mockMovies = {
  trending: [
    { id: 1, title: 'Stranger Things', overview: 'Quando um garoto some, uma cidade descobre segredos sombrios.' },
    { id: 2, title: 'The Crown', overview: 'A história da família real britânica.' },
    { id: 3, title: 'Ozark', overview: 'Uma família se muda para as montanhas Ozark.' },
    { id: 4, title: 'The Witcher', overview: 'Geralt de Rivia, um caçador de monstros.' },
    { id: 5, title: 'Money Heist', overview: 'Um grupo de ladrões planeja o maior assalto da história.' },
    { id: 6, title: 'Bridgerton', overview: 'Romance e drama na alta sociedade londrina.' }
  ],
  popular: [
    { id: 7, title: 'Squid Game', overview: 'Pessoas endividadas competem em jogos mortais.' },
    { id: 8, title: 'Wednesday', overview: 'A filha mais nova da Família Addams.' },
    { id: 9, title: 'The Umbrella Academy', overview: 'Super-heróis disfuncionais salvam o mundo.' },
    { id: 10, title: 'Lucifer', overview: 'O próprio diabo ajuda a resolver crimes.' },
    { id: 11, title: 'Elite', overview: 'Três adolescentes da classe trabalhadora.' },
    { id: 12, title: 'Dark', overview: 'Mistérios temporais em uma pequena cidade alemã.' }
  ],
  action: [
    { id: 13, title: 'Extraction', overview: 'Um mercenário em uma missão de resgate.' },
    { id: 14, title: 'The Old Guard', overview: 'Guerreiros imortais em tempos modernos.' },
    { id: 15, title: 'Project Power', overview: 'Pílulas que dão superpoderes por 5 minutos.' },
    { id: 16, title: '6 Underground', overview: 'Seis vigilantes fingem suas mortes.' },
    { id: 17, title: 'Triple Frontier', overview: 'Ex-soldados planejam um assalto.' },
    { id: 18, title: 'Bright', overview: 'Policiais e criaturas fantásticas.' }
  ],
  horror: [
    { id: 19, title: 'The Haunting of Hill House', overview: 'Uma família assombrada por seu passado.' },
    { id: 20, title: 'Midnight Mass', overview: 'Eventos sobrenaturais em uma ilha.' },
    { id: 21, title: 'Archive 81', overview: 'Um arquivista restaura fitas misteriosas.' },
    { id: 22, title: 'The Midnight Club', overview: 'Adolescentes terminais contam histórias.' },
    { id: 23, title: 'Marianne', overview: 'Uma escritora de terror enfrenta seus demônios.' },
    { id: 24, title: 'Ratched', overview: 'A origem da enfermeira mais cruel do cinema.' }
  ]
};

// Images for different categories
const categoryImages = {
  trending: [
    'https://images.pexels.com/photos/7149329/pexels-photo-7149329.jpeg',
    'https://images.unsplash.com/photo-1590179068383-b9c69aacebd3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHBvc3RlcnN8ZW58MHx8fGJsYWNrfDE3NTEzNjI5NzN8MA&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1715305278832-4e4a15d1a083?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxtb3ZpZSUyMHBvc3RlcnN8ZW58MHx8fGJsYWNrfDE3NTEzNjI5NzN8MA&ixlib=rb-4.1.0&q=85',
    'https://images.pexels.com/photos/4551914/pexels-photo-4551914.jpeg',
    'https://images.unsplash.com/photo-1655057011043-158c48f3809d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHx0diUyMHNlcmllc3xlbnwwfHx8YmxhY2t8MTc1MTQ2NzY2OHww&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1717548381519-10ee59c67150?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHx0diUyMHNlcmllc3xlbnwwfHx8YmxhY2t8MTc1MTQ2NzY2OHww&ixlib=rb-4.1.0&q=85'
  ],
  popular: [
    'https://images.pexels.com/photos/1983035/pexels-photo-1983035.jpeg',
    'https://images.pexels.com/photos/7618392/pexels-photo-7618392.jpeg',
    'https://images.unsplash.com/photo-1583384649873-06f3e4231207?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwxfHxkb2N1bWVudGFyeSUyMGZpbG1zfGVufDB8fHxibGFja3wxNzUxNDY3NjczfDA&ixlib=rb-4.1.0&q=85',
    'https://images.unsplash.com/photo-1572598638399-22f31bad6747?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1NzZ8MHwxfHNlYXJjaHwzfHxkb2N1bWVudGFyeSUyMGZpbG1zfGVufDB8fHxibGFja3wxNzUxNDY3NjczfDA&ixlib=rb-4.1.0&q=85',
    'https://images.pexels.com/photos/7149329/pexels-photo-7149329.jpeg',
    'https://images.pexels.com/photos/4551914/pexels-photo-4551914.jpeg'
  ],
  action: [
    'https://images.pexels.com/photos/6091649/pexels-photo-6091649.jpeg',
    'https://images.pexels.com/photos/9944851/pexels-photo-9944851.jpeg',
    'https://images.pexels.com/photos/5037540/pexels-photo-5037540.jpeg',
    'https://images.pexels.com/photos/6091649/pexels-photo-6091649.jpeg',
    'https://images.pexels.com/photos/9944851/pexels-photo-9944851.jpeg',
    'https://images.pexels.com/photos/5037540/pexels-photo-5037540.jpeg'
  ],
  horror: [
    'https://images.pexels.com/photos/1358833/pexels-photo-1358833.jpeg',
    'https://images.pexels.com/photos/6036202/pexels-photo-6036202.jpeg',
    'https://images.unsplash.com/photo-1657305247808-4a4ad8cf4464?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxzY2ktZmklMjB0aHJpbGxlcnxlbnwwfHx8YmxhY2t8MTc1MTQ2NzY2Mnww&ixlib=rb-4.1.0&q=85',
    'https://images.pexels.com/photos/1358833/pexels-photo-1358833.jpeg',
    'https://images.pexels.com/photos/6036202/pexels-photo-6036202.jpeg',
    'https://images.unsplash.com/photo-1657305247808-4a4ad8cf4464?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHxzY2ktZmklMjB0aHJpbGxlcnxlbnwwfHx8YmxhY2t8MTc1MTQ2NzY2Mnww&ixlib=rb-4.1.0&q=85'
  ]
};

function App() {
  const [movies, setMovies] = useState(mockMovies);
  const [loading, setLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Try to fetch from TMDB API
        const [trendingResponse, popularResponse, actionResponse, horrorResponse] = await Promise.all([
          fetch(`${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}&language=pt-BR`),
          fetch(`${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR`),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=28`),
          fetch(`${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&language=pt-BR&with_genres=27`)
        ]);

        if (trendingResponse.ok && popularResponse.ok && actionResponse.ok && horrorResponse.ok) {
          const [trending, popular, action, horror] = await Promise.all([
            trendingResponse.json(),
            popularResponse.json(),
            actionResponse.json(),
            horrorResponse.json()
          ]);

          setMovies({
            trending: trending.results?.slice(0, 6) || mockMovies.trending,
            popular: popular.results?.slice(0, 6) || mockMovies.popular,
            action: action.results?.slice(0, 6) || mockMovies.action,
            horror: horror.results?.slice(0, 6) || mockMovies.horror
          });

          // Set hero movie from trending
          if (trending.results && trending.results.length > 0) {
            setHeroMovie(trending.results[0]);
          }
        } else {
          // Use mock data if API fails
          setMovies(mockMovies);
          setHeroMovie(mockMovies.trending[0]);
        }
      } catch (error) {
        console.error('Error fetching movies:', error);
        // Use mock data as fallback
        setMovies(mockMovies);
        setHeroMovie(mockMovies.trending[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleSearch = (searchTerm) => {
    console.log('Searching for:', searchTerm);
    // Implement search functionality here
  };

  const handleProfileClick = () => {
    console.log('Profile clicked');
    // Implement profile functionality here
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader onSearch={handleSearch} onProfileClick={handleProfileClick} />
      
      <main>
        <HeroBanner movie={heroMovie} />
        
        <div className="relative z-10 -mt-32 pb-20">
          <ContentRow 
            title="Em Alta" 
            movies={movies.trending} 
            images={categoryImages.trending}
          />
          <ContentRow 
            title="Populares na Netflix" 
            movies={movies.popular} 
            images={categoryImages.popular}
          />
          <ContentRow 
            title="Ação & Aventura" 
            movies={movies.action} 
            images={categoryImages.action}
          />
          <ContentRow 
            title="Terror & Suspense" 
            movies={movies.horror} 
            images={categoryImages.horror}
          />
        </div>
      </main>
      
      <NetflixFooter />
    </div>
  );
}

export default App;