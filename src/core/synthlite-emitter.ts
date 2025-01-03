/**
 *
 * @file synthlite-emitter.ts
 * @description 🚀 SynthliteEmitter is a singleton class that extends EventEmitter to handle custom events.
 * @date January 2024
 * @version 1.0.0
 * @license Affero General Public License v3.0
 * ✨ "Move fast, break things." — Meta Platforms, Inc.
 *
 */

import { EventEmitter } from "events";
import { GeneratedDataset } from "./generated-dataset";
import { CLIOptions } from "../models";

/**
 * SynthliteEmitter: Singleton class extending EventEmitter to handle custom events.
 * @class SynthliteEmitter
 */
export class SynthliteEmitter extends EventEmitter {
  private EVENT_WRITE_DATA = "synthlite:write_data";
  private static instance: SynthliteEmitter;

  /**
   * Private constructor to prevent direct instantiation.
   */
  private constructor() {
    super();
  }

  /**
   * Returns the singleton instance of SynthliteEmitter.
   * @returns {SynthliteEmitter} - The singleton instance.
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new SynthliteEmitter();
    }
    return this.instance;
  }

  /**
   * Emits a custom event with the given arguments.
   * @param {string} event - The event name.
   * @param {any[]} args - The arguments to pass to the event listeners.
   */
  public emitEvent(event: string, ...args: any[]) {
    this.emit(event, ...args);
  }

  /**
   * Adds a listener for the specified event.
   * @param {string} event - The event name.
   * @param {(...args: any[]) => void} listener - The listener function.
   */
  public addEventListener(event: string, listener: (...args: any[]) => void) {
    this.on(event, listener);
  }

  /**
   * Sets up a listener for the "synthlite:write_data" event and saves the generated data to a file.
   * @param options The CLI options created by the user
   * @description Adds a listener for the "synthlite:write_data" event and saves the generated data to a file.
   * @returns void
   */
  public addOnDataGeneratedSaveFileListener(options: CLIOptions) {
    const emitter = SynthliteEmitter.getInstance();
    emitter.on(this.EVENT_WRITE_DATA, async (data) => {
      const generatedDataset = new GeneratedDataset(data);
      await generatedDataset.saveToFile(options.output, options.format);
    });
  }
}
