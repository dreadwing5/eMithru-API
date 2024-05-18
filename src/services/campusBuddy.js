/* eslint-disable node/file-extension-in-import */
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { RetrievalQAChain, loadQARefineChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import logger from "../utils/logger.js";

class CampusBuddy {
  constructor() {
    this.model = new OpenAI({ openAIApiKey: process.env.OPEN_API_KEY });
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
    logger.error(`ERROR 💥  ${error}`);

    // You can further customize this method to handle different types of errors as needed
  }

  async buildIndex(filePath) {
    try {
      const loader = new JSONLoader(filePath);
      const docs = await loader.load();
      await SupabaseVectorStore.fromDocuments(docs, this.embeddings, {
        client: this.client,
        tableName: "documents",
        queryName: "match_documents",
      });
    } catch (error) {
      this.handleError(error);
    }
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

      const chain = new RetrievalQAChain({
        combineDocumentsChain: loadQARefineChain(this.model),
        retriever: vectorStore.asRetriever(),
      });

      const res = await chain.call({
        query,
      });
      return res;
    } catch (error) {
      logger.error("Error in chain call", {
        error: err.message,
        stack: err.stack,
      });
      this.handleError(error);
      return null;
    }
  }
}

export default new CampusBuddy();
