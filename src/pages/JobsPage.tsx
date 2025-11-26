import { JobList } from '../components/Jobs/JobList';

export const JobsPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Remote Developer Jobs</h1>
        <p>Find your perfect remote position</p>
      </div>
      <JobList />
    </div>
  );
};
