/**
 * Config: Handles configuration operations.
 * @class Config
 */
export declare class Config {
    /**
     * Asserts the presence of AI configuration in the environment.
     * @returns void
     */
    static assertAIConfig(): void;
    /**
     * Loads the environment file.
     * @param envPath The path to the environment file.
     * @returns void
     */
    static loadEnv(envPath: string): void;
}
