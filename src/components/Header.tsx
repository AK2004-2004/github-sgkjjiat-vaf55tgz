import { Mail } from 'lucide-react';
import type { User } from '@/types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export const Header = ({ user, onLogout }: HeaderProps) => {
  return (
    <header className="relative">
      <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-red-900 to-black"></div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-20 rounded-lg blur group-hover:opacity-30 transition-opacity"></div>
              <Mail className="h-8 w-8 text-white relative z-10" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              KILL SWITCH
            </h1>
          </div>
          
          {user && (
            <div className="flex items-center space-x-4">
              <img
                src={user.picture}
                alt={user.name}
                className="w-10 h-10 rounded-full ring-2 ring-white/20"
              />
              <button
                onClick={onLogout}
                className="text-sm font-medium text-white hover:text-red-200 transition-colors duration-200"
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};