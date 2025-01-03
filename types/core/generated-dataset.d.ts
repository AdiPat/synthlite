/**
 *
 * @file generated-dataset.ts
 * @description 🚀 GeneratedDataset is a class that handles saving generated data to files.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "Data is the new oil." — Clive Humby
 *
 */
import { OutputFormat } from "../models";
/**
 * GeneratedDataset: Handles saving generated data to files.
 * @class GeneratedDataset
 */
export declare class GeneratedDataset {
    private data;
    /**
     * Constructor for GeneratedDataset.
     * @param {any[]} data - The data to be saved.
     */
    constructor(data: any[]);
    /**
     * Saves the data to a file in the specified format.
     * @param {string} outputPath - The path to save the file.
     * @param {OutputFormat} format - The format to save the file in.
     * @returns {Promise<void>} - A promise that resolves when the file is saved.
     */
    saveToFile(outputPath: string, format: OutputFormat): Promise<void>;
}
