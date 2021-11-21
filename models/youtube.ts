export type PlaylistItem = {
    id: string;
    snippet: {
      title: string;
      thumbnails: {
        default: { url: string; width: number; height: number };
        high: { url: string; width: number; height: number };
        maxres: { url: string; width: number; height: number };
        medium: { url: string; width: number; height: number };
        standard: { url: string; width: number; height: number };
      };
      resourceId: { videoId: string };
    };
  };
  
  export type ApiResponse = {
    items: PlaylistItem[];
    pageInfo: { totalResults: number; resultsPerPage: number };
    nextPageToken: string;
  };