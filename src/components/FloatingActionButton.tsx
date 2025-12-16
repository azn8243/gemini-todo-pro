import { Plus, Mic, MicOff, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { Category } from '@/types/todo';
import { SpeechRecognition } from '@capacitor-community/speech-recognition';

interface FloatingActionButtonProps {
  onAddClick: () => void;
  onVoiceTask: (title: string) => void;
  isAIEnabled: boolean;
  onCategorize: (title: string) => Promise<{ category: Category; cleanedTitle: string }>;
}

// Check if we're running in Capacitor native environment
const isNative = (): boolean => {
  return !!(window as any).Capacitor?.isNativePlatform?.();
};

export const FloatingActionButton = ({ 
  onAddClick, 
  onVoiceTask, 
  isAIEnabled,
  onCategorize 
}: FloatingActionButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [webRecognition, setWebRecognition] = useState<any>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Initialize web speech recognition for browser
  useEffect(() => {
    if (!isNative()) {
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'en-US';
        
        recognitionInstance.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript;
          await handleVoiceResult(transcript);
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
        
        setWebRecognition(recognitionInstance);
      }
    }
  }, []);

  // Check permissions for native
  useEffect(() => {
    const checkPermissions = async () => {
      if (isNative()) {
        try {
          const { speechRecognition } = await SpeechRecognition.checkPermissions();
          setHasPermission(speechRecognition === 'granted');
        } catch (error) {
          console.error('Permission check error:', error);
          setHasPermission(false);
        }
      }
    };
    checkPermissions();
  }, []);

  const handleVoiceResult = async (transcript: string) => {
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
    } catch (error) {
      console.error('Voice task error:', error);
      toast.error('Failed to process voice input');
    } finally {
      setIsProcessing(false);
    }
  };

  const startNativeRecognition = async () => {
    try {
      // Request permissions if not granted
      if (!hasPermission) {
        const { speechRecognition } = await SpeechRecognition.requestPermissions();
        if (speechRecognition !== 'granted') {
          toast.error('Microphone permission denied');
          return;
        }
        setHasPermission(true);
      }

      // Check availability
      const { available } = await SpeechRecognition.available();
      if (!available) {
        toast.error('Speech recognition not available on this device');
        return;
      }

      setIsListening(true);
      toast.info('🎤 Listening... Say your task!');

      // Start listening
      await SpeechRecognition.start({
        language: 'en-US',
        maxResults: 1,
        prompt: 'Say your task...',
        partialResults: false,
        popup: true,
      });

      // Add listener for results
      SpeechRecognition.addListener('partialResults', async (data: { matches: string[] }) => {
        if (data.matches && data.matches.length > 0) {
          const transcript = data.matches[0];
          await handleVoiceResult(transcript);
          SpeechRecognition.removeAllListeners();
        }
      });

    } catch (error: any) {
      console.error('Native speech recognition error:', error);
      toast.error(error.message || 'Voice input failed');
      setIsListening(false);
    }
  };

  const stopNativeRecognition = async () => {
    try {
      await SpeechRecognition.stop();
      SpeechRecognition.removeAllListeners();
    } catch (error) {
      console.error('Stop recognition error:', error);
    }
    setIsListening(false);
  };

  const toggleVoiceInput = useCallback(async () => {
    if (isNative()) {
      // Use Capacitor native speech recognition
      if (isListening) {
        await stopNativeRecognition();
      } else {
        await startNativeRecognition();
      }
    } else {
      // Use web speech recognition
      if (!webRecognition) {
        toast.error('Voice input not supported in this browser');
        return;
      }
      
      if (isListening) {
        webRecognition.stop();
        setIsListening(false);
      } else {
        webRecognition.start();
        setIsListening(true);
        toast.info('🎤 Listening... Say your task!');
      }
    }
  }, [webRecognition, isListening, hasPermission]);

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