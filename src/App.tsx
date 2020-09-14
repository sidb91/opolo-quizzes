import React, { useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { fetchQuizQuestions } from "./API";
import { QuestionsState, Difficulty } from "./API";
import { GlobalStyles, Wrapper } from "./App.styles";

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

const TOTAL_QUESTIONS = 10;

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionsState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);

  const startQuiz = async () => {
    setLoading(true);
    setGameOver(false);

    const newQuestions = await fetchQuizQuestions(
      TOTAL_QUESTIONS,
      Difficulty.MEDIUM
    );

    setQuestions(newQuestions);
    setScore(0);
    setNumber(0);
    setUserAnswers([]);
    setLoading(false);
  };

  //console.log(fetchQuizQuestions(TOTAL_QUESTIONS, Difficulty.MEDIUM));

  console.log(questions);

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      const answer = e.currentTarget.value;
      const correctAnswer = questions[number].correct_answer;

      const correct = answer === correctAnswer;

      if (correct) setScore((prev) => prev + 1);

      const userAnswerObj = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer,
      };

      setUserAnswers((prev) => [...prev, userAnswerObj]);
    }
  };

  const nextQuestion = () => {
    const nextQuestion = number + 1;

    if (nextQuestion === TOTAL_QUESTIONS) {
      setGameOver(true);
    } else {
      setNumber(nextQuestion);
    }
  };

  return (
    <React.Fragment>
      <GlobalStyles />
      <Wrapper>
        <h1>QUIZZO</h1>

        {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
          <button className="start-quiz" onClick={startQuiz}>
            START
          </button>
        ) : null}

        {!gameOver ? <p className="score">Score: {score}</p> : null}

        {loading ? <p>Loading Questions...</p> : null}

        {!gameOver && !loading && (
          <QuestionCard
            questionNumber={number + 1}
            totalQuestion={TOTAL_QUESTIONS}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}

        {!gameOver &&
          !loading &&
          userAnswers.length === number + 1 &&
          number !== TOTAL_QUESTIONS - 1 && (
            <button className="next" onClick={nextQuestion}>
              Next Question
            </button>
          )}
      </Wrapper>
    </React.Fragment>
  );
}

export default App;
