import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface ConnectionButtonProps {
  targetUserId: string;
}

export const ConnectionButton = ({ targetUserId }: ConnectionButtonProps) => {
  const { user } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && targetUserId !== user.id) {
      checkConnectionStatus();
    }
  }, [user, targetUserId]);

  const checkConnectionStatus = async () => {
    try {
      const { data } = await supabase
        .from('connections')
        .select('status')
        .or(`and(user_id.eq.${user?.id},connected_user_id.eq.${targetUserId}),and(user_id.eq.${targetUserId},connected_user_id.eq.${user?.id})`)
        .maybeSingle();

      if (data) {
        setConnectionStatus(data.status);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const sendConnectionRequest = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('connections')
        .insert({
          user_id: user.id,
          connected_user_id: targetUserId,
          status: 'pending',
        });

      if (error) throw error;
      setConnectionStatus('pending');
    } catch (error) {
      console.error('Error sending connection request:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user || targetUserId === user.id) {
    return null;
  }

  if (connectionStatus === 'accepted') {
    return (
      <button className="btn-connect" disabled>
        Connected
      </button>
    );
  }

  if (connectionStatus === 'pending') {
    return (
      <button className="btn-connect" disabled>
        Request Sent
      </button>
    );
  }

  return (
    <button
      className="btn-connect"
      onClick={sendConnectionRequest}
      disabled={loading}
    >
      {loading ? 'Connecting...' : 'Connect'}
    </button>
  );
};
