import React from "react";
import { useAuth } from "@/context/AuthContext";

function WhyDar() {
  const { messages, language } = useAuth();

  return (
    <>
      <section>
        <div
          className="flex items-center justify-center min-h-screen bg-gray-100"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <div className="w-full max-w-screen-xl px-6 mt-10">
            <h2 className="pb-4 mb-6 text-3xl font-semibold text-center text-black border-b w-[350px] mx-auto border-gray-800">
              {messages?.whyDar?.title}
            </h2>

            <ul className="space-y-6">
              {messages?.whyDar?.items?.map(
                (
                  item: { title: string; description: string },
                  index: number
                ) => (
                  <li
                    key={index}
                    className="w-full max-w-screen-lg mx-auto text-black"
                  >
                    <p>
                      <strong>{item?.title}: </strong>
                      {item?.description}
                    </p>
                  </li>
                )
              )}
              <p className="w-full max-w-screen-lg mx-auto text-black mt-4 text-center">
                {messages?.whyDar?.footer}
              </p>
            </ul>

            <div className="mt-32 text-center">
              <p className="text-xl font-normal text-black">
                {messages?.whyDar?.ctaHeader}
              </p>
              <p className="mt-2 text-3xl font-semibold text-gray-600 border-b">
                {messages?.whyDar?.ctaButton}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default WhyDar;
