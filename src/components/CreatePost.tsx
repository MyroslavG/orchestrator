import { useState, useEffect, useRef } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { getTemplates, createPost } from '../api';

interface Template {
  id: string
  name: string
  type: string
  description: string
  icon: string
}

interface GeneratedPost {
  id: string
  caption: string
  image_url: string
  hashtags: string[]
  image_prompt: string
}

export default function CreatePost() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [tone, setTone] = useState('professional')
  const [scheduleDate, setScheduleDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [generatedPost, setGeneratedPost] = useState<GeneratedPost | null>(null)
  const generatedPostRef = useRef<HTMLDivElement>(null)

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
    setGeneratedPost(null)

    try {
      const result = await createPost({
        template_type: selectedTemplate,
        custom_prompt: customPrompt || undefined,
        tone,
        schedule_at: scheduleDate || undefined
      })
      setSuccess(true)
      setGeneratedPost(result)
      setCustomPrompt('')
      setScheduleDate('')

      // Scroll to generated post after a short delay
      setTimeout(() => {
        generatedPostRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (error) {
      console.error('Failed to create post:', error)
      alert('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Post</h1>
        <p className="text-gray-400">Generate AI-powered content for your social media</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        {/* Custom Prompt */}
        <div>
          <label htmlFor="prompt" className="block text-sm font-medium mb-3">
            {selectedTemplate === 'custom' ? (
              <span className="text-blue-400">
                Custom Prompt <span className="text-red-400">*</span> - Describe what you want to generate
              </span>
            ) : (
              'Custom Prompt (Optional)'
            )}
          </label>
          <textarea
            id="prompt"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder={
              selectedTemplate === 'custom'
                ? "Describe exactly what you want to generate: person, object, scene, mood, style, etc."
                : "Add specific instructions for content generation..."
            }
            rows={selectedTemplate === 'custom' ? 6 : 4}
            className={`w-full px-4 py-3 bg-gray-900 border rounded-xl focus:outline-none focus:ring-2 resize-none ${
              selectedTemplate === 'custom'
                ? 'border-blue-500 focus:ring-blue-500'
                : 'border-gray-800 focus:ring-blue-500'
            }`}
          />
          {selectedTemplate === 'custom' && !customPrompt && (
            <p className="text-sm text-gray-500 mt-2">
              💡 Tip: Be specific! Include details about the subject, setting, mood, colors, and style you want.
            </p>
          )}
        </div>

        {/* Tone */}
        <div>
          <label htmlFor="tone" className="block text-sm font-medium mb-3">
            Tone
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="inspirational">Inspirational</option>
            <option value="educational">Educational</option>
            <option value="entertaining">Entertaining</option>
          </select>
        </div>

        {/* Schedule Date */}
        {/* <div>
          <label htmlFor="schedule" className="block text-sm font-medium mb-3">
            Schedule (Optional)
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              id="schedule"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
          </div>
        </div> */}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !selectedTemplate || (selectedTemplate === 'custom' && !customPrompt)}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Post
            </>
          )}
        </button>
      </form>

      {/* Success Message */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-6 animate-pulse">
          <p className="text-green-400 font-medium">✨ Post created successfully! Scroll down to see your generated post.</p>
        </div>
      )}

      {/* Generated Post Preview */}
      {generatedPost && (
        <div ref={generatedPostRef} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mt-6">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Generated Post</h2>
            <button
              onClick={() => setGeneratedPost(null)}
              className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
              title="Clear generated post"
            >
              <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-red-400" />
            </button>
          </div>

          {/* Image */}
          {generatedPost.image_url && (
            <div className="aspect-square bg-gray-800">
              <img
                src={generatedPost.image_url}
                alt="Generated content"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-300 mb-4 whitespace-pre-wrap">{generatedPost.caption}</p>

            {/* Hashtags */}
            {generatedPost.hashtags && generatedPost.hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {generatedPost.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-sm text-blue-400">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Image Prompt Info */}
            {generatedPost.image_prompt && (
              <details className="mt-4">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                  View image generation prompt
                </summary>
                <p className="text-xs text-gray-600 mt-2 p-3 bg-gray-800/50 rounded">
                  {generatedPost.image_prompt}
                </p>
              </details>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
