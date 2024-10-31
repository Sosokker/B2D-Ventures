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
    <div className="fixed inset-0 flex items-center justify-centerbg-black mt-10">
      <Lottie options={alertOption} height={"80%"} width={"50%"} />
    </div>
  );
}
