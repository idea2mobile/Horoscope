export interface BirthData {
  name: string;
  date: string;
  time: string;
  province: string;
}

export interface PlanetPosition {
  name: string;     // e.g., Sun, Moon
  thaiName: string; // e.g., อาทิตย์, จันทร์
  symbol: string;   // e.g., ๑, ๒
  zodiacIndex: number; // 0 = Aries (เมษ), 1 = Taurus (พฤษภ), ... 11 = Pisces (มีน)
  degrees: number;  // 0-30 degrees within the sign
}

export interface ChartData {
  planets: PlanetPosition[];
  ascendant: {
    zodiacIndex: number;
    degrees: number;
  };
  prediction: string;
}

export enum ZodiacSign {
  Aries = 0,
  Taurus = 1,
  Gemini = 2,
  Cancer = 3,
  Leo = 4,
  Virgo = 5,
  Libra = 6,
  Scorpio = 7,
  Sagittarius = 8,
  Capricorn = 9,
  Aquarius = 10,
  Pisces = 11,
}

export const THAI_ZODIAC_NAMES = [
  "เมษ", "พฤษภ", "เมถุน", "กรกฎ", "สิงห์", "กันย์", 
  "ตุลย์", "พิจิก", "ธนู", "มังกร", "กุมภ์", "มีน"
];
