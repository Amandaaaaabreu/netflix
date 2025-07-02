import React, { useState, useEffect } from 'react';
import './App.css';
import { 
  NetflixHeader, 
  HeroBanner, 
  ContentRow, 
  LoadingSpinner, 
  NetflixFooter, 
  LoginModal, 
  MyListSection,
  SectionContent
} from './components';

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
    'https://images.unsplash.com/photo-1657305247808-4a4ad8cf4464?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHhzY2ktZmklMjB0aHJpbGxlcnxlbnwwfHx8YmxhY2t8MTc1MTQ2NzY2Mnww&ixlib=rb-4.1.0&q=85'
  ]
};

function App() {
  const [movies, setMovies] = useState(mockMovies);
  const [loading, setLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [myList, setMyList] = useState([]);
  const [currentSection, setCurrentSection] = useState('home');
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Load user data from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('netflixUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedMyList = localStorage.getItem('netflixMyList');
    if (savedMyList) {
      setMyList(JSON.parse(savedMyList));
    }
  }, []);

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('netflixUser', JSON.stringify(currentUser));
    }
  }, [currentUser]);

  // Save my list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('netflixMyList', JSON.stringify(myList));
  }, [myList]);

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

  const handleLogin = (userData) => {
    setCurrentUser(userData);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setMyList([]);
    localStorage.removeItem('netflixUser');
    localStorage.removeItem('netflixMyList');
    setCurrentSection('home');
  };

  const handleAddToList = (movie) => {
    if (!currentUser) {
      alert('Faça login para adicionar à sua lista');
      return;
    }

    const isAlreadyInList = myList.some(item => item.id === movie.id);
    if (!isAlreadyInList) {
      setMyList([...myList, movie]);
    }
  };

  const handleRemoveFromList = (movie) => {
    setMyList(myList.filter(item => item.id !== movie.id));
  };

  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      setSearchTerm('');
      return;
    }

    setSearchTerm(searchTerm);
    
    try {
      const response = await fetch(
        `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=pt-BR&query=${encodeURIComponent(searchTerm)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.results?.slice(0, 20) || []);
      }
    } catch (error) {
      console.error('Error searching:', error);
      // Fallback to simple mock search
      const allMovies = [...mockMovies.trending, ...mockMovies.popular, ...mockMovies.action, ...mockMovies.horror];
      const filtered = allMovies.filter(movie => 
        movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const isInMyList = (movie) => {
    return myList.some(item => item.id === movie.id);
  };

  const getAllImages = () => {
    return [...categoryImages.trending, ...categoryImages.popular, ...categoryImages.action, ...categoryImages.horror];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const renderContent = () => {
    switch (currentSection) {
      case 'mylist':
        return (
          <MyListSection
            myList={myList}
            images={getAllImages()}
            onRemoveFromList={handleRemoveFromList}
            onAddToList={handleAddToList}
            currentUser={currentUser}
          />
        );
      case 'series':
      case 'movies':
      case 'trending':
        return (
          <SectionContent
            section={currentSection}
            movies={movies}
            images={categoryImages}
            onAddToList={handleAddToList}
            onRemoveFromList={handleRemoveFromList}
            myList={myList}
            currentUser={currentUser}
          />
        );
      case 'search':
        return (
          <div className="min-h-screen bg-black text-white pt-20">
            <div className="px-4 md:px-12 py-20">
              <h1 className="text-4xl font-bold mb-8">
                Resultados para "{searchTerm}"
              </h1>
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {searchResults.map((movie, index) => (
                    <div
                      key={movie.id}
                      className="relative bg-gray-800 rounded cursor-pointer transform transition-all duration-300 hover:scale-105"
                    >
                      <img
                        src={getAllImages()[index % getAllImages().length]}
                        alt={movie.title || movie.name}
                        className="w-full h-32 object-cover rounded"
                        loading="lazy"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                        <div className="text-center text-white p-2">
                          <h3 className="text-sm font-semibold mb-2 truncate">{movie.title || movie.name}</h3>
                          <div className="flex justify-center space-x-2">
                            <button 
                              onClick={() => alert(`Reproduzindo: ${movie.title || movie.name}`)}
                              className="bg-white text-black rounded-full p-1 hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </button>
                            
                            {isInMyList(movie) ? (
                              <button 
                                onClick={() => handleRemoveFromList(movie)}
                                className="bg-green-600 text-white rounded-full p-1 hover:bg-green-700 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                            ) : (
                              <button 
                                onClick={() => handleAddToList(movie)}
                                className="bg-gray-600/70 text-white rounded-full p-1 hover:bg-gray-600/90 transition-colors"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-lg">Nenhum resultado encontrado.</p>
              )}
            </div>
          </div>
        );
      default: // home
        return (
          <>
            <HeroBanner 
              movie={heroMovie} 
              onAddToList={handleAddToList}
              onRemoveFromList={handleRemoveFromList}
              isInMyList={isInMyList(heroMovie)}
              currentUser={currentUser}
            />
            
            <div className="relative z-10 -mt-32 pb-20">
              <ContentRow 
                title="Em Alta" 
                movies={movies.trending} 
                images={categoryImages.trending}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                myList={myList}
                currentUser={currentUser}
              />
              <ContentRow 
                title="Populares na Netflix" 
                movies={movies.popular} 
                images={categoryImages.popular}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                myList={myList}
                currentUser={currentUser}
              />
              <ContentRow 
                title="Ação & Aventura" 
                movies={movies.action} 
                images={categoryImages.action}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                myList={myList}
                currentUser={currentUser}
              />
              <ContentRow 
                title="Terror & Suspense" 
                movies={movies.horror} 
                images={categoryImages.horror}
                onAddToList={handleAddToList}
                onRemoveFromList={handleRemoveFromList}
                myList={myList}
                currentUser={currentUser}
              />
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <NetflixHeader 
        onSearch={(term) => {
          handleSearch(term);
          setCurrentSection('search');
        }}
        onProfileClick={() => setCurrentSection('profile')}
        currentUser={currentUser}
        onLoginClick={() => setShowLoginModal(true)}
        onLogout={handleLogout}
        currentSection={currentSection}
        onSectionChange={setCurrentSection}
      />
      
      <main>
        {renderContent()}
      </main>
      
      {currentSection === 'home' && <NetflixFooter />}
      
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}

export default App;