import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ConnectionButton } from './ConnectionButton';
import { PostComments } from './PostComments';
import { LikeButton } from './LikeButton';
import { ShareButton } from './ShareButton';
import { CommentCount } from './CommentCount';

interface Post {
  id: string;
  user_id: string;
  title: string;
  description: string;
  post_type: 'project' | 'startup' | 'collaboration';
  technologies: string[];
  looking_for: string;
  status: string;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

export const CommunityPosts = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    post_type: 'project',
    technologies: '',
    looking_for: '',
  });

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('community_posts')
        .select(`
          *,
          profiles (
            full_name,
            avatar_url
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('post_type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const techArray = formData.technologies
        .split(',')
        .map(t => t.trim())
        .filter(t => t);

      const { error } = await supabase
        .from('community_posts')
        .insert({
          user_id: user?.id,
          title: formData.title,
          description: formData.description,
          post_type: formData.post_type,
          technologies: techArray,
          looking_for: formData.looking_for || null,
          status: 'active',
        });

      if (error) throw error;

      setFormData({
        title: '',
        description: '',
        post_type: 'project',
        technologies: '',
        looking_for: '',
      });
      setShowForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="community-container">
      <div className="community-header">
        <h2>Community Projects</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'Create Post'}
        </button>
      </div>

      {showForm && (
        <div className="post-form-container">
          <form onSubmit={handleSubmit} className="community-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                placeholder="Looking for co-founder for SaaS startup"
              />
            </div>

            <div className="form-group">
              <label htmlFor="post_type">Type</label>
              <select
                id="post_type"
                value={formData.post_type}
                onChange={(e) => setFormData({ ...formData, post_type: e.target.value })}
                required
              >
                <option value="project">Project</option>
                <option value="startup">Startup</option>
                <option value="collaboration">Collaboration</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                rows={4}
                placeholder="Describe your project or idea..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="technologies">Technologies (comma-separated)</label>
              <input
                id="technologies"
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, PostgreSQL"
              />
            </div>

            <div className="form-group">
              <label htmlFor="looking_for">Looking For</label>
              <input
                id="looking_for"
                type="text"
                value={formData.looking_for}
                onChange={(e) => setFormData({ ...formData, looking_for: e.target.value })}
                placeholder="Frontend Developer, Designer"
              />
            </div>

            <button type="submit" className="btn-primary">Create Post</button>
          </form>
        </div>
      )}

      <div className="filter-buttons">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All Posts
        </button>
        <button
          className={filter === 'project' ? 'active' : ''}
          onClick={() => setFilter('project')}
        >
          Projects
        </button>
        <button
          className={filter === 'startup' ? 'active' : ''}
          onClick={() => setFilter('startup')}
        >
          Startups
        </button>
        <button
          className={filter === 'collaboration' ? 'active' : ''}
          onClick={() => setFilter('collaboration')}
        >
          Collaborations
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading posts...</div>
      ) : (
        <div className="posts-grid">
          {posts.length === 0 ? (
            <div className="no-posts">No posts found. Be the first to create one!</div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-author">
                    <div className="author-avatar">
                      {post.profiles.avatar_url ? (
                        <img src={post.profiles.avatar_url} alt={post.profiles.full_name} />
                      ) : (
                        <div className="avatar-placeholder">{post.profiles.full_name[0]}</div>
                      )}
                    </div>
                    <span>{post.profiles.full_name}</span>
                  </div>
                  <span className={`post-type-badge ${post.post_type}`}>
                    {post.post_type}
                  </span>
                </div>

                <h3>{post.title}</h3>
                <p className="post-description">{post.description}</p>

                {post.looking_for && (
                  <div className="looking-for">
                    <strong>Looking for:</strong> {post.looking_for}
                  </div>
                )}

                {post.technologies.length > 0 && (
                  <div className="tech-tags">
                    {post.technologies.map((tech, index) => (
                      <span key={index} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                )}

                <div className="post-actions">
                  <LikeButton postId={post.id} />
                  <button className="btn-secondary comment-btn" onClick={() => setSelectedPostId(post.id)}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <CommentCount postId={post.id} />
                  </button>
                  <ShareButton postId={post.id} title={post.title} />
                  <ConnectionButton targetUserId={post.user_id} />
                  {user?.id === post.user_id && (
                    <button
                      className="btn-danger-small"
                      onClick={() => handleDeletePost(post.id)}
                      title="Delete post"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {selectedPostId && (
        <PostComments
          postId={selectedPostId}
          onClose={() => setSelectedPostId(null)}
        />
      )}
    </div>
  );
};
