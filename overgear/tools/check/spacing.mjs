#!/usr/bin/env node
// Explicit opt-in to shared layout checks plus the Overgear listing rule OG2.
import { runSpacingCheck } from '../../../tools/check/run-spacing.mjs';

const paths = process.argv.slice(3);
process.exitCode = await runSpacingCheck({
  base: process.argv[2] || 'http://localhost:8000',
  paths: paths.length ? paths : ['overgear/example/', 'overgear/#/theme', 'overgear/#/typography', 'overgear/#/colors'],
  modulePath: 'overgear/tools/audits/spacing-balance.js',
});
