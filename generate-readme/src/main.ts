import * as core from '@actions/core';
import { Generator } from './generator';
import { promises as fs } from 'fs';
import { Bundle } from 'cnabjs';


export async function run() {
  try {

    let bundleMetadataPath = core.getInput("bundle_metadata_path");
    let instructionsPath = core.getInput("instructions_path");
    let outputPath = core.getInput("output_path");
    let simpleTemplateUri = core.getInput("simple_template_uri");
    let advancedTemplateUri = core.getInput("advanced_template_uri");

    core.info(`Reading and parsing bundle metadata from: ${bundleMetadataPath}`);
    let bundleMetadata : Bundle =  JSON.parse(await fs.readFile(bundleMetadataPath, "utf8"));
    core.info(`Reading instructions markdown from: ${instructionsPath}`);
    let instructions = await fs.readFile(instructionsPath, "utf8");

    core.info("Generating readme...");
    let generator = new Generator(bundleMetadata, instructions, simpleTemplateUri, advancedTemplateUri);
    let readme = generator.generateReadme();

    core.info(`Readme generating. Writing out to: ${outputPath}`);
    await fs.writeFile(outputPath, readme);
    
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));