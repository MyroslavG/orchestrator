import { useState, useEffect } from 'react'
import { Sparkles, Calendar } from 'lucide-react'
import { getTemplates, createCampaign } from '../api'

interface Template {
  id: string
  name: string
  type: string
  description: string
  icon: string
}

export default function CreateCampaign() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [campaignName, setCampaignName] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [frequency, setFrequency] = useState<'daily' | 'twice_daily' | 'three_times_daily'>('daily')
  const [startDate, setStartDate] = useState('')
  const [postsCount, setPostsCount] = useState(7)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const data = await getTemplates()
      setTemplates(data)
      if (data.length > 0) {
        setSelectedTemplate(data[0].type)
      }
    } catch (error) {
      console.error('Failed to load templates:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)

    try {
      await createCampaign({
        name: campaignName,
        template_type: selectedTemplate,
        frequency,
        start_date: new Date(startDate).toISOString(),
        posts_count: postsCount
      })
      setSuccess(true)
      setCampaignName('')
      setStartDate('')
      setPostsCount(7)
    } catch (error) {
      console.error('Failed to create campaign:', error)
      alert('Failed to create campaign. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Campaign</h1>
        <p className="text-gray-400">Schedule multiple posts with consistent publishing</p>
      </div>

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mb-6">
          <p className="text-green-400 font-medium">Campaign created successfully!</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Campaign Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-3">
            Campaign Name
          </label>
          <input
            type="text"
            id="name"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="e.g., January Growth Campaign"
            required
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Template Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">Choose Template</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                onClick={() => setSelectedTemplate(template.type)}
                className={`p-6 rounded-2xl border-2 transition-all text-left ${
                  selectedTemplate === template.type
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-gray-800 bg-gray-900 hover:border-gray-700'
                }`}
              >
                <div className="text-3xl mb-3">{template.icon}</div>
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-gray-400">{template.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Frequency */}
        <div>
          <label className="block text-sm font-medium mb-3">Posting Frequency</label>
          <div className="grid grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setFrequency('daily')}
              className={`p-4 rounded-xl border-2 transition-all ${
                frequency === 'daily'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">1×</div>
                <div className="text-sm text-gray-400">Daily</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFrequency('twice_daily')}
              className={`p-4 rounded-xl border-2 transition-all ${
                frequency === 'twice_daily'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">2×</div>
                <div className="text-sm text-gray-400">Daily</div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setFrequency('three_times_daily')}
              className={`p-4 rounded-xl border-2 transition-all ${
                frequency === 'three_times_daily'
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-gray-800 bg-gray-900 hover:border-gray-700'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl font-bold mb-1">3×</div>
                <div className="text-sm text-gray-400">Daily</div>
              </div>
            </button>
          </div>
        </div>

        {/* Posts Count */}
        <div>
          <label htmlFor="posts" className="block text-sm font-medium mb-3">
            Number of Posts
          </label>
          <input
            type="number"
            id="posts"
            min="1"
            max="90"
            value={postsCount}
            onChange={(e) => setPostsCount(parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-2">Generate 1-90 posts for your campaign</p>
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="start" className="block text-sm font-medium mb-3">
            Start Date
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="start"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedTemplate || !campaignName || !startDate}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              Creating Campaign...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Create Campaign
            </>
          )}
        </button>
      </form>
    </div>
  )
}
