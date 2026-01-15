import TermsAndConditionsComponent from "@/components/TermsAndConditions/TermsAndConditionsComponent";
import React, { Suspense } from "react";

const Terms = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TermsAndConditionsComponent />
    </Suspense>
  );
};

export default Terms;
