import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function sum(list: any[]) {
  if (!list || list.length === 0) {
    return 0;
  }

  return list.reduce((total, num) => total + num, 0);
}

export function sumByKey(list: any[], key: string) {
  // example usage
  // const items = [
  //   { amount: 10 },
  //   { amount: 20 },
  //   { amount: 30 },
  //   { amount: 40 }
  // ];
  
  // const totalAmount = sumByKey(items, 'amount');
  // console.log(totalAmount); // Output: 100
  return list.reduce((total, obj) => total + (obj[key] || 0), 0);
}