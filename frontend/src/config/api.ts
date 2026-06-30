export const API = {
  AUTH: process.env.NEXT_PUBLIC_AUTH_SERVICE!,
  JOB: process.env.NEXT_PUBLIC_JOB_SERVICE!,
  USER: process.env.NEXT_PUBLIC_USER_SERVICE!,
  UTILS: process.env.NEXT_PUBLIC_UTILS_SERVICE!,
  PAYMENT: process.env.NEXT_PUBLIC_PAYMENT_SERVICE!,
};

console.log("AUTH =", process.env.NEXT_PUBLIC_AUTH_SERVICE);
console.log("USER =", process.env.NEXT_PUBLIC_USER_SERVICE);
console.log("JOB =", process.env.NEXT_PUBLIC_JOB_SERVICE);
console.log("UTILS =", process.env.NEXT_PUBLIC_UTILS_SERVICE);
console.log("PAYMENT =", process.env.NEXT_PUBLIC_PAYMENT_SERVICE);