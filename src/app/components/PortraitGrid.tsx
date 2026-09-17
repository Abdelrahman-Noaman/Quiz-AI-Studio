"use client";

import Image from "next/image";
import { StudioMock } from "./StudioMock";

export function PortraitGrid() {
  return (
    <div className="portrait-visual" aria-label="Portrait of the QuizAI Studio founder">
      <div className="portrait-visual__profile">
        <div className="portrait-visual__photo">
        <Image src="/profile-photo.jpg" alt="QuizAI Studio founder" width={640} height={640} />
        </div>
        <div className="portrait-visual__founder">FOUNDER OF QUIZAI STUDIO</div>
      </div>
      <div className="portrait-visual__mockup">
        <StudioMock />
      </div>
    </div>
  );
}
