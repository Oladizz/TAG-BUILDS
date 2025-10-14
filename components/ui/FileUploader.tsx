import React, { useState, useCallback, useRef } from 'react';

interface FileUploaderProps {
    onFileUpload: (file: File) => void;
    title: string;
    description: string;
    acceptedTypes: string;
    status: 'idle' | 'loading' | 'success';
    icon: React.ReactNode;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload, title, description, acceptedTypes, status, icon }) => {
    const [isDragActive, setIsDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") setIsDragActive(true);
        else if (e.type === "dragleave") setIsDragActive(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) onFileUpload(e.dataTransfer.files[0]);
    }, [onFileUpload]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) onFileUpload(e.target.files[0]);
    };

    const onButtonClick = () => inputRef.current?.click();

    const borderColor = isDragActive ? 'border-green-500 ring-4 ring-green-500/20' : 
                          status === 'success' ? 'border-green-500 ring-4 ring-green-500/20' : 
                          'border-white/10';
    
    const bgColor = isDragActive ? 'bg-green-500/10' : 'bg-black/20';

    return (
        <div 
            onDragEnter={handleDrag} 
            onDragLeave={handleDrag} 
            onDragOver={handleDrag} 
            onDrop={handleDrop}
            onClick={onButtonClick}
            className={`relative p-10 border-2 ${borderColor} ${bgColor} border-dashed rounded-2xl cursor-pointer transition-all duration-300 min-h-[200px] flex items-center justify-center`}
        >
            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept={acceptedTypes}
                onChange={handleChange}
                disabled={status === 'loading' || status === 'success'}
            />
            {status === 'loading' && (
                <div className="flex flex-col items-center justify-center space-y-3 animate-fade-in">
                    <svg className="animate-spin h-8 w-8 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <p className="text-gray-300 font-semibold">Verifying...</p>
                </div>
            )}
             {status === 'success' && (
                <div className="flex flex-col items-center justify-center space-y-3 text-green-400 animate-fade-in">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p className="font-semibold text-lg text-green-300">Verified Successfully</p>
                </div>
            )}
            {status === 'idle' && (
                <div className="flex flex-col items-center justify-center space-y-3 animate-fade-in">
                    <div className="text-green-400">{icon}</div>
                    <p className="font-semibold text-white text-lg">{title}</p>
                    <p className="text-sm text-gray-400">{description}</p>
                </div>
            )}
        </div>
    );
};