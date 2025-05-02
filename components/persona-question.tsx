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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckCircle } from "lucide-react";
import { PersonaType } from '@/lib/aiPersonaRewriter';

type CustomPersona = {
  id: string;
  name: string;
  description: string;
  instructions: string;
};

interface CustomPersonaWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (persona: CustomPersona) => void;
}

// Steps in the wizard
type WizardStep = 
  | 'basic-info'
  | 'writing-samples'
  | 'audience-feeling'
  | 'language-preferences'
  | 'writing-style'
  | 'target-reader'
  | 'review';

export default function CustomPersonaWizard({ isOpen, onClose, onSave }: CustomPersonaWizardProps) {
  // Basic info
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  
  // Writing samples
  const [writingSamples, setWritingSamples] = useState('');
  
  // Audience feeling
  const [audienceFeeling, setAudienceFeeling] = useState('');
  const [audienceFeelingOptions, setAudienceFeelingOptions] = useState({
    inspired: false,
    motivated: false,
    informed: false,
    entertained: false,
    persuaded: false,
    curious: false,
    connected: false
  });
  
  // Language preferences
  const [phrases, setPhrases] = useState('');
  const [avoidLanguage, setAvoidLanguage] = useState('');
  
  // Writing style
  const [writingStylePreference, setWritingStylePreference] = useState('');
  const [writingPetPeeve, setWritingPetPeeve] = useState('');
  
  // Target reader
  const [targetReader, setTargetReader] = useState('');
  
  // Flow control
  const [currentStep, setCurrentStep] = useState<WizardStep>('basic-info');
  const [error, setError] = useState<string | null>(null);
  
  // Helper function to extract key phrases from the collected data
  const generateInstructions = () => {
    const selectedFeelings = Object.entries(audienceFeelingOptions)
      .filter(([_, selected]) => selected)
      .map(([feeling, _]) => feeling)
      .join(', ');
      
    return `
# Writing Style Guide for "${name}" ${role ? `(${role})` : ''}

## Voice & Tone
- Make the audience feel: ${audienceFeeling || selectedFeelings || 'Not specified'}
- Writing style: ${writingStylePreference || 'Not specified'}
- Writing pet peeve to avoid: ${writingPetPeeve || 'Not specified'}

## Language Preferences
- Phrases and language to use: ${phrases || 'Not specified'}
- Language to avoid: ${avoidLanguage || 'Not specified'}

## Target Reader Profile
${targetReader || 'General audience'}

## Writing Samples for Reference
${writingSamples || 'No specific samples provided.'}

When rewriting content, use a tone that embodies these characteristics and mimics the voice of ${name}. Be persuasive, clear, and maintain the political perspective of the original author while enhancing the style to match ${name}'s voice.
    `.trim();
  };
  
  // Handle next step
  const handleNextStep = () => {
    setError(null);
    
    // Validation for each step
    if (currentStep === 'basic-info') {
      if (!name.trim()) {
        setError('Persona name is required.');
        return;
      }
      setCurrentStep('writing-samples');
    } 
    else if (currentStep === 'writing-samples') {
      setCurrentStep('audience-feeling');
    }
    else if (currentStep === 'audience-feeling') {
      setCurrentStep('language-preferences');
    }
    else if (currentStep === 'language-preferences') {
      setCurrentStep('writing-style');
    }
    else if (currentStep === 'writing-style') {
      setCurrentStep('target-reader');
    }
    else if (currentStep === 'target-reader') {
      setCurrentStep('review');
    }
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    setError(null);
    
    if (currentStep === 'writing-samples') {
      setCurrentStep('basic-info');
    }
    else if (currentStep === 'audience-feeling') {
      setCurrentStep('writing-samples');
    }
    else if (currentStep === 'language-preferences') {
      setCurrentStep('audience-feeling');
    }
    else if (currentStep === 'writing-style') {
      setCurrentStep('language-preferences');
    }
    else if (currentStep === 'target-reader') {
      setCurrentStep('writing-style');
    }
    else if (currentStep === 'review') {
      setCurrentStep('target-reader');
    }
  };
  
  // Final submit handler
  const handleSubmit = () => {
    // Create a unique ID based on name
    const id = 'custom_' + name.toLowerCase().replace(/\s+/g, '_');
    
    // Generate the full instructions
    const instructions = generateInstructions();
    
    // Create description based on role
    const description = role ? `${role}` : 'Custom commentator';
    
    // Create new persona object
    const newPersona: CustomPersona = {
      id,
      name,
      description,
      instructions
    };
    
    // Save persona
    onSave(newPersona);
    
    // Reset form
    resetForm();
    
    // Close modal
    onClose();
  };
  
  const resetForm = () => {
    // Reset all form fields
    setName('');
    setRole('');
    setWritingSamples('');
    setAudienceFeeling('');
    setAudienceFeelingOptions({
      inspired: false,
      motivated: false,
      informed: false,
      entertained: false,
      persuaded: false,
      curious: false,
      connected: false
    });
    setPhrases('');
    setAvoidLanguage('');
    setWritingStylePreference('');
    setWritingPetPeeve('');
    setTargetReader('');
    
    // Reset to first step
    setCurrentStep('basic-info');
    setError(null);
  };
  
  const handleClose = () => {
    resetForm();
    onClose();
  };
  
  // Progress indicator (1-7)
  const stepNumber = 
    currentStep === 'basic-info' ? 1 :
    currentStep === 'writing-samples' ? 2 :
    currentStep === 'audience-feeling' ? 3 :
    currentStep === 'language-preferences' ? 4 :
    currentStep === 'writing-style' ? 5 :
    currentStep === 'target-reader' ? 6 : 7;
  
  // Progress percentage
  const progressPercentage = (stepNumber / 7) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Custom Persona</DialogTitle>
          <DialogDescription>
            Develop a detailed voice profile for your custom commentator
          </DialogDescription>
        </DialogHeader>
        
        {/* Progress bar */}
        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 text-right">Step {stepNumber} of 7</p>
        
        <div className="py-4">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded text-sm text-red-700 mb-4">
              {error}
            </div>
          )}
          
          {/* Step 1: Basic Information */}
          {currentStep === 'basic-info' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <p className="text-sm text-gray-500">Let's start with the fundamentals of your custom commentator.</p>
              
              <div className="space-y-2">
                <Label htmlFor="name">Persona Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  placeholder="e.g., Tucker Carlson, Mark Levin, etc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  Enter the name of the commentator whose style you want to mimic.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role or Position</Label>
                <Input
                  id="role"
                  placeholder="e.g., Fox News Host, Radio Commentator, etc."
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  What position or role does this persona have? (Optional)
                </p>
              </div>
            </div>
          )}
          
          {/* Step 2: Writing Samples */}
          {currentStep === 'writing-samples' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Writing Samples</h3>
              <p className="text-sm text-gray-500">
                Share 1–3 pieces of writing you love from this persona. These can be quotes, excerpts, or descriptions of their style.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="samples">Writing Samples</Label>
                <Textarea
                  id="samples"
                  placeholder="Paste examples of their writing style, memorable quotes, or describe how they typically speak..."
                  value={writingSamples}
                  onChange={(e) => setWritingSamples(e.target.value)}
                  rows={6}
                />
                <p className="text-xs text-gray-500">
                  These examples help the AI understand the rhythm, tone, and structure of the writing style.
                </p>
              </div>
            </div>
          )}
          
          {/* Step 3: Audience Feeling */}
          {currentStep === 'audience-feeling' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Audience Response</h3>
              <p className="text-sm text-gray-500">
                How should readers feel after reading content in this persona's style?
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="inspired"
                    checked={audienceFeelingOptions.inspired}
                    onChange={e => setAudienceFeelingOptions({...audienceFeelingOptions, inspired: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="inspired">Inspired</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="motivated"
                    checked={audienceFeelingOptions.motivated}
                    onChange={e => setAudienceFeelingOptions({...audienceFeelingOptions, motivated: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="motivated">Motivated/Ready to Act</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="informed"
                    checked={audienceFeelingOptions.informed}
                    onChange={e => setAudienceFeelingOptions({...audienceFeelingOptions, informed: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="informed">Well-Informed</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="entertained"
                    checked={audienceFeelingOptions.entertained}
                    onChange={e => setAudienceFeelingOptions({...audienceFeelingOptions, entertained: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="entertained">Entertained</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="persuaded"
                    checked={audienceFeelingOptions.persuaded}
                    onChange={e => setAudienceFeelingOptions({...audienceFeelingOptions, persuaded: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="persuaded">Persuaded/Convinced</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="curious"
                    checked={audienceFeelingOptions.curious}
                    onChange={e => setAudienceFeelingOptions({...audienceFeelingOptions, curious: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="curious">Curious/Wanting More</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="connected"
                    checked={audienceFeelingOptions.connected}
                    onChange={e => setAudienceFeelingOptions({...audienceFeelingOptions, connected: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="connected">Connected/Understood</Label>
                </div>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="audienceFeeling">Other Feelings or Details</Label>
                <Textarea
                  id="audienceFeeling"
                  placeholder="Describe any other specific emotional responses this persona tries to evoke..."
                  value={audienceFeeling}
                  onChange={(e) => setAudienceFeeling(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {/* Step 4: Language Preferences */}
          {currentStep === 'language-preferences' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Language Preferences</h3>
              <p className="text-sm text-gray-500">
                Identify specific language patterns that define this persona's style.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="phrases">Common Phrases, Catchphrases, or Terminology</Label>
                <Textarea
                  id="phrases"
                  placeholder="List phrases or words the persona often uses, e.g., 'That's the bottom line,' 'But wait, there's more!'"
                  value={phrases}
                  onChange={(e) => setPhrases(e.target.value)}
                  rows={4}
                />
                <p className="text-xs text-gray-500">
                  These signature phrases help make the content immediately recognizable as this person's voice.
                </p>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="avoid">Language to Avoid</Label>
                <Textarea
                  id="avoid"
                  placeholder="List words, phrases, or styles the persona would never use..."
                  value={avoidLanguage}
                  onChange={(e) => setAvoidLanguage(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Are there expressions or word choices that would feel "off-brand" for this persona?
                </p>
              </div>
            </div>
          )}
          
          {/* Step 5: Writing Style */}
          {currentStep === 'writing-style' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Writing Style</h3>
              <p className="text-sm text-gray-500">
                Define the technical aspects of this persona's writing approach.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="stylePreference">Overall Writing Style</Label>
                <RadioGroup value={writingStylePreference} onValueChange={setWritingStylePreference}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="direct" id="direct" />
                    <Label htmlFor="direct">Direct and concise</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="conversational" id="conversational" />
                    <Label htmlFor="conversational">Conversational and casual</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="formal" id="formal" />
                    <Label htmlFor="formal">Formal and professional</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="passionate" id="passionate" />
                    <Label htmlFor="passionate">Passionate and emotional</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="analytical" id="analytical" />
                    <Label htmlFor="analytical">Analytical and detailed</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="humorous" id="humorous" />
                    <Label htmlFor="humorous">Humorous and witty</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2 mt-4">
                <Label htmlFor="petPeeve">Writing Pet Peeve or Rule</Label>
                <Textarea
                  id="petPeeve"
                  placeholder="Is there a writing 'rule' this persona lives by? (e.g., 'Never use passive voice,' 'Always provide evidence,' etc.)"
                  value={writingPetPeeve}
                  onChange={(e) => setWritingPetPeeve(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {/* Step 6: Target Reader */}
          {currentStep === 'target-reader' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Target Audience</h3>
              <p className="text-sm text-gray-500">
                Describe who this persona is typically speaking to.
              </p>
              
              <div className="space-y-2">
                <Label htmlFor="reader">Target Reader Profile</Label>
                <Textarea
                  id="reader"
                  placeholder="Describe the typical audience this persona addresses, including their demographics, concerns, values, etc."
                  value={targetReader}
                  onChange={(e) => setTargetReader(e.target.value)}
                  rows={5}
                />
                <p className="text-xs text-gray-500">
                  Understanding the intended audience helps calibrate the appropriate tone and arguments.
                </p>
              </div>
            </div>
          )}
          
          {/* Step 7: Review */}
          {currentStep === 'review' && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <h3 className="text-lg font-medium">Ready to Create</h3>
              </div>
              <p className="text-sm text-gray-500">
                We're ready to create your custom commentator persona with the following details:
              </p>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-600">Persona Name</p>
                  <p>{name}</p>
                </div>
                
                {role && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Role</p>
                    <p>{role}</p>
                  </div>
                )}
                
                {/* Only show fields that have content */}
                {writingSamples && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Writing Samples</p>
                    <p className="text-sm whitespace-pre-wrap max-h-32 overflow-y-auto">{writingSamples}</p>
                  </div>
                )}
                
                {/* Show audience feelings */}
                <div>
                  <p className="text-sm font-medium text-gray-600">Audience Response</p>
                  <p>
                    {Object.entries(audienceFeelingOptions)
                      .filter(([_, selected]) => selected)
                      .map(([feeling, _]) => feeling.charAt(0).toUpperCase() + feeling.slice(1))
                      .join(', ')}
                    {audienceFeeling && ', ' + audienceFeeling}
                  </p>
                </div>
                
                {phrases && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Common Phrases</p>
                    <p className="text-sm whitespace-pre-wrap">{phrases}</p>
                  </div>
                )}
                
                {avoidLanguage && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avoid Language</p>
                    <p className="text-sm whitespace-pre-wrap">{avoidLanguage}</p>
                  </div>
                )}
                
                {writingStylePreference && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Writing Style</p>
                    <p>{writingStylePreference.charAt(0).toUpperCase() + writingStylePreference.slice(1)}</p>
                  </div>
                )}
                
                {writingPetPeeve && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Writing Rule</p>
                    <p className="text-sm whitespace-pre-wrap">{writingPetPeeve}</p>
                  </div>
                )}
                
                {targetReader && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Target Audience</p>
                    <p className="text-sm whitespace-pre-wrap">{targetReader}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
          <div className="flex space-x-2 mt-3 sm:mt-0">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            
            {currentStep !== 'basic-info' && (
              <Button variant="secondary" onClick={handlePreviousStep}>
                Back
              </Button>
            )}
          </div>
          
          <div>
            {currentStep === 'review' ? (
              <Button onClick={handleSubmit} className="w-full sm:w-auto">
                Create Persona
              </Button>
            ) : (
              <Button onClick={handleNextStep} className="w-full sm:w-auto">
                Continue
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}