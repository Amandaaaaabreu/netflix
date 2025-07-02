import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Netflix Header Component
export const NetflixHeader = ({ 
  onSearch, 
  onProfileClick, 
  currentUser, 
  onLoginClick, 
  onLogout, 
  currentSection, 
  onSectionChange 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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

  const sections = [
    { id: 'home', label: 'Início' },
    { id: 'series', label: 'Séries' },
    { id: 'movies', label: 'Filmes' },
    { id: 'trending', label: 'Bombando' },
    { id: 'mylist', label: 'Minha Lista' }
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 md:px-12 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-red-600 text-2xl md:text-3xl font-bold cursor-pointer"
              onClick={() => onSectionChange('home')}>
            NETFLIX
          </h1>
          <nav className="hidden md:flex space-x-6">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`transition-colors ${
                  currentSection === section.id 
                    ? 'text-white font-semibold' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {section.label}
              </button>
            ))}
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

          {/* Profile or Login */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="w-8 h-8 bg-red-600 rounded text-white flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </button>
              {showProfileMenu && (
                <div className="absolute right-0 top-10 bg-black/95 border border-gray-700 rounded-lg p-4 w-48">
                  <div className="text-white mb-2">
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-sm text-gray-400">{currentUser.email}</p>
                  </div>
                  <hr className="border-gray-700 my-2" />
                  <button
                    onClick={() => {
                      onSectionChange('profile');
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left text-white hover:text-gray-300 py-1"
                  >
                    Gerenciar Perfis
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowProfileMenu(false);
                    }}
                    className="block w-full text-left text-white hover:text-gray-300 py-1"
                  >
                    Sair da Netflix
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onLoginClick}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Entrar
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

// Login Modal Component
export const LoginModal = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Nome é obrigatório';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const userData = {
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        password: formData.password
      };
      onLogin(userData);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black/95 border border-gray-700 rounded-lg p-8 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-2xl font-bold">
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Nome completo"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-red-600"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-red-600"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-red-600"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {!isLogin && (
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmar senha"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:border-red-600"
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
          >
            {isLogin ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            {isLogin ? 'Novo na Netflix?' : 'Já tem uma conta?'}
          </p>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-600 hover:text-red-500 font-semibold"
          >
            {isLogin ? 'Assine agora' : 'Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Hero Banner Component
export const HeroBanner = ({ movie, onAddToList, onRemoveFromList, isInMyList, currentUser }) => {
  const handlePlay = () => {
    alert(`Reproduzindo: ${movie?.title || 'Conteúdo selecionado'}`);
  };

  const handleMoreInfo = () => {
    alert(`Mais informações sobre: ${movie?.title || 'Conteúdo selecionado'}`);
  };

  const handleMyListToggle = () => {
    if (!currentUser) {
      alert('Faça login para adicionar à sua lista');
      return;
    }
    
    if (isInMyList) {
      onRemoveFromList(movie);
    } else {
      onAddToList(movie);
    }
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
          {movie?.title || movie?.name || 'Stranger Things'}
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

          <button
            onClick={handleMyListToggle}
            className="flex items-center justify-center px-8 py-3 bg-gray-600/70 text-white text-lg font-semibold rounded hover:bg-gray-600/90 transition-colors"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isInMyList ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
            </svg>
            {isInMyList ? 'Na Minha Lista' : 'Minha Lista'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Content Row Component
export const ContentRow = ({ title, movies, images, onAddToList, onRemoveFromList, myList, currentUser }) => {
  const scrollRef = useRef(null);

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

  const handleAddToList = (movie) => {
    if (!currentUser) {
      alert('Faça login para adicionar à sua lista');
      return;
    }
    onAddToList(movie);
  };

  const handleRemoveFromList = (movie) => {
    onRemoveFromList(movie);
  };

  const isInMyList = (movie) => {
    return myList.some(item => item.id === movie.id);
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
                  <h3 className="text-sm font-semibold mb-2 truncate">{movie.title || movie.name}</h3>
                  <div className="flex justify-center space-x-2">
                    <button 
                      onClick={() => handleItemClick(movie)}
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
                        title="Remover da Minha Lista"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleAddToList(movie)}
                        className="bg-gray-600/70 text-white rounded-full p-1 hover:bg-gray-600/90 transition-colors"
                        title="Adicionar à Minha Lista"
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
      </div>
    </div>
  );
};

// My List Component
export const MyListSection = ({ myList, images, onRemoveFromList, onAddToList, currentUser }) => {
  const handleItemClick = (movie) => {
    alert(`Reproduzindo: ${movie.title || movie.name}`);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="px-4 md:px-12 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Faça login para ver sua lista</h1>
            <p className="text-gray-400 text-lg">Você precisa estar logado para acessar sua lista personalizada.</p>
          </div>
        </div>
      </div>
    );
  }

  if (myList.length === 0) {
    return (
      <div className="min-h-screen bg-black text-white pt-20">
        <div className="px-4 md:px-12 py-20">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Sua lista está vazia</h1>
            <p className="text-gray-400 text-lg">Adicione filmes e séries à sua lista para assisti-los depois.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="px-4 md:px-12 py-20">
        <h1 className="text-4xl font-bold mb-8">Minha Lista</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {myList.map((movie, index) => (
            <div
              key={movie.id}
              className="relative bg-gray-800 rounded cursor-pointer transform transition-all duration-300 hover:scale-105"
            >
              <img
                src={images[index % images.length]}
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
                      onClick={() => handleItemClick(movie)}
                      className="bg-white text-black rounded-full p-1 hover:bg-gray-200 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => onRemoveFromList(movie)}
                      className="bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                      title="Remover da Lista"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

// Section Content Component
export const SectionContent = ({ section, movies, images, onAddToList, onRemoveFromList, myList, currentUser }) => {
  const getSectionTitle = () => {
    switch(section) {
      case 'series': return 'Séries';
      case 'movies': return 'Filmes';
      case 'trending': return 'Bombando';
      default: return 'Conteúdo';
    }
  };

  const getSectionMovies = () => {
    switch(section) {
      case 'series': return movies.popular || [];
      case 'movies': return movies.action || [];
      case 'trending': return movies.trending || [];
      default: return [];
    }
  };

  const getSectionImages = () => {
    switch(section) {
      case 'series': return images.popular || [];
      case 'movies': return images.action || [];
      case 'trending': return images.trending || [];
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <div className="py-20">
        <ContentRow
          title={getSectionTitle()}
          movies={getSectionMovies()}
          images={getSectionImages()}
          onAddToList={onAddToList}
          onRemoveFromList={onRemoveFromList}
          myList={myList}
          currentUser={currentUser}
        />
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