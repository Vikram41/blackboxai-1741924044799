import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFileUpload, FaSpinner } from 'react-icons/fa';
import { extractTextFromPDF, isPasswordProtected } from '../lib/utils/pdf';

interface PDFUploaderProps {
  onTextExtracted: (text: string) => void;
  summaryLength: 'short' | 'medium' | 'long';
}

const PDFUploader = ({ onTextExtracted, summaryLength }: PDFUploaderProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Check if PDF is password protected
      const isProtected = await isPasswordProtected(file);
      if (isProtected) {
        throw new Error('Password protected PDFs are not supported');
      }

      // Extract text from PDF
      const text = await extractTextFromPDF(file);
      if (!text.trim()) {
        throw new Error('No text could be extracted from the PDF');
      }

      onTextExtracted(text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process PDF');
    } finally {
      setIsLoading(false);
    }
  }, [onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const dropzoneProps = getRootProps();

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={false}
        className={`
          relative p-8 border-2 border-dashed rounded-lg cursor-pointer
          transition-colors duration-200 ease-in-out
          ${isDragActive 
            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-400 dark:hover:border-indigo-500'
          }
        `}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={dropzoneProps.onClick}
        onKeyDown={dropzoneProps.onKeyDown}
        onFocus={dropzoneProps.onFocus}
        onBlur={dropzoneProps.onBlur}
        tabIndex={0}
        role="button"
        aria-label="Upload PDF"
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <FaSpinner className="w-12 h-12 text-indigo-500 animate-spin" />
            ) : (
              <FaFileUpload className="w-12 h-12 text-indigo-500 dark:text-indigo-400" />
            )}
          </motion.div>

          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {isDragActive
                ? 'Drop your PDF here'
                : 'Drag & drop your PDF here, or click to select'}
            </p>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              PDF files only, up to 10MB
            </p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PDFUploader;
