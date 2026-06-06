import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { ModelConfig } from '../utils/config';

export interface AIResponse {
  command: string;
  explanation?: string;
}

const systemPrompt = `你是一个专业的终端命令助手。将用户的自然语言描述转换为精确的Shell命令。

规则：
1. 只输出一个最相关的命令
2. 如果命令有危险性（如rm -rf /），请添加警告说明
3. 对于复杂操作，提供简要解释
4. 优先使用跨平台兼容的命令
5. 如果用户请求不明确，给出最合理的假设

输出格式（严格JSON）：
{
  "command": "具体的shell命令",
  "explanation": "命令的简要说明（可选）"
}`;

const explainSystemPrompt = '你是一个命令解释专家。用简洁的中文解释给定的Shell命令的功能、每个参数的含义，以及使用时的注意事项。';

export async function generateCommand(
  query: string,
  config: ModelConfig,
  context?: string
): Promise<AIResponse> {
  const userPrompt = context
    ? `当前工作目录: ${context}\n\n用户需求: ${query}`
    : `用户需求: ${query}`;

  let text: string;

  switch (config.provider) {
    case 'openai':
    case 'ollama': {
      const client = new OpenAI({
        apiKey: config.apiKey || 'ollama',
        baseURL: config.baseUrl || (config.provider === 'ollama' ? 'http://localhost:11434/v1' : undefined),
      });
      const response = await client.chat.completions.create({
        model: config.model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.2,
        max_tokens: 500,
      });
      text = response.choices[0]?.message?.content || '';
      break;
    }
    case 'anthropic': {
      const client = new Anthropic({ apiKey: config.apiKey || '' });
      const response = await client.messages.create({
        model: config.model,
        max_tokens: 500,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
      const content = response.content[0];
      text = content.type === 'text' ? content.text : '';
      break;
    }
    case 'google': {
      const client = new GoogleGenerativeAI(config.apiKey || '');
      const model = client.getGenerativeModel({ model: config.model });
      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 500 },
      });
      text = result.response.text();
      break;
    }
    default:
      throw new Error(`不支持的AI提供商: ${config.provider}`);
  }

  try {
    const parsed = JSON.parse(text);
    return {
      command: parsed.command || text.trim(),
      explanation: parsed.explanation,
    };
  } catch {
    const lines = text.trim().split('\n');
    const cmdLine = lines.find((l) => l.trim() && !l.startsWith('```') && !l.startsWith('{'));
    return {
      command: cmdLine || text.trim(),
      explanation: undefined,
    };
  }
}

export async function explainCommand(
  command: string,
  config: ModelConfig
): Promise<string> {
  const userPrompt = `请解释这个命令：\n\n${command}`;
  let text: string;

  switch (config.provider) {
    case 'openai':
    case 'ollama': {
      const client = new OpenAI({
        apiKey: config.apiKey || 'ollama',
        baseURL: config.baseUrl || (config.provider === 'ollama' ? 'http://localhost:11434/v1' : undefined),
      });
      const response = await client.chat.completions.create({
        model: config.model,
        messages: [
          { role: 'system', content: explainSystemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 800,
      });
      text = response.choices[0]?.message?.content || '';
      break;
    }
    case 'anthropic': {
      const client = new Anthropic({ apiKey: config.apiKey || '' });
      const response = await client.messages.create({
        model: config.model,
        max_tokens: 800,
        temperature: 0.3,
        system: explainSystemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      });
      const content = response.content[0];
      text = content.type === 'text' ? content.text : '';
      break;
    }
    case 'google': {
      const client = new GoogleGenerativeAI(config.apiKey || '');
      const model = client.getGenerativeModel({ model: config.model });
      const result = await model.generateContent({
        contents: [
          { role: 'user', parts: [{ text: `${explainSystemPrompt}\n\n${userPrompt}` }] },
        ],
        generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
      });
      text = result.response.text();
      break;
    }
    default:
      throw new Error(`不支持的AI提供商: ${config.provider}`);
  }

  return text.trim();
}
