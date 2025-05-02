'use client';

import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PersonaType } from '@/lib/aiPersonaRewriter';
import CustomPersonaWizard from './persona-question';

type CustomPersona = {
  id: string;
  name: string;
  description: string;
  instructions: string;
};

interface CustomPersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (persona: CustomPersona) => void;
}

export default function CustomPersonaModal({ isOpen, onClose, onSave }: CustomPersonaModalProps) {
  // Simply pass through to the wizard
  return (
    <CustomPersonaWizard
      isOpen={isOpen}
      onClose={onClose}
      onSave={onSave}
    />
  );
}