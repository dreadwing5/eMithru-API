/* eslint-disable node/file-extension-in-import */
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { OpenAIEmbeddings } from "@langchain/openai";
import { createClient } from "@supabase/supabase-js";
import logger from "../utils/logger.js";

class CampusBuddy {
  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_PRIVATE_KEY
    );
    this.embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPEN_API_KEY,
    });
  }

  handleError(error) {
    // Log the error using your logger
    logger.error(`ERROR 💥 ${error}`);
    // You can further customize this method to handle different types of errors as needed
  }

  async generateResponse(query) {
    try {
      const vectorStore = await SupabaseVectorStore.fromExistingIndex(
        this.embeddings,
        {
          client: this.client,
          tableName: "documents",
          queryName: "match_documents",
        }
      );

      // Perform similarity search using the vector store
      const resultA = await vectorStore.similaritySearch(query, 5);

      // Perform maximum marginal relevance search using the vector store
      const resultB = await vectorStore.maxMarginalRelevanceSearch(query, {
        k: 5,
      });

      // Combine the results
      const combinedResults = [...resultA, ...resultB];

      return combinedResults;
    } catch (error) {
      logger.error("Error in vector store search", {
        error: error.message,
        stack: error.stack,
      });
      this.handleError(error);
      return null;
    }
  }
}

export default new CampusBuddy();
