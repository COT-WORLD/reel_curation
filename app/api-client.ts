import { IVideo } from "@/models/Video";

type FetchOptions = {
    method?: "GET" | "POST" | "PUT" | "DELETE";
    body?: unknown;
    headers?: Record<string, string>;
}

export type VideoFormData = Omit<IVideo, "_id">;
class ApiClient {
    private async fetch<T>(
        endpoint: string,
        options: FetchOptions = {}
    ): Promise<T> {

        const {method = "GET", body, headers ={}} = options;

        const defaultHeaders = {
            "Content-Type": "application/json",
            ...headers
        };

        const response = await fetch(`/api/${endpoint}`, {
            method,
            body: body? JSON.stringify(body): undefined,
            headers: defaultHeaders
        });

        if (!response.ok) {            
            throw new Error(await response.text());
        }    

        return response.json();

    }

    async getVideos(){
        return this.fetch<IVideo[]>("/videos");
    }

    async getAVideo(id: string){
        return this.fetch<IVideo>(`/videos/${id}`);
    }

    async createVideo(video: VideoFormData){
        return this.fetch<IVideo>("/videos", {method: "POST", body: video});
    }   
}

export const apiClient = new ApiClient();