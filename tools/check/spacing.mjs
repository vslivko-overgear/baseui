#!/usr/bin/env node
// Shared layout checks. Product-specific policies have their own commands.
import { TEMPLATES } from '../../src/templates/registry.js';
import { runSpacingCheck } from './run-spacing.mjs';

const paths = process.argv.slice(3);
process.exitCode = await runSpacingCheck({
  base: process.argv[2] || 'http://localhost:8000',
  paths: paths.length ? paths : TEMPLATES.map((t) => `templates/frame/?t=${t.id}`),
});
