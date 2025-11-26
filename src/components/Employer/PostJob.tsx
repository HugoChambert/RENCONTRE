import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const PostJob = () => {
  const { user } = useAuth();
  const [employerProfile, setEmployerProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    position_type: 'fullstack',
    required_skills: '',
    salary_range: '',
    experience_required: '',
  });

  useEffect(() => {
    if (user) {
      fetchEmployerProfile();
    }
  }, [user]);

  const fetchEmployerProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setEmployerProfile(data);
    } catch (error) {
      console.error('Error fetching employer profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!employerProfile) {
      setError('Please complete your employer profile first');
      setLoading(false);
      return;
    }

    try {
      const skillsArray = formData.required_skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      const { error: insertError } = await supabase
        .from('job_listings')
        .insert({
          employer_id: employerProfile.id,
          title: formData.title,
          description: formData.description,
          position_type: formData.position_type,
          required_skills: skillsArray,
          salary_range: formData.salary_range || null,
          experience_required: formData.experience_required,
          company_name: employerProfile.company_name,
          status: 'open',
        });

      if (insertError) throw insertError;

      setSuccess('Job posted successfully!');
      setFormData({
        title: '',
        description: '',
        position_type: 'fullstack',
        required_skills: '',
        salary_range: '',
        experience_required: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-job-container">
      <h2>Post a New Job</h2>

      {!employerProfile && (
        <div className="warning-message">
          Please complete your employer profile before posting jobs.
        </div>
      )}

      <form onSubmit={handleSubmit} className="job-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label htmlFor="title">Job Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Senior Frontend Developer"
          />
        </div>

        <div className="form-group">
          <label htmlFor="position_type">Position Type</label>
          <select
            id="position_type"
            value={formData.position_type}
            onChange={(e) => setFormData({ ...formData, position_type: e.target.value })}
            required
          >
            <option value="frontend">Frontend</option>
            <option value="backend">Backend</option>
            <option value="fullstack">Full Stack</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Job Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows={6}
            placeholder="Describe the role, responsibilities, and what makes your company great..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="required_skills">Required Skills (comma-separated)</label>
          <input
            id="required_skills"
            type="text"
            value={formData.required_skills}
            onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
            placeholder="React, TypeScript, Node.js, PostgreSQL"
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience_required">Experience Required</label>
          <input
            id="experience_required"
            type="text"
            value={formData.experience_required}
            onChange={(e) => setFormData({ ...formData, experience_required: e.target.value })}
            required
            placeholder="3-5 years"
          />
        </div>

        <div className="form-group">
          <label htmlFor="salary_range">Salary Range (optional)</label>
          <input
            id="salary_range"
            type="text"
            value={formData.salary_range}
            onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
            placeholder="$80,000 - $120,000"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading || !employerProfile}>
          {loading ? 'Posting...' : 'Post Job'}
        </button>
      </form>
    </div>
  );
};
