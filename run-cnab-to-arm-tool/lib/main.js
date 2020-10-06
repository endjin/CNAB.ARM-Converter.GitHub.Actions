"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const exec = __importStar(require("@actions/exec"));
const process_1 = require("process");
const path = __importStar(require("path"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let toolVersion = core.getInput("tool_version");
            let bundlePath = core.getInput("bundle_path");
            let bundleTag = core.getInput("bundle_tag");
            let outputPath = core.getInput("output_path");
            let simplify = core.getInput("simplify") == "true";
            let workspacePath = process.env.GITHUB_WORKSPACE;
            bundlePath = path.join(workspacePath, bundlePath);
            outputPath = path.join(workspacePath, outputPath);
            let os = process_1.env.RUNNER_OS;
            let toolUrl;
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
                    throw `Unknown OS: ${os}`;
            }
            let toolPath = yield tc.downloadTool(toolUrl);
            yield exec.exec("chmod", ["+x", toolPath]);
            let execParams = ['generate', '-b', bundlePath, '-t', bundleTag, '-f', outputPath, '-i', '-o'];
            if (simplify)
                execParams = execParams.concat('-s');
            yield exec.exec(toolPath, execParams);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));
