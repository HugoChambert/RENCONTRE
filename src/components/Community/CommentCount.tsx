import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface CommentCountProps {
  postId: string;
}

export const CommentCount = ({ postId }: CommentCountProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchCommentCount();
  }, [postId]);

  const fetchCommentCount = async () => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select('id', { count: 'exact', head: true })
        .eq('post_id', postId);

      if (error) throw error;
      setCount(data?.length || 0);
    } catch (error) {
      console.error('Error fetching comment count:', error);
    }
  };

  return <span>{count}</span>;
};
