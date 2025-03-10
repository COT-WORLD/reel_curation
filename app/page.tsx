"use client";

import React, { useEffect, useState } from "react";
import { IVideo } from "@/models/Video";
import { apiClient } from "./api-client";
import VideoFeed from "./components/VideoFeed";
import { useNotification } from "./components/Notification";

export default function Home() {
  const [videos, setVideos] = useState<IVideo[]>([]);
  const { showNotification } = useNotification();
  

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await apiClient.getVideos();
        setVideos(data);
      } catch (error) {
        showNotification(`Error fetching videos:${error}`, "error");
        console.error("Error fetching videos:", error);
      }
    };

    fetchVideos();
  }, []);

  return (
    
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ImageKit ReelsPro</h1>
      <VideoFeed videos={videos} />
    </main>
  );
}