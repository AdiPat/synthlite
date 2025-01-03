import chalk from "chalk";
import { Command } from "commander";
import { jsonSchemaToZod } from "json-schema-to-zod";
import { z } from "zod";
import fs from "fs/promises";
import dotenv from "dotenv";
import { createOpenAI as createGroq } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { generateObject, LanguageModel } from "ai";
import { EventEmitter } from "events";
import { v4 as uuidv } from "uuid";
import { Printer } from "./core";

const chalkPink = chalk.hex("#FF1493");

/** Constants */

const DEFAULT_ROWS = 10;
const CONSECUTIVE_NOOP_THRESHOLD = 3;
const DEFAULT_BATCH_SIZE = 10;
const DEFAULT_AI_MODEL = "llama-3.3-70b-versatile";
const DEFAULT_ANTHROPIC_AI_MODEL = "claude-3-5-haiku-latest";
const DEFAULT_AI_PROVIDER = "anthropic";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

/** Types */

interface CLIOptions {
  verbose: boolean;
  schema: string;
  output: string;
  rows: string;
  format: OutputFormat;
  envPath: string;
}

type OutputFormat = "json" | "csv";

/** Classes & Methods */

const printer = new Printer();

class SynthliteEmitter extends EventEmitter {
  private static instance: SynthliteEmitter;

  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SynthliteEmitter();
    }
    return this.instance;
  }
}

export class AI {
  private static instance: AI;
  private model: LanguageModel;

  private constructor(provider = DEFAULT_AI_PROVIDER) {
    if (provider === "anthropic") {
      this.model = anthropic(DEFAULT_ANTHROPIC_AI_MODEL);
    } else if (provider === "meta") {
      const groq = createGroq({
        baseURL: GROQ_BASE_URL,
        apiKey: process.env.GROQ_API_KEY,
      });
      this.model = groq(DEFAULT_AI_MODEL);
    } else {
      throw new Error("Invalid provider specified!");
    }
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AI();
    }

    return this.instance;
  }

  getModel() {
    return this.model;
  }
}

export class GeneratedDataset {
  private data: any[];

  constructor(data: any[]) {
    this.data = data;
  }

  async saveToFile(outputPath: string, format: OutputFormat) {
    if (format === "json") {
      await fs.writeFile(outputPath, JSON.stringify(this.data, null, 2));
    } else if (format === "csv") {
      throw new Error("CSV format not supported yet!");
    }
  }
}

export class SynthliteDataset {
  private jsonSchema: string;
  private schema: z.ZodObject<any>;
  private emitter: SynthliteEmitter;

  constructor(jsonSchema: any) {
    this.jsonSchema = jsonSchema;
    const schemaJS = jsonSchemaToZod(jsonSchema);
    this.schema = eval(`const z = require('zod');\n${schemaJS}`);
    this.emitter = SynthliteEmitter.getInstance();
  }

  static async fromSchemaFile(schemaPath: string) {
    const schema = await fs.readFile(schemaPath, "utf-8");
    return new SynthliteDataset(JSON.parse(schema));
  }

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
      data = data.map((row) => ({ ...row, id: row?.id || uuidv() }));

      printer.debug(
        `Duplicate count table: ${JSON.stringify(duplicateCountTable, null, 2)}`
      );

      const batchStartTime = performance.now();
      dataLengthUpdates.push(data.length);
      printer.info(
        `[batchCount: ${batchCount}] Generating batch of ${DEFAULT_BATCH_SIZE} synthetic data.`
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
          DEFAULT_BATCH_SIZE > count ? count : DEFAULT_BATCH_SIZE
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

      if (dataLengthUpdates.length > CONSECUTIVE_NOOP_THRESHOLD) {
        const lastThree = dataLengthUpdates.slice(-CONSECUTIVE_NOOP_THRESHOLD);
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

  private getDuplicateRow(row: any, data: any[]) {
    return data.find((x) => {
      const { id: _id, ...rest } = x;
      return JSON.stringify(rest) === JSON.stringify(row);
    });
  }
}

function assertAIConfig() {
  if (process.env.ANTHROPIC_API_KEY) {
    printer.debug("ANTHROPIC_API_KEY found in environment.");
    return;
  } else {
    printer.debug(
      "No ANTHROPIC_API_KEY found in environment. Falling back to GROQ API."
    );
  }

  if (process.env.GROQ_API_KEY) {
    printer.debug("GROQ_API_KEY found in environment.");
    return;
  } else {
    printer.debug("No GROQ_API_KEY found in environment.");
  }

  printer.error(
    "Please add either GROQ_API_KEY or ANTHROPIC_API_KEY to your environment file."
  );
  process.exit(1);
}

function getCLIOptions(): CLIOptions {
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

  const options = program.opts();

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

  let rows = options.rows;

  if (!rows) {
    printer.warn(
      `Number of rows not specified. Using default value: ${DEFAULT_ROWS}`
    );
    rows = DEFAULT_ROWS.toString();
  }

  let format: OutputFormat = options.format;

  if (!format) {
    printer.warn("Output format not specified. Using default value: json");
    format = "json";
  }

  const envPath = options.env;

  if (!envPath) {
    printer.warn("Environment file not specified. Using default value: .env");
    const { error } = dotenv.config({ path: ".env" });

    if (error) {
      printer.error(
        "Error loading environment file. Please specify the environment file using -env option or add a .env file to current folder."
      );
      process.exit(1);
    }
  } else {
    const { error } = dotenv.config({ path: envPath });

    if (error) {
      printer.error(
        "Error loading environment file. Please specify the correct environment file using -env option."
      );
      process.exit(1);
    }
  }

  const verbose = options.verbose == undefined ? false : options.verbose;

  return {
    verbose,
    schema,
    output,
    rows,
    format,
    envPath: options.env || ".env",
  };
}

function printBanner() {
  const messages = [
    "SynthLite: A fast, lightweight and flexible synthetic data generation tool. 🚀",
    "Author: Aditya Patange (AdiPat) <contact.adityapatange@gmail.com>",
    "GitHub: https://www.github.com/AdiPat/synthlite",
    "synthlite is a product of AdiPat Labs! 🌞",
    "\n",
  ];

  messages.forEach((message) => {
    printer.info(message);
  });
}

function setupOutputWriterEventHandler(options: CLIOptions) {
  const emitter = SynthliteEmitter.getInstance();
  emitter.on("synthlite:write_data", async (data) => {
    const generatedDataset = new GeneratedDataset(data);
    await generatedDataset.saveToFile(options.output, options.format);
  });
}

/**
 *
 * SynthLite runner ⚡️
 *
 * */
export async function synthlite() {
  try {
    printBanner();
    const options = getCLIOptions();
    printer.setVerbose(options.verbose);
    assertAIConfig();
    setupOutputWriterEventHandler(options);

    printer.info("Parsing schema and constructing dataset.");
    const dataset = await SynthliteDataset.fromSchemaFile(options.schema);

    printer.info(`Generating dataset of rows: ${options.rows}.`);
    const generateStartTime = performance.now();
    await dataset.generate(parseInt(options.rows));
    const generateEndTime = performance.now();
    printer.info(
      `Dataset generated in ${
        (generateEndTime - generateStartTime) / 1000
      } seconds.`
    );
    printer.info(`Dataset saved to: ${options.output}!`);
    printer.info("SynthLite run completed successfully! ⚡️");
  } catch (error: any) {
    printer.error(`Unexpected Failure: ${error.message}`);
    process.exit(1);
  }
}
