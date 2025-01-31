import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, Zap } from 'lucide-react';

const DAYS = [
  { label: 'L', value: 1 },
  { label: 'Ma', value: 2 },
  { label: 'Me', value: 3 },
  { label: 'J', value: 4 },
  { label: 'V', value: 5 },
  { label: 'S', value: 6 },
  { label: 'D', value: 0 }
] as const;

export const Settings = () => {
  const [settings, setSettings] = useState({
    filterMode: 'normal',
    filterStartTime: '18:00',
    filterEndTime: '09:00',
    activeDays: [1, 2, 3, 4, 5]
  });

  useEffect(() => {
    const savedSettings = localStorage.getItem('filterSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('filterSettings', JSON.stringify(settings));
    const saveButton = document.getElementById('saveSettings');
    if (saveButton) {
      saveButton.textContent = 'Modifications enregistrées !';
      saveButton.classList.add('success');
      setTimeout(() => {
        saveButton.textContent = 'Enregistrer les modifications';
        saveButton.classList.remove('success');
      }, 2000);
    }
  };

  const toggleDay = (dayValue: number) => {
    const newActiveDays = settings.activeDays.includes(dayValue)
      ? settings.activeDays.filter(d => d !== dayValue)
      : [...settings.activeDays, dayValue];
    setSettings({ ...settings, activeDays: newActiveDays });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-red-950 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern opacity-20"></div>
      
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center space-x-4 mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <h1 className="text-2xl font-bold text-white">Paramètres</h1>
          </div>

          <div className="space-y-8">
            {/* Filter Mode Section */}
            <section className="bg-black/30 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Zap className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Mode de filtrage
                </h2>
              </div>
              <div className="grid gap-4">
                <label className="relative flex items-center p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors duration-200">
                  <input
                    type="radio"
                    name="filterMode"
                    value="normal"
                    checked={settings.filterMode === 'normal'}
                    onChange={(e) => setSettings({ ...settings, filterMode: e.target.value })}
                    className="w-4 h-4 text-red-500"
                  />
                  <div className="ml-4">
                    <span className="block font-medium text-white">Mode normal</span>
                    <span className="text-sm text-white/60">Les emails filtrés sont déplacés dans la corbeille</span>
                  </div>
                </label>
                <label className="relative flex items-center p-4 border border-white/10 rounded-lg cursor-pointer hover:bg-white/5 transition-colors duration-200">
                  <input
                    type="radio"
                    name="filterMode"
                    value="aggressive"
                    checked={settings.filterMode === 'aggressive'}
                    onChange={(e) => setSettings({ ...settings, filterMode: e.target.value })}
                    className="w-4 h-4 text-red-500"
                  />
                  <div className="ml-4">
                    <span className="block font-medium text-white">Mode agressif</span>
                    <span className="text-sm text-white/60">Les emails sont supprimés définitivement dès leur réception</span>
                  </div>
                </label>
              </div>
            </section>

            {/* Schedule Section */}
            <section className="bg-black/30 backdrop-blur-xl rounded-xl shadow-lg p-6 border border-white/10">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-red-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Planification
                </h2>
              </div>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-white/90 mb-2">Horaires de filtrage</h3>
                  <div className="flex items-center space-x-4">
                    <input
                      type="time"
                      value={settings.filterStartTime}
                      onChange={(e) => setSettings({ ...settings, filterStartTime: e.target.value })}
                      className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                    />
                    <span className="text-white/60">à</span>
                    <input
                      type="time"
                      value={settings.filterEndTime}
                      onChange={(e) => setSettings({ ...settings, filterEndTime: e.target.value })}
                      className="px-3 py-2 bg-black/20 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-white/90 mb-2">Jours actifs</h3>
                  <div className="flex space-x-2">
                    {DAYS.map(({ label, value }) => (
                      <button
                        key={value}
                        onClick={() => toggleDay(value)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                          settings.activeDays.includes(value)
                            ? 'bg-red-500 text-white'
                            : 'bg-black/20 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              id="saveSettings"
              onClick={handleSave}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Enregistrer les modifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};