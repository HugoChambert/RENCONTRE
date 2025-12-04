import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ProfilePictureUpload } from '../Profile/ProfilePictureUpload';

export const EmployerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [baseProfile, setBaseProfile] = useState({
    avatar_url: '',
    location: '',
    website: '',
    twitter_url: '',
  });

  const [formData, setFormData] = useState({
    company_name: '',
    company_website: '',
    company_size: '',
    company_logo: '',
    description: '',
    industry: '',
    founded_year: new Date().getFullYear(),
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profileData) {
        setBaseProfile({
          avatar_url: profileData.avatar_url || '',
          location: profileData.location || '',
          website: profileData.website || '',
          twitter_url: profileData.twitter_url || '',
        });
      }

      const { data, error } = await supabase
        .from('employer_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setHasProfile(true);
        setFormData({
          company_name: data.company_name || '',
          company_website: data.company_website || '',
          company_size: data.company_size || '',
          company_logo: data.company_logo || '',
          description: data.description || '',
          industry: data.industry || '',
          founded_year: data.founded_year || new Date().getFullYear(),
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
      const { error: baseProfileError } = await supabase
        .from('profiles')
        .update({
          avatar_url: baseProfile.avatar_url || null,
          location: baseProfile.location || null,
          website: baseProfile.website || null,
          twitter_url: baseProfile.twitter_url || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (baseProfileError) throw baseProfileError;

      if (hasProfile) {
        const { error: updateError } = await supabase
          .from('employer_profiles')
          .update({
            company_name: formData.company_name,
            company_website: formData.company_website || null,
            company_size: formData.company_size || null,
            company_logo: formData.company_logo || null,
            description: formData.description || null,
            industry: formData.industry || null,
            founded_year: formData.founded_year || null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user?.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('employer_profiles')
          .insert({
            user_id: user?.id,
            company_name: formData.company_name,
            company_website: formData.company_website || null,
            company_size: formData.company_size || null,
            company_logo: formData.company_logo || null,
            description: formData.description || null,
            industry: formData.industry || null,
            founded_year: formData.founded_year || null,
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
      <h2>Company Profile</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <ProfilePictureUpload
          currentUrl={baseProfile.avatar_url}
          onUrlChange={(url) => setBaseProfile({ ...baseProfile, avatar_url: url })}
        />

        <div className="profile-section">
          <h3>Company Information</h3>

          <div className="form-group">
            <label htmlFor="company_name">Company Name</label>
            <input
              id="company_name"
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              required
              placeholder="Acme Corp"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Company Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              placeholder="Tell us about your company, mission, and culture..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <input
              id="industry"
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="Technology, Finance, Healthcare, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_size">Company Size</label>
            <select
              id="company_size"
              value={formData.company_size}
              onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
            >
              <option value="">Select size</option>
              <option value="1-10">1-10 employees</option>
              <option value="11-50">11-50 employees</option>
              <option value="51-200">51-200 employees</option>
              <option value="201-500">201-500 employees</option>
              <option value="501+">501+ employees</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="founded_year">Founded Year</label>
            <input
              id="founded_year"
              type="number"
              min="1800"
              max={new Date().getFullYear()}
              value={formData.founded_year}
              onChange={(e) => setFormData({ ...formData, founded_year: parseInt(e.target.value) })}
              placeholder="2020"
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={baseProfile.location}
              onChange={(e) => setBaseProfile({ ...baseProfile, location: e.target.value })}
              placeholder="San Francisco, CA"
            />
          </div>
        </div>

        <div className="profile-section">
          <h3>Online Presence</h3>

          <div className="form-group">
            <label htmlFor="company_website">Company Website</label>
            <input
              id="company_website"
              type="url"
              value={formData.company_website}
              onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company_logo">Company Logo URL</label>
            <input
              id="company_logo"
              type="url"
              value={formData.company_logo}
              onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
              placeholder="https://example.com/logo.png"
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Additional Website</label>
            <input
              id="website"
              type="url"
              value={baseProfile.website}
              onChange={(e) => setBaseProfile({ ...baseProfile, website: e.target.value })}
              placeholder="https://careers.example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="twitter_url">Twitter Profile</label>
            <input
              id="twitter_url"
              type="url"
              value={baseProfile.twitter_url}
              onChange={(e) => setBaseProfile({ ...baseProfile, twitter_url: e.target.value })}
              placeholder="https://twitter.com/company"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};
