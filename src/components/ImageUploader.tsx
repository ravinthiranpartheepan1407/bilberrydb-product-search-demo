"use client" // Nextjs App Router Directive - File should be rendered on the client side and we want to enable react hooks (useState, useCallback)

import { Upload } from 'lucide-react';
import React, {useState, useCallback} from 'react'; // useState - React Hook used to store and update component state
// useCallback - Persist the functions so they are not recreated on every render

interface ImageUploadProps{ // TS interface for compoent prop
    onImageSelect: (file: File) => void; // function that takes a file as i/p and returns nothing (Void)
    isLoading: boolean; // Is boolean type -> if the upload process is currently in progress
}


// Fucntion component
const ImageUploader: React.FC<ImageUploadProps> = ({onImageSelect, isLoading}) => {
    // Defining a FC (React.FC) with the props we defined in the ImgeUploadProps
    // onImageSelect: Callback func whenever an image is chosen
    // isLoading: If something is in progress

    // Handle Drag and Drop
    const [dragActive, setDragActive] = useState(true) //True - If a file is being dragged over the drop area
    const [selectedImage, setSelectedImage] = useState<File | null> (null) // Stores the file object of the chosen image
    const [previewUrl, setPreviewUrl] = useState<string | null> (null) // Stores the URL of the image for preview purposes

    const handleDrag = useCallback((e: React.DragEvent) => { // useCallback - Func reference stays the same between renders
        e.preventDefault(); // Stops the browser from opening the file
        e.stopPropagation() // Prevent the event from bubbling up
        if(e.type === 'dragenter' || e.type === 'dragover'){ //If this event DE || DO -> Activate the drag state
            setDragActive(true)
        } else if (e.type === 'dragleave'){ // 
            setDragActive(false);
        }
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => { // Triggered when a file is dropped into the drop area
        e.preventDefault(); // Prevent default behaviour & stops event bubbling
        e.stopPropagation();
        setDragActive(false) // Drag is finished

        if(e.dataTransfer.files && e.dataTransfer.files[0]){
            handleFile(e.dataTransfer.files[0]) // HandleFile function
        }
    }, []);

    const handleFile = (file: File) => { // If this file is an image (MIME type starts with image/)
        if(file.type.startsWith('image/')){
            setSelectedImage(file) // Store the file in selectImage
            const url = URL.createObjectURL(file) // Create an object url for the uploaded image
            setPreviewUrl(url) // updating the url in the previewURL state
            onImageSelect(file); // Parent FC knows about the new image.
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { // handle file input change event 
        e.preventDefault();
        if(e.target.files && e.target.files[0]){
            handleFile(e.target.files[0])
        }
    }

    const clearImage = () => { // Removes the selected image from state
        setSelectedImage(null) 
        if(previewUrl){ // previewURL exists, we need to revoke with  "URL.revokeObjectURL" free memory
            URL.revokeObjectURL(previewUrl)
        }
        setPreviewUrl(null) // previewURL to null
    }

    return(
        <div>
           <div className={`${dragActive ? 'bg-blue-50 border-blue-300' : selectedImage ? 'bg-gray-50 border-gray-200' : 'bg-red-50 border-red-300'} border-2 border-dashed rounded-xl p-6 transition-colors duration-200 hover:opacity-70`} 
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input type="file" id="image-upload" accept='image/*' onChange={handleChange} disabled={isLoading} className='hidden' />
                {previewUrl ? (
                    <div className='text-center space-y-4'>
                        <div className='relative inline-block'>
                            <img src={previewUrl} className='max-w-full max-h-48 rounded-lg shadow-md object-contain' />
                            <button className='absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold transition-color disabled:opacity-50' onClick={clearImage} disabled={isLoading}>x</button>
                        </div>
                        <p className='text-sm text-gray-600 font-medium'>
                            {selectedImage?.name} ({(selectedImage!.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                    </div>
                ):(
                    <div className='text-center space-y-4'>
                        <div className='flex justify-center'>
                            {isLoading ? (
                                <div className='flex items-center space-x-2 text-blue-600'>
                                    <div className='w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                                    <p className='font-medium'>Loading...</p>
                                </div>
                            ): (
                                <label htmlFor="image-upload" className='cursor-pointer inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors'>
                                    <Upload className='w-4 h-4 mr-2' /> Upload
                                </label>
                            )}
                        </div>
                        <div>
                            <p className='text-gray-700 font-medium'>{isLoading ? 'searching....': 'Upload an image to search'}</p>
                        </div>
                        <p className='text-sm text-gray-500'>Drag and Drop or Click to select an Image file</p>
                    </div>
                )}
            </div> 
        </div>
    )
}

export default ImageUploader;



