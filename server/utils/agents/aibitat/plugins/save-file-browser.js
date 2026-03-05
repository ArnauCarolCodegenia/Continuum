const { Deduplicator } = require("../utils/dedupe");

const saveFileInBrowser = {
  name: "save-file-to-browser",
  startupConfig: {
    params: {},
  },
  plugin: function () {
    return {
      name: this.name,
      setup(aibitat) {
        // List and summarize the contents of files that are embedded in the workspace
        aibitat.function({
          super: aibitat,
          tracker: new Deduplicator(),
          name: this.name,
          description:
            "Save content to a file when the user explicitly asks for a download of the file. DO NOT use placeholders for the file content! You MUST provide the full, final text, code, or markdown to be saved. If the user asks for a PDF, you CANNOT generate binary PDFs natively. Instead, you MUST generate a beautifully formatted HTML file (with .html extension) that contains the requested information, embeds any requested charts using Chart.js via CDN, and includes a script to call window.print() on load so the user can save it as a PDF.",
          examples: [
            {
              prompt: "Save my report to a file named 'output'",
              call: JSON.stringify({
                file_content:
                  "# Executive Report\n\nThis is the actual full text content of the report you requested. It contains all the necessary details and findings without any removed text or placeholders.",
                filename: "output.md",
              }),
            },
            {
              prompt: "Download this as a PDF with the user growth chart",
              call: JSON.stringify({
                file_content:
                  "<html><head><script src='https://cdn.jsdelivr.net/npm/chart.js'></script></head><body onload='window.print()'><h1>User Growth Report</h1><canvas id='myChart'></canvas><script>new Chart(document.getElementById('myChart'), {type: 'bar', data: {labels: ['Jan', 'Feb'], datasets: [{label: 'Users', data: [10, 20]}]}})</script></body></html>",
                filename: "User_Growth_Report.html",
              }),
            },
            {
              prompt: "Save that code to my desktop",
              call: JSON.stringify({
                file_content:
                  "function calculateSum(a, b) {\n  return a + b;\n}\nconsole.log(calculateSum(5, 10));",
                filename: "script.js",
              }),
            },
          ],
          // JSON schema defining the arguments the LLM must provide to call this tool
          parameters: {
            $schema: "http://json-schema.org/draft-07/schema#",
            type: "object",
            properties: {
              file_content: {
                type: "string",
                description: "The content of the file that will be saved.",
              },
              filename: {
                type: "string",
                description:
                  "filename to save the file as with extension. Extension should be plaintext file extension.",
              },
            },
            additionalProperties: false,
          },
          handler: async function ({ file_content = "", filename }) {
            try {
              const { isDuplicate, reason } = this.tracker.isDuplicate(
                this.name,
                { file_content, filename }
              );
              if (isDuplicate) {
                this.super.handlerProps.log(
                  `${this.name} was called, but exited early because ${reason}.`
                );
                return `${filename} file has been saved successfully!`;
              }

              // Prevent corrupt PDF files by enforcing HTML fallback if the LLM ignores instructions
              let finalFilename = filename;
              let finalContent = file_content;
              
              if (finalFilename.toLowerCase().endsWith('.pdf')) {
                finalFilename = finalFilename.replace(/\\.[^/.]+$/, "") + ".html";
                // If the LLM didn't wrap it in HTML, wrap it automatically
                if (!finalContent.toLowerCase().includes('<html>')) {
                  finalContent = `<!DOCTYPE html><html><head><title>${finalFilename}</title><style>body{font-family:sans-serif;padding:2rem}</style></head><body onload="window.print()"><pre style="white-space:pre-wrap;word-wrap:break-word;">${finalContent}</pre></body></html>`;
                }
              }

              this.super.socket.send("fileDownload", {
                filename: finalFilename,
                b64Content:
                  "data:text/plain;base64," +
                  Buffer.from(finalContent, "utf8").toString("base64"),
              });
              this.super.introspect(`${this.caller}: Saving file ${finalFilename}.`);
              this.tracker.trackRun(this.name, { file_content: finalContent, filename: finalFilename });
              return `${finalFilename} file has been saved successfully and will be downloaded automatically to the users browser.`;
            } catch (error) {
              this.super.handlerProps.log(
                `save-file-to-browser raised an error. ${error.message}`
              );
              return `Let the user know this action was not successful. An error was raised while saving a file to the browser. ${error.message}`;
            }
          },
        });
      },
    };
  },
};

module.exports = {
  saveFileInBrowser,
};
