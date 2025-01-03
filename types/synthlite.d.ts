export declare class SynthLiteCLI {
    /**
     * Private constructor to prevent direct instantiation.
     */
    constructor();
    /**
     * Sets up the SynthLite CLI.
     * @returns void
     */
    private setup;
    /**
     * Generates the dataset.
     * @param options The CLI options created by the user
     * @param dataset The dataset to generate
     * @returns void
     */
    private generateDataset;
    /**
     * Runs the SynthLite CLI. ⚡️
     * @returns Promise<void>
     */
    run(): Promise<void>;
}
