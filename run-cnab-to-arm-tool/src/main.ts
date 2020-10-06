import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import { env } from 'process';
import * as path from 'path';

export async function run() {
  try {

    let toolVersion = core.getInput("tool_version");
    let bundlePath = core.getInput("bundle_path");
    let bundleTag = core.getInput("bundle_tag");
    let outputPath = core.getInput("output_path");
    let simplify = core.getInput("simplify") == "true";

    let workspacePath = <string>process.env.GITHUB_WORKSPACE;
    bundlePath = path.join(workspacePath, bundlePath);
    outputPath = path.join(workspacePath, outputPath);

    let os = env.RUNNER_OS;

    let toolUrl: string;

    switch (os) {
      case "Windows":
        toolUrl = `https://github.com/endjin/CNAB.ARM-Converter/releases/download/${toolVersion}/cnabarmdriver-windows-amd64.exe`;
        break;
      case "MacOS":
        toolUrl = `https://github.com/endjin/CNAB.ARM-Converter/releases/download/${toolVersion}/cnabarmdriver-darwin-amd64`;
        break;
      case "Linux":
        toolUrl = `https://github.com/endjin/CNAB.ARM-Converter/releases/download/${toolVersion}/cnabarmdriver-linux-amd64`;
        break;
      default:
        throw `Unknown OS: ${os}`
    }

    let toolPath = await tc.downloadTool(toolUrl);
    await exec.exec("chmod", ["+x", toolPath]);

    let execParams = ['generate', '-b', bundlePath, '-t', bundleTag, '-f', outputPath, '-i', '-o'];
    if (simplify) execParams = execParams.concat('-s');
    await exec.exec(toolPath, execParams);

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));