import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const EmployerProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    company_name: '',
    company_website: '',
    company_size: '',
    company_logo: '',
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
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
      if (hasProfile) {
        const { error: updateError } = await supabase
          .from('employer_profiles')
          .update({
            company_name: formData.company_name,
            company_website: formData.company_website || null,
            company_size: formData.company_size || null,
            company_logo: formData.company_logo || null,
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
      <h2>Employer Profile</h2>

      <form onSubmit={handleSubmit} className="profile-form">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

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
          <label htmlFor="company_logo">Company Logo URL</label>
          <input
            id="company_logo"
            type="url"
            value={formData.company_logo}
            onChange={(e) => setFormData({ ...formData, company_logo: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};
