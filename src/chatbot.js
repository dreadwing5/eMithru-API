/* eslint-disable node/file-extension-in-import */
import "./config.js";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { RetrievalQAChain, loadQARefineChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { createClient } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import AppError from "./utils/appError.js";

const model = new OpenAI({ openAIApiKey: process.env.OPEN_API_KEY });

const privateKey = process.env.SUPABASE_PRIVATE_KEY;
if (!privateKey) throw new AppError(`Expected env var SUPABASE_PRIVATE_KEY`);

const url = process.env.SUPABASE_URL;
if (!url) throw new AppError(`Expected env var SUPABASE_URL`);

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPEN_API_KEY,
});
const client = createClient(url, privateKey);

const buildIndex = async () => {
  try {
    const loader = new JSONLoader("./dev-data/data.json");
    const docs = await loader.load();
    await SupabaseVectorStore.fromDocuments(docs, embeddings, {
      client,
      tableName: "documents",
      queryName: "match_documents",
    });
    console.log(results);
  } catch (error) {
    console.error(error);
  }
};

const retrieveDocument = async () => {
  const vectorStore = await SupabaseVectorStore.fromExistingIndex(embeddings, {
    client,
    tableName: "documents",
    queryName: "match_documents",
  });

  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQARefineChain(model),
    retriever: vectorStore.asRetriever(),
  });
  const res = await chain.call({
    query:
      "What are the programs offered by cmrit? and tell me where it is located",
  });
  console.log({ res });
};

retrieveDocument();
