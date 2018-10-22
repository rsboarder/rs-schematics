import {
  Rule,
  Tree,
  chain,
  externalSchematic
} from '@angular-devkit/schematics';
import { getWorkspace } from "@schematics/angular/utility/config";
import { buildDefaultPath } from "@schematics/angular/utility/project";
import { parseName } from "@schematics/angular/utility/parse-name";

export default function (options: any): Rule {
  return chain([
    externalSchematic('@schematics/angular', 'component', options),
    (tree: Tree) => {
      const workspace = getWorkspace(tree);
      const project = workspace.projects[options.project];

      if (options.path === undefined) {
        options.path = buildDefaultPath(project);
      }

      const parsedPath = parseName(options.path, options.name);

      tree.getDir(`${parsedPath.path}/${options.name}`).visit((filePath) => {
        if (filePath.endsWith('.ts') && !filePath.endsWith('spec.ts')) {
          let content = tree.read(filePath)!.toString();
          content = content.replace(/html/, 'pug');
          tree.overwrite(filePath, content);
        }

        if (filePath.endsWith('.html')) {
          tree.overwrite(filePath, '');
          tree.rename(filePath, filePath.replace(/\.html/, '\.pug'));
        }
      });
      return tree;
    },
  ]);
}
