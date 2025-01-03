/**
 *
 * @file constants.ts
 * @author Aditya Patange (AdiPat) <contact.adityapatange@gmail.com>
 * @description Global constants for SynthLite.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "Why be a king, when you can be a God?" — Eminem
 *
 */

export class Constants {
  public static readonly DEFAULT_ROWS: number = 10;
  public static readonly CONSECUTIVE_NOOP_THRESHOLD: number = 3;
  public static readonly DEFAULT_BATCH_SIZE: number = 10;
  public static readonly DEFAULT_AI_MODEL: string = "llama-3.3-70b-versatile";
  public static readonly DEFAULT_ANTHROPIC_AI_MODEL: string =
    "claude-3-5-haiku-latest";
  public static readonly DEFAULT_AI_PROVIDER: string = "anthropic";
  public static readonly GROQ_BASE_URL: string =
    "https://api.groq.com/openai/v1";
}
