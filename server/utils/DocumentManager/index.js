/**
 * DocumentManager
 * 
 * This class handles the retrieval and checking of embedded/pinned documents for a specific workspace.
 * It ensures that when a workspace has "pinned" documents (documents forced to act as constant context
 * for every single chat message), their contents are safely loaded from disk up to a defined token limit.
 * 
 * Key responsibilities:
 * - Finding all pinned documents in a workspace from the SQL database.
 * - Reading the physical JSON files of those documents from the vector/document storage directory.
 * - Enforcing max token limits so pinned documents don't crash the LLM context window.
 */
const fs = require("fs");
const path = require("path");

const documentsPath =
  process.env.NODE_ENV === "development"
    ? path.resolve(__dirname, `../../storage/documents`)
    : path.resolve(process.env.STORAGE_DIR, `documents`);

class DocumentManager {
  constructor({ workspace = null, maxTokens = null }) {
    this.workspace = workspace;
    this.maxTokens = maxTokens || Number.POSITIVE_INFINITY;
    this.documentStoragePath = documentsPath;
  }

  log(text, ...args) {
    console.log(`\x1b[36m[DocumentManager]\x1b[0m ${text}`, ...args);
  }

  async pinnedDocuments() {
    if (!this.workspace) return [];
    const { Document } = require("../../models/documents");
    return await Document.where({
      workspaceId: Number(this.workspace.id),
      pinned: true,
    });
  }

  async pinnedDocs() {
    if (!this.workspace) return [];
    const docPaths = (await this.pinnedDocuments()).map((doc) => doc.docpath);
    if (docPaths.length === 0) return [];

    let tokens = 0;
    const pinnedDocs = [];
    
    // Iterate through all fetched document paths to retrieve their actual contents
    for await (const docPath of docPaths) {
      try {
        const filePath = path.resolve(this.documentStoragePath, docPath);
        
        // Parse the JSON data directly from the document storage dir
        const data = JSON.parse(
          fs.readFileSync(filePath, { encoding: "utf-8" })
        );

        // Discard the document if it's lacking required text content or a token count
        if (
          !data.hasOwnProperty("pageContent") ||
          !data.hasOwnProperty("token_count_estimate")
        ) {
          this.log(
            `Skipping document - Could not find page content or token_count_estimate in pinned source.`
          );
          continue;
        }

        // Enforce the workspace max tokens cap to avoid blowing up the LLM context window
        if (tokens >= this.maxTokens) {
          this.log(
            `Skipping document - Token limit of ${this.maxTokens} has already been exceeded by pinned documents.`
          );
          continue;
        }

        pinnedDocs.push(data);
        tokens += data.token_count_estimate || 0;
      } catch {}
    }

    this.log(
      `Found ${pinnedDocs.length} pinned sources - prepending to content with ~${tokens} tokens of content.`
    );
    return pinnedDocs;
  }
}

module.exports.DocumentManager = DocumentManager;
