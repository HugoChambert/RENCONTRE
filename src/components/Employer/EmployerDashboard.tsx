import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface Job {
  id: string;
  title: string;
  position_type: string;
  status: string;
  created_at: string;
}

interface Application {
  id: string;
  status: string;
  cover_letter: string;
  created_at: string;
  job_listings: {
    title: string;
  };
  applicant_profiles: {
    user_id: string;
    skills: string[];
    experience_years: number;
  };
  profiles: {
    full_name: string;
    email: string;
  };
}

export const EmployerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: employerData } = await supabase
        .from('employer_profiles')
        .select('id')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (!employerData) {
        setLoading(false);
        return;
      }

      if (activeTab === 'jobs') {
        const { data: jobsData } = await supabase
          .from('job_listings')
          .select('*')
          .eq('employer_id', employerData.id)
          .order('created_at', { ascending: false });

        setJobs(jobsData || []);
      } else {
        const { data: applicationsData } = await supabase
          .from('applications')
          .select(`
            *,
            job_listings (title),
            applicant_profiles (user_id, skills, experience_years)
          `)
          .in('job_id',
            (await supabase
              .from('job_listings')
              .select('id')
              .eq('employer_id', employerData.id)
            ).data?.map(j => j.id) || []
          )
          .order('created_at', { ascending: false });

        if (applicationsData) {
          const applicationsWithProfiles = await Promise.all(
            applicationsData.map(async (app: any) => {
              const { data: profileData } = await supabase
                .from('profiles')
                .select('full_name, email')
                .eq('id', app.applicant_profiles.user_id)
                .maybeSingle();

              return {
                ...app,
                profiles: profileData
              };
            })
          );

          setApplications(applicationsWithProfiles);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';

    try {
      const { error } = await supabase
        .from('job_listings')
        .update({ status: newStatus })
        .eq('id', jobId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating job status:', error);
    }
  };

  const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;
      fetchData();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  return (
    <div className="employer-dashboard">
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          My Jobs
        </button>
        <button
          className={`dashboard-tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : activeTab === 'jobs' ? (
        <div className="jobs-list">
          {jobs.length === 0 ? (
            <div className="no-jobs">No jobs posted yet</div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="job-item">
                <div className="job-item-header">
                  <div>
                    <h3 className="job-item-title">{job.title}</h3>
                    <p className="company-name">
                      {job.position_type} • Posted {new Date(job.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="job-item-actions">
                    <button onClick={() => toggleJobStatus(job.id, job.status)}>
                      {job.status === 'open' ? 'Close' : 'Reopen'}
                    </button>
                  </div>
                </div>
                <span className={`position-badge ${job.position_type}`}>
                  {job.status === 'open' ? 'Active' : 'Closed'}
                </span>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="applications-list">
          {applications.length === 0 ? (
            <div className="no-jobs">No applications yet</div>
          ) : (
            applications.map((app) => (
              <div key={app.id} className="application-card">
                <div className="application-header">
                  <div className="applicant-info">
                    <h4>{app.profiles?.full_name || 'Unknown'}</h4>
                    <p>Applied to: {app.job_listings.title}</p>
                    <p>{app.profiles?.email}</p>
                  </div>
                  <span className={`application-status ${app.status}`}>
                    {app.status}
                  </span>
                </div>

                <div className="job-meta">
                  <div className="meta-item">
                    <strong>Experience:</strong> {app.applicant_profiles.experience_years} years
                  </div>
                  <div className="meta-item">
                    <strong>Applied:</strong> {new Date(app.created_at).toLocaleDateString()}
                  </div>
                </div>

                {app.applicant_profiles.skills.length > 0 && (
                  <div className="skills-container">
                    {app.applicant_profiles.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                )}

                {app.cover_letter && (
                  <div className="cover-letter">
                    <strong>Cover Letter:</strong><br />
                    {app.cover_letter}
                  </div>
                )}

                {app.status === 'pending' && (
                  <div className="application-actions">
                    <button
                      className="btn-primary"
                      onClick={() => updateApplicationStatus(app.id, 'reviewed')}
                    >
                      Mark as Reviewed
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => updateApplicationStatus(app.id, 'accepted')}
                    >
                      Accept
                    </button>
                    <button
                      className="btn-secondary"
                      onClick={() => updateApplicationStatus(app.id, 'rejected')}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
