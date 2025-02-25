"use client";
import React, { useState } from "react";
import { IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void,
    onProgress: (progress: number) => void,
    fileType?: "image" | "video"
}


export default function FIleUpload({onSuccess, onProgress, fileType= "image" }: FileUploadProps) {

    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const onError = (err: {message: string}) => {
        console.log("Error", err);
        setError(err.message);
        setUploading(false);
      };
      
      const handleSuccess = (res: IKUploadResponse) => {
        console.log("Success", res);
        setUploading(false);
        setError(null);
        onSuccess(res);
      };

      const handleProgress = (evt: ProgressEvent) => {
        if (evt.lengthComputable && onProgress) {
          const percentComplete = Math.round((evt.loaded / evt.total) * 100);
          onProgress(percentComplete);
        }
      };
      const handleStartUpload = () => {
        setUploading(true);
        setError(null);
      };

      const validateFile = (file: File) => {
        if (file.type === "video") {
            if (!file.type.startsWith("video/") ) {
                setError("Please select a video file");
                return false;
              }
              if (file.size > 100 * 1024 * 1024) {
                setError("Please select a file less than 100MB");
                return false;
                
            }
        }else {
            const validTypes = ["image/png", "image/jpeg", "image/jpg"];
            if (!validTypes.includes(file.type)) {
                setError("Please select a valid image file [png, jpg, jpeg]");
                return false;
              }
              if (file.size > 5 * 1024 * 1024) {
                setError("Please select a image less than 5MB");
                return false;
                
            }
        }
        
        return false;
      }
      
  return (
    <div className="space-y-2">
        
        <IKUpload
        className="file-input file-input-bordered file-input-primary w-full"
          fileName={fileType === "video" ? "video.mp4" : "image"}   
          useUniqueFileName={true}
          validateFile={validateFile}
          folder={fileType === "video" ? "/videos" : "/images"}
          accept={fileType === "video" ? "video/*" : "image/*"}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
        />
        {uploading && (
            <div className="flex items-center gap-2 text-sm text-primary">
                <Loader2 className="animate-spin w-4 h-4" /><span>Uploading...</span>            </div>
        )}
        {error && <div className="text-error text-red-500 text-sm">{error}</div>}
      
    </div>
  );
}