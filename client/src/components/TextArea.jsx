import React, { useContext } from "react";
import { AppContext } from "../App";

function TextArea() {
  const { wordsArray, currentIndex, inputValue } = useContext(AppContext);

  return (
    <div className="text-paragraph">
      {wordsArray.map((word, wordIndex) => (
        <span key={wordIndex}>
          {word.split("").map((letter, letterIndex) => {
            const name = () => {
              if (wordIndex > currentIndex) return "";
              if (wordIndex < currentIndex) return "right";

              const underline = letter === " " ? "" : "underline";
              if (!inputValue[letterIndex]) return underline;
              if (
                word.slice(0, letterIndex + 1) ===
                inputValue.slice(0, letterIndex + 1)
              )
                return "right " + underline;
              return "wrong " + underline;
            };

            return (
              <span key={letterIndex} className={name()}>
                {letter}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}

export default TextArea;
