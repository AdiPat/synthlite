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

import { generateObject } from "ai";
import jsonSchemaToZod from "json-schema-to-zod";
import { z } from "zod";
import { AI } from "../common/ai";
import { Constants } from "../common/constants";
import { GeneratedDataset } from "./generated-dataset";
import { printer } from "../common/printer";
import { SynthliteEmitter } from "./synthlite-emitter";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";

/**
 * SynthliteDataset: Handles the generation of synthetic datasets based on a given JSON schema.
 */
export class SynthliteDataset {
  private schema: z.ZodObject<any>;
  private emitter: SynthliteEmitter;

  /**
   * Constructs a SynthliteDataset instance.
   * @param jsonSchema - The JSON schema to use for generating synthetic data.
   */
  constructor(jsonSchema: any) {
    const schemaJS = jsonSchemaToZod(jsonSchema);
    this.schema = eval(`const z = require('zod');\n${schemaJS}`);
    this.emitter = SynthliteEmitter.getInstance();
  }

  /**
   * Creates a SynthliteDataset instance from a schema file.
   * @param schemaPath - The path to the schema file.
   * @returns A new SynthliteDataset instance.
   */
  static async fromSchemaFile(schemaPath: string) {
    const schema = await fs.readFile(schemaPath, "utf-8");
    return new SynthliteDataset(JSON.parse(schema));
  }

  /**
   * Generates synthetic data based on the provided schema.
   * @param count - The number of synthetic data rows to generate.
   * @returns A promise that resolves to a GeneratedDataset instance.
   */
  public async generate(count: number): Promise<GeneratedDataset> {
    let data: any[] = [];
    let batchCount = 0;
    let dataLengthUpdates = [];
    const duplicateCountTable: {
      id: string;
      count: number;
    }[] = [];

    while (data.length < count) {
      data = data.filter((x) => Boolean(x));
      data = data.map((row) => ({ ...row, id: row?.id || uuidv4() }));

      printer.debug(
        `Duplicate count table: ${JSON.stringify(duplicateCountTable, null, 2)}`
      );

      const batchStartTime = performance.now();
      dataLengthUpdates.push(data.length);
      printer.info(
        `[batchCount: ${batchCount}] Generating batch of ${Constants.DEFAULT_BATCH_SIZE} synthetic data.`
      );
      printer.info(
        `[batchCount: ${batchCount}] Total unique rows generated so far: ${data.length} / ${count}.`
      );

      let avoidDuplicatesPromptInput = "";
      if (duplicateCountTable.length > 0) {
        avoidDuplicatesPromptInput = duplicateCountTable
          .sort((a, b) => {
            return a.count - b.count;
          })
          .map((x) => {
            return data.find((d) => d?.id === x?.id);
          })
          .map((x) => JSON.stringify(x))
          .join("\n");
      } else {
        avoidDuplicatesPromptInput = data
          .sort(() => Math.random() - 0.5)
          .slice(0, data.length < 10 ? data.length : 10)
          .map((x) => {
            const { id: _id, ...rest } = x;
            return JSON.stringify(rest);
          })
          .join("\n");
      }

      const rows = await generateObject({
        model: AI.getInstance().getModel(),
        system: `You are synthlite, an advanced syntehic data generator AI agent. Given a schema, generate 10 rows of synthetic data. Try to be unique and creative in your outputs.
            Make sure you return all unique data points in the batch and no items are duplicated. 
            `,
        prompt: `Generate ${
          Constants.DEFAULT_BATCH_SIZE > count
            ? count
            : Constants.DEFAULT_BATCH_SIZE
        } synthetic data based on the schema.
  
          Avoid repeating these entries: """\n${avoidDuplicatesPromptInput}\n"""
  
          If you are finding it difficult to generate unique data points, try to make minor adjustments to the existing data points to make them unique.
  
          - For instance, for string fields, change some characters or add adjectives.
          - For numbers, tweak the value up or down accordingly.
          - For booleans, consider flipping them.
          - For arrays, add or remove elements.
          - For objects, change the values of the keys.
          - Scramble, change, combine and mutate as many keys as possible, just make sure the data is meaningful.
          - For names and addresses, consider changing the first or last name, or the street name or number.
          - For dates, consider changing the year, month or day.
          - For emails, consider changing the domain or the username.
          - For phone numbers, consider changing the area code or the country code.
          - For URLs, consider changing the domain or the path.
          - For any other field, consider changing the value slightly.
          - Make sure the data is coherent and makes sense.
          - For numeric values like age, consider changing the value slightly.
          - For categorical values consider changing the category.
          - For text fields, consider changing the text slightly, be creative if needed.
          - For numeric values like width, height, sensor data, temperature, etc consider a delta of +/- 10% as long as its within range.
  
          `,
        schema: z.object({
          rows: z.array(this.schema),
        }),
      })
        .then((res) => res.object.rows)
        .catch((err) => {
          printer.error(`Error generating synthetic data: ${err.message}`);
          return [];
        });

      const duplicates: any[] = [];
      const uniques: any[] = [];

      rows.forEach((row) => {
        if (this.hasDuplicate(row, data)) {
          const duplicateRow = this.getDuplicateRow(row, data);
          duplicateCountTable.push({
            id: duplicateRow.id,
            count: duplicateCountTable.find((x) => x.id === duplicateRow.id)
              ? (duplicateCountTable.find((x) => x.id === duplicateRow.id)
                  ?.count ?? 0) + 1
              : 1,
          });
          duplicates.push(row);
        } else {
          uniques.push(row);
        }
      });

      printer.info(
        `Found ${duplicates.length} duplicates and ${uniques.length} unique rows in the batch.`
      );

      data.push(...uniques);

      const mutatedDuplicates = await this.mutateDuplicates(duplicates, data);

      if (mutatedDuplicates.length > 0) {
        printer.info(
          `Found ${mutatedDuplicates.length} mutated duplicates in the batch.`
        );
        data.push(...mutatedDuplicates);
      }

      batchCount++;

      // Emit event after processing each batch
      this.emitter.emit("synthlite:write_data", data);

      const batchEndTime = performance.now();

      printer.info(
        `[batchCount: ${batchCount}] Batch generated in ${
          (batchEndTime - batchStartTime) / 1000
        } seconds.`
      );

      if (dataLengthUpdates.length > Constants.CONSECUTIVE_NOOP_THRESHOLD) {
        const lastThree = dataLengthUpdates.slice(
          -Constants.CONSECUTIVE_NOOP_THRESHOLD
        );
        const diff = lastThree[2] - lastThree[0];
        if (diff === 0) {
          printer.error(
            `No new data points generated in last 3 batches. Exiting to avoid infinite loop.`
          );
          break;
        }
      }
    }

    return new GeneratedDataset(data);
  }

