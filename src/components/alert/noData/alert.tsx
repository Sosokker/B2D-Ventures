"use client";
import Lottie from "react-lottie";
import * as alertData from "./alert.json";

const alertOption = {
  loop: true,
  autoplay: true,
  animationData: alertData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export function NoDataAlert() {
  return (
    <Lottie options={alertOption} height={"200"} width={"200"} />
  );
}
