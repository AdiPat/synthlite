/**
 *
 * @file config.ts
 * @author Aditya Patange (AdiPat) <contact.adityapatange@gmail.com>
 * @description Config class for handling configuration operations.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "I can feel your energy from two planets away I got my drink I got my music..." — Kendrick Lamar
 *
 */
import { printer } from "./printer";
import dotenv from "dotenv";

/**
 * Config: Handles configuration operations.
 * @class Config
 */
export class Config {
  /**
   * Asserts the presence of AI configuration in the environment.
   * @returns void
   */
  public static assertAIConfig(): void {
    if (process.env.ANTHROPIC_API_KEY) {
      printer.debug("ANTHROPIC_API_KEY found in environment.");
      return;
    } else {
      printer.debug(
        "No ANTHROPIC_API_KEY found in environment. Falling back to GROQ API."
      );
    }

    if (process.env.GROQ_API_KEY) {
      printer.debug("GROQ_API_KEY found in environment.");
      return;
    } else {
      printer.debug("No GROQ_API_KEY found in environment.");
    }

    printer.error(
      "Please add either GROQ_API_KEY or ANTHROPIC_API_KEY to your environment file."
    );
    process.exit(1);
  }

  /**
   * Loads the environment file.
   * @param envPath The path to the environment file.
   * @returns void
   */
  public static loadEnv(envPath: string): void {
    try {
      dotenv.config({ path: envPath });
    } catch (error) {
      printer.error(
        "Error loading environment file. Please specify the correct environment file using -env option."
      );
      process.exit(1);
    }
  }
}
