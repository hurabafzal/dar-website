"use client";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Button from "../Button/Button";
import axios from "axios";

const CatalogPage = () => {
  const { messages, language } = useAuth();
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

  const departments = [
    { id: 1, img: "/assets/6.png", title: "Master bedroom" },
    { id: 2, img: "/assets/4.png", title: "Kids bedroom" },
    { id: 3, img: "/assets/7.png", title: "Living area" },
    { id: 4, img: "/assets/3 copy.png", title: "Kitchen" },
    { id: 5, img: "/assets/5.png", title: "Diwaniya" },
    { id: 6, img: "/assets/2.png", title: "Play room" },
    { id: 7, img: "/assets/1.png", title: "Full house" },
    { id: 8, img: "/assets/3.png", title: "Shops" },
  ];

  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{
        background: "linear-gradient(to bottom, white 50%, #9dbcbf 50%)",
      }}
    >
      {/* <div className="flex items-center justify-center"> */}
      <div className="md:grid md:grid-cols-3 md:gap-44 flex flex-col">
        <div className="flex items-center space-x-4 md:mt-40 mt-28">
          <Button
            className="w-64 h-14 text-xl font-bold flex items-center justify-center"
            text={messages?.catalog?.old}
          />
          <Button
            className="w-24 h-14 text-5xl font-bold flex items-center justify-center"
            text={counts.completedCount.toString()}
          />
        </div>
        <div className="flex items-center space-x-4 md:mt-40 mt-5">
          <Button
            className="w-64 h-14 text-xl font-bold flex items-center justify-center"
            text={messages?.catalog?.current}
          />
          <Button
            className="w-24 h-14 text-5xl font-bold flex items-center justify-center"
            text={counts.readyToDeliverCount.toString()}
          />
        </div>
        <div className="flex items-center space-x-4 md:mt-40 mt-5">
          <Button
            className="w-64 h-14 text-xl font-bold flex items-center justify-center"
            text={messages?.catalog?.awaitingDelivery}
          />
          <Button
            className="w-24 h-14 text-5xl font-bold flex items-center justify-center"
            text={counts.pendingCount.toString()}
          />
        </div>
      </div>

      <div className="relative w-full h-auto flex items-center justify-center py-16">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-0 z-20 bg-[#286d7c] text-white rounded-full md:w-12 md:h-12 w-8 h-8 flex items-center justify-center -translate-y-1/2 top-1/2 md:ml-5 ml-3"
        >
          &#8592;
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-0 z-20 bg-[#286d7c] text-white rounded-full md:w-12 md:h-12 w-8 h-8 flex items-center justify-center -translate-y-1/2 top-1/2 md:mr-5 mr-3"
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
            1024: { slidesPerView: 4 },
          }}
          navigation={false}
          modules={[Navigation]}
          className="w-[70%] md:w-[90%] px-4 mt-14"
        >
          {departments.map((dept) => (
            <SwiperSlide
              key={dept.id}
              className="flex flex-col items-center justify-center space-y-4"
            >
              <div className="rounded-3xl shadow-md border-[5px] border-[#286d7c] w-[210px] h-[210px] sm:w-[310px] sm:h-[310px] mx-auto">
                <img
                  src={dept.img}
                  alt={dept.title}
                  className="object-cover rounded-2xl sm:w-[300px] sm:h-[300px] w-[200px] h-[200px]"
                />
              </div>
              <h1 className="text-lg font-bold montserrat-font text-center">
                {dept.title}
              </h1>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-8 sm:space-y-0 mb-16">
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
  );
};

export default CatalogPage;
