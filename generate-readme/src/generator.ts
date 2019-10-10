import { Bundle } from 'cnabjs';
import { default as json2md } from 'json2md';

export class Generator {
    private readonly bundleMetadata: Bundle;
    private readonly instructions: string;
    private readonly templateUri: string;

    constructor(bundleMetadata: Bundle, instructions: string, templateUri: string) {
        this.bundleMetadata = bundleMetadata;
        this.instructions = instructions;
        this.templateUri = templateUri;
    }
    
    generateReadme() : string {
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

    private generateTitle(): string {
        let title = this.bundleMetadata.description || this.bundleMetadata.name;

        return json2md({ h1: title });
    }

    private generateDeployToAzureButton(): string {
        let portalUri = "https://portal.azure.com/#create/Microsoft.Template/uri/"
        let buttonImageUri = "http://azuredeploy.net/deploybutton.png"
        
        let deployUri = portalUri + encodeURIComponent(this.templateUri);

        return `<a href=\"${deployUri}\" target=\"_blank\"><img src=\"${buttonImageUri}\"/></a>`;
    }

    private generateInstructions(): string {
        return this.instructions;
    }

    private generateParametersAndCredentials(): string {
        let parametersAndCredentials: [string, any][] = [];
        
        if (this.bundleMetadata.parameters){
            let parameters = Object.entries(this.bundleMetadata.parameters);
            parametersAndCredentials = parametersAndCredentials.concat(parameters);
        }

        if (this.bundleMetadata.credentials){
            let credentials = Object.entries(this.bundleMetadata.credentials);
            parametersAndCredentials = parametersAndCredentials.concat(credentials);
        }
        
        parametersAndCredentials = parametersAndCredentials.sort((a, b) => (a[0] > b[0]) ? 1 : -1)

        return json2md([
            { 
                h2: "Parameters and Credentials" 
            },
            {
                table: {
                    headers: ["Name", "Description"],
                    rows: parametersAndCredentials.map(x => { return { Name: x[0], Description: x[1].description } })
                }
            }
        ])
    }

    private insertNewLine(): string {
        return "\n";
    }
}