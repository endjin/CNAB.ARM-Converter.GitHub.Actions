"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const json2md_1 = __importDefault(require("json2md"));
class Generator {
    constructor(bundleMetadata, instructions, templateUri) {
        this.bundleMetadata = bundleMetadata;
        this.instructions = instructions;
        this.templateUri = templateUri;
    }
    generateReadme() {
        let readme = "";
        readme += this.generateTitle();
        readme += this.insertNewLine();
        readme += this.generateDeployToAzureButton();
        readme += this.insertNewLine();
        readme += this.insertNewLine();
        readme += this.generateInstructions();
        readme += this.insertNewLine();
        readme += this.insertNewLine();
        readme += this.generateParametersAndCredentials();
        return readme;
    }
    generateTitle() {
        let title = this.bundleMetadata.description || this.bundleMetadata.name;
        return json2md_1.default({ h1: title });
    }
    generateDeployToAzureButton() {
        let portalUri = "https://portal.azure.com/#create/Microsoft.Template/uri/";
        let buttonImageUri = "http://azuredeploy.net/deploybutton.png";
        let deployUri = portalUri + encodeURIComponent(this.templateUri);
        return `<a href=\"${deployUri}\" target=\"_blank\"><img src=\"${buttonImageUri}\"/></a>`;
    }
    generateInstructions() {
        return this.instructions;
    }
    generateParametersAndCredentials() {
        let parametersAndCredentials = [];
        if (this.bundleMetadata.parameters) {
            let parameters = Object.entries(this.bundleMetadata.parameters);
            parametersAndCredentials = parametersAndCredentials.concat(parameters);
        }
        if (this.bundleMetadata.credentials) {
            let credentials = Object.entries(this.bundleMetadata.credentials);
            parametersAndCredentials = parametersAndCredentials.concat(credentials);
        }
        parametersAndCredentials = parametersAndCredentials.sort((a, b) => (a[0] > b[0]) ? 1 : -1);
        return json2md_1.default([
            {
                h2: "Parameters and Credentials"
            },
            {
                table: {
                    headers: ["Name", "Description"],
                    rows: parametersAndCredentials.map(x => { return { Name: x[0], Description: x[1].description }; })
                }
            }
        ]);
    }
    insertNewLine() {
        return "\n";
    }
}
exports.Generator = Generator;
