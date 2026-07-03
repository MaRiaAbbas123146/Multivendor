import Lottie from "lottie-react";
import animationData from "../../assets/Animation - 1770915824291.json";

const Loader = () => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      {animationData && (
        <Lottie
          animationData={animationData}
          loop={false}
          autoplay={true}
          style={{ width: 300, height: 300 }}
        />
      )}
    </div>
  );
};

export default Loader;