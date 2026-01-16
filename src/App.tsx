import { useState } from 'react'
import { Sparkles, FileText } from 'lucide-react'
import Dashboard from './components/Dashboard'
import CreatePost from './components/CreatePost'

type View = 'dashboard' | 'create-post'

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard')

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <h1 className="text-base sm:text-xl font-semibold whitespace-nowrap">Media Orchestrator</h1>
            </div>

            <nav className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`px-2 sm:px-4 py-2 rounded-lg transition-all text-xs sm:text-base ${
                  currentView === 'dashboard'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('create-post')}
                className={`px-2 sm:px-4 py-2 rounded-lg transition-all flex items-center gap-1 sm:gap-2 text-xs sm:text-base ${
                  currentView === 'create-post'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Create Post</span>
                <span className="sm:hidden">Post</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentView === 'dashboard' && <Dashboard />}
        {currentView === 'create-post' && <CreatePost />}
      </main>
    </div>
  )
}

export default App
