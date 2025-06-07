"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Upload, Trash } from "lucide-react";
import ImageCropper from "./image-cropper";
import { useMutation } from "@tanstack/react-query";
import { updateProfilePicture, updateUserProfile, removeProfilePicture } from "@/actions/actions.user";

// Form schema with validation
const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email().optional(),
  website: z.string().url({ message: "Please enter a valid URL" }).or(z.string().length(0)).optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
});

type ProfileFormValues = z.infer<typeof formSchema>;

interface ProfileFormProps {
  initialData: {
    id: string; 
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl: string;
    website: string;
    bio: string;
  };
}

// Define proper types for the action responses
interface ProfileUpdateResponse {
  success?: boolean;
  error?: string;
}

interface ProfileImageResponse {
  success?: boolean;
  error?: string;
  avatarUrl?: string;
}

export default function ProfileForm({initialData }: ProfileFormProps) {
  const router = useRouter();
  const [showCropper, setShowCropper] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>(initialData.avatarUrl);

  // Profile update mutation with proper typing
  const updateProfileMutation = useMutation<
    ProfileUpdateResponse, // TData - what the mutation returns
    Error,                // TError - type of error
    ProfileFormValues     // TVariables - what the mutation accepts
  >({
    mutationFn: async (data: ProfileFormValues) => {
      const result = await updateUserProfile(initialData.id, {
        firstName: data.firstName, 
        lastName: data.lastName, 
        website: data.website, 
        bio: data.bio,
      });
      return result as ProfileUpdateResponse;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      router.refresh();
    },
    onError: (error) => {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    }
  });

  // Profile image update mutation with proper typing
  const updateProfileImageMutation = useMutation<
    ProfileImageResponse, // TData - what the mutation returns
    Error,               // TError - type of error
    Blob                 // TVariables - what the mutation accepts
  >({
    mutationFn: async (blob: Blob) => {
      const result = await updateProfilePicture(initialData.id, blob);
      return result as ProfileImageResponse;
    },
    onSuccess: (data) => {
      if (data && data.avatarUrl) {
        setAvatarUrl(data.avatarUrl);
      }
      toast.success("Profile image updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to upload image");
      console.error("Error uploading image:", error);
    }
  });

  // Profile image removal mutation with proper typing
  const removeProfileImageMutation = useMutation<
    ProfileUpdateResponse, // TData - what the mutation returns
    Error,                // TError - type of error
    void                  // TVariables - this mutation doesn't need parameters
  >({
    mutationFn: async () => {
      const result = await removeProfilePicture(initialData.id);
      return result as ProfileUpdateResponse;
    },
    onSuccess: () => {
      setAvatarUrl('');
      toast.success("Profile image removed successfully");
    },
    onError: (error) => {
      toast.error("Failed to remove profile image");
      console.error("Error removing profile image:", error);
    }
  });
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: initialData.firstName,
      lastName: initialData.lastName,
      email: initialData.email,
      website: initialData.website || "",
      bio: initialData.bio || "",
    },
  });

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setShowCropper(true);
    }
  };

  // Handle cropped image
  const handleCroppedImage = async (blob: Blob) => {
    setShowCropper(false);
    
    try {
      // Generate a temporary URL for preview
      const tempUrl = URL.createObjectURL(blob);
      setAvatarUrl(tempUrl);
      
      // Use the mutation to upload the image
      await updateProfileImageMutation.mutateAsync(blob);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle removing profile image
  const handleRemoveProfilePicture = () => {
    if (confirm("Are you sure you want to remove your profile picture?")) {
      removeProfileImageMutation.mutate();
    }
  };

  // Handle form submission
  const onSubmit = async (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const initials = `${initialData.firstName.charAt(0)}${initialData.lastName.charAt(0)}`;

  return (
    <>
      {showCropper && imageFile && (
        <ImageCropper 
          image={imageFile}
          onCrop={handleCroppedImage}
          onCancel={() => setShowCropper(false)}
        />
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Profile Image Section */}
          <Card className="p-6 border border-slate-200">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-xl font-bold bg-blue-100 text-blue-700">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                
                {(updateProfileImageMutation.isPending || removeProfileImageMutation.isPending) && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2">
                <h3 className="font-medium text-sm">Profile Picture</h3>
                <p className="text-xs text-slate-500">
                  Upload a new profile picture. JPEG, PNG or GIF. Max file size 2MB.
                </p>
                
                <div className="mt-2 flex gap-2">
                  <Input
                    type="file"
                    id="profileImage"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={updateProfileImageMutation.isPending || removeProfileImageMutation.isPending}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    disabled={updateProfileImageMutation.isPending || removeProfileImageMutation.isPending}
                    asChild
                  >
                    <label htmlFor="profileImage" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      {updateProfileImageMutation.isPending ? "Uploading..." : "Change Photo"}
                    </label>
                  </Button>
                  
                  {avatarUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={handleRemoveProfilePicture}
                      disabled={updateProfileImageMutation.isPending || removeProfileImageMutation.isPending}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      {removeProfileImageMutation.isPending ? "Removing..." : "Remove"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
          
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" readOnly {...field} className="bg-slate-50" />
                </FormControl>
                <p className="text-xs text-slate-500">
                  Email cannot be changed. Contact support if you need to use a different email.
                </p>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://yourwebsite.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Tell us a little about yourself" 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isPending || !form.formState.isDirty}
            >
              {updateProfileMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}