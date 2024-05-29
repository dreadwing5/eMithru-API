import openai from "./openaiApi.js";

const conversationSummaryPrompt = (thread) => {
  if (thread.messages.length < 3) {
    return "Not enough messages to generate a summary.";
  }

  const prompt = `You are tasked with generating a summary of a conversation and evaluating the mentor performance in providing counseling to a student. Your evaluation will be used to provide feedback to higher-level management on the mentor's counseling performance. In your summary, please include a brief overview of the student's problem, the mentor's approach to counseling, the effectiveness of the mentor's counseling, and whether or not the student's problem was resolved. Your summary should be clear and concise, with a maximum word count of 100. Use specific examples and details from the conversation to support your evaluation of the mentor performance.

Here is a conversation thread object:
Topic: ${thread.topic}
Participants: ${thread.participants
    .map((p) => `${p.name} (Role: ${p.role})`)
    .join(", ")}
Title: ${thread.title}

${thread.messages
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

  return prompt;
};

// eslint-disable-next-line import/prefer-default-export
export async function generateSummary(thread) {
  const prompt = conversationSummaryPrompt(thread);
  if (prompt === "Not enough messages to generate a summary.") {
    return prompt;
  }

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are a helpful assistant that generates conversation summaries and evaluates mentor performance.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.5,
  });

  return response.choices[0];
}
