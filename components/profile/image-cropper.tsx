"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { type Crop, type PixelCrop, centerCrop, makeAspectCrop } from "react-image-crop";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  image: File;
  onCrop: (blob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
}

export default function ImageCropper({ 
  image,
  onCrop,
  onCancel,
  aspect = 1 // Default to square crop
}:  ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [imgSrc, setImgSrc] = useState<string>("");
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Convert file to data URL for preview
  useEffect(() => {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      setImgSrc(reader.result as string);
    });
    reader.readAsDataURL(image);
  }, [image]);

  // Center the crop when the image loads
  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 80,
        },
        aspect,
        width,
        height
      ),
      width,
      height
    );
    
    setCrop(initialCrop);
  }

  // Generate the cropped image
  async function handleCropComplete() {
    if (!imgRef.current || !completedCrop) return;
    
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        throw new Error("No 2d context");
      }
      
      const pixelRatio = window.devicePixelRatio;
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      
      canvas.width = completedCrop.width * scaleX;
      canvas.height = completedCrop.height * scaleY;
      
      ctx.scale(pixelRatio, pixelRatio);
      ctx.imageSmoothingQuality = "high";
      
      ctx.drawImage(
        imgRef.current,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY
      );
      
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((file) => {
          if (file) resolve(file);
          else throw new Error("Failed to create image file");
        }, "image/jpeg", 0.95);
      });
      
      onCrop(blob);
    } catch (error) {
      console.error("Error during image crop:", error);
    }
  }

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
          <DialogDescription>
            Adjust the crop to select the visible portion of your image
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          {imgSrc ? (
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={aspect}
              circularCrop
              className="max-w-full mx-auto"
            >
              <img
                ref={imgRef}
                alt="Crop preview"
                src={imgSrc}
                onLoad={onImageLoad}
                className="max-w-full h-auto"
              />
            </ReactCrop>
          ) : (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleCropComplete}
            disabled={!completedCrop?.width || !completedCrop?.height}
          >
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}