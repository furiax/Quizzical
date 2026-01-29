import { useState, useEffect } from "react";
import he from "he";
import clsx from "clsx";
import Confetti from "react-confetti";
import { shuffleArray } from "../../utils";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [resetGame, setResetGame] = useState(false);

  useEffect(() => {
    async function getQuestions() {
      try {
        const res = await fetch(
          "https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple",
        );
        const data = await res.json();

        if (data.response_code === 0 && Array.isArray(data.results)) {
          const shuffledQuestions = data.results.map((q, index) => ({
            ...q,
            id: index,
            choices: shuffleArray([...q.incorrect_answers, q.correct_answer]),
          }));
          setQuestions(shuffledQuestions);
        }
      } catch (err) {
        console.error("Failed to fetch questions", err);
      }
    }
    getQuestions();
  }, [resetGame]);

  function handleSelect(questionIndex, choice) {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: choice,
    }));
  }

  function checkAnswers() {
    let newScore = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correct_answer) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResults(true);
  }

  function reset() {
    setShowResults(false);
    setScore(0);
    setSelectedAnswers({});
    setResetGame((prev) => !prev);
  }

  const allQuestionsAnswered = questions.every(
    (q, index) => selectedAnswers[index],
  );

  const questionElements = questions.map((q, index) => (
    <div key={q.id} className="question-section">
      <h2>{he.decode(q.question)}</h2>
      <div className="answers">
        {q.choices.map((choice) => {
          const isSelected = selectedAnswers[index] === choice;
          const isCorrect = choice === q.correct_answer;

          const labelClass = clsx("possible-answer", {
            "selected-answer": !showResults && isSelected,
            "correct-answer": showResults && isCorrect,
            "wrong-answer": showResults && isSelected && !isCorrect,
            "fade-answer":
              showResults && !isCorrect && !(isSelected && !isCorrect),
          });
          return (
            <label key={choice} className={labelClass}>
              <input
                type="radio"
                name={`question${index}`}
                value={choice}
                checked={isSelected}
                onChange={() => handleSelect(index, choice)}
              />
              {he.decode(choice)}
            </label>
          );
        })}
      </div>
      <hr />
    </div>
  ));

  return (
    <>
      {score === questions.length && <Confetti />}
      {questionElements}

      <div className="bottom-section">
        {showResults && (
          <>
            <p>
              You scored {score}/{questions.length} correct answers
            </p>
            <button onClick={reset}>Play Again</button>
          </>
        )}

        {allQuestionsAnswered && !showResults && (
          <button onClick={checkAnswers}>Check Answers</button>
        )}
      </div>
    </>
  );
}
