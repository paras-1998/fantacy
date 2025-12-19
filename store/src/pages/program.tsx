"use client";
import React from "react";
import dynamic from "next/dynamic";



const Prog = dynamic(() => import("@/components/Prog"), {
  ssr: false, // Disable server-side rendering
});

export default  function ProgramPage() {
  return (
      <Prog />
  );
}