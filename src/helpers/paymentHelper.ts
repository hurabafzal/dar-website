"use server";

import axios from "axios";
import { redirect } from "next/navigation";

const headers = {
  accept: "application/json",
  "content-type": "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TAP_PUBLIC_KEY}`,
};

export const makePayment = async (user: any) => {
  const url = "https://api.tap.company/v2/charges/";
  const payload = {
    amount: 10,
    currency: "KWD",
    customer_initiated: true,
    threeDSecure: true,
    save_card: false,
    description: "Test Description",
    metadata: { udf1: "Metadata 1" },
    receipt: { email: false, sms: false },
    reference: { transaction: "txn_01", order: "ord_01" },
    customer: {
      first_name: user?.userName,
      middle_name: user?.userName,
      last_name: user?.userNamee || "",
      email: user?.email || "test@test.com",
      phone: user?.phone,
    },
    merchant: { id: "1234" },
    source: { id: "src_all" },
    redirect: { url: "https://dar-kuwait.com/home" },
  };
  const res = await axios.post(url, payload, {
    headers,
  });

  if (res.data) {
    redirect(res.data.transaction.url);
  }
};

export const checkPaymentStatus = async (tapId: string) => {
  const url = `https://api.tap.company/v2/charges/${tapId}`;
  const res = await axios.get(url, {
    headers,
  });

  if (res.data) {
    return res.data.status
  }
};
