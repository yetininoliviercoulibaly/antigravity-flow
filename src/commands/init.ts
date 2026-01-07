import inquirer from 'inquirer';
import { WorkflowGenerator } from '../core/WorkflowGenerator';
import { WorkflowRole } from '../core/types';
import { ILogger } from '../core/interfaces';

export class InitCommand {
  constructor(
    private workflowGenerator: WorkflowGenerator,
    private logger: ILogger,
  ) {}

  async execute(): Promise<void> {
    this.logger.info('Welcome to Antigravity Workflow Init!');
    this.logger.info('This utility will help you generate agent workflows for your project.\n');

    const projectRoot = process.cwd(); // Assume CLI is run from project root

    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'buildCommand',
        message: 'What is your build command?',
        default: 'npm run build',
      },
      {
        type: 'input',
        name: 'testCommand',
        message: 'What is your test command?',
        default: 'npm run test',
      },
      {
        type: 'checkbox',
        name: 'roles',
        message: 'Which workflows do you want to generate?',
        choices: Object.values(WorkflowRole),
        default: [WorkflowRole.DEVELOPER, WorkflowRole.QA, WorkflowRole.LEAD_DEV],
      },
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Ready to generate files?',
        default: true,
      },
    ]);

    if (!answers.confirm) {
      this.logger.warn('Operation cancelled.');
      return;
    }

    try {
      await this.workflowGenerator.generateWorkflows(
        {
          rootPath: projectRoot,
          workflowDirectory: '.agent/workflows',
          buildCommand: answers.buildCommand,
          testCommand: answers.testCommand,
        },
        answers.roles,
      );
    } catch (error) {
      // Logger handles the error inside generator or here.
      // Already logged in generator for specific file failures.
      this.logger.error('Failed to complete initialization.');
    }
  }
}
