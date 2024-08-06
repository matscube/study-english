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
 * 
 * TODO: specify output json format in prompt
 * TODO: receive output as javascript object
 * TODO: validate the output by using zod
 */
export async function generateScripts() {
  createConversation();
}

async function createConversation() {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            `
            ビジネス英会話の練習のために、5分程度の会話スクリプトを書いてください。
            参加者は2名です。
            Aliceは営業部長です。
            Bobは開発部のエンジニアです。
            回答は英語と日本語の両方を出力してください。
            回答フォーマットはJavaScriptのObject配列形式で出力してください。
            `,
        },
        {
          role: "user",
          content:
          `
          シチュエーションはオンライン会議でのスプリント開発MTGです。
          議題は以下のとおりです。
          * 前のスプリントの進捗確認をする
          * 次のスプリントで着手するタスクを決める
          * 各タスクにアサインするメンバーを決める
          * 各タスクの優先順位を決める
          * 次のスプリントMTGの日程を決める

          ### Output Format Sample
          {
            conversation: [
              {
                role: 'Alice',
                ja: 'Hi Bob, how are you today?',
                en: 'お疲れ様です、ボブ。今日の調子はどうですか？',
              },
              {
                role: 'Bob',
                ja: 'Hi Alice, I'm good, thanks. How about you?',
                en: 'お疲れ様です、アリスさん。良い調子です。ありがとうございます。そちらはどうですか？',
              },
            ]
          }
          `
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

async function createCommonlyUsedPhrases() {
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
            `,
        },
        {
          role: "user",
          content:
            // 会議の終わりに議論の結果の再確認をする
            "Please think of commonly used phrases for reconfirming the results of the discussion at the end of the meeting",

            // スケジュール調整
            // "Please think of commonly used phrases for adjusting the schedule of the next meeting during internal online meetings.",
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
