/**
 *
 * @file ai.ts
 * @description 🚀 AI is a singleton class that handles interactions with different AI models.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "Move fast, break things." — Meta Platforms, Inc.
 *
 */

import { anthropic } from "@ai-sdk/anthropic";
import { LanguageModel } from "ai";
import { Constants } from "./constants";
import { createOpenAI as createGroq } from "@ai-sdk/openai";

/**
 * AI: Singleton class to handle interactions with different AI models.
 * @class AI
 */
export class AI {
  private static instance: AI;
  private model: LanguageModel;

  /**
   * Private constructor to prevent direct instantiation.
   * @param {string} provider - The AI provider to use.
   */
  private constructor(provider = Constants.DEFAULT_AI_PROVIDER) {
    if (provider === "anthropic") {
      this.model = anthropic(Constants.DEFAULT_ANTHROPIC_AI_MODEL);
    } else if (provider === "meta") {
      const groq = createGroq({
        baseURL: Constants.GROQ_BASE_URL,
        apiKey: process.env.GROQ_API_KEY,
      });
      this.model = groq(Constants.DEFAULT_AI_MODEL);
    } else {
      throw new Error("Invalid provider specified!");
    }
  }

  /**
   * Returns the singleton instance of AI.
   * @returns {AI} - The singleton instance.
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new AI();
    }

    return this.instance;
  }

  /**
   * Returns the current AI model.
   * @returns {LanguageModel} - The current AI model.
   */
  getModel() {
    return this.model;
  }
}
