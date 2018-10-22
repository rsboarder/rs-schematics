import { SchematicTestRunner, UnitTestTree } from '@angular-devkit/schematics/testing';
import { Schema as ApplicationOptions } from '@schematics/angular/application/schema';
import { Schema as WorkspaceOptions } from '@schematics/angular/workspace/schema';
import { Schema as ComponentOptions } from '@schematics/angular/component/schema';


describe('Component Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    'schematics',
    require.resolve('../collection.json'),
  );

  const defaultOptions: ComponentOptions = {
    name: 'foo',
    // path: 'src/app',
    inlineStyle: false,
    inlineTemplate: false,
    styleext: 'css',
    spec: true,
    module: undefined,
    export: false,
    project: 'bar',
  };

  const workspaceOptions: WorkspaceOptions = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0',
  };

  const appOptions: ApplicationOptions = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'css',
    skipTests: false,
    skipPackageJson: false,
  };

  let appTree: UnitTestTree;
  beforeEach(() => {
    const angularSchematic = new SchematicTestRunner(
      '@schematics/angular',
      require.resolve('@schematics/angular/collection.json'),
    );
    appTree = angularSchematic.runSchematic('workspace', workspaceOptions);
    appTree = angularSchematic.runSchematic('application', appOptions, appTree);
  });

  it('should create all files', () => {
    const options = { ...defaultOptions };
    const tree = schematicRunner.runSchematic('component', options, appTree);
    const files = tree.files;

    expect(files.indexOf('/projects/bar/src/app/foo/foo.component.css')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/projects/bar/src/app/foo/foo.component.pug')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/projects/bar/src/app/foo/foo.component.spec.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/projects/bar/src/app/foo/foo.component.ts')).toBeGreaterThanOrEqual(0);
  });

  it('should set correct template extension in Component file', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('component', options, appTree);
    const tsContent = tree.readContent('/projects/bar/src/app/foo/foo.component.ts');
    expect(tsContent).toMatch(/foo\.component\.pug/);
  });
});
