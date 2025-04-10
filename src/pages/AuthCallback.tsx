import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) throw sessionError;
        
        if (!session?.user) {
          console.error('No session or user found');
          throw new Error('Authentication failed');
        }

        // Check if profile exists
        const { data: existingProfile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no profile found
          throw profileError;
        }

        // If profile doesn't exist, create it
        if (!existingProfile) {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: session.user.id,
              email: session.user.email,
              is_subscribed: false,
              subscription_tier: 'free',
              token_usage: {
                total: 0,
                limit: 5000,
                remaining: 5000
              }
            });

          if (createError) throw createError;
        }

        // Redirect to chat page
        navigate('/chat');
        
        toast({
          title: "Success",
          description: "You have successfully signed in!",
        });
      } catch (error: any) {
        console.error('Error in auth callback:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to complete authentication",
          variant: "destructive",
        });
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-amp-blue">
      <div className="text-amp-cyan text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amp-cyan mx-auto mb-4"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
};

export default AuthCallback; 