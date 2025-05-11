'use client'

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import CustomPersonaWizard from "./persona-question";
import { createClient } from '@/supabase/client';
import { User } from '@supabase/supabase-js';

type CustomPersona = {
  id: string;
  name: string;
  description: string;
  instructions: string;
  user_id?: string;
};

interface CustomPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (persona: CustomPersona) => void;
}

export default function CustomPersonaModal({ isOpen, onClose, onSave }: CustomPersonaModalProps) {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Get the current user when the component mounts
  useEffect(() => {
    async function getUserData() {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error("Error fetching user:", error.message);
          setUser(null);
        } else {
          console.log("User data from modal:", data.user);
          setUser(data.user);
        }
      } catch (err) {
        console.error("Exception fetching user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    
    getUserData();
  }, [supabase.auth]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (isOpen && !loading && !user) {
      console.log("User not logged in, redirecting to login");
      router.push('/auth/signin?redirect=/');
    }
  }, [isOpen, loading, user, router]);
  
  // While loading or if no user, don't show the modal
  if (loading || !user) {
    return null;
  }
  
  return (
    <CustomPersonaWizard
      isOpen={isOpen}
      onClose={onClose}
      onSave={(persona) => {
        // Add the user ID to the persona before passing it up
        const personaWithUserId = {
          ...persona,
          user_id: user.id
        };
        console.log("Saving persona with user ID:", user.id);
        onSave(personaWithUserId);
      }}
      userId={user.id}
    />
  );
}