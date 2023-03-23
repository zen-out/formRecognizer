require('dotenv').config()
const { AzureKeyCredential, DocumentAnalysisClient } = require("@azure/ai-form-recognizer");

const endpoint = process.env.ENDPOINT; 
const key = process.env.KEY; 
const formUrlLayout = "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/blob/master/curl/form-recognizer/rest-api/invoice.pdf"
async function main() {
  const client = new DocumentAnalysisClient(endpoint, new AzureKeyCredential(key));

  const poller = await client.beginAnalyzeDocumentFromUrl("prebuilt-layout", formUrlLayout);

  const {
      pages,
      tables
  } = await poller.pollUntilDone();

  if (pages.length <= 0) {
      console.log("No pages were extracted from the document.");
  } else {
      console.log("Pages:");
      for (const page of pages) {
          console.log("- Page", page.pageNumber, `(unit: ${page.unit})`);
          console.log(`  ${page.width}x${page.height}, angle: ${page.angle}`);
          console.log(`  ${page.lines.length} lines, ${page.words.length} words`);
      }
  }

  if (tables.length <= 0) {
      console.log("No tables were extracted from the document.");
  } else {
      console.log("Tables:");
      for (const table of tables) {
          console.log(
              `- Extracted table: ${table.columnCount} columns, ${table.rowCount} rows (${table.cells.length} cells)`
          );
      }
  }
}

main().catch((error) => {
  console.error("An error occurred:", error);
  process.exit(1);
});