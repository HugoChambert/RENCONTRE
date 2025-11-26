import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ApplicantProfile } from '../components/Applicant/ApplicantProfile';
import { EmployerProfile } from '../components/Employer/EmployerProfile';
import { PostJob } from '../components/Employer/PostJob';
import { EmployerDashboard } from '../components/Employer/EmployerDashboard';

export const ProfilePage = () => {
  const { user } = useAuth();
  const [userType, setUserType] = useState<'employer' | 'applicant' | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'postjob' | 'dashboard'>('profile');

  useEffect(() => {
    if (user) {
      fetchUserType();
    }
  }, [user]);

  const fetchUserType = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_type')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;
      setUserType(data?.user_type || null);
    } catch (error) {
      console.error('Error fetching user type:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="page-container">
      {userType === 'employer' && (
        <div className="tabs">
          <button
            className={activeTab === 'profile' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('profile')}
          >
            Company Profile
          </button>
          <button
            className={activeTab === 'dashboard' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'postjob' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('postjob')}
          >
            Post Job
          </button>
        </div>
      )}

      {userType === 'applicant' && <ApplicantProfile />}
      {userType === 'employer' && activeTab === 'profile' && <EmployerProfile />}
      {userType === 'employer' && activeTab === 'dashboard' && <EmployerDashboard />}
      {userType === 'employer' && activeTab === 'postjob' && <PostJob />}
    </div>
  );
};
