
import React, { useState, useRef } from "react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, X, Upload, ImagePlus, Pencil } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { uploadImage } from "@/lib/utils";
import { toast } from "sonner";

interface ProfileImageUploadProps {
  control: any;
  name: string;
  initialImage?: string | null;
  getInitials?: () => string;
  onImageUploaded?: (url: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({
  control,
  name,
  initialImage,
  getInitials = () => "UP",
  onImageUploaded,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImage || null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: any) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Clean up previous preview URL if it exists
    if (previewUrl && !initialImage) {
      URL.revokeObjectURL(previewUrl);
    }

    // Validate file type
    const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Only .jpg, .jpeg, .png and .webp files are accepted");
      return;
    }

    // Validate file size (5MB max)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Show preview immediately
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    try {
      // Start upload with progress simulation
      setIsUploading(true);
      setUploadProgress(0);
      
      // Simulate progress while actual upload happens
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null) return 0;
          return Math.min(prev + 5, 90);
        });
      }, 100);
      
      // Actual upload
      const imageUrl = await uploadImage(file, "profile-photos");
      
      // Complete progress and clean up
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Set the form value to the uploaded URL
      onChange(imageUrl);
      
      // Notify parent component
      if (onImageUploaded) {
        onImageUploaded(imageUrl);
      }
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(null);
        setIsUploading(false);
      }, 1000);
      
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setUploadProgress(null);
      setIsUploading(false);
    }
  };

  const removeImage = (onChange: (value: any) => void) => {
    onChange("");
    if (previewUrl && !initialImage) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const changeImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className="flex flex-col items-center">
          <FormLabel className="cursor-pointer">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-primary/20">
                {previewUrl ? (
                  <AvatarImage src={previewUrl} alt="Profile" />
                ) : (
                  <AvatarFallback className="bg-secondary">
                    {value ? <Camera className="h-8 w-8 text-muted-foreground" /> : getInitials()}
                  </AvatarFallback>
                )}
              </Avatar>
              
              {/* Edit/Remove buttons that appear on hover when image exists */}
              {previewUrl && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50 rounded-full">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      changeImage();
                    }}
                    className="p-1 bg-primary text-white rounded-full mr-2"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      removeImage(onChange);
                    }}
                    className="p-1 bg-destructive text-white rounded-full"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
              
              {/* Upload progress indicator */}
              {uploadProgress !== null && (
                <div className="absolute -bottom-4 left-0 right-0 flex justify-center">
                  <Progress
                    value={uploadProgress}
                    className="h-2 w-20 bg-secondary"
                  />
                </div>
              )}
              
              {/* Add icon when no image */}
              {!previewUrl && (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col items-center">
                    <ImagePlus size={24} className="mb-1" />
                    <span className="text-xs">Add Photo</span>
                  </div>
                </div>
              )}
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileChange(e, onChange)}
              {...field}
              disabled={isUploading}
            />
          </FormLabel>
          <FormMessage />
          
          {uploadProgress === 100 && (
            <span className="text-xs text-green-500 mt-1">Upload complete!</span>
          )}
          {isUploading && uploadProgress !== 100 && (
            <span className="text-xs text-muted-foreground mt-1">Uploading...</span>
          )}
        </FormItem>
      )}
    />
  );
};

export default ProfileImageUpload;
