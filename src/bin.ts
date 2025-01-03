#!/usr/bin/env node

/**
 * @file bin.ts
 * @description CLI entry point for THP-OCR
 */

import { main } from "./index";

// Run CLI if executed directly
if (require.main === module) {
  main();
}
