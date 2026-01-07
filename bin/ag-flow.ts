#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'path';
import { InitCommand } from '../src/commands';
import { WorkflowGenerator } from '../src/core/WorkflowGenerator';
import {
  NodeFileSystemAdapter,
  ConsoleLoggerAdapter,
  EjsTemplateAdapter,
  JsonLocalizationAdapter,
} from '../src/adapters';

const program = new Command();

// Wired Dependencies (Pure DI)
import { RulesComposer } from '../src/core/RulesComposer';
import { ContextGenerator } from '../src/core/ContextGenerator';

const logger = new ConsoleLoggerAdapter();
const fileSystem = new NodeFileSystemAdapter();
const templatesDir = path.join(__dirname, '../src/templates'); 
const localesDir = path.join(__dirname, '../src/locales');
const localizationService = new JsonLocalizationAdapter(localesDir);
const templateProvider = new EjsTemplateAdapter(templatesDir);
const rulesComposer = new RulesComposer(templateProvider, localizationService);
const contextGenerator = new ContextGenerator(templateProvider, localizationService);

const workflowGenerator = new WorkflowGenerator(
    fileSystem, 
    templateProvider, 
    logger, 
    localizationService,
    rulesComposer,
    contextGenerator
);
const initCommand = new InitCommand(workflowGenerator, logger, localizationService);

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
