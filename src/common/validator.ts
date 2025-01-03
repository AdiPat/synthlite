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
import { OutputFormat } from "../models";
import { Constants } from "./constants";
import { printer } from "./printer";
import fs from "fs/promises";

/**
 * Validator: Validates CLI options and environment paths.
 * @class Validator
 */
export class Validator {
  /**
   * Validates the CLI options provided by the user.
   *
   * @param options - The CLI options to validate.
   */
  static async validateCLIOptions(options: any): Promise<void> {
    const schema = options.schema;

    if (!schema) {
      printer.error(
        "schema file is required! Use -sc option to specify the schema file."
      );
      process.exit(1);
    }

    const output = options.output;

    if (!output) {
      printer.error(
        "output file is required! Use -o option to specify the output file."
      );
      process.exit(1);
    }

    await Validator.createFileIfNotExists(output);
    await Validator.validateFilePath(output);

    let rows = options.rows;

    if (!rows) {
      printer.warn(
        `Number of rows not specified. Using default value: ${Constants.DEFAULT_ROWS}`
      );
      rows = Constants.DEFAULT_ROWS.toString();
    }

    if (isNaN(rows)) {
      printer.error("Number of rows must be a valid number.");
      process.exit(1);
    }

    let format: OutputFormat = options.format;

    if (!format) {
      printer.warn("Output format not specified. Using default value: json");
      format = "json";
    }
  }

  /**
   * Validates the environment file path.
   *
   * @param envPath - The path to the environment file.
   * @returns The final environment file path.
   */
  static async validateEnvPath(envPath: string): Promise<string> {
    let finalEnvPath = envPath;
    if (!envPath) {
      printer.warn("Environment file not specified. Using default value: .env");

      finalEnvPath = ".env";

      let error: string = "";

      try {
        await fs.access(envPath);
      } catch (err) {
        error =
          "Error loading environment file. Please specify the environment file using -env option or add a .env file to current folder.";
      }

      if (error) {
        printer.error(error);
        process.exit(1);
      }
    } else {
      await Validator.validateFilePath(envPath);
    }

    return finalEnvPath;
  }

  /**
   * Validates the file path.
   * @param filePath - The path to the file to validate.
   */
  private static async validateFilePath(filePath: string): Promise<void> {
    try {
      await fs.access(filePath);
    } catch (error) {
      printer.error(
        `File not found at path: ${filePath}. Please specify a valid file path.`
      );
      process.exit(1);
    }
  }

  /**
   * Creates a file if it does not exist.
   * @param filePath - The path to the file to create.
   */
  private static async createFileIfNotExists(filePath: string): Promise<void> {
    try {
      await fs.access(filePath);
    } catch (error) {
      await fs.writeFile(filePath, "");
    }
  }
}
