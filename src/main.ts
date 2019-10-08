import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as exec from '@actions/exec';
import { env } from 'process';

export async function run() {
  try {

    let toolVersion = core.getInput("tool_version");
    let bundlePath = core.getInput("bundle_path");
    let outputPath = core.getInput("output_path");

    let os = env.RUNNER_OS;

    let toolUrl: string;

    switch (os) {
      case "Windows":
        toolUrl = `https://github.com/endjin/CNAB.ARM-Converter/releases/download/${toolVersion}/cnab-arm-windows-amd64.exe`;
        break;
      case "MacOS":
        toolUrl = `https://github.com/endjin/CNAB.ARM-Converter/releases/download/${toolVersion}/cnab-arm-darwin-amd64`;
        break;
      case "Linux":
        toolUrl = `https://github.com/endjin/CNAB.ARM-Converter/releases/download/${toolVersion}/cnab-arm-linux-amd64`;
        break;
      default:
        throw `Unknown OS: ${os}`
    }

    let toolPath = await tc.downloadTool(toolUrl);

    await exec.exec(toolPath, ['-b', bundlePath, '-f', outputPath, '-i'])

  } catch (error) {
    throw error;
  }
}

run().catch(error => core.setFailed(error.message));