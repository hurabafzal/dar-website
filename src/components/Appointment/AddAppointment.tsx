"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns-tz";
import { cn } from "@/lib/utils";
import axios from "axios";
import { getUserData } from "@/helpers/jwtHelper";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { checkPaymentStatus, makePayment } from "@/helpers/paymentHelper";

interface Governorate {
  _id: string;
  name: string;
}

interface District {
  _id: string;
  name: string;
  governorateId: {
    _id: string;
    name: string;
  };
}

const formSchema = z.object({
  phone: z
    .string()
    .min(8, {
      message: "Phone number must be at least 8 digits.",
    })
    .max(8, {
      message: "Phone number must not exceed 8 digits.",
    }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  time: z.string().min(2, {
    message: "Please select a time slot.",
  }),
  area: z.string().min(2, {
    message: "Please select your area",
  }),
  remarks: z.string().optional(),
  appointmentDate: z.date({
    required_error: "Date of appointment is required.",
  }),
});

const AddAppointment = () => {
  const router = useRouter();
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [currentUser, setCurrentUser] = useState({});
  const searchParams = useSearchParams();
  const [districtsByGovernorate, setDistrictsByGovernorate] = useState<
    Record<string, District[]>
  >({});
  const [user, setUser] = useState({ sub: "" });

  const timeSlots = ["09-11", "11-01", "01-03", "03-05", "05-07"];

  const checkLoggedInUser = async () => {
    const user: any = await getUserData();
    if (!user) {
      redirect("/login");
    }
    setUser(user);
  };

  const checkPayment = async () => {
    const tapId = searchParams.get("tap_id");
    if (tapId) {
      const status = await checkPaymentStatus(tapId);
      if (status === "CAPTURED") {
        toast("Payment made successfully", {
          className: "success-toast",
        });
        setTimeout(() => router.push("/"), 3000);
      } else {
        toast("Error while making payment", {
          className: "error-toast",
        });
      }
    }
  };

  const getCurrentUser = async () => {
    const user: any = await getUserData();
    await axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}users/${user?.sub}`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => setCurrentUser(res.data));
  };

  useEffect(() => {
    checkLoggedInUser();
    getCurrentUser();
    checkPayment();
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}governorate`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => setGovernorates(res.data))
      .catch((err) => console.error("Failed to fetch governorates:", err));
  }, []);

  useEffect(() => {
    if (governorates.length > 0) {
      const fetchDistricts = async () => {
        const districtsData: any = {};
        for (const governorate of governorates) {
          try {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}district/governorate/${governorate._id}`,
              { headers: { "Content-Type": "application/json" } }
            );
            districtsData[governorate.name] = res.data;
          } catch (err) {
            console.error(
              `Failed to fetch districts for governorate ${governorate.name}:`,
              err
            );
          }
        }
        setDistrictsByGovernorate(districtsData);
      };
      fetchDistricts();
    }
  }, [governorates]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phone: "",
      time: "",
      area: "",
      remarks: "",
      appointmentDate: undefined,
    },
  });

  const formatDateForKuwait = (date: Date) =>
    format(date, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: "Asia/Kuwait" });

  const convertTo24HourFormat = (hour: number, isPM: boolean): number => {
    if (isPM && hour < 12) {
      return hour + 12; // Convert PM hours to 24-hour format (e.g., 3PM → 15)
    } else if (!isPM && hour === 12) {
      return 0; // Convert 12AM to 0
    }
    return hour;
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      customerId: user?.sub,
      type: "MEASUREMENT",
      phoneNo: values.phone,
      name: values.username,
      appointmentDate: values.appointmentDate,
      appointmentStartTime: formatDateForKuwait(
        new Date(
          new Date(values.appointmentDate).setHours(
            convertTo24HourFormat(
              parseInt(values.time.split("-")[0]),
              parseInt(values.time.split("-")[0]) >= 9 &&
                parseInt(values.time.split("-")[0]) < 12
                ? false
                : true // AM for slots 9-11, PM for others
            ),
            0,
            0,
            0
          )
        )
      ),
      appointmentEndTime: formatDateForKuwait(
        new Date(
          new Date(values.appointmentDate).setHours(
            convertTo24HourFormat(
              parseInt(values.time.split("-")[1]),
              parseInt(values.time.split("-")[1]) >= 1 &&
                parseInt(values.time.split("-")[1]) <= 7
                ? true
                : false // PM for slots 1-7
            ),
            0,
            0,
            0
          )
        )
      ),
      districtId: values.area,
      remarks: values?.remarks,
    };

    makePayment(currentUser);

    axios
      .post(`${process.env.NEXT_PUBLIC_BACKEND_URL}appointments`, payload, {
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        toast(
          "Appointment has been created successfully and you are being redirected to the payments",
          {
            className: "success-toast",
          }
        );
        form.reset();
      })
      .catch((err) =>
        toast("Error while creating appointment", {
          className: "error-toast",
        })
      );
  }

  return (
    <div className="mt-[70px]">
      <div className="bg-gray-50">
        <div className="container mx-auto">
          <h1 className="font-bold text-[28px] my-account-head pt-5 pb-5 md:ml-0 mobile:ml-8">
            Appointment
          </h1>
        </div>
      </div>
      <div className="container md:mx-auto mt-5 mb-10 mobile:ml-8">
        <h1 className="text-slate-500 text-3xl montserrat-font font-bold">
          Book Measurement
        </h1>
        <p className="text-slate-500 mt-5 montserrat-font mb-5">
          Kindly fill below details
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex md:flex-row mobile:flex-wrap mobile:flex-col w-full">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Phone No"
                        {...field}
                        className="w-80 h-14"
                        type="number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Enter Username"
                        {...field}
                        className="w-80 h-14 md:mt-0 md:ml-4 mobile:ml-0 mobile:mt-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex md:flex-row mobile:flex-wrap mobile:flex-col w-full">
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => {
                  const [popoverOpen, setPopoverOpen] = useState(false);
                  return (
                    <FormItem className="flex flex-col">
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-80 h-14 pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0" align="start">
                          <Calendar
                            mode="single"
                            className="w-80"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              setPopoverOpen(false);
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={(value) => field.onChange(value)}
                      >
                        <SelectTrigger className="w-80 h-14 md:mt-0 md:ml-4 mobile:ml-0 mobile:mt-4">
                          <SelectValue placeholder="Select Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((slot: string, index: number) => (
                            <SelectItem value={slot} key={index}>
                              {slot.split("-")[1] === "11"
                                ? `${slot} AM`
                                : `${slot} PM`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(value) => field.onChange(value)}
                    >
                      <SelectTrigger className="w-80 h-14">
                        <SelectValue placeholder="Select a district" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(districtsByGovernorate).map(
                          ([governorateName, districts]) => (
                            <SelectGroup key={governorateName}>
                              <SelectLabel className="font-bold text-lg">
                                {governorateName}
                              </SelectLabel>
                              {districts.map((district: any) => (
                                <SelectItem
                                  key={district._id}
                                  value={district._id}
                                >
                                  {district.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Remarks"
                      {...field}
                      className="md:w-[41.3rem] h-14 mobile:w-80"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-slate-500 mt-5 mb-5 montserrat-font">
              Measurement Charges :{" "}
              <span className="font-bold">10.000 KWD</span>
            </p>
            <Button type="submit">Pay Now</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddAppointment;
