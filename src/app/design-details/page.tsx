import DesignDetails from "@/components/Design/DesignDetails";
import React, { Suspense } from "react";

const Design = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DesignDetails />
    </Suspense>
  );
};

export default Design;
