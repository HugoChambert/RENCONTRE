import { useState } from 'react';

interface ProfilePictureUploadProps {
  currentUrl: string;
  onUrlChange: (url: string) => void;
}

export const ProfilePictureUpload = ({ currentUrl, onUrlChange }: ProfilePictureUploadProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(currentUrl);

  const handleSave = () => {
    onUrlChange(tempUrl);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUrl(currentUrl);
    setIsEditing(false);
  };

  return (
    <div className="profile-picture-section">
      <div className="profile-picture-container">
        {currentUrl ? (
          <img src={currentUrl} alt="Profile" className="profile-picture" />
        ) : (
          <div className="profile-picture-placeholder">
            <svg viewBox="0 0 24 24" fill="currentColor" width="48" height="48">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
        )}
      </div>

      {!isEditing ? (
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setIsEditing(true)}
        >
          Change Picture
        </button>
      ) : (
        <div className="picture-edit-form">
          <input
            type="url"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Enter image URL (e.g., from Imgur, GitHub, etc.)"
            className="picture-url-input"
          />
          <div className="picture-actions">
            <button type="button" className="btn-primary" onClick={handleSave}>
              Save
            </button>
            <button type="button" className="btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
          <p className="picture-help-text">
            Upload your image to a service like <a href="https://imgur.com" target="_blank" rel="noopener noreferrer">Imgur</a> or use your GitHub avatar URL
          </p>
        </div>
      )}
    </div>
  );
};
