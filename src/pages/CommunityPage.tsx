import { CommunityPosts } from '../components/Community/CommunityPosts';

export const CommunityPage = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Community</h1>
        <p>Connect with developers, share projects, and find collaborators</p>
      </div>
      <CommunityPosts />
    </div>
  );
};
