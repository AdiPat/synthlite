/**
 *
 * @file cli.ts
 * @author Aditya Patange (AdiPat) <contact.adityapatange@gmail.com>
 * @description 🚀 CLI is a class that handles command-line interface operations.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "Wise speaks, symbols breathe." — IA
 *
 */

import { Command, OptionValues } from "commander";
import { CLIOptions } from "../models";
import { Config, Validator } from "../common";

/**
 * CLI: Handles command-line interface operations.
 * @class CLI
 */
export class CLI {
  /**
   * Retrieves and validates command-line options.
   * @returns {Promise<CLIOptions>} - A promise that resolves to the CLI options.
   */
  static async getOptions(): Promise<CLIOptions> {
    const program = new Command();

    program
      .name("synthlite")
      .description(
        "SynthLite: A fast, lightweight and flexible synthetic data generation tool."
      )
      .version("1.0.0")
      .option("-v, --verbose", "Enable verbose mode")
      .option("-sc, --schema <schema>", "Path to the schema file")
      .option("-o, --output <output>", "Path to the output file")
      .option("-r, --rows <rows>", "Number of rows to generate")
      .option("-f, --format <format>", "Output format (json/csv)")
      .option("-env, --env <env>", "Path to the environment file");

    program.parse(process.argv);

    const options: OptionValues = program.opts();

    Validator.validateCLIOptions(options);
    const envPath = await Validator.validateEnvPath(options.env);
    Config.loadEnv(envPath);

    const verbose = options.verbose == undefined ? false : options.verbose;

    return {
      verbose,
      schema: options.schema,
      output: options.output,
      rows: options.rows,
      format: options.format || "json",
      envPath: options.env || ".env",
    };
  }
}
