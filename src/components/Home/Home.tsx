"use client";
import React, { useEffect, useState } from "react";
// import pic1 from "../../assets/box1.jpg";
// import pic2 from "../../assets/box2.jpg";
// import pic3 from "../../assets/box3.png";
// import pic4 from "../../assets/box4.jpg";
import WhyDar from "../WhyDar/WhyDar";
import Button from "../Button/Button";
// import videoFile from "../../assets/Dar.mp4"
import { redirect } from "next/navigation";
import { getUserData } from "@/helpers/jwtHelper";
import Login from "../login/login";
import darHome from "../../../public/assets/Musharik.png";
import AuthModal from "../authModal";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

function Home() {
  const [user, setUser] = useState({ sub: "" });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { messages } = useAuth();

  useEffect(() => {
    getUserData().then((res: any) => setUser(res));
  }, []);

  const handleRedirect = (userId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const threeJsAppUrl = `https://cabinet-system.vercel.app/?userid=${encodeURIComponent(
      userId
    )}`;
    window.location.href = threeJsAppUrl;
  };

  return (
    <>
      <div className="bg-[#9dbcbf] min-h-screen">
        <div className="flex flex-col items-center justify-center w-full space-y-5 pt-24">
          <Image
            src={darHome}
            alt="Home Image"
            className="object-cover w-[91%] h-[35%] md:w-[90%] md:h-[65%]"
          />
          <div className="container flex flex-col md:flex-row justify-between px-5 space-x-8">
            <div className="flex flex-col items-center md:items-start justify-center space-y-2 w-full md:w-fit">
              <Button
                className="w-60 h-12"
                text={messages?.home?.bookMeasurements}
                onClick={() => redirect("/appointment")}
              />
              <Button
                className="w-60 h-12"
                text={messages?.home?.bookDarCrew}
              />
              {user && (
                <Button
                  className="w-60 h-12"
                  text={messages?.home?.trackYourOrder}
                  onClick={() => redirect("/order-tracking")}
                />
              )}
            </div>
            <div className="flex-1 flex items-center justify-center w-full">
              <img
                src="/assets/multi.png"
                alt="Image 4"
                className="w-[340px] h-[100px] sm:w-[400px] sm:h-[100px] object-cover rounded-2xl mx-auto mobile:ml-0 mobile:my-14 mobile:mr-14"
              />
            </div>
            <div
              className="bg-[#286d7c] flex items-center justify-center flex-1 mobile:w-64 cursor-pointer"
              onClick={() => handleRedirect(user?.sub)}
            >
              {/* <button className="md:w-60 md:h-12 mobile:w-36 mobile:h-4"> */}
              <img
                className="text-white mobile:h-40 mobile:w-80"
                src="/assets/noun-cabinet-7017453.svg"
                alt="Technology"
              />
              {/* </button> */}
              <h1 className="dar-design-head mr-10 md:text-5xl mobile:text-2xl my-auto">
                {messages?.home?.darDesign}
              </h1>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center sm:space-x-8 space-y-8 sm:space-y-0 bg-[#9dbcbf] md:pt-32 pt-5 pb-20 mobile:mt-10">
            <Button
              className="w-64 h-12 text-lg"
              text={messages?.projects?.darCatalogs}
              onClick={() => redirect("/catalog")}
            />
            <Button
              className="w-64 h-12 text-lg"
              text={messages?.projects?.darProjects}
              onClick={() => redirect("/projects")}
            />
            <Button
              className="w-64 h-12 text-lg"
              text={messages?.projects?.darTeam}
              onClick={() => redirect("/about-us")}
            />
          </div>
        </div>
      </div>

      <WhyDar />
      <section className="py-10 bg-gray-100">
        <div className="flex flex-col items-center gap-10 px-6">
          <div className="grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
              <img
                src="/assets/box1.jpg"
                alt="IT"
                className="object-cover w-full h-48 rounded-t-lg"
              />
              <p className="mt-2 text-lg font-semibold text-center text-gray-700">
                {messages?.home?.it}
              </p>
            </div>

            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
              <img
                src="/assets/box2.jpg"
                alt="Designer"
                className="object-cover w-full h-48 rounded-t-lg"
              />
              <p className="mt-2 text-lg font-semibold text-center text-gray-700">
                {messages?.home?.designer}
              </p>
            </div>

            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
              <img
                src="/assets/box3.png"
                alt="Technology"
                className="object-cover w-full h-48 rounded-t-lg"
              />
              <p className="mt-2 text-lg font-semibold text-center text-gray-700">
                {messages?.home?.technology}
              </p>
            </div>

            <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
              <img
                src="/assets/box4.jpg"
                alt="Management"
                className="object-cover w-full h-48 rounded-t-lg"
              />
              <p className="mt-2 text-lg font-semibold text-center text-gray-700">
                {messages?.home?.management}
              </p>
            </div>
          </div>
          <Button text={messages?.home?.cv} />
        </div>
      </section>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialView={"signup"}
      ></AuthModal>
    </>
  );
}

export default Home;
