/**
 *
 * @file printer.ts
 * @author Aditya Patange (AdiPat) <contact.adityapatange@gmail.com>
 * @description 🚀 Printer is a class that handles printing of messages to the terminal.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "We write to change." — Anonymous
 *
 */

import chalk from "chalk";

/**
 * Printer: Handles printing to the console.
 * @class Printer
 * @property {boolean} verbose - Whether to print verbose output.
 */
export class Printer {
  private verbose: boolean = false;
  private colourPrinter: {
    [colour: string]: chalk.Chalk;
  } = {
    pink: chalk.hex("#FF1493") as chalk.Chalk,
    orange: chalk.hex("#FFA500") as chalk.Chalk,
  };

  /**
   * Sets the verbose property.
   * @param {boolean} verbose - If true, print verbose output.
   */
  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  /**
   * Sets the verbose property.
   * @param {boolean} verbose - If true, print verbose output.
   */
  public setVerbose(verbose: boolean) {
    this.verbose = verbose;
  }

  /**
   * Returns the verbose property.
   * @returns {boolean} - The verbose property.
   */
  public getVerbose() {
    return this.verbose;
  }

  /**
   * Wrapper function for printing messages to the console with a prefix, color, and verbose check.
   * @param prefix The prefix to include in the message.
   * @param message The message to print.
   * @param colour The colour to print the message in.
   * @param verboseCheck Whether to check for verbose output.
   * @returns void
   */
  private px(
    prefix: string,
    message: string,
    colour: string,
    verboseCheck = false
  ): void {
    if (verboseCheck && !this.verbose) {
      return;
    }

    if (this.isMessageEmpty(message)) {
      console.log("\n");
      return;
    }

    const chalkPrinter: chalk.Chalk =
      (chalk as any)?.[colour] ?? (this.colourPrinter as any)[colour];
    console.log(chalkPrinter(`${prefix} ${message}`));
  }

  /**
   * Prints an error message to the console.
   * @param {string} message - The message to print.
   */
  public error(message: string) {
    return this.px("[!]", message, "redBright", false);
  }

  /**
   * Prints an info message to the console.
   * @param {string} message - The message to print.
   */
  public info(message: string) {
    return this.px("[*]", message, "cyanBright", false);
  }

  /**
   * Prints a debug message to the console in pink.
   * @param {string} message - The message to print.
   */
  public debug(message: string) {
    return this.px("→", message, "pink", true);
  }

  /**
   * Prints a warning message to the console.
   * @param {string} message - The message to print.
   */
  public warn(message: string) {
    return this.px("[!]", message, "yellowBright", false);
  }

  /**
   * Prints a success message to the console.
   * @param message The message to print.
   * @returns
   */
  public success(message: string) {
    return this.px("[✔]", message, "greenBright", false);
  }

  /**
   * Checks if the message is empty.
   * @param message The message to print.
   * @returns true if the message is empty, false otherwise.
   */
  private isMessageEmpty(message: string) {
    return (
      message === "" ||
      message === undefined ||
      message === null ||
      message.trim() === ""
    );
  }

  /**
   * Prints the SynthLite banner to the console.
   * @returns void
   */
  public printBanner(): void {
    const messages = [
      "SynthLite: A fast, lightweight and flexible synthetic data generation tool. 🚀",
      "Author: Aditya Patange (AdiPat) <contact.adityapatange@gmail.com>",
      "GitHub: https://www.github.com/AdiPat/synthlite",
      "synthlite is a product of AdiPat Labs! 🌞",
      "\n",
    ];

    messages.forEach((message) => {
      this.px("⚡️", message, "orange", false);
    });
  }
}

export const printer = new Printer();
