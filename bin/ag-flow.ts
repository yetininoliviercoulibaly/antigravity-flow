#!/usr/bin/env node
import { Command } from 'commander';
import * as path from 'path';
import { InitCommand, GuideCommand, TemplatesCommand } from '../src/commands';
import { WorkflowGenerator, RulesComposer, ContextGenerator, PipelineGenerator, ConfigService, StackDetector, GitignoreGenerator, DockerfileGenerator } from '../src/core';
import {
  NodeFileSystemAdapter,
  ConsoleLoggerAdapter,
  EjsTemplateAdapter,
  JsonLocalizationAdapter,
} from '../src/adapters';

const program = new Command();

// Wired Dependencies (Pure DI)

const logger = new ConsoleLoggerAdapter();
const fileSystem = new NodeFileSystemAdapter();
const templatesDir = path.join(__dirname, '../src/templates');
const localesDir = path.join(__dirname, '../src/locales');

const localizationService = new JsonLocalizationAdapter(localesDir);
// Allow override from .agent/templates
const customTemplatesDir = path.join(process.cwd(), '.agent/templates');
const templateProvider = new EjsTemplateAdapter(templatesDir, customTemplatesDir);

const rulesComposer = new RulesComposer(templateProvider, localizationService);
const contextGenerator = new ContextGenerator(templateProvider, localizationService);

const pipelineGenerator = new PipelineGenerator(fileSystem, templateProvider, logger);
const configService = new ConfigService(fileSystem, logger);
const stackDetector = new StackDetector(fileSystem, logger);
const gitignoreGenerator = new GitignoreGenerator(fileSystem, logger);
const dockerfileGenerator = new DockerfileGenerator(fileSystem, templateProvider, logger);

const workflowGenerator = new WorkflowGenerator(
    fileSystem,
    templateProvider,
    logger,
    localizationService,
    rulesComposer,
    contextGenerator
);

const initCommand = new InitCommand(
    workflowGenerator,
    logger,
    localizationService,
    pipelineGenerator,
    configService,
    stackDetector,
    gitignoreGenerator,
    dockerfileGenerator,
    fileSystem
);

const guideCommand = new GuideCommand(
    logger,
    localizationService,
    templateProvider,
    configService
);

const templatesCommand = new TemplatesCommand(
    logger,
    localizationService,
    templatesDir,
    customTemplatesDir
);

program
  .name('antigravity-flow')
  .description('Antigravity Agent Workflow CLI')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize agent workflows in the current directory')
  .addHelpText('after', `
    
    Examples:
      $ ag-flow init
      
    Description:
      Starts an interactive wizard to configure the project.
      It will ask for:
      - Project Description
      - Tech Stack (Frontend, Backend, Contracts)
      - Rigor Mode (Strict vs Prototype)
      - Monorepo Configuration
      
      It saves configuration to .agent/antigravity.json
      It saves configuration to .agent/antigravity.json
  `)
  .option('-c, --config <path>', 'Path to configuration file')
  .action(async (options) => {
    await initCommand.execute(options);
  });

program
  .command('guide')
  .description('Show comprehensive usage guide')
  .argument('[lang]', 'Language (en/fr)', 'en')
  .addHelpText('after', `

    Examples:
      $ ag-flow guide
      $ ag-flow guide fr
      
    Description:
      Displays the full user manual in the terminal.
      If .agent/antigravity.json exists, it tries to use the configured language.
      Otherwise, it defaults to English (or the provided argument).
  `)
  .action(async (lang) => {
    await guideCommand.execute(lang);
    await guideCommand.execute(lang);
  });

program
  .command('templates')
  .description('Manage and customize templates')
  .argument('[action]', 'Action to perform (list, update)', 'list')
  .argument('[template]', 'Template name (for update action)')
  .addHelpText('after', `
    
    Examples:
      $ ag-flow templates list
      $ ag-flow templates update docker/django.Dockerfile.ejs
      
    Description:
      - list: Shows all available templates and indicates if they are customized.
      - update: Opens the template in your default editor and saves a custom copy to .agent/templates/.
  `)
  .action(async (action, template) => {
    await templatesCommand.execute(action, template);
  });

program.parse(process.argv);
