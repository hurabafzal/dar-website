"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "next/navigation";
import Loader from "../Loader/Loader";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "../ui/input";
import { SquarePercent } from "lucide-react";

interface LineItem {
  itemId: string;
  amount: string;
  price: string;
  quantity: string;
  description: string;
  name: string;
}

interface OrderPayload {
  invoiceDate: string;
  status: string;
  customerId: string;
  paymentTerms: string;
  items: LineItem[];
  grossAmount: string;
  discount: string;
  totalAmount: string;
  comments: string;
  invoiceType: string;
  userType: string;
  measurementDescription: string;
  measurementId: string | null;
}

const TermsAndConditionsPage = () => {
  const searchParams = useSearchParams();
  const designId = searchParams.get("designId");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [discountCode, setDiscountCode] = useState({ name: "", discount: 0 });
  const [totalPrice, setTotalPrice] = useState(0);
  const [designData, setDesignData] = useState({
    name: "",
    measurment: "",
    measurementDate: "",
    comments: "",
    createdAt: "",
    lineItems: [{}],
    customerId: "",
  });

  useEffect(() => {
    if (searchParams) {
      axios
        .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}measurements/${designId}`)
        .then((res) => setDesignData(res.data));
    }
  }, [searchParams]);

  useEffect(() => {
    calculateTotal(designData?.lineItems);
  }, [designData, discountCode]);

  const calculateTotal = (items: any) => {
    let total = items.reduce((acc: any, curr: any) => {
      return acc + curr?.price;
    }, 0);

    total = total - (total * discountCode.discount) / 100;
    setTotalPrice(total);
  };

  const terms = `
  1. Payment Terms
  80% Payment: Customers are required to pay 80% of the total price through the system upon finalizing
  their design and proceeding to payment.
  20% Payment: The remaining 20% must be paid on the delivery day before final handover.

  2. Cancellations and Refunds
  Cancellations:
  Cancellations are not allowed after payment has been processed due to the immediate purchase of
  materials.
  Customers must confirm their designs and materials before proceeding to payment to avoid errors.
  Refunds:
  Refunds will not be issued once payment has been made.

  3. Changes and Additions
  Any additional items or design changes requested after the initial confirmation will be handled separately
  through customer service.
  Additional costs incurred due to changes will be communicated and must be approved by the customer
  before proceeding.

  4. Materials and Stock Availability
  DAR reserves the right to inform customers if selected materials are unavailable due to supplier
  constraints or stock issues.
  In such cases, customers will be contacted promptly, and alternative options will be provided for approval
  before production.

  5. Project Timeline
  Estimated timelines for design, production, and delivery will be provided upon payment.
  Delays caused by unforeseen circumstances, including supplier issues or logistics, will be communicated
  to customers promptly.

  6. Liability
  DAR is committed to delivering high-quality designs and materials. However, DAR is not liable for
  damages caused by:
  Misuse or improper handling of delivered items.
  Delays caused by events outside DAR's control (e.g., natural disasters, supplier delays).

  7. Legal Jurisdiction
  These terms and conditions are governed by the laws of the State of Kuwait.
  Any disputes arising from these terms will be resolved in Kuwait courts.

  8. Physical Contract
  A physical contract containing these terms will be sent to customers after payment.
  Customers must sign and return the contract before production begins.

  9. Customer Responsibilities
  Customers are responsible for ensuring that the dimensions and materials selected during the design
  process meet their requirements.
  Customers are required to review their final design thoroughly before proceeding to payment.

  10. DAR Express Service (Optional)
  Customers can opt for DAR Express Service for expedited production and delivery at an additional cost of
  25% of the total price.
  `;

  const createInvoice = async (
    formData: OrderPayload
  ): Promise<{ data: any; status: number }> => {
    const response = await axios.post<any>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}orders`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return {
      data: response.data,
      status: response.status,
    };
  };

  const ApplyDiscount = (name: string | null) => {
    if (discountCode.name !== "") {
      axios
        .get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}discount-code/by-name/${name}`
        )
        .then((res) => {
          setDiscountCode(res.data);
          toast("Discount has been applied successfully", {
            className: "success-toast",
          });
        })
        .catch((error) => {
          toast("Invalid Discount Code", {
            className: "error-toast",
          });
        });
    } else {
      setDiscountCode({ name: "", discount: 0 });
      calculateTotal(designData?.lineItems);
    }
  };

  const handleProceed = async () => {
    if (isAgreed) {
      try {
        setIsLoading(true);

        const lineItems = designData.lineItems.map((val: any) => ({
          itemId: "6775a2dbbba341b28a767db1",
          amount: val.price.toString(),
          price: val.price.toString(),
          quantity: "1",
          description: val.description,
          name: val.name,
          item: val.name,
          status: "PENDING",
        }));

        const grossAmount = lineItems.reduce(
          (total, item) => total + parseFloat(item.price),
          0
        );
        const discountedPrice = 0;
        const orderPayload: OrderPayload = {
          invoiceDate: designData.createdAt,
          status: "SAVED",
          customerId: designData.customerId,
          paymentTerms: "80-20",
          items: lineItems,
          grossAmount: grossAmount.toString(),
          discount: (discountedPrice > 0 ? discountedPrice : 0).toString(),
          totalAmount: (
            grossAmount - (discountedPrice > 0 ? discountedPrice : 0)
          ).toString(),
          comments: designData.comments,
          invoiceType: "Design",
          userType: "Customer",
          measurementDescription: designData.measurment,
          measurementId: designId,
        };

        const chargePayload = {
          amount: totalPrice * 0.8,
          customerId: designData.customerId,
          designId: designId,
        };

        const chargeResponse = await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}invoices/create-charge`,
          chargePayload
        );

        const invoiceResult = await createInvoice(orderPayload);

        if (invoiceResult.status === 201) {
          // await axios.post(
          //   `${process.env.NEXT_PUBLIC_BACKEND_URL}invoices/send-sms`,
          //   {
          //     customerId: designData.customerId,
          //     amount: chargeResponse.data.amount,
          //     chargeUrl: chargeResponse.data.transaction.url,
          //   }
          // );

          window.location.href = chargeResponse.data.transaction.url;
          toast("Invoice has been sent to you by SMS", {
            className: "success-toast",
          });
        }
      } catch (error) {
        console.error("Error in handlePayment:", error);
        toast("An error occurred while processing the payment", {
          className: "error-toast",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="p-24 flex justify-center">
      <div className="w-[70%]">
        {isLoading && <Loader />}
        <div className="text-3xl font-semibold mb-5">Terms and Conditions</div>
        <div className="overflow-y-auto max-h-[400px] text-sm text-gray-700 whitespace-pre-wrap border p-4 rounded-md mb-5">
          {terms}
        </div>
        <div className="flex items-center mb-5 space-x-2">
          <Checkbox
            id="terms-checkbox"
            checked={isAgreed}
            onCheckedChange={(value) => setIsAgreed(value as any)}
          />
          <label htmlFor="terms-checkbox" className="text-sm text-gray-700">
            I agree to the Terms and Conditions
          </label>
        </div>
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <div className="flex w-full items-center space-x-2">
              <Input
                className="w-52"
                value={discountCode.name as any}
                onChange={(e) =>
                  setDiscountCode((prev) => ({
                    ...prev,
                    name: e.target.value as any,
                  }))
                }
                type="text"
                placeholder="Discount Code"
              />
              <Button
                className="w-24 m-10"
                onClick={() => ApplyDiscount(discountCode.name)}
              >
                <SquarePercent /> Apply
              </Button>
            </div>
            <Button
              onClick={handleProceed}
              disabled={!isAgreed}
              className={`${!isAgreed ? "cursor-not-allowed opacity-50" : ""}`}
            >
              Proceed to Payment
            </Button>
          </div>
          <h1 className="m-10 font-bold poppins-font text-xl">
            Total Price : {totalPrice} KD
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
