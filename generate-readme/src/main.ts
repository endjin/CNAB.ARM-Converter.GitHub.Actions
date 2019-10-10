import * as core from '@actions/core';
import { Generator } from './generator';
import { promises as fs } from 'fs';
import { Bundle } from 'cnabjs';


export async function run() {
  try {

    let bundleMetadataPath = core.getInput("bundle_metadata_path");
    let instructionsPath = core.getInput("instructions_path");
    let outputPath = core.getInput("output_path");
    let templateUri = core.getInput("template_uri");

    let bundleMetadata : Bundle =  JSON.parse(await fs.readFile(bundleMetadataPath, "utf8"));
    let instructions = await fs.readFile(instructionsPath, "utf8");

    let generator = new Generator(bundleMetadata, instructions, templateUri);

    let readme = generator.generateReadme();

    await fs.writeFile(outputPath, readme);
    
  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));