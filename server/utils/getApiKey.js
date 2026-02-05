import dotenv from 'dotenv';
dotenv.config();

export function getRandomApiKey() {
  const keys = process.env.YTAPIKEYS.split(",");
  return keys[Math.floor(Math.random() * keys.length)];
}




