import { useState, useCallback } from 'react';
import { Category } from '@/types/todo';

const API_KEY_STORAGE = 'gemini-api-key';

export const useAI = () => {
  const [apiKey, setApiKeyState] = useState<string>(() => {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const isEnabled = apiKey.length > 0;

  const setApiKey = useCallback((key: string) => {
    setApiKeyState(key);
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  }, []);

  const categorizeTask = useCallback(async (title: string): Promise<{ category: Category; cleanedTitle: string }> => {
    if (!isEnabled) {
      return { category: 'Personal', cleanedTitle: title };
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `You are a task categorization assistant. Analyze the following task and:
1. Categorize it into one of these categories: Work, Personal, or Shopping
2. Clean up the text to make it more professional and clear (fix typos, improve wording)

Task: "${title}"

Respond in JSON format only, no markdown:
{"category": "Work|Personal|Shopping", "cleanedTitle": "cleaned up task title"}`
              }]
            }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 150,
            }
          }),
        }
      );

      if (!response.ok) {
        throw new Error('AI request failed');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const validCategories: Category[] = ['Work', 'Personal', 'Shopping'];
        const category = validCategories.includes(parsed.category) ? parsed.category : 'Personal';
        return {
          category,
          cleanedTitle: parsed.cleanedTitle || title,
        };
      }
      
      return { category: 'Personal', cleanedTitle: title };
    } catch (error) {
      console.error('AI categorization error:', error);
      return { category: 'Personal', cleanedTitle: title };
    } finally {
      setIsProcessing(false);
    }
  }, [apiKey, isEnabled]);

  return {
    isEnabled,
    isProcessing,
    apiKey,
    setApiKey,
    categorizeTask,
  };
};
