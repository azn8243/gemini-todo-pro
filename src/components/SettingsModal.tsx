import { useState } from 'react';
import { Sparkles, Key, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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

  const handleSave = () => {
    onSaveApiKey(inputKey);
    onClose();
  };

  const handleRemove = () => {
    setInputKey('');
    onSaveApiKey('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
            <Input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground/50"
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium text-foreground">AI Features Include:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Auto-categorization of tasks</li>
              <li>• Smart title cleanup and formatting</li>
              <li>• Typo correction</li>
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
              >
                Remove Key
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-border text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!inputKey.trim()}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
