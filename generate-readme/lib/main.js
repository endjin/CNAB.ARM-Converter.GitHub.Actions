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
const generator_1 = require("./generator");
const fs_1 = require("fs");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let bundleMetadataPath = core.getInput("bundle_metadata_path");
            let instructionsPath = core.getInput("instructions_path");
            let outputPath = core.getInput("output_path");
            let templateUri = core.getInput("template_uri");
            let bundleMetadata = JSON.parse(yield fs_1.promises.readFile(bundleMetadataPath, "utf8"));
            let instructions = yield fs_1.promises.readFile(instructionsPath, "utf8");
            let generator = new generator_1.Generator(bundleMetadata, instructions, templateUri);
            let readme = generator.generateReadme();
            yield fs_1.promises.writeFile(outputPath, readme);
        }
        catch (error) {
            throw error;
        }
    });
}
exports.run = run;
run().catch(error => core.setFailed(error.message));
