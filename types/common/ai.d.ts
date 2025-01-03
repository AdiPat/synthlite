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
/**
 * AI: Singleton class to handle interactions with different AI models.
 * @class AI
 */
export declare class AI {
    private static instance;
    private model;
    /**
     * Private constructor to prevent direct instantiation.
     * @param {string} provider - The AI provider to use.
     */
    private constructor();
    /**
     * Returns the singleton instance of AI.
     * @returns {AI} - The singleton instance.
     */
    static getInstance(): AI;
    /**
     * Returns the current AI model.
     * @returns {LanguageModel} - The current AI model.
     */
    getModel(): import("ai").LanguageModelV1;
}
