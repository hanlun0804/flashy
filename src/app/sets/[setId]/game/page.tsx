"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./style.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addFavourite,
  getFlashcardSet,
  removeFavourite,
} from "@/actions/flashcard-set-actions";
import { Card } from "@/components/ui/card";
import useUserSession from "@/hooks/use-user-session";
import { getUserById } from "@/actions/login-actions";
import { Shuffle } from "lucide-react";
import { doc } from "firebase/firestore";

interface FlashCardSetPageProps {
  params: {
    setId: string;
  };
}

const FlashCardGame = ({ params }: FlashCardSetPageProps) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [flashcards, setFlashcards] = useState([]);
  const userSession = useUserSession();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: () => getUserById(userSession?.uid),
    enabled: !!userSession,
  });

  const { data: set } = useQuery({
    queryKey: ["set", params.setId],
    queryFn: () => getFlashcardSet(params.setId),
  });

  if (!set) {
    return <div></div>;
  }

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % set.flashcards.length);
  };

  const handlePrevious = () => {
    setShowAnswer(false);
    setCurrentCardIndex(
      (prevIndex) =>
        (prevIndex - 1 + set.flashcards.length) % set.flashcards.length,
    );
  };
  const currentCard = set.flashcards[currentCardIndex];

  const handleShuffle = () => {
    setShowAnswer(false);
    set.flashcards.sort(() => Math.random() - 0.5);
    setCurrentCardIndex(0);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case "Enter":
        setShowAnswer(!showAnswer);
        break;
      case " ":
        setShowAnswer(!showAnswer);
        break;
      case "ArrowLeft":
        handlePrevious();
        break;
      case "ArrowRight":
        handleNext();
        break;
    }
  };

  const handleFavourite = () => {
    if (!user) {
      return;
    }
    if (user?.favourites?.includes(set.id)) {
      removeFavourite(user.id, set.id);
    } else {
      addFavourite(user.id, set.id);
    }
    queryClient.invalidateQueries({
      queryKey: ["user"],
    });
  };

  return (
    <div
      className="flex justify-center items-center w-full h-full flex-col pt-20"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      <div className="flex flex-row space-x-2 items-center">
        <h1>Playing: {set.name}</h1>
        {user?.id && (
          <Button variant="ghost" onClick={handleFavourite}>
            <Star
              size={30}
              fill="#e8f0ff"
              fillOpacity={user?.favourites?.includes(set.id) ? 1 : 0}
            />
          </Button>
        )}
      </div>
      <div className="flex justify-center items-center flip-card mt-8">
        <div className={`flip-card-inner ${showAnswer ? "clicked" : ""}`}>
          <Card
            className="flip-card-front hover:bg-[#444e63] flex justify-center items-center p-30 duration-300 cursor-pointer"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className="absolute top-3 left-3 text-white p-2" id="counter">
              {currentCardIndex + 1}/{set.flashcards.length}
            </div>
            <div>{currentCard.question}</div>
            <Button
              className="absolute top-4 right-4 bg-red-900"
              id="marking"
              onClick={(event) => {
                event.stopPropagation();
                set.flashcards = [...set.flashcards, currentCard];
                document.getElementById("marking")!.innerHTML =
                  "<BookmarkX /> Marked as difficult";
              }}
            >
              <BookmarkX /> Mark as difficult
            </Button>
          </Card>

          <Card
            className="flip-card-back hover:bg-[#444e63] flex justify-center items-center p-30 duration-300 cursor-pointer"
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <div className="absolute top-3 left-3 text-white p-2">
              {currentCardIndex + 1}/{set.flashcards.length}
            </div>
            <div>{currentCard.answer}</div>
          </Card>
        </div>
      </div>
      <div className="flex flex-wrap justify-center mt-6 space-x-6">
        <Button className="flex justify-center p-10" onClick={handlePrevious}>
          <ChevronLeft size={30} />
        </Button>
        <Button className="flex justify-center p-10" onClick={handleNext}>
          <ChevronRight size={30} />
        </Button>
      </div>
      <div>
        <Button className="m-5 py-4" onClick={handleShuffle}>
          <Shuffle className="mr-4" size={20} /> Shuffle
        </Button>
      </div>
    </div>
  );
};

export default FlashCardGame;
