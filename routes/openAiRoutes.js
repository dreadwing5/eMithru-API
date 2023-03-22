const router = require("express").Router();
const { Configuration, OpenAIApi } = require("openai");
const axios = require("axios");
// const openai = require("../app");

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post("/text", async (req, res) => {
  try {
    const { text, activeChatId } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." }, // this represents the bot and what role they will assume
        { role: "user", content: text }, // the message that the user sends

        // BONUS NOTE: you can also provide a list of messages to the bot to give context
        // and the bot can use that information to respond to the user as needed, ie adding:
        // { role: "assistant", content: "The weather sucks today." },

        // to the above messages array, and then asking it this question:
        // `how is the weather today?`

        // the bot gave me this response:
        // `I apologize for my previous response. As an AI language model, I should not use such language.
        // I do not have access to real-time weather information without your location. Could you please
        // let me know your location, so I can provide you with accurate weather information?`

        // Hence, if you wanted to keep the "threads" that exist on ChatGPT, you would have to save the
        // messages that the bot sends and then provide them to the bot in the next request.
      ],
    });

    await axios.post(
      `https://api.chatengine.io/chats/${activeChatId}/messages/`,
      { text: response.data.choices[0].message.content },
      {
        headers: {
          "Project-ID": process.env.PROJECT_ID,
          "User-Name": process.env.BOT_USER_NAME,
          "User-Secret": process.env.BOT_USER_SECRET,
        },
      }
    );
    res.status(200).json({ text: response.data.choices[0].message.content });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
