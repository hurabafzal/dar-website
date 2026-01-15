"use client";
import { useAuth } from "@/context/AuthContext";
import React from "react";
import Button from "../Button/Button";
import { redirect } from "next/navigation";

const AboutUsComponent = () => {
  const { messages, language } = useAuth();

  return (
    <section>
      <div
        className="h-auto sm:h-[800px] flex items-center justify-center p-4 pt-24 sm:p-4"
        style={{
          background: "linear-gradient(to bottom, white 50%, #9dbcbf 50%)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:space-x-9 space-y-9 sm:space-y-0">
          <div className="rounded-xl shadow-md border-[5px] border-[#286d7c]">
            <img
              src="/assets/mobile-hand.png"
              alt="Image 1"
              className="w-[200px] h-[250px] sm:w-[400px] sm:h-[500px] object-cover rounded-md"
            />
          </div>
          <div className="rounded-xl shadow-md border-[5px] border-[#286d7c]">
            <img
              src="/assets/led-screen.png"
              alt="Image 2"
              className="w-[200px] h-[250px] sm:w-[400px] sm:h-[500px] object-cover rounded-md"
            />
          </div>
          <div className="rounded-xl shadow-md border-[5px] border-[#286d7c]">
            <img
              src="/assets/truck.png"
              alt="Image 3"
              className="w-[200px] h-[250px] sm:w-[400px] sm:h-[500px] object-cover rounded-md"
            />
          </div>
        </div>
      </div>
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pt-14"
        dir={language === "ar" ? "rtl" : "ltr"}
      >
        <div className="w-full max-w-screen-xl px-6 mt-10">
          <h2 className="pb-4 mb-6 text-3xl font-semibold text-center text-black border-b w-[350px] mx-auto border-gray-800 poppins-font">
            {messages?.darHistory?.title}
          </h2>
          <p className="pb-4 mb-6 text-2xl font-semibold text-center text-black mx-auto border-gray-800 montserrat-font">
            {messages?.darHistory?.description}
          </p>

          <ul className="space-y-6">
            {messages?.darHistory?.items?.map(
              (item: { description: string }, index: number) => (
                <li key={index} className="w-full mx-auto text-black">
                  <p className="text-xl montserrat-font">{item?.description}</p>
                </li>
              )
            )}
          </ul>
        </div>
        <div className="w-full max-w-screen-xl px-6 mt-10">
          <h2 className="pb-4 mb-6 text-3xl font-semibold text-center text-black border-b w-[350px] mx-auto border-gray-800 poppins-font">
            {messages?.aboutDar?.title}
          </h2>

          <ul className="space-y-6 pb-0">
            {messages?.aboutDar?.items?.map(
              (item: { title: string; description: string }, index: number) => (
                <li key={index} className="w-full mx-auto text-black">
                  <p className="text-xl montserrat-font">
                    <strong>{item?.title}: </strong>
                    {item?.description}
                  </p>
                </li>
              )
            )}
            <p className="w-full mx-auto text-black mt-4 text-center text-xl montserrat-font pb-20">
              {messages?.whyDar?.footer}
            </p>
          </ul>
        </div>
        <div className="w-full max-w-screen-xl px-6 mt-10">
          <h2 className="pb-4 mb-6 text-3xl font-semibold text-center text-black border-b w-[350px] mx-auto border-gray-800 poppins-font">
            {messages?.darPrinciples?.title}
          </h2>

          <ul className="space-y-6 pb-0">
            {messages?.darPrinciples?.items?.map(
              (item: { title: string; description: string }, index: number) => (
                <li key={index} className="w-full mx-auto text-black">
                  <p className="text-xl montserrat-font">
                    <strong>{item?.title}: </strong>
                    {item?.description}
                  </p>
                </li>
              )
            )}
            <p className="w-full mx-auto text-black mt-4 text-center text-xl montserrat-font pb-20">
              {messages?.whyDar?.footer}
            </p>
          </ul>
        </div>
      </div>
      <div className="h-auto flex items-start justify-center py-16">
        <div className="flex flex-col sm:flex-row sm:space-x-16 space-y-8 sm:space-y-0">
          <div>
            <div className="w-[270px] h-[210px] sm:w-[300px] sm:h-[310px] rounded-3xl shadow-md border-[5px] border-[#286d7c]">
              <img
                src="/assets/4 2.png"
                alt="Image 1"
                className="w-[270px] h-[200px] sm:w-[300px] sm:h-[300px] object-cover rounded-2xl"
              />
            </div>
            <h1 className="flex justify-center text-lg mt-2 montserrat-font font-bold">
              IT Department
            </h1>
          </div>
          <div>
            <div className="w-[270px] h-[210px] sm:w-[300px] sm:h-[310px] rounded-3xl shadow-md border-[5px] border-[#286d7c]">
              <img
                src="/assets/3 2.png"
                alt="Image 2"
                className="w-[270px] h-[200px] sm:w-[300px] sm:h-[300px] object-cover rounded-2xl"
              />
            </div>
            <h1 className="flex justify-center text-lg mt-2 montserrat-font font-bold">
              Design Department
            </h1>
          </div>
          <div>
            <div className="w-[270px] h-[210px] sm:w-[300px] sm:h-[310px] rounded-3xl shadow-md border-[5px] border-[#286d7c]">
              <img
                src="/assets/2 2.png"
                alt="Image 3"
                className="w-[270px] h-[200px] sm:w-[300px] sm:h-[300px] object-cover rounded-2xl"
              />
            </div>
            <h1 className="flex justify-center text-lg mt-2 montserrat-font font-bold">
              Public Relations Department
            </h1>
          </div>
          <div>
            <div className="w-[270px] h-[210px] sm:w-[300px] sm:h-[310px] rounded-3xl shadow-md border-[5px] border-[#286d7c]">
              <img
                src="/assets/1 2.png"
                alt="Image 4"
                className="w-[270px] h-[200px] sm:w-[300px] sm:h-[300px] object-cover rounded-2xl"
              />
            </div>
            <h1 className="flex justify-center text-lg mt-2 montserrat-font font-bold">
              Management
            </h1>
          </div>
        </div>
      </div>
      {/* <div className="flex items-center justify-center">
        <Button
          className="w-60 h-12 mb-20"
          text={messages?.aboutUs?.ourLocation}
          onClick={() => redirect("/appointment")}
        />
      </div> */}
    </section>
  );
};

export default AboutUsComponent;
