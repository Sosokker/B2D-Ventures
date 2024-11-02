import { useEffect, useState } from "react";
import { Deal, getDealList, convertToGraphData, getRecentDealData } from "../api/dealApi";
import { RecentDealData } from "@/components/recent-funds";
import { getCurrentUserID } from "../api/userApi";

// custom hook for deal list
export function useDealList() {
  const [dealList, setDealList] = useState<Deal[]>([]);

  const fetchDealList = async () => {
    // set the state to the deal list of current business user
    setDealList(await getDealList(await getCurrentUserID()));
  }

  useEffect(() => {
    fetchDealList();
  }, []);

  return dealList;
}

export function useGraphData() {
  const [graphData, setGraphData] = useState({});

  const fetchGraphData = async () => {
    // fetch the state to the deal list of current business user
    const dealList = await getDealList(await getCurrentUserID());
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
    // set the state to the deal list of current business user
    setRecentDealData(await getRecentDealData(await getCurrentUserID()));
  }

  useEffect(() => {
    fetchRecentDealData();
  }, []);

  return recentDealData;
}