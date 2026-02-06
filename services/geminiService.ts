import { GoogleGenerativeAI } from "@google/generative-ai";
import { Hand, GameResult } from "../types";

export const getDealerCommentary = async (
  apiKey: string | undefined,
  playerHand: Hand,
  dealerHand: Hand,
  result: GameResult,
  amountWon: number,
): Promise<string> => {
  if (!apiKey) return "Dealer smiles silently.";

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are a witty, sophisticated, and slightly cynical casino dealer at a high-stakes Blackjack table.
    The game just ended.
    
    Context:
    Result: ${result}
    Amount Won/Lost: ${amountWon}
    Player Score: ${playerHand.score}
    Dealer Score: ${dealerHand.score}
    
    Give a very short (max 1 sentence), reactive comment to the player.
    If they won big, be impressed but professional.
    If they lost, offer dry consolation or a subtle tease.
    If it's a push, comment on the waste of time.
    Do not use emojis.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "Place your bets.";
  } catch (error) {
    console.error("Dealer is distracted (API Error)", error);
    return "Care for another hand?";
  }
};
