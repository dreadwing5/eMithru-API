const axios = require("axios");

const { Configuration, OpenAIApi } = require("openai");

const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");

const configuration = new Configuration({
  apiKey: process.env.OPEN_API_KEY,
});

const openai = new OpenAIApi(configuration);

const getIntentFromChatGpt = async (query) => {
  const prompt = `Intent of the following user query:\nQuery: ${query}\nIntent: `;
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 0,
    max_tokens: 64,
    top_p: 1.0,
    frequency_penalty: 0.0,
    presence_penalty: 0.0,
    stop: ['"""'],
  });

  if (response.data.choices && response.data.choices.length > 0)
    return response.data.choices[0].text.trim();

  throw new Error("No intent found");
};

const createMeeting = async (query) => {
  // Implement logic to extract key-value pairs and call the meeting creation API
};

const getSchedule = async (query) => {
  // Implement logic to extract key-value pairs and call the schedule API
};

exports.handleUserQuery = catchAsync(async (req, res, next) => {
  const userQuery = req.body.query;
  const userIntent = await getIntentFromChatGpt(userQuery);

  let response;

  switch (userIntent) {
    case "create_meeting":
      response = await createMeeting(userQuery);
      break;
    case "get_schedule":
      response = await getSchedule(userQuery);
      break;
    default:
      response = { error: "Unknown intent" };
  }
  res.status(200).json(response);
});
