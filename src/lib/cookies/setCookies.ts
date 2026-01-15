"use server";
import { cookies } from "next/headers";

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("jwt", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function setLanguageCookie(lan: string) {
  const cookieStore = await cookies();
  cookieStore.set("language", lan, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function getAuthCookie(name: string) {
  const cookieStore = await cookies();
  return cookieStore.get(name);
}
