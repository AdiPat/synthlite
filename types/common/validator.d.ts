/**
 *
 * @file validator.ts
 * @author Aditya Patange (AdiPat) <contact.adityapatange@gmail.com>
 * @description 🚀 Validator class for validating CLI options and environment paths.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "In the shadows, truth whispers." — Unknown
 *
 */
/**
 * Validator: Validates CLI options and environment paths.
 * @class Validator
 */
export declare class Validator {
    /**
     * Validates the CLI options provided by the user.
     *
     * @param options - The CLI options to validate.
     */
    static validateCLIOptions(options: any): void;
    /**
     * Validates the environment file path.
     *
     * @param envPath - The path to the environment file.
     * @returns The final environment file path.
     */
    static validateEnvPath(envPath: string): Promise<string>;
}
