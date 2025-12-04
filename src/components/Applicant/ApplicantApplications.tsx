import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Application {
  id: string;
  status: string;
  cover_letter: string;
  created_at: string;
  job_listings: {
    id: string;
    title: string;
    company_name: string;
    position_type: string;
    salary_range: string;
  };
}

export const ApplicantApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [applicantProfileId, setApplicantProfileId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data: profileData } = await supabase
        .from('applicant_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (!profileData) {
        setLoading(false);
        return;
      }

      setApplicantProfileId(profileData.id);

      const { data: applicationsData, error } = await supabase
        .from('applications')
        .select(`
          *,
          job_listings (
            id,
            title,
            company_name,
            position_type,
            salary_range
          )
        `)
        .eq('applicant_id', profileData.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(applicationsData || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'reviewed':
        return 'status-reviewed';
      case 'accepted':
        return 'status-accepted';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (!applicantProfileId) {
    return (
      <div className="profile-container">
        <div className="warning-message">
          Please complete your applicant profile before applying to jobs.
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>My Applications</h2>

      {applications.length === 0 ? (
        <div className="no-jobs">
          You haven't applied to any jobs yet. Check out the Jobs page to find opportunities!
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <div className="application-header">
                <div>
                  <h3>{app.job_listings.title}</h3>
                  <p className="company-name">{app.job_listings.company_name}</p>
                </div>
                <span className={`application-status ${getStatusColor(app.status)}`}>
                  {app.status}
                </span>
              </div>

              <div className="job-meta">
                <div className="meta-item">
                  <strong>Position:</strong> {app.job_listings.position_type}
                </div>
                {app.job_listings.salary_range && (
                  <div className="meta-item">
                    <strong>Salary:</strong> {app.job_listings.salary_range}
                  </div>
                )}
                <div className="meta-item">
                  <strong>Applied:</strong> {new Date(app.created_at).toLocaleDateString()}
                </div>
              </div>

              {app.cover_letter && (
                <div className="cover-letter">
                  <strong>Your Cover Letter:</strong>
                  <p>{app.cover_letter}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
