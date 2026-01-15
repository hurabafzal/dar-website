"use client";
import { Coins, SquarePercent } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { Input } from "../ui/input";
import Loader from "../Loader/Loader";
import { useRouter } from "next/navigation";

type CardProps = React.ComponentProps<typeof Card>;

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

const DesignDetails = ({ className, ...props }: CardProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [designId, setDesignId] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [discountCode, setDiscountCode] = useState({ name: "", discount: 0 });
  const [isLoading, setIsLoading] = useState(false);
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
      const designId = searchParams.get("designId");
      setDesignId(designId as any);
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

  const createInvoice = async (
    formData: OrderPayload
  ): Promise<{ data: any; status: number }> => {
    const response = await axios.post<any>(`${process.env.NEXT_PUBLIC_BACKEND_URL}orders`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return {
      data: response.data,
      status: response.status,
    };
  };

  const handlePayment = async (amount: number, customerId: string) => {
    try {
      setIsLoading(true)
      const chargePayload = {
        amount,
        customerId,
      };

      const lineItems = designData.lineItems.map((val: any) => ({
        itemId: "6775a2dbbba341b28a767db1",
        amount: val.price.toString(),
        price: val.price.toString(),
        quantity: "1",
        description: val.description,
        name: val.name,
        item: val.name,
        status: "PENDING"
      }));

      const grossAmount = lineItems.reduce((total, item) => total + parseFloat(item.price), 0);
      const discountedPrice = ((grossAmount * discountCode.discount) / 100);
      const orderPayload: OrderPayload = {
        invoiceDate: designData.createdAt,
        status: "SAVED",
        customerId: designData.customerId,
        paymentTerms: "80-20",
        items: lineItems,
        grossAmount: grossAmount.toString(),
        discount: (discountedPrice > 0 ? discountedPrice : 0).toString(),
        totalAmount: (grossAmount - (discountedPrice > 0 ? discountedPrice : 0)).toString(),
        comments: designData.comments,
        invoiceType: "Design",
        userType: "Customer",
        measurementDescription: designData.measurment,
        measurementId: designId,
      };

      const chargeResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}invoices/create-charge`,
        chargePayload
      );

      const invoiceResult = await createInvoice(orderPayload);

      if (invoiceResult.status === 201) {
        await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}invoices/send-sms`, {
          customerId,
          amount: chargeResponse.data.amount,
          chargeUrl: chargeResponse.data.transaction.url,
        });

        window.open(chargeResponse.data.transaction.url, '_blank')
        toast("Invoice has been sent to you by SMS", {
          className: "success-toast",
        });
        router.push("/home");
      }

    } catch (error) {
      console.error("Error in handlePayment:", error);
      toast("An error occurred while processing the payment", {
        className: "error-toast",
      });
    } finally {
      setIsLoading(false);
    }
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

  return designId ? (
    <div className="mt-[70px]">
      {isLoading && <Loader />}
      <div className="bg-gray-50">
        <div className="container mx-auto">
          <h1 className="font-bold text-[28px] my-account-head pt-5 pb-5 mobile:ml-8">
            Design Details
          </h1>
        </div>
      </div>
      <div className="container md:mx-auto mt-5 mb-10 mobile:ml-8">
        <Card className={cn("w-auto", className)} {...props}>
          <CardHeader></CardHeader>
          <CardContent className="justify-start">
            <div className="grid grid-cols-4 w-full">
              <div className="flex flex-col items-start p-10 pt-0 pl-2 col-span-2 border border-y-0 border-l-0 border-r-slate-400 md:mr-10">
                <h1 className="poppins-font font-bold text-3xl pb-5">
                  Your latest design data
                </h1>
                <div className="flex flex-col justify-start items-start space-x-4 pt-8 pb-2 border-b-2 w-full">
                  <h1 className="order-card-head font-bold text-xl">Name:</h1>
                  <span className="order-card-head text-lg mt-1">
                    {designData?.name}
                  </span>
                </div>
                <div className="flex flex-col justify-start items-start space-x-4 pt-8 pb-2 border-b-2 w-full">
                  <h1 className="order-card-head font-bold text-xl">
                    Measurement:
                  </h1>
                  <span className="order-card-head text-lg mt-1">
                    {designData?.measurment}
                  </span>
                </div>
                <div className="flex flex-col justify-start items-start space-x-4 pt-8 pb-2 border-b-2 w-full">
                  <h1 className="order-card-head font-bold text-xl">Date:</h1>
                  <span className="order-card-head text-lg mt-1">
                    {designData?.measurementDate}
                  </span>
                </div>
                <div className="flex flex-col justify-start items-start space-x-4 pt-8 pb-2 border-b-2 w-full">
                  <h1 className="order-card-head font-bold text-xl">
                    Comments:
                  </h1>
                  <span className="order-card-head text-lg mt-1">
                    {designData?.comments}
                  </span>
                </div>
                <div className="flex flex-col justify-start items-start space-x-4 pt-8 pb-2 border-b-2 w-full">
                  <h1 className="order-card-head font-bold text-xl">
                    Created At:
                  </h1>
                  <span className="order-card-head text-lg mt-1">
                    {designData?.createdAt}
                  </span>
                </div>
              </div>
              <div className="poppins-font text-3xl p-10 pt-0 pl-2 pb-5">
                <div className="flex flex-col items-start p-4 pt-0 col-span-2">
                  <h1 className="poppins-font font-bold text-3xl pb-5">
                    Models
                  </h1>
                  <div className="overflow-y-auto overflow-x-hidden max-h-[550px] w-full">
                    {designData?.lineItems?.map((item: any) => {
                      return (
                        <div key={item?._id}>
                          <div className="flex flex-col justify-start items-start space-x-4 pt-8 pb-2 border-b-2 w-full">
                            <h1 className="order-card-head font-bold text-xl">
                              Frame:
                            </h1>
                            <div className="flex justify-between w-full">
                              <span className="order-card-head text-lg mt-1">
                                {item?.frame?.material}
                              </span>
                              <span className="order-card-head text-lg mt-1 mr-5">
                                {item?.frame?.Price} KD
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col justify-start items-start space-x-4 pt-8 pb-2 border-b-2 w-full">
                            <h1 className="order-card-head font-bold text-xl">
                              Door:
                            </h1>
                            <div className="flex justify-between w-full">
                              <span className="order-card-head text-lg mt-1">
                                {item?.door?.material}
                              </span>
                              <span className="order-card-head text-lg mt-1 mr-5">
                                {item?.door?.Price} KD
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col justify-start items-start space-x-4 pt-8 pb-2 border-b-2 w-full">
                            <h1 className="order-card-head font-bold text-xl">
                              Drawer:
                            </h1>
                            <div className="flex justify-between w-full">
                              <span className="order-card-head text-lg mt-1">
                                {item?.drawer?.material}
                              </span>
                              <span className="order-card-head text-lg mt-1 mr-5">
                                {item?.drawer?.Price} KD
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col justify-start items-start space-x-4 pt-8 pb-2 border-b-2 w-full">
                            <h1 className="order-card-head font-bold text-xl">
                              Shelf:
                            </h1>
                            <div className="flex justify-between w-full">
                              <span className="order-card-head text-lg mt-1">
                                {item?.shelf?.material}
                              </span>
                              <span className="order-card-head text-lg mt-1 mr-5">
                                {item?.shelf?.Price} KD
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col justify-start items-start space-x-4 pt-10 pb-2 border-b-2 w-full">
                            <h1 className="order-card-head font-bold text-xl">
                              Total:
                            </h1>
                            <span className="order-card-head text-lg mt-1">
                              {item?.price} KD
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <div className="flex flex-col">
                {/* <div className="flex w-full items-center space-x-2">
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
                  className="w-52 m-10 ml-0"
                  onClick={() =>
                    handlePayment(totalPrice * 0.8, designData?.customerId)
                  }
                >
                  <Coins /> Get Invoice and Pay
                </Button> */}
              </div>
              <h1 className="m-10 font-bold poppins-font text-xl">
                Total Price : {totalPrice} KD
              </h1>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default DesignDetails;
