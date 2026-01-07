import {
  WorkflowRole,
  WORKFLOW_FILES,
  FrontendFramework,
  BackendFramework,
  SmartContractFramework,
  MobileFramework,
  ArchitectureType,
  RigorMode,
  VersionControlPlatform,
  BranchingStrategy,
  CommitConvention,
  PackageManager,
  DatabaseType,
  OrmType,
  TestingFramework,
  CoverageTarget,
  DeploymentPlatform,
  Containerization,
  SecurityScanningTool,
  MonorepoTool,
  DocumentationStyle,
  LintingTool,
  IdeIntegration,
} from '../../src/core/types';

describe('Types', () => {
  describe('WorkflowRole', () => {
    it('should have all original roles', () => {
      expect(WorkflowRole.DEVELOPER).toBe('dev');
      expect(WorkflowRole.QA).toBe('qa');
      expect(WorkflowRole.LEAD_DEV).toBe('lead');
      expect(WorkflowRole.ARCHITECT).toBe('architect');
      expect(WorkflowRole.PRODUCT_OWNER).toBe('po');
      expect(WorkflowRole.BUSINESS_ANALYST).toBe('ba');
      expect(WorkflowRole.RULES).toBe('rules');
    });

    it('should have new roles', () => {
      expect(WorkflowRole.DEVOPS).toBe('devops');
      expect(WorkflowRole.SECURITY).toBe('security');
      expect(WorkflowRole.TECH_WRITER).toBe('techwriter');
      expect(WorkflowRole.DATA_ENGINEER).toBe('data');
    });

    it('should have 11 total roles', () => {
      expect(Object.keys(WorkflowRole).length).toBe(11);
    });
  });

  describe('WORKFLOW_FILES', () => {
    it('should map all roles to files', () => {
      expect(WORKFLOW_FILES[WorkflowRole.DEVELOPER]).toBe('dev.md');
      expect(WORKFLOW_FILES[WorkflowRole.DEVOPS]).toBe('devops.md');
      expect(WORKFLOW_FILES[WorkflowRole.SECURITY]).toBe('security.md');
      expect(WORKFLOW_FILES[WorkflowRole.TECH_WRITER]).toBe('techwriter.md');
      expect(WORKFLOW_FILES[WorkflowRole.DATA_ENGINEER]).toBe('data.md');
    });
  });

  describe('FrontendFramework', () => {
    it('should include new frameworks', () => {
      expect(FrontendFramework.NEXTJS).toBe('nextjs');
      expect(FrontendFramework.NUXTJS).toBe('nuxtjs');
      expect(FrontendFramework.SVELTEKIT).toBe('sveltekit');
      expect(FrontendFramework.REMIX).toBe('remix');
      expect(FrontendFramework.ASTRO).toBe('astro');
      expect(FrontendFramework.REACT_NATIVE).toBe('react-native');
    });

    it('should have correct count of frameworks', () => {
      expect(Object.keys(FrontendFramework).length).toBe(12);
    });
  });

  describe('BackendFramework', () => {
    it('should include new frameworks', () => {
      expect(BackendFramework.FASTAPI).toBe('fastapi');
      expect(BackendFramework.DJANGO).toBe('django');
      expect(BackendFramework.FLASK).toBe('flask');
      expect(BackendFramework.SPRING_BOOT).toBe('spring-boot');
      expect(BackendFramework.GO).toBe('go');
      expect(BackendFramework.GIN).toBe('gin');
      expect(BackendFramework.ELIXIR).toBe('elixir');
      expect(BackendFramework.EXPRESS).toBe('express');
      expect(BackendFramework.FASTIFY).toBe('fastify');
    });

    it('should have correct count of frameworks', () => {
      expect(Object.keys(BackendFramework).length).toBe(15);
    });
  });

  describe('SmartContractFramework', () => {
    it('should include new frameworks', () => {
      expect(SmartContractFramework.SOLIDITY).toBe('solidity');
      expect(SmartContractFramework.MOVE).toBe('move');
      expect(SmartContractFramework.ANCHOR).toBe('anchor');
      expect(SmartContractFramework.INK).toBe('ink');
    });
  });

  describe('MobileFramework', () => {
    it('should include mobile frameworks', () => {
      expect(MobileFramework.FLUTTER).toBe('flutter');
      expect(MobileFramework.REACT_NATIVE).toBe('react-native');
      expect(MobileFramework.SWIFT).toBe('swift');
      expect(MobileFramework.KOTLIN).toBe('kotlin');
      expect(MobileFramework.NONE).toBe('none');
    });
  });

  describe('ArchitectureType', () => {
    it('should include new architectures', () => {
      expect(ArchitectureType.CLEAN).toBe('clean');
      expect(ArchitectureType.VERTICAL_SLICE).toBe('vertical-slice');
      expect(ArchitectureType.LAYERED).toBe('layered');
      expect(ArchitectureType.MICROSERVICES).toBe('microservices');
      expect(ArchitectureType.NONE).toBe('none');
    });
  });

  describe('RigorMode', () => {
    it('should include standard mode', () => {
      expect(RigorMode.STANDARD).toBe('standard');
    });

    it('should have all 4 modes', () => {
      expect(Object.keys(RigorMode).length).toBe(4);
    });
  });

  describe('VersionControlPlatform', () => {
    it('should include all platforms', () => {
      expect(VersionControlPlatform.GITHUB).toBe('github');
      expect(VersionControlPlatform.GITLAB).toBe('gitlab');
      expect(VersionControlPlatform.AZURE_DEVOPS).toBe('azure-devops');
      expect(VersionControlPlatform.BITBUCKET).toBe('bitbucket');
      expect(VersionControlPlatform.NONE).toBe('none');
    });
  });

  describe('BranchingStrategy', () => {
    it('should include all strategies', () => {
      expect(BranchingStrategy.GITFLOW).toBe('gitflow');
      expect(BranchingStrategy.GITHUB_FLOW).toBe('github-flow');
      expect(BranchingStrategy.TRUNK_BASED).toBe('trunk-based');
      expect(BranchingStrategy.GITLAB_FLOW).toBe('gitlab-flow');
      expect(BranchingStrategy.CUSTOM).toBe('custom');
    });
  });

  describe('CommitConvention', () => {
    it('should include all conventions', () => {
      expect(CommitConvention.CONVENTIONAL).toBe('conventional');
      expect(CommitConvention.GITMOJI).toBe('gitmoji');
      expect(CommitConvention.ANGULAR).toBe('angular');
      expect(CommitConvention.SEMANTIC).toBe('semantic');
    });
  });

  describe('PackageManager', () => {
    it('should include all package managers', () => {
      expect(PackageManager.NPM).toBe('npm');
      expect(PackageManager.YARN).toBe('yarn');
      expect(PackageManager.PNPM).toBe('pnpm');
      expect(PackageManager.BUN).toBe('bun');
      expect(PackageManager.PIP).toBe('pip');
      expect(PackageManager.POETRY).toBe('poetry');
      expect(PackageManager.UV).toBe('uv');
      expect(PackageManager.CARGO).toBe('cargo');
      expect(PackageManager.NUGET).toBe('nuget');
      expect(PackageManager.MAVEN).toBe('maven');
      expect(PackageManager.GRADLE).toBe('gradle');
      expect(PackageManager.GO_MODULES).toBe('go-modules');
    });
  });

  describe('DatabaseType', () => {
    it('should include SQL Server and Oracle', () => {
      expect(DatabaseType.SQLSERVER).toBe('sqlserver');
      expect(DatabaseType.ORACLE).toBe('oracle');
    });

    it('should include all database types', () => {
      expect(DatabaseType.POSTGRESQL).toBe('postgresql');
      expect(DatabaseType.MYSQL).toBe('mysql');
      expect(DatabaseType.MONGODB).toBe('mongodb');
      expect(DatabaseType.SUPABASE).toBe('supabase');
      expect(DatabaseType.FIREBASE).toBe('firebase');
      expect(DatabaseType.DYNAMODB).toBe('dynamodb');
      expect(DatabaseType.REDIS).toBe('redis');
      expect(DatabaseType.NEON).toBe('neon');
      expect(DatabaseType.PLANETSCALE).toBe('planetscale');
    });
  });

  describe('OrmType', () => {
    it('should include all ORMs', () => {
      expect(OrmType.PRISMA).toBe('prisma');
      expect(OrmType.TYPEORM).toBe('typeorm');
      expect(OrmType.MIKROORM).toBe('mikroorm');
      expect(OrmType.DRIZZLE).toBe('drizzle');
      expect(OrmType.MONGOOSE).toBe('mongoose');
      expect(OrmType.SQLALCHEMY).toBe('sqlalchemy');
      expect(OrmType.DJANGO_ORM).toBe('django-orm');
      expect(OrmType.ENTITY_FRAMEWORK).toBe('entity-framework');
      expect(OrmType.GORM).toBe('gorm');
      expect(OrmType.DIESEL).toBe('diesel');
      expect(OrmType.ECTO).toBe('ecto');
    });
  });

  describe('TestingFramework', () => {
    it('should include all testing frameworks', () => {
      expect(TestingFramework.JEST).toBe('jest');
      expect(TestingFramework.VITEST).toBe('vitest');
      expect(TestingFramework.PLAYWRIGHT).toBe('playwright');
      expect(TestingFramework.CYPRESS).toBe('cypress');
      expect(TestingFramework.PYTEST).toBe('pytest');
      expect(TestingFramework.JUNIT).toBe('junit');
      expect(TestingFramework.GO_TEST).toBe('go-test');
      expect(TestingFramework.RUST_TEST).toBe('rust-test');
      expect(TestingFramework.EXUNIT).toBe('exunit');
    });
  });

  describe('CoverageTarget', () => {
    it('should have all coverage levels', () => {
      expect(CoverageTarget.FULL).toBe('100');
      expect(CoverageTarget.HIGH).toBe('80');
      expect(CoverageTarget.STANDARD).toBe('60');
      expect(CoverageTarget.MINIMAL).toBe('40');
      expect(CoverageTarget.NONE).toBe('none');
    });
  });

  describe('DeploymentPlatform', () => {
    it('should include all platforms', () => {
      expect(DeploymentPlatform.VERCEL).toBe('vercel');
      expect(DeploymentPlatform.NETLIFY).toBe('netlify');
      expect(DeploymentPlatform.AWS).toBe('aws');
      expect(DeploymentPlatform.AZURE).toBe('azure');
      expect(DeploymentPlatform.GCP).toBe('gcp');
      expect(DeploymentPlatform.RAILWAY).toBe('railway');
      expect(DeploymentPlatform.RENDER).toBe('render');
      expect(DeploymentPlatform.FLY_IO).toBe('fly-io');
      expect(DeploymentPlatform.KUBERNETES).toBe('kubernetes');
    });
  });

  describe('Containerization', () => {
    it('should include all options', () => {
      expect(Containerization.DOCKER).toBe('docker');
      expect(Containerization.DOCKER_COMPOSE).toBe('docker-compose');
      expect(Containerization.KUBERNETES).toBe('kubernetes');
      expect(Containerization.PODMAN).toBe('podman');
    });
  });

  describe('SecurityScanningTool', () => {
    it('should include all tools', () => {
      expect(SecurityScanningTool.SNYK).toBe('snyk');
      expect(SecurityScanningTool.DEPENDABOT).toBe('dependabot');
      expect(SecurityScanningTool.RENOVATE).toBe('renovate');
      expect(SecurityScanningTool.TRIVY).toBe('trivy');
      expect(SecurityScanningTool.SONARQUBE).toBe('sonarqube');
      expect(SecurityScanningTool.CODEQL).toBe('codeql');
    });
  });

  describe('MonorepoTool', () => {
    it('should include all tools', () => {
      expect(MonorepoTool.TURBOREPO).toBe('turborepo');
      expect(MonorepoTool.NX).toBe('nx');
      expect(MonorepoTool.LERNA).toBe('lerna');
      expect(MonorepoTool.RUSH).toBe('rush');
      expect(MonorepoTool.PNPM_WORKSPACES).toBe('pnpm-workspaces');
      expect(MonorepoTool.YARN_WORKSPACES).toBe('yarn-workspaces');
    });
  });

  describe('IdeIntegration', () => {
    it('should include all IDEs', () => {
      expect(IdeIntegration.CURSOR).toBe('cursor');
      expect(IdeIntegration.WINDSURF).toBe('windsurf');
      expect(IdeIntegration.GEMINI).toBe('gemini');
      expect(IdeIntegration.COPILOT).toBe('copilot');
      expect(IdeIntegration.CODY).toBe('cody');
    });
  });
});
