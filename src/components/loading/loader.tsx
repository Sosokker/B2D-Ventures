import Lottie from "react-lottie";
import * as loadingData from "./loading.json";

const loadingOption = {
  loop: true,
  autoplay: true,
  animationData: loadingData,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

interface LoaderProps {
  isSuccess: boolean;
}

export function Loader(props: LoaderProps) {
  return (
    <>
      {!props.isSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm z-50">
          <Lottie options={loadingOption} height={200} width={200} />
        </div>
      )}
    </>
  );
}
