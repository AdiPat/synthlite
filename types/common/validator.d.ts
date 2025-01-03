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
    static validateCLIOptions(options: any): Promise<void>;
    /**
     * Validates the environment file path.
     *
     * @param envPath - The path to the environment file.
     * @returns The final environment file path.
     */
    static validateEnvPath(envPath: string): Promise<string>;
    /**
     * Validates the file path.
     * @param filePath - The path to the file to validate.
     */
    private static validateFilePath;
    /**
     * Creates a file if it does not exist.
     * @param filePath - The path to the file to create.
     */
    private static createFileIfNotExists;
}
