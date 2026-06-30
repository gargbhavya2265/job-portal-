const AUTH = process.env.NEXT_PUBLIC_AUTH_SERVICE;
const USER = process.env.NEXT_PUBLIC_USER_SERVICE;
const JOB = process.env.NEXT_PUBLIC_JOB_SERVICE;
const UTILS = process.env.NEXT_PUBLIC_UTILS_SERVICE;

console.log("========== API DEBUG ==========");
console.log("AUTH:", AUTH);
console.log("USER:", USER);
console.log("JOB:", JOB);
console.log("UTILS:", UTILS);
console.log("===============================");

export const API = {
  AUTH,
  USER,
  JOB,
  UTILS,
  PAYMENT: process.env.NEXT_PUBLIC_PAYMENT_SERVICE,
};