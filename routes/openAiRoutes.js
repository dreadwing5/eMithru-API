// const axios = require("axios");

const router = require("express").Router();

const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

router.post("/summary", async (req, res) => {
  try {
    const { thread } = req.body;
    const prompt = `You are tasked with generating a summary of a conversation and evaluating the mentor performance in providing counseling to a student. Your evaluation will be used to provide feedback to higher-level management on the mentor's counseling performance. In your summary, please include a brief overview of the student's problem, the mentor's approach to counseling, the effectiveness of the mentor's counseling, and whether or not the student's problem was resolved.Your summary should be clear and concise, with a maximum word count of 100. Use specific examples and details from the conversation to support your evaluation of the mentor performance. Here is a conversation thread object:
    Participants: ${thread.participants.map((p) => p.name).join(", ")}
    Title: ${thread.title} ${thread.messages
      .map(
        (msg) =>
          `${
            msg.senderId === thread.participants[0]._id
              ? thread.participants[0].name
              : thread.participants[1].name
          }: ${msg.body}`
      )
      .join("\n")}

Evaluate the mentor performance in providing counseling to the student based on the above conversation. Be sure to provide specific examples and details to support your conclusions.`;

    // console.log(prompt);

    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: prompt,
      max_tokens: 100,
      temperature: 0.5,
    });

    // // Return summary in response
    res.status(200).json({ summary: response.data.choices[0].text });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
