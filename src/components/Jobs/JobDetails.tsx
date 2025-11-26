import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface JobDetailsProps {
  jobId: string;
  onClose: () => void;
}

interface Job {
  id: string;
  title: string;
  description: string;
  position_type: string;
  required_skills: string[];
  salary_range: string;
  experience_required: string;
  company_name: string;
  created_at: string;
}

export const JobDetails = ({ jobId, onClose }: JobDetailsProps) => {
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [applicantProfile, setApplicantProfile] = useState<any>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchJobAndStatus();
  }, [jobId, user]);

  const fetchJobAndStatus = async () => {
    try {
      const { data: jobData, error: jobError } = await supabase
        .from('job_listings')
        .select('*')
        .eq('id', jobId)
        .maybeSingle();

      if (jobError) throw jobError;
      setJob(jobData);

      if (user) {
        const { data: profileData } = await supabase
          .from('applicant_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        setApplicantProfile(profileData);

        if (profileData) {
          const { data: applicationData } = await supabase
            .from('applications')
            .select('*')
            .eq('job_id', jobId)
            .eq('applicant_id', profileData.id)
            .maybeSingle();

          setHasApplied(!!applicationData);
        }
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantProfile) {
      setError('Please complete your applicant profile first');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          job_id: jobId,
          applicant_id: applicantProfile.id,
          cover_letter: coverLetter || null,
          status: 'pending',
        });

      if (insertError) throw insertError;

      setSuccess('Application submitted successfully!');
      setHasApplied(true);
      setCoverLetter('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="job-details">
          <div className="job-details-header">
            <h2>{job.title}</h2>
            <span className={`position-badge ${job.position_type}`}>
              {job.position_type}
            </span>
          </div>

          <p className="company-name">{job.company_name}</p>

          <div className="job-meta">
            <div className="meta-item">
              <strong>Experience:</strong> {job.experience_required}
            </div>
            {job.salary_range && (
              <div className="meta-item">
                <strong>Salary:</strong> {job.salary_range}
              </div>
            )}
            <div className="meta-item">
              <strong>Posted:</strong> {new Date(job.created_at).toLocaleDateString()}
            </div>
          </div>

          <div className="section">
            <h3>Description</h3>
            <p>{job.description}</p>
          </div>

          {job.required_skills.length > 0 && (
            <div className="section">
              <h3>Required Skills</h3>
              <div className="skills-container">
                {job.required_skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {user && (
            <div className="section">
              {hasApplied ? (
                <div className="success-message">
                  You have already applied to this position
                </div>
              ) : !applicantProfile ? (
                <div className="warning-message">
                  Please complete your applicant profile before applying
                </div>
              ) : (
                <form onSubmit={handleApply}>
                  <h3>Apply for this position</h3>
                  {error && <div className="error-message">{error}</div>}
                  {success && <div className="success-message">{success}</div>}

                  <div className="form-group">
                    <label htmlFor="coverLetter">Cover Letter (optional)</label>
                    <textarea
                      id="coverLetter"
                      value={coverLetter}
                      onChange={(e) => setCoverLetter(e.target.value)}
                      rows={6}
                      placeholder="Tell us why you're a great fit for this role..."
                    />
                  </div>

                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
