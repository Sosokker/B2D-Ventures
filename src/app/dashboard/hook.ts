import { useEffect, useState } from "react";
import { Deal, getDealList, convertToGraphData } from "../api/dealApi";

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

export function useGraphData() {
  const [graphData, setGraphData] = useState<Record<string, number>>({});

  const fetchGraphData = async () => {
    const dealList = await getDealList();
    if (dealList) {
      setGraphData(convertToGraphData(dealList));
    }
  }

  useEffect(() => {
    fetchGraphData();
  }, []);

  return graphData;
}