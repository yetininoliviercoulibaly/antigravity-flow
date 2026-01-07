#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'path';
import { InitCommand } from '../src/commands';
import { WorkflowGenerator } from '../src/core/WorkflowGenerator';
import {
  NodeFileSystemAdapter,
  ConsoleLoggerAdapter,
  EjsTemplateAdapter,
} from '../src/adapters';

const program = new Command();

// Wired Dependencies (Pure DI)
const logger = new ConsoleLoggerAdapter();
const fileSystem = new NodeFileSystemAdapter();
const templatesDir = path.join(__dirname, '../src/templates'); // Pointing to src for dev/compiled structure check needed
const templateProvider = new EjsTemplateAdapter(templatesDir);
const workflowGenerator = new WorkflowGenerator(fileSystem, templateProvider, logger);
const initCommand = new InitCommand(workflowGenerator, logger);

program
  .name('antigravity-flow')
  .description('Antigravity Agent Workflow CLI')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize agent workflows in the current directory')
  .action(async () => {
    await initCommand.execute();
  });

program.parse(process.argv);
