import { redirect } from "next/navigation";
import React from "react";

export default function EmailPage() {
  redirect("/wip");

  return <div>{/* Email Communications content here */}</div>;
}
