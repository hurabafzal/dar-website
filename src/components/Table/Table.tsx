"use client";
import {
  Table as TableLayout,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Eye, Printer } from "lucide-react";
import { getUserData } from "@/helpers/jwtHelper";
import { redirect } from "next/navigation";
import Button from "../Button/Button";
import { toast } from "sonner";

export interface ExistingFile {
  originalName: string;
  mimeType: string;
  fileId: string;
  url: string;
}

const Table = () => {
  const [orders, setOrders] = useState([]);

  const getUserOrders = async () => {
    const user: any = await getUserData();
    if (!user) {
      redirect("/login");
    }
    await axios
      .get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}orders/customer/${user?.sub}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => setOrders(res.data));
  };

  const handleDownload = async (file: File | ExistingFile) => {
    try {
      if ("url" in file) {
        window.open(file.url, "_blank");
      } else {
        const url = window.URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.name);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      toast("Error downloading file", {
        className: "error-toast",
      });
    }
  };

  function downloadFile(file: File | ExistingFile) {
    if ("url" in file) {
      window.open(file.url, "_blank");
    } else {
      const url = window.URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }
  }

  useEffect(() => {
    getUserOrders();
  }, []);

  return (
    <div className="mt-[70px]">
      <div className="bg-gray-50">
        <div className="container mx-auto">
          <h1 className="font-bold text-[28px] my-account-head pt-5 pb-5 md:ml-0 mobile:ml-4">
            My Account
          </h1>
        </div>
      </div>
      <div className="container md:mx-auto mt-5 mb-10 mobile:ml-4">
        <TableLayout className="bg-gray-50 rounded-md">
          <TableHeader className="bg-[#286d7c]">
            <TableRow>
              <TableHead className="table-head text-white font-bold">
                Order
              </TableHead>
              <TableHead className="table-head text-white font-bold">
                Date
              </TableHead>
              <TableHead className="table-head text-white font-bold">
                Status
              </TableHead>
              <TableHead className="text-right table-head text-white font-bold">
                Total
              </TableHead>
              <TableHead className="text-right table-head text-white font-bold">
                Paid
              </TableHead>
              <TableHead className="text-right table-head text-white font-bold">
                Due
              </TableHead>
              <TableHead className="text-right table-head text-white font-bold">
                Estimated Delivery
              </TableHead>
              <TableHead className="text-right table-head text-white font-bold">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order: any, index: number) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium table-row-value">
                    {order?._id}
                  </TableCell>
                  <TableCell className="table-row-value">
                    {order?.createdAt
                      ? format(new Date(order?.createdAt), "dd MMMM, yyyy")
                      : ""}
                  </TableCell>
                  <TableCell className="table-row-value">
                    {order?.status}
                  </TableCell>
                  <TableCell className="table-row-value text-right">
                    {order?.totalAmount}
                  </TableCell>
                  <TableCell className="table-row-value text-right">
                    {order?.paidAmount}
                  </TableCell>
                  <TableCell className="table-row-value text-right">
                    {`${order?.totalAmount - order?.paidAmount}`}
                  </TableCell>
                  <TableCell className="table-row-value text-right">
                    {order?.estimatedDeliveryDate
                      ? format(
                          new Date(order?.estimatedDeliveryDate),
                          "dd MMMM, yyyy"
                        )
                      : ""}
                  </TableCell>
                  <TableCell className="table-row-value text-right">
                    <div className="flex justify-end">
                      <span className="cursor-pointer text-[#0d5362]">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Eye className="text-xs" />
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[725px]">
                            <DialogHeader>
                              <DialogTitle>Order Details</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <h1>Item Details</h1>
                              <TableLayout>
                                <TableHeader className="hover:bg-[#286d7c]">
                                  <TableRow className="bg-[#286d7c]">
                                    <TableHead className="table-head text-white font-bold">
                                      Name
                                    </TableHead>
                                    <TableHead className="table-head text-white font-bold">
                                      Description
                                    </TableHead>
                                    <TableHead className="table-head text-white font-bold">
                                      Status
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody key={"first-key"}>
                                  {order?.items?.map(
                                    (item: any) => (
                                      <TableRow key={item.item}>
                                        <TableCell className="font-medium">
                                          {item?.item}
                                        </TableCell>
                                        <TableCell>{item?.description}</TableCell>
                                        <TableCell>{item?.status}</TableCell>
                                      </TableRow>
                                    )
                                  )}
                                </TableBody>
                              </TableLayout>
                            </div>
                            <div className="grid gap-4 py-4">
                              <h1>Download Design</h1>
                              <TableLayout>
                                <TableHeader className="hover:bg-[#286d7c]">
                                  <TableRow className="bg-[#286d7c]">
                                    <TableHead className="table-head text-white font-bold">
                                      Document Name
                                    </TableHead>
                                    <TableHead className="table-head text-white font-bold">
                                      Download
                                    </TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody key={"second-key"}>
                                  {order?.files?.map((file: any) => (
                                    <TableRow key={file.file}>
                                      <TableCell className="font-medium">
                                        {file?.originalName}
                                      </TableCell>
                                      <TableCell>
                                        {file?.originalName && (
                                          <Button
                                            text="Download"
                                            onClick={() => handleDownload(file)}
                                          />
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </TableLayout>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </span>
                      <span className="cursor-pointer text-[#0d5362] ml-2">
                        <Printer />
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </TableLayout>
      </div>
    </div>
  );
};

export default Table;
