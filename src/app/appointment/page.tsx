import AddAppointment from "@/components/Appointment/AddAppointment";
import React, { Suspense } from "react";

const Appointment = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <AddAppointment />
  </Suspense>
);

export default Appointment;
