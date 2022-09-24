import React from "react";

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <div className="w-full  relative min-h-screen">
        <div className="py-24 px-5">
          <h1 className="text-primary text-7xl font-extrabold">Card-32</h1>
          <p className="text-gray-200 text-lg mt-2 ml-2">
            A simple card game. Create room with <br /> a room ID and username
            and invite others to play.
          </p>
          <button className="mt-12 btn-primary h-14 w-32 bg-rose-600 text-lg">
            Play Now!
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
