import Lottie from "react-lottie";
import * as loadingData from "./loading.json";
import * as successData from "./success.json";

const loadingOption = {
  loop: true,
  autoplay: true,
  animationData: loadingData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};
const successOption = {
  loop: false,
  autoplay: true,
  animationData: successData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

interface LoaderProps {
  isSuccess: boolean;
}

export function Loader(props: LoaderProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm z-50">
      {!props.isSuccess && (
        <Lottie options={loadingOption} height={200} width={200} />
      )}
      {/* {!props.isSuccess ? (
        <Lottie options={loadingOption} height={200} width={200} />
      ) : (
        <Lottie options={successOption} height={200} width={200} />
      )} */}
    </div>
  );
}
