import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateInviteCode(length: number) {
  const alphanumeric =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
  let temp = "";
  for (let i = 0; i < length; i++) {
    temp += alphanumeric.charAt(
      Math.floor(Math.random() * alphanumeric.length)
    );
  }
  return temp;
}
