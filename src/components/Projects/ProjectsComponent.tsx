"use client";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import Button from "../Button/Button";
import { useAuth } from "@/context/AuthContext";
import { redirect } from "next/navigation";
import axios from "axios";

const ProjectsComponent = () => {
  const { messages } = useAuth();
  const swiperRef = useRef<any>(null);
  const [counts, setCounts] = useState({
    completedCount: 0,
    readyToDeliverCount: 0,
    pendingCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}orders/get-projects-count`
        );
        const data = await response.data;
        setCounts({
          completedCount: data.completedCount,
          readyToDeliverCount: data.readyToDeliverCount,
          pendingCount: data.pendingCount,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const cards = [
    {
      id: 1,
      count: counts.completedCount + 300,
      label: messages?.catalog?.delivered,
    },
    {
      id: 2,
      count: counts.readyToDeliverCount + 20,
      label: messages?.catalog?.current,
    },
    {
      id: 3,
      count: counts.pendingCount + 10,
      label: messages?.catalog?.awaitingDelivery,
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-center">
        <Button
          className="w-64 h-14 mt-40 text-2xl font-bold"
          text={messages?.projects?.projectsCount}
        />
      </div>
      <div
        className="flex justify-center"
        style={{
          background: "linear-gradient(to bottom, white 50%, #9dbcbf 50%)",
        }}
      >
        <div className="flex flex-col items-center w-full">
          {/* Conditional Layout */}
          <div className="my-16 w-full">
            {/* Slider for small screens with navigation */}
            <div className="block sm:hidden relative">
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="absolute left-0 z-20 bg-[#286d7c] text-white rounded-full w-10 h-10 flex items-center justify-center top-1/2 -translate-y-1/2 ml-3"
              >
                &#8592;
              </button>
              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="absolute right-0 z-20 bg-[#286d7c] text-white rounded-full w-10 h-10 flex items-center justify-center top-1/2 -translate-y-1/2 mr-3"
              >
                &#8594;
              </button>
              <Swiper
                onSwiper={(swiper) => {
                  swiperRef.current = swiper;
                }}
                slidesPerView={1}
                spaceBetween={16}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
                navigation={false}
                modules={[Navigation]}
                className="w-full"
              >
                {cards.map((card) => (
                  <SwiperSlide key={card.id} className="flex justify-center">
                    <div className="rounded-2xl shadow-md border-[5px] border-[#286d7c] w-60 mx-auto h-72">
                      {" "}
                      {/* Reduced width */}
                      <div className="object-cover rounded-md bg-[#286d7c] p-4 w-full h-full">
                        {" "}
                        {/* Reduced padding */}
                        <div className="flex flex-col items-center justify-center space-y-3">
                          {" "}
                          {/* Reduced spacing */}
                          <div className="text-white text-6xl font-bold border-[8px] border-white rounded-full py-8 px-2 flex min-w-48 h-48">
                            {" "}
                            {/* Reduced font size, padding, and border size */}
                            <h1 className="mx-auto my-auto">{card.count}</h1>
                          </div>
                          <h1 className="text-white text-lg font-bold">
                            {" "}
                            {/* Reduced font size */}
                            {card.label}
                          </h1>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Grid for larger screens */}
            <div className="hidden sm:flex flex-col sm:flex-row sm:space-x-9 my-16 space-y-9 sm:space-y-0 justify-center">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="rounded-3xl shadow-md border-[5px] border-[#286d7c] w-80"
                >
                  <div className="object-cover rounded-md bg-[#286d7c] p-5 w-full">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="text-white text-9xl font-bold border-[10px] border-white rounded-full py-12 px-2 flex min-w-64">
                        <h1 className="mx-auto">{card.count}</h1>
                      </div>
                      <h1 className="text-white text-2xl font-bold">
                        {card.label}
                      </h1>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-8 sm:space-y-0 mb-16">
            <Button
              className="w-64 h-12 text-lg"
              text={messages?.projects?.darCatalogs}
              onClick={() => redirect("/catalog")}
            />
            <Button
              className="w-64 h-12 text-lg"
              text={messages?.projects?.darTeam}
              onClick={() => redirect("/about-us")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsComponent;
