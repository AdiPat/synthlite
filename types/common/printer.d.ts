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
/**
 * Printer: Handles printing to the console.
 * @class Printer
 * @property {boolean} verbose - Whether to print verbose output.
 */
export declare class Printer {
    private verbose;
    private colourPrinter;
    /**
     * Sets the verbose property.
     * @param {boolean} verbose - If true, print verbose output.
     */
    constructor(verbose?: boolean);
    /**
     * Sets the verbose property.
     * @param {boolean} verbose - If true, print verbose output.
     */
    setVerbose(verbose: boolean): void;
    /**
     * Returns the verbose property.
     * @returns {boolean} - The verbose property.
     */
    getVerbose(): boolean;
    /**
     * Wrapper function for printing messages to the console with a prefix, color, and verbose check.
     * @param prefix The prefix to include in the message.
     * @param message The message to print.
     * @param colour The colour to print the message in.
     * @param verboseCheck Whether to check for verbose output.
     * @returns void
     */
    private px;
    /**
     * Prints an error message to the console.
     * @param {string} message - The message to print.
     */
    error(message: string): void;
    /**
     * Prints an info message to the console.
     * @param {string} message - The message to print.
     */
    info(message: string): void;
    /**
     * Prints a debug message to the console in teal.
     * @param {string} message - The message to print.
     */
    debug(message: string): void;
    /**
     * Prints a warning message to the console.
     * @param {string} message - The message to print.
     */
    warn(message: string): void;
    /**
     * Prints a success message to the console.
     * @param message The message to print.
     * @returns
     */
    success(message: string): void;
    /**
     * Checks if the message is empty.
     * @param message The message to print.
     * @returns true if the message is empty, false otherwise.
     */
    private isMessageEmpty;
    /**
     * Prints the SynthLite banner to the console.
     * @returns void
     */
    printBanner(): void;
}
export declare const printer: Printer;
