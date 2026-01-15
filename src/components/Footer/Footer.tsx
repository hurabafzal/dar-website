import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faSnapchatGhost,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import logoImage from "../../../public/assets/dar-logo.png";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Button from "../Button/Button";
import { redirect } from "next/dist/server/api-utils";

function Footer() {
  const { messages } = useAuth();

  return (
    <footer className="bg-[#ebebeb] py-12 shadow-lg">
      <div className="container mx-auto px-6 md:px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between space-y-12 md:space-y-0 md:space-x-12">
          {/* Logo and Social Links */}
          <div className="flex flex-col items-center space-y-6 md:items-start">
            <Image
              src={logoImage}
              alt="Logo"
              className="h-16 mb-4 w-40 mx-auto"
            />
            <Button
              className="w-64 h-12 text-lg mx-auto"
              text={messages?.footer?.sendYourCv}
            />
            <Button
              className="w-auto h-12 text-lg"
              text={messages?.footer?.stayUpdated}
            />
            <div className="flex space-x-6 text-gray-700 mx-auto">
              <a
                href="#"
                className="hover:text-[#286d7c] transition duration-300"
              >
                <FontAwesomeIcon icon={faFacebookF} className="text-2xl" />
              </a>
              <a
                href="#"
                className="hover:text-[#286d7c] transition duration-300"
              >
                <FontAwesomeIcon icon={faInstagram} className="text-2xl" />
              </a>
              <a
                href="#"
                className="hover:text-[#286d7c] transition duration-300"
              >
                <FontAwesomeIcon icon={faSnapchatGhost} className="text-2xl" />
              </a>
              <a
                href="#"
                className="hover:text-[#286d7c] transition duration-300"
              >
                <FontAwesomeIcon icon={faTwitter} className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center md:ml-24">
              <Button
                className="w-60 h-12 mb-12"
                text={messages?.aboutUs?.ourLocation}
              />
            </div>
            <div className="flex flex-col md:flex-row gap-12 justify-center space-y-12 md:space-y-0 md:ml-24">
              <div className="rounded-3xl shadow-md border-[5px] border-[#286d7c] w-[270px] h-[210px] sm:w-[200px] sm:h-[180px]">
                <img
                  src="/assets/1 copy 2.png"
                  alt="Image 4"
                  className="w-[270px] h-[200px] sm:w-[200px] sm:h-[170px] object-cover rounded-2xl"
                />
              </div>
              <div className="rounded-3xl shadow-md border-[5px] border-[#286d7c] w-[270px] h-[210px] sm:w-[200px] sm:h-[180px]">
                <img
                  src="/assets/2 copy 2.png"
                  alt="Image 4"
                  className="w-[270px] h-[200px] sm:w-[200px] sm:h-[170px] object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 md:gap-16">
            <div>
              <h5 className="mb-4 text-lg font-semibold text-gray-900">
                {messages?.footer?.company}
              </h5>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.aboutUs}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.missionAndVision}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.ourLocation}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.ourTeam}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.privacyPolicy}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 text-lg font-semibold text-gray-900">
                {messages?.footer?.explore}
              </h5>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.faq}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.careers}
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="mb-4 text-lg font-semibold text-gray-900">
                {messages?.footer?.quickLinks}
              </h5>
              <ul className="space-y-3 text-gray-700">
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.bookAppointment}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.contactUs}
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-[#286d7c] transition duration-300"
                  >
                    {messages?.footer?.helpCenter}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 mt-10 text-center">
          <p className="text-sm font-medium text-gray-700">
            {messages?.footer?.rightsReserved}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
