import { useState } from 'react';
import { Sparkles, Key, ExternalLink, Loader2, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  apiKey,
  onSaveApiKey 
}: SettingsModalProps) => {
  const [inputKey, setInputKey] = useState(apiKey);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const testApiKey = async (key: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Say "OK" if you can read this.' }] }],
            generationConfig: { maxOutputTokens: 10 }
          }),
        }
      );
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleSave = async () => {
    if (!inputKey.trim()) return;
    
    setTesting(true);
    setTestResult(null);
    
    const isValid = await testApiKey(inputKey.trim());
    
    setTesting(false);
    setTestResult(isValid ? 'success' : 'error');
    
    if (isValid) {
      onSaveApiKey(inputKey.trim());
      toast.success('API key saved! AI features are now enabled.');
      setTimeout(() => onClose(), 500);
    } else {
      toast.error('Invalid API key. Please check and try again.');
    }
  };

  const handleRemove = () => {
    setInputKey('');
    setTestResult(null);
    onSaveApiKey('');
    toast.info('API key removed. AI features disabled.');
    onClose();
  };

  const handleClose = () => {
    setTestResult(null);
    setInputKey(apiKey);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enable AI-powered features by adding your Google Gemini API key
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 mt-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Key className="w-4 h-4" />
              Gemini API Key
            </label>
            <div className="relative">
              <Input
                type="password"
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setTestResult(null);
                }}
                placeholder="Enter your Gemini API key"
                className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50 pr-10"
              />
              {testResult === 'success' && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
              )}
              {testResult === 'error' && (
                <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-destructive" />
              )}
            </div>
            {testResult === 'error' && (
              <p className="text-sm text-destructive mt-1">
                Invalid API key. Make sure you copied it correctly from Google AI Studio.
              </p>
            )}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-foreground">AI Features Include:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Auto-categorization of tasks</li>
              <li>• Smart title & notes optimization</li>
              <li>• AI-powered schedule insights</li>
              <li>• Interactive task Q&A</li>
            </ul>
          </div>

          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-secondary hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Get your free Gemini API key
          </a>

          <div className="flex gap-3 pt-2">
            {apiKey && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleRemove}
                className="flex-1"
                disabled={testing}
              >
                Remove Key
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-border text-muted-foreground hover:text-foreground"
              disabled={testing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!inputKey.trim() || testing}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                'Save Key'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};