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
import fs from "fs/promises";

/**
 * GeneratedDataset: Handles saving generated data to files.
 * @class GeneratedDataset
 */
export class GeneratedDataset {
  private data: any[];

  /**
   * Constructor for GeneratedDataset.
   * @param {any[]} data - The data to be saved.
   */
  constructor(data: any[]) {
    this.data = data;
  }

  /**
   * Saves the data to a file in the specified format.
   * @param {string} outputPath - The path to save the file.
   * @param {OutputFormat} format - The format to save the file in.
   * @returns {Promise<void>} - A promise that resolves when the file is saved.
   */
  async saveToFile(outputPath: string, format: OutputFormat) {
    if (format === "json") {
      await fs.writeFile(outputPath, JSON.stringify(this.data, null, 2));
    } else if (format === "csv") {
      throw new Error("CSV format not supported yet!");
    }
  }
}
