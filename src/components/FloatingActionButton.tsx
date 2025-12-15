import { Plus, Mic, MicOff, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Category } from '@/types/todo';

interface FloatingActionButtonProps {
  onAddClick: () => void;
  onVoiceTask: (title: string) => void;
  isAIEnabled: boolean;
  onCategorize: (title: string) => Promise<{ category: Category; cleanedTitle: string }>;
}

export const FloatingActionButton = ({ 
  onAddClick, 
  onVoiceTask, 
  isAIEnabled,
  onCategorize 
}: FloatingActionButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      const recognitionInstance = new SpeechRecognitionAPI();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setIsProcessing(true);
        
        toast.success(`Heard: "${transcript}"`);
        
        try {
          if (isAIEnabled) {
            const result = await onCategorize(transcript);
            onVoiceTask(result.cleanedTitle);
          } else {
            onVoiceTask(transcript);
          }
        } finally {
          setIsProcessing(false);
        }
      };
      
      recognitionInstance.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        toast.error('Voice input failed. Please try again.');
        setIsListening(false);
        setIsProcessing(false);
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [isAIEnabled, onCategorize, onVoiceTask]);

  const toggleVoiceInput = useCallback(() => {
    if (!recognition) {
      toast.error('Voice input not supported in this browser');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info('🎤 Listening... Say your task!');
    }
  }, [recognition, isListening]);

  return (
    <>
      {/* Voice Button */}
      <button 
        onClick={toggleVoiceInput}
        disabled={isProcessing}
        className={`fab fab-voice ${isListening ? 'recording' : ''}`}
      >
        {isProcessing ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : isListening ? (
          <MicOff className="w-6 h-6" />
        ) : (
          <Mic className="w-6 h-6" />
        )}
      </button>

      {/* Add Button */}
      <button onClick={onAddClick} className="fab fab-add">
        <Plus className="w-7 h-7" />
      </button>
    </>
  );
};
