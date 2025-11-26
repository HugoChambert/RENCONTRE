import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const ApplicantProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    skills: '',
    experience_years: 0,
    position_type: 'fullstack',
    resume_url: '',
    portfolio_url: '',
    github_url: '',
    linkedin_url: '',
    available: true,
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('applicant_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHasProfile(true);
        setFormData({
          skills: data.skills?.join(', ') || '',
          experience_years: data.experience_years || 0,
          position_type: data.position_type || 'fullstack',
          resume_url: data.resume_url || '',
          portfolio_url: data.portfolio_url || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
          available: data.available ?? true,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const skillsArray = formData.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s);

      if (hasProfile) {
        const { error: updateError } = await supabase
          .from('applicant_profiles')
          .update({
            skills: skillsArray,
            experience_years: formData.experience_years,
            position_type: formData.position_type,
            resume_url: formData.resume_url || null,
            portfolio_url: formData.portfolio_url || null,
            github_url: formData.github_url || null,
            linkedin_url: formData.linkedin_url || null,
            available: formData.available,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user?.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('applicant_profiles')
          .insert({
            user_id: user?.id,
            skills: skillsArray,
            experience_years: formData.experience_years,
            position_type: formData.position_type,
            resume_url: formData.resume_url || null,
            portfolio_url: formData.portfolio_url || null,
            github_url: formData.github_url || null,
            linkedin_url: formData.linkedin_url || null,
            available: formData.available,
          });

        if (insertError) throw insertError;
        setHasProfile(true);
      }

      setSuccess('Profile saved successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <h2>Applicant Profile</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label htmlFor="position_type">Position Type</label>
          <select
            id="position_type"
            value={formData.position_type}
            onChange={(e) => setFormData({ ...formData, position_type: e.target.value })}
            required
          >
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Full Stack Developer</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="skills">Skills (comma-separated)</label>
          <input
            id="skills"
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="React, Node.js, TypeScript, PostgreSQL"
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience_years">Years of Experience</label>
          <input
            id="experience_years"
            type="number"
            min="0"
            value={formData.experience_years}
            onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="resume_url">Resume URL</label>
          <input
            id="resume_url"
            type="url"
            value={formData.resume_url}
            onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
            placeholder="https://example.com/resume.pdf"
          />
        </div>

        <div className="form-group">
          <label htmlFor="portfolio_url">Portfolio URL</label>
          <input
            id="portfolio_url"
            type="url"
            value={formData.portfolio_url}
            onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
            placeholder="https://yourportfolio.com"
          />
        </div>

        <div className="form-group">
          <label htmlFor="github_url">GitHub Profile</label>
          <input
            id="github_url"
            type="url"
            value={formData.github_url}
            onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
            placeholder="https://github.com/username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="linkedin_url">LinkedIn Profile</label>
          <input
            id="linkedin_url"
            type="url"
            value={formData.linkedin_url}
            onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.available}
              onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
            />
            Available for opportunities
          </label>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};
