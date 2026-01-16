import { useState } from 'react'
import { Sparkles, Calendar, FileText } from 'lucide-react'
import Dashboard from './components/Dashboard'
import CreatePost from './components/CreatePost'
import CreateCampaign from './components/CreateCampaign'

type View = 'dashboard' | 'create-post' | 'create-campaign'

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-semibold">Media Orchestrator</h1>
            </div>

            <nav className="flex gap-2">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('create-post')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  currentView === 'create-post'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <FileText className="w-4 h-4" />
                Create Post
              </button>
              <button
                onClick={() => setCurrentView('create-campaign')}
                className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 ${
                  currentView === 'create-campaign'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Calendar className="w-4 h-4" />
                Create Campaign
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'create-post' && <CreatePost />}
        {currentView === 'create-campaign' && <CreateCampaign />}
      </main>
    </div>
  )
}

export default App
