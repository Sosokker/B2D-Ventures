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

export function UnAuthorizedAlert() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black mt-24 z-50">
      <Lottie options={alertOption} style={{ width: "50%", height: "auto" }} />
    </div>
  );
}
