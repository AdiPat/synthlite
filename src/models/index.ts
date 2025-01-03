export interface CLIOptions {
  verbose: boolean;
  schema: string;
  output: string;
  rows: string;
  format: OutputFormat;
  envPath: string;
}

export type OutputFormat = "json" | "csv";
