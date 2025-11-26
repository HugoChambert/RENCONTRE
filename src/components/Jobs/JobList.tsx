import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface JobListing {
  id: string;
  title: string;
  description: string;
  position_type: 'frontend' | 'backend' | 'fullstack';
  required_skills: string[];
  salary_range: string;
  experience_required: string;
  company_name: string;
  created_at: string;
}

export const JobList = () => {
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [filter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('job_listings')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('position_type', filter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="job-list-container">
      <div className="job-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All Jobs
          </button>
          <button
            className={filter === 'frontend' ? 'active' : ''}
            onClick={() => setFilter('frontend')}
          >
            Frontend
          </button>
          <button
            className={filter === 'backend' ? 'active' : ''}
            onClick={() => setFilter('backend')}
          >
            Backend
          </button>
          <button
            className={filter === 'fullstack' ? 'active' : ''}
            onClick={() => setFilter('fullstack')}
          >
            Full Stack
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading jobs...</div>
      ) : (
        <div className="jobs-grid">
          {filteredJobs.length === 0 ? (
            <div className="no-jobs">No jobs found matching your criteria.</div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className={`position-badge ${job.position_type}`}>
                    {job.position_type}
                  </span>
                </div>
                <p className="company-name">{job.company_name}</p>
                <p className="job-description">{job.description}</p>

                <div className="job-details">
                  <div className="detail-item">
                    <strong>Experience:</strong> {job.experience_required}
                  </div>
                  {job.salary_range && (
                    <div className="detail-item">
                      <strong>Salary:</strong> {job.salary_range}
                    </div>
                  )}
                </div>

                {job.required_skills.length > 0 && (
                  <div className="skills-container">
                    {job.required_skills.map((skill, index) => (
                      <span key={index} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                )}

                <button className="btn-apply">Apply Now</button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
