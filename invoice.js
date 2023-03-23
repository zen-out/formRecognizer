require("dotenv").config();
const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const fs = require("fs");
const _ = require("lodash");

const endpoint = process.env.ENDPOINT;
const key = process.env.KEY;

async function main() {
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key)
  );
  const file = fs.createReadStream("files/20210218_121030_001.pdf");

  const poller = await client.beginAnalyzeDocument("prebuilt-invoice", file);

  const settings = await poller.pollUntilDone();
  const { keyValuePairs, paragraphs, content, apiVersion } = settings;

  const keyValues = _.map(keyValuePairs, ({ key, value }) => {
    if (value) {
      return `${key.content} ${value.content}`;
    }
  });
  const result = _.compact(keyValues);
  console.log(result);
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});
