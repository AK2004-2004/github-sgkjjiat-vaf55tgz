'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Calendar, Zap } from 'lucide-react'

const DAYS = [
  { label: 'L', value: 1 },
  { label: 'Ma', value: 2 },
  { label: 'Me', value: 3 },
  { label: 'J', value: 4 },
  { label: 'V', value: 5 },
  { label: 'S', value: 6 },
  { label: 'D', value: 0 }
] as const

export default function Settings() {
  const [settings, setSettings] = useState({
    filterMode: 'normal',
    filterStartTime: '18:00',
    filterEndTime: '09:00',
    activeDays: [1, 2, 3, 4, 5],
    vacationStart: '',
    vacationEnd: ''
  })

  useEffect(() => {
    const savedSettings = localStorage.getItem('filterSettings')
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem('filterSettings', JSON.stringify(settings))
    const saveButton = document.getElementById('saveSettings')
    if (saveButton) {
      saveButton.textContent = 'Modifications enregistrées !'
      saveButton.classList.add('success')
      setTimeout(() => {
        saveButton.textContent = 'Enregistrer les modifications'
        saveButton.classList.remove('success')
      }, 2000)
    }
  }

  const toggleDay = (dayValue: number) => {
    const newActiveDays = settings.activeDays.includes(dayValue)
      ? settings.activeDays.filter(d => d !== dayValue)
      : [...settings.activeDays, dayValue]
    setSettings({ ...settings, activeDays: newActiveDays })
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <motion.div 
        className="flex items-center space-x-4 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Paramètres</h1>
      </motion.div>

      <div className="space-y-8">
        {/* Filter Mode Section */}
        <motion.section 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <Zap className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Mode de filtrage
            </h2>
          </div>
          <div className="grid gap-4">
            <motion.label 
              className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name="filterMode"
                value="normal"
                checked={settings.filterMode === 'normal'}
                onChange={(e) => setSettings({ ...settings, filterMode: e.target.value })}
                className="w-4 h-4 text-indigo-600"
              />
              <div className="ml-4">
                <span className="block font-medium text-gray-900">Mode normal</span>
                <span className="text-sm text-gray-500">Les emails filtrés sont déplacés dans la corbeille</span>
              </div>
            </motion.label>
            <motion.label 
              className="relative flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <input
                type="radio"
                name="filterMode"
                value="aggressive"
                checked={settings.filterMode === 'aggressive'}
                onChange={(e) => setSettings({ ...settings, filterMode: e.target.value })}
                className="w-4 h-4 text-indigo-600"
              />
              <div className="ml-4">
                <span className="block font-medium text-gray-900">Mode agressif</span>
                <span className="text-sm text-gray-500">Les emails sont supprimés définitivement dès leur réception</span>
              </div>
            </motion.label>
          </div>
        </motion.section>

        {/* Schedule Section */}
        <motion.section 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Planification
            </h2>
          </div>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Horaires de filtrage</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="time"
                  value={settings.filterStartTime}
                  onChange={(e) => setSettings({ ...settings, filterStartTime: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
                <span className="text-gray-500">à</span>
                <input
                  type="time"
                  value={settings.filterEndTime}
                  onChange={(e) => setSettings({ ...settings, filterEndTime: e.target.value })}
                  className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Jours actifs</h3>
              <div className="flex space-x-2">
                {DAYS.map(({ label, value }) => (
                  <motion.button
                    key={value}
                    onClick={() => toggleDay(value)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      settings.activeDays.includes(value)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Vacation Mode Section */}
        <motion.section 
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Mode vacances
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                value={settings.vacationStart}
                onChange={(e) => setSettings({ ...settings, vacationStart: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                value={settings.vacationEnd}
                onChange={(e) => setSettings({ ...settings, vacationEnd: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </motion.section>
      </div>

      <motion.div 
        className="mt-8 flex justify-end"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <motion.button
          id="saveSettings"
          onClick={handleSave}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enregistrer les modifications
        </motion.button>
      </motion.div>
    </div>
  )
}