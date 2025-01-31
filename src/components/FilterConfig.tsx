import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, AlertCircle } from 'lucide-react';
import { createGmailFilter, removeGmailFilter, checkGmailFilter } from '../utils/gmail';
import type { FilterConfig } from '@/types';

interface FilterConfigProps {
  config: FilterConfig;
  onUpdate: (config: FilterConfig) => void;
  accessToken: string;
  user: {
    name: string;
    email: string;
  };
}

export const FilterConfig = ({ config, onUpdate, accessToken }: FilterConfigProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkFilter = async () => {
      if (!accessToken) return;
      
      setIsVerifying(true);
      
      try {
        const filterExists = await checkGmailFilter(accessToken);
        onUpdate(prev => ({ ...prev, enabled: filterExists }));
      } catch (err) {
        console.error('Erreur lors de la vérification du filtre:', err);
        setError("Impossible de vérifier l'état du filtre");
      } finally {
        setIsVerifying(false);
      }
    };

    checkFilter();
  }, [accessToken]);

  const handleToggle = async () => {
    if (isLoading || isVerifying) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (!config.enabled) {
        await createGmailFilter(accessToken);
        onUpdate(prev => ({ ...prev, enabled: true }));
      } else {
        await removeGmailFilter(accessToken);
        onUpdate(prev => ({ ...prev, enabled: false }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      console.error('Erreur lors du toggle du filtre:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonState = () => {
    if (isVerifying) return {
      emoji: '⌛',
      text: 'VÉRIFICATION',
      bgClass: 'bg-gradient-to-br from-yellow-500 to-yellow-600'
    };
    if (isLoading) return {
      emoji: '⏳',
      text: 'CHARGEMENT',
      bgClass: 'bg-gradient-to-br from-blue-500 to-blue-600'
    };
    if (config.enabled) return {
      emoji: '🚫',
      text: 'ACTIF',
      bgClass: 'bg-gradient-to-br from-red-500 to-red-600'
    };
    return {
      emoji: '😴',
      text: 'INACTIF',
      bgClass: 'bg-gradient-to-br from-gray-700 to-gray-800'
    };
  };

  const buttonState = getButtonState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div 
              className="inline-flex items-center justify-center p-2 bg-red-500/10 rounded-2xl mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Shield className="w-8 h-8 text-red-500 mr-2" />
              <Mail className="w-8 h-8 text-red-400" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-4">
              Filtre Email
            </h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Ce filtre supprimera automatiquement TOUS les emails
            </p>
          </motion.div>

          <motion.div 
            className="bg-black/30 backdrop-blur-xl rounded-2xl p-8 mb-8 border border-white/10 relative overflow-hidden group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <div className="flex justify-center mb-8">
              <motion.button
                onClick={handleToggle}
                disabled={isLoading || isVerifying}
                className={`relative inline-flex flex-col items-center justify-center w-48 h-48 rounded-2xl transition-all duration-300 ${
                  buttonState.bgClass
                } shadow-lg hover:shadow-xl border border-white/20 ${
                  (isLoading || isVerifying) ? 'cursor-not-allowed opacity-75' : ''
                }`}
                whileHover={{ scale: (isLoading || isVerifying) ? 1 : 1.05 }}
                whileTap={{ scale: (isLoading || isVerifying) ? 1 : 0.95 }}
              >
                <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                <span className="text-5xl mb-4 relative z-10">
                  {buttonState.emoji}
                </span>
                <span className="text-xl font-bold text-white mb-2 relative z-10">
                  {buttonState.text}
                </span>
                
                {(isLoading || isVerifying) && (
                  <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </motion.button>
            </div>

            <div className="text-center">
              <p className="text-lg font-medium text-white/90">
                {isVerifying 
                  ? "Vérification de l'état du filtre..."
                  : isLoading
                    ? "Mise à jour du filtre en cours..."
                    : config.enabled 
                      ? "Le filtre est actif. Tous les emails seront automatiquement supprimés."
                      : "Le filtre est inactif. Aucun email ne sera filtré."}
              </p>
            </div>
          </motion.div>

          {error && (
            <motion.div 
              className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5" />
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};