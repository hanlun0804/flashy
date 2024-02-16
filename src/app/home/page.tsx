"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    router.push("sign-in-or-register");
  };
  return (
    <div className="flex flex-col items-start justify-center h-screen px-20">
      <h1 className="text-6xl font-bold">Welcome to Flashy - Your</h1>
      <h1 className="text-6xl font-bold">Ultimate Flashcard Soulution!</h1>

      <h2 className="text-lg mt-4">
        Create personalized flashcards effortlessly. Study smarter, not harder.
        Get started now
      </h2>
      <div className="mt-8">
        <Button
          className="bg-[--clr_secondary] hover:bg-[--clr_primary] text-white px-12"
          onClick={handleGetStarted}
        >
          Get started
        </Button>
      </div>
    </div>
  );
};

export default Home;
