import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Header } from './components/Header';
import { FilterConfig as FilterConfigComponent } from './components/FilterConfig';
import { ShieldOff, Zap, Mail } from 'lucide-react';
import type { FilterConfig, User } from './types';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string>('');
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    enabled: false,
    exceptions: []
  });

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const userInfo = await userInfoResponse.json();
        const user = {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
    },
    scope: 'https://www.googleapis.com/auth/gmail.settings.basic https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    flow: 'implicit'
  });

  const handleLogout = () => {
    setUser(null);
    setAccessToken('');
    localStorage.removeItem('user');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const LoginPage = ({ onLogin }: { onLogin: () => void }) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="flex flex-col items-center justify-center min-h-screen relative z-10 px-4">
        <div className="relative mb-12 animate-float">
          <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 rounded-full"></div>
          <div className="relative flex items-center justify-center space-x-4">
            <div className="bg-gradient-to-br from-red-500 to-red-600 w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl transform -rotate-12">
              <Mail className="w-12 h-12 text-white" />
            </div>
            <div className="bg-gradient-to-br from-red-600 to-red-700 w-24 h-24 rounded-2xl flex items-center justify-center shadow-2xl transform rotate-12">
              <ShieldOff className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>

        <h1 className="text-7xl md:text-8xl font-black text-center mb-6 tracking-tighter relative">
          <span className="absolute -inset-1 bg-red-500/30 blur-2xl rounded-full"></span>
          <span className="relative bg-gradient-to-r from-white via-white to-red-200 bg-clip-text text-transparent">
            KILL SWITCH
          </span>
        </h1>

        <p className="text-xl text-white/80 max-w-md text-center mb-16 leading-relaxed">
          Votre solution radicale pour une boîte mail sans distractions
        </p>

        <div className="flex flex-col items-center space-y-8 w-full max-w-md">
          <div className="w-full bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Connectez-vous avec Gmail</h2>
            <div className="flex justify-center">
              <button
                onClick={() => onLogin()}
                className="px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Se connecter avec Google</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { 
                title: 'Filtrage Simple',
                desc: 'Basé sur la taille et un mot secret',
                icon: <Mail className="w-8 h-8 mb-4 text-red-400" />
              },
              { 
                title: 'Protection',
                desc: 'Suppression automatique',
                icon: <Zap className="w-8 h-8 mb-4 text-purple-400" />
              },
              { 
                title: 'Exceptions',
                desc: 'Gardez les messages importants',
                icon: <ShieldOff className="w-8 h-8 mb-4 text-pink-400" />
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-105 flex flex-col items-center text-center group"
              >
                <div className="transform transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-white/60">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <div className="min-h-screen">
        {user && <Header user={user} onLogout={handleLogout} />}
        <main>
          <Routes>
            <Route path="/" element={
              !user ? (
                <LoginPage onLogin={login} />
              ) : (
                <FilterConfigComponent 
                  config={filterConfig} 
                  onUpdate={setFilterConfig}
                  accessToken={accessToken}
                  user={{
                    name: user.name,
                    email: user.email
                  }}
                />
              )
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;