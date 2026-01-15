"use server";
import { jwtVerify } from "jose";
import { deleteCookie, getCookie } from "cookies-next/server";
import { cookies } from "next/headers";

export const getUserData = async () => {
  try {
    const token: string = (await getCookie("jwt", { cookies })) as any;
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload: decoded } = await jwtVerify(token, secret);

    return decoded;
  } catch (error) {
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await deleteCookie("jwt", { cookies });
  } catch (error) {
    console.error("Error deleting JWT cookie:", error);
    return { success: false, message: "Failed to delete JWT cookie" };
  }
};
