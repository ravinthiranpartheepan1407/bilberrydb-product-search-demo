"use client" // Nextjs - component should run on the client side (useState and broswer related APIs)

import React from "react";
import { SearchResult } from "@/types/bilberry";
import LoadingSpinner from "./LoadingSpinner";
import { Search } from "lucide-react";

interface SearchResultProps{ // 
    results: SearchResult[]; // Array of SearchResults
    isLoading: boolean; // To show whether search results are still loading
}

// Component definition
const SearchResults: React.FC<SearchResultProps> = ({results, isLoading}) => {
    if(isLoading){
        return(
            <div className="flex flex-col items-center justify-center space-y-4">
                <LoadingSpinner />
                <p className="text-gray-600 font-medium">Searching for similar images...</p>
            </div>
        )
    }

    if(results.length === 0){
        return(
            <div className="text-center py-12 space-y-3">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-lg font-medium text-gray-800">No Similar Images Found</p>
                <p className="text-gray-600">Try uploading a different image</p>
            </div>
        )
    }

    return(
        <div className="space-y-6">
            <div className="text-center sapce-y-2">
                <h2 className="text-2xl font-bold text-gray-800">Similar images Found</h2>
                <p className="text-gray-600">Found {results.length} similar Image {results.length !== 1 ? 's' : ''}</p>
            </div>

            <div className="grid gap-4">
                {results.map((result, index) => {
                    const filename = result.filename || result.file_name || `product_${result.id}`;
                    const similarityPercentage = (result.similarity_score * 100).toFixed(1);
                    return(
                        <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-sm transition-shadow" key={result.id}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                    Product: #{index + 1}
                                </div>                                
                            </div>
                            <div className="text-sm font-semibold text-green-600">
                                Similarty Score: {similarityPercentage}%
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center sapce-x-2 mt-3">
                                    <label className="text-sm font-medium text-gray-500 min-w-fit">Filename: </label>
                                    <p className="text-sm text-gray-800 truncate">{filename}</p>
                                </div>

                                <div className="flex items-center sapce-x-2">
                                    <label className="text-sm font-medium text-gray-500 min-w-fit">File Type: </label>
                                    <p className="text-sm text-gray-800 truncate">{result.file_type}</p>
                                </div>

                                <div className="spacey-y-2">
                                    <label className="text-sm font-medium text-gray-500">Similarity Score: </label>
                                    <div className="flex items-center sapce-x-3"> 
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                            <div className="bg-gradient-to-r from green-400 to-green-600 h-2 rounded-full transition-all duration-300" style={{width: `${result.similarity_score * 100}%`}}></div>
                                        </div>
                                        <span className="text-xs font-mono text-gray-600 min-w-fit">{result.similarity_score.toFixed(3)}</span>
                                    </div>
                                </div>
                                {result.url && (
                                    <div className="pt-2">
                                        <a className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors" href={result.url} rel="noopener noreferrer">View Original</a>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default SearchResults;