import { useEffect, useState } from "react";
import { Deal, getDealList, convertToGraphData, getRecentDealData } from "../api/dealApi";
import { RecentDealData } from "@/components/recent-funds";

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
  const [graphData, setGraphData] = useState({});

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

export function useRecentDealData() {
  const [recentDealData, setRecentDealData] = useState<RecentDealData[]>();

  const fetchRecentDealData = async () => {
    setRecentDealData(await getRecentDealData());
  }

  useEffect(() => {
    fetchRecentDealData();
  }, []);

  return recentDealData;
}