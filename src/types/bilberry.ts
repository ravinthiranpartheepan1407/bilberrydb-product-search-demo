// File - Define the types we use for image search in our project

// Interface: Buleprint that tells you what shape an object shoudl have and what properties it must contain - name, tpes, color.....

export interface SearchResult { //Strcture of each individual match
    // Key-Value Pair Structure
    id: string; // Required 
    filename?: string; //?: -> Optional
    file_name?: string;
    similarity_score: number;
    file_type: string;
    url?: string;
    metadata?: Record<string, any>; //{Image: <Image, number, float}
}

export interface SearchResponse{ // Get the full resonse from the search operation // What we are gonna get back
    results: SearchResult[]; // AN array of the searchResults 
    total: number; // Count of how many results matched
    query_time: number; // Time taken to search
}

export interface SearchRequest{ // Wha we are going to send
    top_k?: number;
    threshold?: number;
}