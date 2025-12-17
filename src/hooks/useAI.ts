import { useState, useCallback } from 'react';
import { Category, Task } from '@/types/todo';

const API_KEY_STORAGE = 'gemini-api-key';

interface AIInsight {
  type: 'optimization' | 'question' | 'suggestion' | 'schedule';
  message: string;
  action?: {
    label: string;
    value: string;
  };
}

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

  const callGemini = async (prompt: string): Promise<string> => {
    if (!apiKey) {
      throw new Error('No API key configured');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
      
      // Use gemini-2.0-flash-lite which is the latest available model
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            }
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Gemini API error:', response.status, errorData);
        
        if (response.status === 400) {
          throw new Error('Invalid API key or request. Please check your Gemini API key.');
        } else if (response.status === 403) {
          throw new Error('API key unauthorized. Enable Gemini API in Google Cloud Console.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        }
        throw new Error(`AI request failed: ${errorData?.error?.message || response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) {
        console.error('No text in response:', data);
        throw new Error('No response from AI');
      }
      
      return text;
    } catch (error: any) {
      console.error('Gemini call failed:', error);
      if (error.name === 'AbortError') {
        throw new Error('AI request timed out. Check your connection.');
      }
      throw error;
    }
  };

  const categorizeTask = useCallback(async (title: string): Promise<{ category: Category; cleanedTitle: string }> => {
    if (!isEnabled) {
      return { category: 'Personal', cleanedTitle: title };
    }

    setIsProcessing(true);
    try {
      const text = await callGemini(`You are a task categorization assistant. Analyze the following task and:
1. Categorize it into one of these categories: Work, Personal, or Shopping
2. Clean up the text to make it more professional and clear (fix typos, improve wording)

Task: "${title}"

Respond in JSON format only, no markdown:
{"category": "Work|Personal|Shopping", "cleanedTitle": "cleaned up task title"}`);
      
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

  const optimizeTask = useCallback(async (
    title: string, 
    notes: string, 
    category: Category
  ): Promise<{ optimizedTitle: string; optimizedNotes: string; insight: AIInsight }> => {
    if (!isEnabled) {
      return { 
        optimizedTitle: title, 
        optimizedNotes: notes,
        insight: { type: 'suggestion', message: 'Enable AI to get smart task optimization!' }
      };
    }

    setIsProcessing(true);
    try {
      const text = await callGemini(`You are a productivity assistant. Optimize this task for clarity and actionability:

Task Title: "${title}"
Category: ${category}
Notes: "${notes || 'No notes provided'}"

Provide:
1. An optimized, action-oriented title (start with a verb, be specific)
2. Enhanced notes with clear action items, context, or helpful structure
3. One helpful insight - this could be:
   - A clarifying question if the task is vague
   - A scheduling suggestion based on task type
   - A productivity tip related to this task
   - A way to break down a complex task

Respond in JSON format only, no markdown:
{
  "optimizedTitle": "improved title",
  "optimizedNotes": "enhanced notes with structure",
  "insight": {
    "type": "optimization|question|suggestion|schedule",
    "message": "your helpful insight or question",
    "action": {"label": "Apply suggestion", "value": "the suggested improvement"} 
  }
}`);
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          optimizedTitle: parsed.optimizedTitle || title,
          optimizedNotes: parsed.optimizedNotes || notes,
          insight: parsed.insight || { type: 'suggestion', message: 'Task optimized!' },
        };
      }
      
      return { 
        optimizedTitle: title, 
        optimizedNotes: notes,
        insight: { type: 'suggestion', message: 'Could not generate optimization.' }
      };
    } catch (error) {
      console.error('AI optimization error:', error);
      return { 
        optimizedTitle: title, 
        optimizedNotes: notes,
        insight: { type: 'suggestion', message: 'AI optimization failed. Try again.' }
      };
    } finally {
      setIsProcessing(false);
    }
  }, [apiKey, isEnabled]);

  const getScheduleInsights = useCallback(async (tasks: Task[]): Promise<AIInsight[]> => {
    if (!isEnabled || tasks.length === 0) {
      return [];
    }

    setIsProcessing(true);
    try {
      const taskSummary = tasks.map(t => 
        `- ${t.title} (${t.category}, ${t.time}, ${t.completed ? 'done' : 'pending'})`
      ).join('\n');

      const text = await callGemini(`You are a productivity coach. Analyze this task list and provide 2-3 actionable insights:

Today's Tasks:
${taskSummary}

Provide insights about:
- Task prioritization suggestions
- Time management tips based on task types
- Potential scheduling conflicts or optimizations
- Motivational nudges if tasks are piling up

Respond in JSON format only, no markdown:
{
  "insights": [
    {"type": "schedule|suggestion|optimization", "message": "your insight"},
    {"type": "schedule|suggestion|optimization", "message": "another insight"}
  ]
}`);
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return parsed.insights || [];
      }
      
      return [];
    } catch (error) {
      console.error('AI schedule insights error:', error);
      return [];
    } finally {
      setIsProcessing(false);
    }
  }, [apiKey, isEnabled]);

  const askFollowUp = useCallback(async (
    title: string,
    notes: string,
    question: string
  ): Promise<string> => {
    if (!isEnabled) {
      return 'Enable AI to get answers!';
    }

    setIsProcessing(true);
    try {
      const text = await callGemini(`You are a helpful task assistant. The user has a task and is asking a follow-up question.

Task: "${title}"
Notes: "${notes || 'No notes'}"
User Question: "${question}"

Provide a helpful, concise response (2-3 sentences max). Be practical and actionable.`);
      
      return text.trim() || 'I couldn\'t generate a response. Please try again.';
    } catch (error) {
      console.error('AI follow-up error:', error);
      return 'Failed to get AI response. Check your API key.';
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
    optimizeTask,
    getScheduleInsights,
    askFollowUp,
  };
};

export type { AIInsight };
