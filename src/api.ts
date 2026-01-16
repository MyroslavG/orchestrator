const API_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : 'http://localhost:8000/api'

export async function getTemplates() {
  const response = await fetch(`${API_URL}/templates`)
  if (!response.ok) throw new Error('Failed to fetch templates')
  return response.json()
}

export async function getPosts() {
  const response = await fetch(`${API_URL}/posts`)
  if (!response.ok) throw new Error('Failed to fetch posts')
  return response.json()
}

export async function createPost(data: {
  template_type: string
  custom_prompt?: string
  tone?: string
  schedule_at?: string
}) {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to create post')
  return response.json()
}

export async function getCampaigns() {
  const response = await fetch(`${API_URL}/campaigns`)
  if (!response.ok) throw new Error('Failed to fetch campaigns')
  return response.json()
}

export async function createCampaign(data: {
  name: string
  template_type: string
  frequency: string
  start_date: string
  end_date?: string
  posts_count: number
}) {
  const response = await fetch(`${API_URL}/campaigns`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  if (!response.ok) throw new Error('Failed to create campaign')
  return response.json()
}

export async function deletePost(postId: string) {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete post')
  return response.json()
}
