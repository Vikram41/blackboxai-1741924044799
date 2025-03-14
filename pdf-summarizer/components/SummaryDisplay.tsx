import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEdit, FaSave, FaCopy, FaDownload, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

interface SummaryDisplayProps {
  summary: string;
  onSave?: (editedSummary: string) => void;
}

const SummaryDisplay = ({ summary, onSave }: SummaryDisplayProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(summary);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  useEffect(() => {
    setEditedText(summary);
  }, [summary]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedText);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const handleDownload = (format: 'txt' | 'pdf') => {
    const element = document.createElement('a');
    if (format === 'txt') {
      const file = new Blob([editedText], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = 'summary.txt';
    } else {
      // For PDF, we'll use a simple approach. For a more sophisticated PDF,
      // you might want to use a library like jsPDF
      const content = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; }
              h1 { color: #333; }
              p { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>PDF Summary</h1>
            <p>${editedText.replace(/\n/g, '<br>')}</p>
          </body>
        </html>
      `;
      const file = new Blob([content], { type: 'text/html' });
      element.href = URL.createObjectURL(file);
      element.download = 'summary.pdf';
    }
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const toggleSpeech = () => {
    if (!speechSynthesis) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(editedText);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Summary</h2>
          <div className="flex space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(!isEditing)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <FaEdit className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              <FaCopy className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleSpeech}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              {isSpeaking ? <FaVolumeMute className="w-5 h-5" /> : <FaVolumeUp className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="w-full h-64 p-4 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="flex justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setIsEditing(false);
                  if (onSave) onSave(editedText);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <FaSave className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{editedText}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload('txt')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Download TXT
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload('pdf')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Download PDF
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryDisplay;
