import { Generator } from '../src/generator'
import uuid = require('uuid');
import { promises as fs } from 'fs';
import { Bundle } from 'cnabjs';

test('generate readme runs', async () => {
    let testId: string = uuid();
    let outputPath = `./outputs/${testId}.md`;

    let expected = await fs.readFile('./__tests__/data/readme.md', "utf8");

    let bundleMetadata : Bundle = JSON.parse(await fs.readFile('./__tests__/data/bundle.json', "utf8"));
    let instructions = await fs.readFile('./__tests__/data/INSTRUCTIONS.md', "utf8");

    let simpleTemplateUri = "https://raw.githubusercontent.com/endjin/CNAB.Quickstarts/master/porter/sql-server-always-on/azuredeploy-simple.json"
    let advancedTemplateUri = "https://raw.githubusercontent.com/endjin/CNAB.Quickstarts/master/porter/sql-server-always-on/azuredeploy-advanced.json"

    let generator = new Generator(bundleMetadata, instructions, simpleTemplateUri, advancedTemplateUri);
    let readme = generator.generateReadme();
    expect(readme).toBe(expected);
});