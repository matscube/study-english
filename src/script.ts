/**
 * Create script using LLM
 */
import OpenAI from "openai";
import "dotenv/config";

const openai = new OpenAI();

/**
 * TODO: generate json string formatted as Manuscript[]
 * TODO: give the situation by a command run
 * TODO: use few-shot prompting
 */
export async function generateScripts() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            `
            * You are an English language tutor creating learning materials for Japanese students.
            * Generate 10 pairs of sentences, each with an English sentence and its Japanese translation.
            * The sentences should cover various everyday situations and language levels.
            * Please think of commonly used phrases for adjusting the schedule of the next meeting during internal online meetings.
            * Generate sentences in a conversational format.
            `,
        },
        {
          role: "user",
          content:
            "Generate 10 English learning scripts with Japanese translations.",
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedScripts = completion.choices[0].message.content;
    console.log(generatedScripts);
  } catch (error) {
    console.error("Error generating scripts:", error);
  }
}
