import { NextRequest, NextResponse } from "next/server"; // API - Request and Response
import { searchSimilarImages } from "@/utils/bilberry";
import {writeFile, unlink} from 'fs/promises' // Save and delete files using promises so we can await them
import path from 'path' //Helping us to create file paths in safe way
import { write } from "fs";

export async function POST(request: NextRequest){
    // Async function - POST -: Handle Post requests to the API route in our Nextjs App
    try{
        // Input Query Image
        const formData = await request.formData()
        const file = formData.get('image') as File; //We grabbing the image file and TS it's a file
        const topK = parseInt(formData.get('top_k') as string) || 5; // How many similar images to return

        if(!file){
            return NextResponse.json({
                error: "No Image File Provided"
            }, {
                status: 400 // A bad request
            }) //{key: value}
        }

        // Persist the uploaded file temporarily
        // The uploaded file and converting into an ArrayBuffer so we can handle the raw binary data
        const bytes = await file.arrayBuffer(); // Raw file
        const buffer = Buffer.from(bytes) // Converting Nodejs buffer - Write the file to disk

        // Creating a temp dir path by joining cwd with the folder name 'temp'
        const tempDir = path.join(process.cwd(), 'temp')
        const tempFilePath = path.join(tempDir, `Upload_${Date.now()}_${file.name}`) // Full file path by adding a unique file name

        // Create temp directory if it does not exist
        try{
            await writeFile(tempFilePath, buffer) // Write the file to disk using writeFile
        } catch (error){ //FS module -> Check if the folder exists and if not we create it using recursive condition.
            const fs = require('fs')
            if(!fs.existsSync(tempDir)){
                fs.mkdirSync(tempDir, {recursive: true});
            }
            await writeFile(tempFilePath, buffer);
        }

        try{
            const results = await searchSimilarImages(tempFilePath, {top_k: topK}); 

            return NextResponse.json({ // JSON: K-Y Pair
                success: true,
                results,
                total: results.length,
                query_file: file.name
            });
        } finally{
            // Finally block - always runs whether there's an error or not
            // clean the temp file
            try{
                await unlink(tempFilePath) // Delete the temp file after the search is complete
            } catch(error){
                console.warn('Failed to delete the temp file: ', error)
            }
        }
    } catch(error){
        console.error('Search API error: ', error)
        NextResponse.json({
            error: 'Search Failed',
            details: error instanceof Error ? error.message : "unknown error"
        }, {
            status: 500 //Internal server error
        });
    }
}

export async function GET() {
  return NextResponse.json({ 
    success: false,
    message: 'Method not allowed. Only POST requests are accepted.' 
  }, { status: 405 });
}