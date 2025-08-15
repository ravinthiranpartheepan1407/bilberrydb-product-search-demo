"use client";

import React, {useState} from 'react';
import ImageUploader from '@/components/ImageUploader';
import SearchResults from '@/components/SearchResults';
import { SearchResult } from '@/types/bilberry';
import {AlertCircle} from "lucide-react";

export default function Homepage(){ // HomePage Comp -> Main Page of our app. 
  const [searchResults, setSearchResults] = useState<SearchResult[]> ([]) // Store the list of matching results. It starts with an empty array
  // <SearchResult[]> -> Each item in the array will follow the SearcResult type
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null> (null) //Storing the error message. The message can a string or null if there is no error

  const handleImageSearch = async(file: File) => {
    setIsLoading(true)
    setError(null)
    setSearchResults([])
    try{
      const formData = new FormData() // Object -> Send files and data to server
      formData.append('image', file)
      formData.append('top_k', '5')
      const response = await fetch("https://bilberrydb-product-search-demo.vercel.app/api/search", { //Form Data to our Search APi Endpoint: /api/search
        method: 'POST', // Sending a file 
        body: formData 
      })
      const data = await response.json();
      if(!response.ok){
        throw new Error(data.error || 'Search Failed')
      }
      setSearchResults(data.results || [])
    } catch(err){
      const errorMessage = err instanceof Error ? err.message : "An error ocurred"
      setError(errorMessage)
      console.error("Search Error: ", err)
    } finally{ // Runs no matter what - success or error
      setIsLoading(false);
    }
  }

  return(
    <div className='min-h-screen bg-gradient-to-br from-gray-50 to-blue-50'>
      <div className='container mx-auto px-4 py-8 max-w-4xl'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-bold text-gray-800 mb-2'>Product Visual Search Engine</h1>
          <p className='text-gray-600'>Find similar products by uploading an image</p>
        </div>
        
        <section className='mb-8'>
          <ImageUploader onImageSelect={handleImageSearch} isLoading={isLoading} />
        </section>
        
        {error && (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4 mb-8'>
            <div className='flex items-center space-x-2 mb-2'>
              <AlertCircle className='w-5 h-5 text-red-500' />
              <h3 className='font-semibold text-red-800'>Search Error</h3>
            </div>
            <p className='text-red-700 text-sm'>{error}</p>
          </div>
        )}
        
        <section>
          <SearchResults results={searchResults} isLoading={isLoading} />
        </section>
      </div>
    </div>
  )
} 