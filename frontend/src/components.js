import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Netflix Header Component
export const NetflixHeader = ({ onSearch, onProfileClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold">NETFLIX</h1>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Início</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Séries</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Filmes</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Bombando</a>
            <a href="#" className="text-white hover:text-gray-300 transition-colors">Minha Lista</a>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {showSearch && (
              <form onSubmit={handleSearch} className="absolute right-0 top-8">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Títulos, pessoas, gêneros"
                  className="bg-black/90 text-white px-4 py-2 rounded border border-gray-600 focus:outline-none focus:border-white"
                  autoFocus
                />
              </form>
            )}
          </div>

          {/* Notifications */}
          <button className="text-white hover:text-gray-300 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            </svg>
          </button>

          {/* Profile */}
          <button
            onClick={onProfileClick}
            className="w-8 h-8 bg-red-600 rounded text-white flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

// Hero Banner Component
export const HeroBanner = ({ movie }) => {
  const [trailer, setTrailer] = useState('');

  const handlePlay = () => {
    // For demo purposes, we'll just show an alert
    alert(`Reproduzindo: ${movie?.title || 'Conteúdo selecionado'}`);
  };

  const handleMoreInfo = () => {
    alert(`Mais informações sobre: ${movie?.title || 'Conteúdo selecionado'}`);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(https://images.pexels.com/photos/956999/milky-way-starry-sky-night-sky-star-956999.jpeg)`
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
          {movie?.title || 'Stranger Things'}
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed">
          {movie?.overview || 'Quando um garoto some, uma cidade descobre segredos sombrios, criaturas sobrenaturais e uma garota peculiar com poderes extraordinários.'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handlePlay}
            className="flex items-center justify-center px-8 py-3 bg-white text-black text-lg font-semibold rounded hover:bg-gray-200 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            Assistir
          </button>
          <button
            onClick={handleMoreInfo}
            className="flex items-center justify-center px-8 py-3 bg-gray-600/70 text-white text-lg font-semibold rounded hover:bg-gray-600/90 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Mais Informações
          </button>
        </div>
      </div>
    </div>
  );
};

// Content Row Component
export const ContentRow = ({ title, movies, images }) => {
  const scrollRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const handleItemClick = (movie) => {
    alert(`Reproduzindo: ${movie.title || movie.name}`);
  };

  return (
    <div className="mb-8 px-4 md:px-12">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">{title}</h2>
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Content Grid */}
        <div
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie, index) => (
            <div
              key={movie.id || index}
              className="relative flex-shrink-0 w-48 h-28 bg-gray-800 rounded cursor-pointer transform transition-all duration-300 hover:scale-105 hover:z-10"
              onClick={() => handleItemClick(movie)}
              onMouseEnter={() => setHoveredItem(movie.id || index)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <img
                src={images[index % images.length]}
                alt={movie.title || movie.name}
                className="w-full h-full object-cover rounded"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                <div className="text-center text-white p-2">
                  <h3 className="text-sm font-semibold mb-1 truncate">{movie.title || movie.name}</h3>
                  <div className="flex justify-center space-x-2">
                    <button className="bg-white text-black rounded-full p-1 hover:bg-gray-200 transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                    <button className="bg-gray-600/70 text-white rounded-full p-1 hover:bg-gray-600/90 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Loading Component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
  </div>
);

// Footer Component
export const NetflixFooter = () => (
  <footer className="bg-black text-gray-400 py-12 px-4 md:px-12">
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-white font-semibold mb-4">Navegação</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Início</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Séries</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Filmes</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Bombando</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Ajuda</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Centro de Ajuda</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Conta</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Informações</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-4">Social</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t border-gray-800 pt-8 text-center">
        <p className="text-sm">&copy; 2025 Netflix Clone. Todos os direitos reservados.</p>
        <p className="text-xs mt-2">Este é um projeto de demonstração criado para fins educacionais.</p>
      </div>
    </div>
  </footer>
);