import React, { useRef, useState } from 'react';
import { parseUploadedFile } from '../utils/fileParser';
import { AppData } from '../types';

interface FileUploadProps {
  onDataLoaded: (data: AppData, fileName: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setFileName(file.name);

    try {
      const data = await parseUploadedFile(file);
      onDataLoaded(data, file.name);
    } catch (error) {
      console.error("Failed to parse file", error);
      alert("Failed to parse file. Please ensure it is a valid .xlsx, .json, or .pdf file.");
      setFileName(null);
    } finally {
      setIsParsing(false);
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json, .xlsx, .xls, .pdf"
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isParsing}
        className="flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 transition-colors shadow-sm font-medium"
      >
        {isParsing ? (
          <i className="fa-solid fa-spinner fa-spin text-indigo-600"></i>
        ) : (
          <i className="fa-solid fa-upload text-indigo-600"></i>
        )}
        <span>{fileName ? 'Data Loaded' : 'Upload Data'}</span>
      </button>
    </>
  );
};

export default FileUpload;