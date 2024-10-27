import { useEffect, useState } from "react";
import { Deal, getDealList } from "../api/dealApi";

// custom hook for deal list
export function useDealList() {
  const [dealList, setDealList] = useState<Deal[]>();

  const fetchDealList = async () => {
    setDealList(await getDealList());
  }

  useEffect(() => {
    fetchDealList();
  }, []);

  return dealList;
}