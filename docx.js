require("dotenv").config();
const {
  DocumentAnalysisClient,
  AzureKeyCredential,
  DocumentModelAdministrationClient
} = require("@azure/ai-form-recognizer");
const {
  DefaultAzureCredential
} = require("@azure/identity");
const fs = require("fs");
const endpoint = process.env.ENDPOINT;
const apiKey = process.env.KEY;
const inputFile = "sampleDocx.docx";
const fileBuffer = fs.readFileSync(inputFile);
var docxConverter = require('docx-pdf');
const _ = require("lodash"); 
async function getModelId() {
  const client = new DocumentModelAdministrationClient(endpoint, new AzureKeyCredential(apiKey));
  const modelId = "prebuilt-idDocument";
  for await (const modelSummary of client.listDocumentModels()) {
    console.log("- ID", modelSummary.modelId);
    console.log("  Description: ", modelSummary.description);
  }
}
// getModelId();
// https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/applied-ai-services/form-recognizer/concept-read.md
async function main() {
  let modelId = "prebuilt-read";
  const file = fs.createReadStream("sampleDocx.docx");
  // const file = fs.createReadStream("sampleXlsx.xlsx")
  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(apiKey));
  const poller = await client.beginAnalyzeDocument(modelId, file);
  const { pages, tables, styles, keyValuePairs, paragraphs, entities, documents,  } = await poller.pollUntilDone();
  console.log("paragraphs", paragraphs)
  const content = _.map(paragraphs, 'content').join('\n\n');
  console.log(content, "content"); 
}

main();