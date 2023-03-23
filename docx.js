require("dotenv").config();
const {
  DocumentAnalysisClient,
  AzureKeyCredential,
  DocumentModelAdministrationClient,
} = require("@azure/ai-form-recognizer");
const { DefaultAzureCredential } = require("@azure/identity");
const fs = require("fs");
const endpoint = process.env.ENDPOINT;
const apiKey = process.env.KEY;
const _ = require("lodash");
async function getModelId() {
  const client = new DocumentModelAdministrationClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );
  const modelId = "prebuilt-idDocument";
  // console.log(client.listModels());
  // let models = await client.listModels();
  // console.log(models);

  for await (const modelSummary of client.listModels()) {
    console.log("- ID", modelSummary.modelId);
    console.log("  Description: ", modelSummary.description);
  }
}
getModelId();
// https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/applied-ai-services/form-recognizer/concept-read.md
async function main() {
  let modelId = "prebuilt-read";
  const file = fs.createReadStream("files/Johnson Jul_upload.xlsx");
  // const file = fs.createReadStream("sampleXlsx.xlsx")
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(apiKey)
  );
  const poller = await client.beginAnalyzeDocument(modelId, file);
  const { paragraphs, keyValuePairs, content } = await poller.pollUntilDone();
  // console.log("paragraphs", Object.keys(paragraphs));
  // console.log(keyValuePairs);
  const paragraphContents = _.map(paragraphs, "content").join("\n");
  console.log(content, "content");
  console.log("paragraph contents", paragraphContents);
}

// main();