  /**
   * Mutates duplicate rows to make them unique.
   * @param duplicates - The array of duplicate rows.
   * @param data - The existing data array.
   * @returns A promise that resolves to an array of mutated duplicates.
   */
  private async mutateDuplicates(
    duplicates: any[],
    data: any[]
  ): Promise<any[]> {
    const mutatedDuplicates: any[] = [];
    for (const duplicate of duplicates) {
      let mutatedDuplicate = await this.mutateDuplicateByKeys(duplicate, data);
      printer.debug(`Mutated duplicate: ${JSON.stringify(mutatedDuplicate)}`);
      mutatedDuplicates.push(mutatedDuplicate);
    }

    return mutatedDuplicates;
  }

  /**
   * Mutates specific keys of a duplicate row to make it unique.
   * @param duplicate - The duplicate row to mutate.
   * @param data - The existing data array.
   * @returns A promise that resolves to a mutated duplicate row.
   */
  private async mutateDuplicateByKeys(
    duplicate: any,
    data: any[]
  ): Promise<any> {
    const keys = Object.keys(duplicate);

    const randomKeys = keys
      .sort(() => Math.random() - 0.5)
      .slice(0, keys.length >= 3 ? 3 : keys.length);

    const mutatedDuplicate = await generateObject({
      model: AI.getInstance().getModel(),
      system: `You are synthlite, an advanced synthetic data generator AI agent. 
              You will be given a data point in the sample that already exists i.e. was generated previously. 
              Specifically make minor adjustments to ${randomKeys.join()} so that the resulting data point is unique.
              The resulting data point should be different from the provided data point`,
      prompt: `
                  Mutate this duplicate as per instructions and provide the mutated unique value.
                  If you are finding it difficult to generate unique data points, try to make minor adjustments to the existing data points to make them unique.
  
                  - For instance, for string fields, change some characters or add adjectives.
                  - For numbers, tweak the value up or down accordingly.
                  - For booleans, consider flipping them.
                  - For arrays, add or remove elements.
                  - For objects, change the values of the keys.
                  - Scramble, change, combine and mutate as many keys as possible, just make sure the data is meaningful.
                  - For names and addresses, consider changing the first or last name, or the street name or number.
                  - For dates, consider changing the year, month or day.
                  - For emails, consider changing the domain or the username.
                  - For phone numbers, consider changing the area code or the country code.
                  - For URLs, consider changing the domain or the path.
                  - For any other field, consider changing the value slightly.
                  - Make sure the data is coherent and makes sense.
                  - For numeric values like age, consider changing the value slightly.
                  - For categorical values consider changing the category.
                  - For text fields, consider changing the text slightly, be creative if needed.
                  - For numeric values like width, height, sensor data, temperature, etc consider a delta of +/- 10% as long as its within range.
  
                  Duplicate to Mutate: ${JSON.stringify(duplicate)}
              `,
      schema: this.schema,
    })
      .then((res) => res.object)
      .catch((err) => {
        printer.error(`Error mutating duplicate: ${err.message}`);
        return null;
      });

    if (mutatedDuplicate && this.hasDuplicate(mutatedDuplicate, data)) {
      printer.error(
        `[!] Mutated duplicate is still a duplicate: ${JSON.stringify(
          mutatedDuplicate
        )}`
      );
      printer.warn(`→ Skipping the duplicate for now.`);
      return null;
    }

    return mutatedDuplicate;
  }

  /**
   * Checks if a row is a duplicate in the existing data.
   * @param row - The row to check for duplicates.
   * @param data - The existing data array.
   * @returns True if the row is a duplicate, false otherwise.
   */
  private hasDuplicate(row: any, data: any[]) {
    const dataWithoutId = data.map((x) => {
      const { id, ...rest } = x;
      return rest;
    });
    const duplicate = dataWithoutId.find(
      (x) => JSON.stringify(x) === JSON.stringify(row)
    );
    return Boolean(duplicate);
  }

  /**
   * Retrieves the duplicate row from the existing data.
   * @param row - The row to find the duplicate for.
   * @param data - The existing data array.
   * @returns The duplicate row if found, undefined otherwise.
   */
  private getDuplicateRow(row: any, data: any[]) {
    return data.find((x) => {
      const { id: _id, ...rest } = x;
      return JSON.stringify(rest) === JSON.stringify(row);
    });
  }
}
