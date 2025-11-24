import { GoogleGenAI, Type } from "@google/genai";
import { BirthData, ChartData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAstrologyData = async (data: BirthData): Promise<ChartData> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    Role: Expert Thai Astrologer (Suriyayart System).
    Task: Calculate the planetary positions and generate a horoscope prediction based on the birth data.
    
    Birth Data:
    Name: ${data.name}
    Date: ${data.date}
    Time: ${data.time}
    Location: ${data.province}, Thailand

    Instructions:
    1. Calculate approximate positions of Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu, Uranus, Neptune, and Pluto based on the Suriyayart system.
    2. Determine the Ascendant (Lagana) based on the time and location.
    3. Provide a detailed prediction in Thai language covering Personality, Career, Finance, and Love.
    4. For 'zodiacIndex', use 0 for Aries (เมษ), 1 for Taurus (พฤษภ), up to 11 for Pisces (มีน).
    5. 'symbol' must be the single digit Thai numeral (e.g., Sun=๑, Moon=๒, Mars=๓, Mercury=๔, Jupiter=๕, Venus=๖, Saturn=๗, Rahu=๘, Ketu=๙, Uranus=๐).
    
    Return strict JSON.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          planets: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                thaiName: { type: Type.STRING },
                symbol: { type: Type.STRING },
                zodiacIndex: { type: Type.INTEGER, description: "0-11, where 0 is Aries" },
                degrees: { type: Type.NUMBER, description: "0-30" },
              },
              required: ["name", "thaiName", "symbol", "zodiacIndex", "degrees"]
            }
          },
          ascendant: {
            type: Type.OBJECT,
            properties: {
              zodiacIndex: { type: Type.INTEGER },
              degrees: { type: Type.NUMBER }
            },
            required: ["zodiacIndex", "degrees"]
          },
          prediction: {
            type: Type.STRING,
            description: "A detailed horoscope reading in Thai."
          }
        },
        required: ["planets", "ascendant", "prediction"]
      }
    }
  });

  if (response.text) {
    return JSON.parse(response.text) as ChartData;
  }
  
  throw new Error("Failed to generate astrology data");
};
