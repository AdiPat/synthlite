/**
 *
 * @file synthlite-dataset.ts
 * @description Handles the generation of synthetic datasets based on a given JSON schema.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "We write to change." — Anonymous
 *
 */
import { GeneratedDataset } from "./generated-dataset";
/**
 * SynthliteDataset: Handles the generation of synthetic datasets based on a given JSON schema.
 */
export declare class SynthliteDataset {
    private schema;
    private emitter;
    /**
     * Constructs a SynthliteDataset instance.
     * @param jsonSchema - The JSON schema to use for generating synthetic data.
     */
    constructor(jsonSchema: any);
    /**
     * Creates a SynthliteDataset instance from a schema file.
     * @param schemaPath - The path to the schema file.
     * @returns A new SynthliteDataset instance.
     */
    static fromSchemaFile(schemaPath: string): Promise<SynthliteDataset>;
    /**
     * Generates synthetic data based on the provided schema.
     * @param count - The number of synthetic data rows to generate.
     * @returns A promise that resolves to a GeneratedDataset instance.
     */
    generate(count: number): Promise<GeneratedDataset>;
    /**
     * Mutates duplicate rows to make them unique.
     * @param duplicates - The array of duplicate rows.
     * @param data - The existing data array.
     * @returns A promise that resolves to an array of mutated duplicates.
     */
    private mutateDuplicates;
    /**
     * Mutates specific keys of a duplicate row to make it unique.
     * @param duplicate - The duplicate row to mutate.
     * @param data - The existing data array.
     * @returns A promise that resolves to a mutated duplicate row.
     */
    private mutateDuplicateByKeys;
    /**
     * Checks if a row is a duplicate in the existing data.
     * @param row - The row to check for duplicates.
     * @param data - The existing data array.
     * @returns True if the row is a duplicate, false otherwise.
     */
    private hasDuplicate;
    /**
     * Retrieves the duplicate row from the existing data.
     * @param row - The row to find the duplicate for.
     * @param data - The existing data array.
     * @returns The duplicate row if found, undefined otherwise.
     */
    private getDuplicateRow;
}
