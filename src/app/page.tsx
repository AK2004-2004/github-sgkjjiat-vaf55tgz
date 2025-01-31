'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Shield, Zap } from 'lucide-react'
import { GoogleLogin } from '@react-oauth/google'
import { FilterConfig } from '@/components/FilterConfig'
import { Header } from '@/components/Header'
import type { User, FilterConfig as FilterConfigType } from '@/types'

const DEMO_USER: User = {
  email: 'demo@example.com',
  name: 'Utilisateur Démo',
  picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces'
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [filterConfig, setFilterConfig] = useState<FilterConfigType>({
    enabled: false,
    autoReplyMessage: "Je suis actuellement en train d'utiliser un filtre email. Pour les sujets urgents, merci de me contacter par un autre canal.",
    exceptions: []
  })

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const handleLogin = async (credentialResponse: any) => {
    try {
      const token = credentialResponse.credential
      const payload = JSON.parse(atob(token.split('.')[1]))
      
      const user = {
        email: payload.email,
        name: payload.name,
        picture: payload.picture
      }
      
      setUser(user)
      localStorage.setItem('user', JSON.stringify(user))
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleDemoLogin = () => {
    setUser(DEMO_USER)
    localStorage.setItem('user', JSON.stringify(DEMO_USER))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <motion.div 
          className="w-1/2 p-12 flex flex-col justify-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-md">
            <motion.div 
              className="flex items-center space-x-4 mb-8"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Shield className="w-12 h-12 text-indigo-600" />
              <Mail className="w-12 h-12 text-purple-600" />
            </motion.div>
            
            <motion.h2 
              className="text-2xl font-semibold text-gray-700 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Connectez-vous pour commencer
            </motion.h2>
            
            <motion.p 
              className="text-gray-600 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Protégez votre boîte de réception et reprenez le contrôle de vos emails
            </motion.p>

            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-full max-w-sm">
                <GoogleLogin
                  onSuccess={handleLogin}
                  onError={() => console.error('Login failed')}
                  useOneTap={false}
                  type="standard"
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                  width={280}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>

              <button
                onClick={handleDemoLogin}
                className="w-full max-w-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Mode démo</span>
                <Zap className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          className="w-1/2 gradient-bg flex items-center justify-center p-12 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926')] opacity-10 bg-cover bg-center"></div>
          <div className="blur-circle w-72 h-72 top-0 right-0 -translate-y-1/2 translate-x-1/2"></div>
          <div className="blur-circle w-96 h-96 bottom-0 left-0 translate-y-1/2 -translate-x-1/2"></div>
          
          <motion.div 
            className="relative z-10 text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h1 className="text-8xl font-black text-white mb-6 tracking-tight leading-none">
              KILL
              <br />
              SWITCH
            </h1>
            <p className="text-xl text-white/90 max-w-md mx-auto leading-relaxed">
              Votre solution radicale pour une boîte mail sans distractions
            </p>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <FilterConfig config={filterConfig} onUpdate={setFilterConfig} />
    </>
  )
}