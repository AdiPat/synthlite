/**
 *
 * @file cli.ts
 * @author Aditya Patange (AdiPat) <contact.adityapatange@gmail.com>
 * @description 🚀 CLI is a class that handles command-line interface operations.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "Wise speaks, symbols breathe." — IA
 *
 */
import { CLIOptions } from "../models";
/**
 * CLI: Handles command-line interface operations.
 * @class CLI
 */
export declare class CLI {
    /**
     * Retrieves and validates command-line options.
     * @returns {Promise<CLIOptions>} - A promise that resolves to the CLI options.
     */
    static getOptions(): Promise<CLIOptions>;
}
