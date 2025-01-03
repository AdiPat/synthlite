import { SynthLiteCLI } from "./synthlite";

/**
 * Main function to run the SynthLite CLI.
 */
export async function main() {
  const cli = new SynthLiteCLI();
  await cli.run();
}
