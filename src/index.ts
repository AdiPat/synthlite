import dotenv from "dotenv";
import { synthlite } from "./synthlite";

dotenv.config();

export async function main() {
  await synthlite();
}
