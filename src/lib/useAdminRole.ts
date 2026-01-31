import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function useAdminRole() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAdminRole();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.id);
      if (session) {
        await checkAdminRole();
      } else {
        setIsAdmin(false);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async () => {
    try {
      // Add timeout protection
      const timeoutPromise = new Promise<void>((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );

      const checkPromise = async () => {
        // Use getSession instead of getUser for more reliable results
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        
        console.log('🔍 Checking admin role for user:', user?.id);
        
        if (!user) {
          console.log('❌ No user found');
          setIsAdmin(false);
          return;
        }

        // Check if user has admin role
        const { data, error } = await supabase
          .from('admin_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        console.log('📊 Admin role query result:', { data, error });

        if (error || !data) {
          console.log('❌ No admin role found or error occurred');
          setIsAdmin(false);
        } else {
          console.log('✅ Admin role found:', data.role);
          setIsAdmin(data.role === 'admin');
        }
      };

      await Promise.race([checkPromise(), timeoutPromise]);
      
    } catch (error) {
      console.error('❌ Error checking admin role:', error);
      setIsAdmin(false);
    } finally {
      console.log('⏹️ Setting loading to false');
      setIsLoading(false);
    }
  };

  return { isAdmin, isLoading, checkAdminRole };
}