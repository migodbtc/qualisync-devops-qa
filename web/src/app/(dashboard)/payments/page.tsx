import { redirect } from "next/navigation";
import React from "react";

export default function PaymentsPage() {
  redirect("/wip");

  return <div>{/* Payment History content here */}</div>;
}
