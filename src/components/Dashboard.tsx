import { useEffect, useState } from 'react'
import { Calendar, TrendingUp, FileText, X, Trash2 } from 'lucide-react'
import { getPosts, getCampaigns, deletePost } from '../api'

interface Post {
  id: string
  template_type: string
  caption: string
  image_url?: string
  image_prompt?: string
  hashtags: string[]
  status: string
  scheduled_at?: string
  created_at: string
}

interface Campaign {
  id: string
  name: string
  template_type: string
  frequency: string
  status: string
  posts: Post[]
}

export default function Dashboard() {
  const [posts, setPosts] = useState<Post[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [postsData, campaignsData] = await Promise.all([
        getPosts(),
        getCampaigns()
      ])
      setPosts(postsData)
      setCampaigns(campaignsData)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePost = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent opening the modal
    if (!confirm('Are you sure you want to delete this post?')) {
      return
    }

    try {
      await deletePost(postId)
      setPosts(posts.filter(p => p.id !== postId))
      if (selectedPost?.id === postId) {
        setSelectedPost(null)
      }
    } catch (error) {
      console.error('Failed to delete post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const scheduledPosts = posts.filter(p => p.status === 'scheduled').length
  const totalPosts = posts.length
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Posts</p>
              <p className="text-3xl font-semibold mt-2">{totalPosts}</p>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-xl">
              <FileText className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Scheduled</p>
              <p className="text-3xl font-semibold mt-2">{scheduledPosts}</p>
            </div>
            <div className="bg-green-500/10 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Campaigns</p>
              <p className="text-3xl font-semibold mt-2">{activeCampaigns}</p>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
        {posts.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No posts yet. Create your first post to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-all cursor-pointer"
              >
                {/* Image */}
                {post.image_url && (
                  <div className="relative aspect-square bg-gray-800">
                    <img
                      src={post.image_url}
                      alt="Generated post"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/400x400/1f2937/6b7280?text=Image+Error'
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-400">
                        {post.template_type.replace('_', ' ')}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                        post.status === 'scheduled'
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-gray-500/10 text-gray-400'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleDeletePost(post.id, e)}
                      className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4 text-gray-500 group-hover:text-red-400" />
                    </button>
                  </div>

                  <p className="text-sm text-gray-300 line-clamp-3 mb-3">{post.caption}</p>

                  {/* Hashtags */}
                  {post.hashtags && post.hashtags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.hashtags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs text-blue-400">
                          #{tag}
                        </span>
                      ))}
                      {post.hashtags.length > 3 && (
                        <span className="text-xs text-gray-500">+{post.hashtags.length - 3} more</span>
                      )}
                    </div>
                  )}

                  {post.scheduled_at && (
                    <p className="text-xs text-gray-500 mt-3">
                      Scheduled: {new Date(post.scheduled_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Campaigns */}
      {campaigns.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Active Campaigns</h2>
          <div className="space-y-4">
            {campaigns.filter(c => c.status === 'active').map((campaign) => (
              <div key={campaign.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium">{campaign.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                      <span>{campaign.template_type.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{campaign.frequency.replace('_', ' ')}</span>
                      <span>•</span>
                      <span>{campaign.posts.length} posts</span>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-400">
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Post Details</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleDeletePost(selectedPost.id, e)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                  title="Delete post"
                >
                  <Trash2 className="w-5 h-5 text-gray-500 group-hover:text-red-400" />
                </button>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Image */}
              {selectedPost.image_url && (
                <div className="mb-6 rounded-xl overflow-hidden bg-gray-800">
                  <img
                    src={selectedPost.image_url}
                    alt="Post"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Post Info */}
              <div className="space-y-4">
                {/* Status and Type */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-500/10 text-blue-400">
                    {selectedPost.template_type.replace('_', ' ')}
                  </span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    selectedPost.status === 'scheduled'
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-gray-500/10 text-gray-400'
                  }`}>
                    {selectedPost.status}
                  </span>
                </div>

                {/* Caption */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Caption</h3>
                  <p className="text-gray-300 whitespace-pre-wrap">{selectedPost.caption}</p>
                </div>

                {/* Hashtags */}
                {selectedPost.hashtags && selectedPost.hashtags.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Hashtags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPost.hashtags.map((tag, idx) => (
                        <span key={idx} className="text-sm px-3 py-1 rounded-full bg-blue-500/10 text-blue-400">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Image Prompt */}
                {selectedPost.image_prompt && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Image Generation Prompt</h3>
                    <p className="text-sm text-gray-500 p-4 bg-gray-800/50 rounded-lg">
                      {selectedPost.image_prompt}
                    </p>
                  </div>
                )}

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-400 mb-1">Created</h3>
                    <p className="text-sm text-gray-300">
                      {new Date(selectedPost.created_at).toLocaleString()}
                    </p>
                  </div>
                  {selectedPost.scheduled_at && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-400 mb-1">Scheduled</h3>
                      <p className="text-sm text-gray-300">
                        {new Date(selectedPost.scheduled_at).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
