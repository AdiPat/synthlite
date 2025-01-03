import { SynthliteEmitter, SynthliteDataset } from "./core";
import { CLIOptions } from "./models";
import { printer, Config } from "./common";
import { CLI } from "./core/cli";

export class SynthLiteCLI {
  /**
   * Private constructor to prevent direct instantiation.
   */
  constructor() {}

  /**
   * Sets up the SynthLite CLI.
   * @returns void
   */
  private async setup(): Promise<CLIOptions> {
    printer.printBanner();
    const options = await CLI.getOptions();
    printer.setVerbose(options.verbose);
    Config.assertAIConfig();
    SynthliteEmitter.getInstance().addOnDataGeneratedSaveFileListener(options);
    return options;
  }

  /**
   * Generates the dataset.
   * @param options The CLI options created by the user
   * @param dataset The dataset to generate
   * @returns void
   */
  private async generateDataset(
    options: CLIOptions,
    dataset: SynthliteDataset
  ) {
    printer.success(`Generating dataset of rows: ${options.rows}.`);
    await dataset.generate(parseInt(options.rows));
    printer.success(`Dataset saved to: ${options.output}!`);
    printer.success("SynthLite run completed successfully! ⚡️");
  }

  /**
   * Runs the SynthLite CLI. ⚡️
   * @returns Promise<void>
   */
  public async run(): Promise<void> {
    try {
      const options = await this.setup();
      printer.info("Parsing schema and constructing dataset.");
      const dataset = await SynthliteDataset.fromSchemaFile(options.schema);
      const generateStartTime = performance.now();
      await this.generateDataset(options, dataset);
      const totalTimeInSeconds = (generateStartTime - performance.now()) / 1000;
      printer.success(
        `Dataset for schema '${options.schema}' generated in ${totalTimeInSeconds} seconds.`
      );
    } catch (error: any) {
      printer.error(`Unexpected Failure: ${error.message}`);
      process.exit(1);
    }
  }
}
