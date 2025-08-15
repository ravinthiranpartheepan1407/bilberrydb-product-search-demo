import * as bilberrydb from 'bilberrydb'
import { SearchResult } from '@/types/bilberry'
import { metadata } from '@/app/layout';

let client: any = null;

// initBilberryClient
export function initBilberryClient(){ 
    if(!client){
        if(!process.env.API_KEY || !process.env.API_ID){
            throw new Error("Missing required environment variables")
        }
        client = bilberrydb.init({
            api_key: process.env.API_KEY,
            api_id: process.env.API_ID
        });
    }

    return client;
}


// searchSimilarImages
// Whenever you use async you have return a promise
export async function searchSimilarImages(imagePath: string, options: {top_k?: number} = {top_k: 5}): Promise<SearchResult[]> {

// Without async - If you run a task this would make the page feels stuck until the ops finishes
// Async - return promise and await - JS to wait for this promise to finish befor removing to the next line (Other of the app will keep running while it waits)
// APIs db request
// If you AWS EC2 - 1 CPU 2 CPUs GPU: 1 CPU login registration search (async/await)

    try{
        const client = initBilberryClient();
        const vec = client.get_vec();
        const results = await vec.search(imagePath, options);

        return results.map((result: any) => ({
            id: result.id,
            filename: result.filename,
            file_name: result.file_name,
            similarity_score: result.similarity_score,
            file_type: result.file_type,
            url: result.url,
            metadata: result.metadata
        }))
    } catch(error){
        console.error('Search Failed: ', error);
        throw error;
    }

}