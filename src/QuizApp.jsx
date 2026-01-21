import "./QuizApp.css";
import { useState } from "react";
import axios from "axios";
import { Options } from "./Options";

export const QuizApp = () => {
  const [quizStart, setQuizStart] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [answers, setAnswers] = useState([]); // store all selected answers

  // 🔹 Shuffle helper
  const shuffleOptions = (arr) => arr.sort(() => Math.random() - 0.5);

  // 🔹 Start Quiz
  const startQuiz = async () => {
    try {
      const res = await axios.get("https://the-trivia-api.com/api/questions");

      // Shuffle questions
      const shuffledQuestions = res.data.sort(() => Math.random() - 0.5);
      setQuestions(shuffledQuestions);

      // Shuffle options for first question
      const firstOptions = shuffleOptions([
        shuffledQuestions[0].correctAnswer,
        ...shuffledQuestions[0].incorrectAnswers,
      ]);
      setCurrentOptions(firstOptions);

      setQuizStart(true);
      setAnswers([]); // reset answers
      setScore(0);
      setSelectedAnswer("");
      setShowResult(false);
      setCurrentIndex(0);
    } catch (error) {
      console.error(error);
      alert("Failed to load quiz. Try again later.");
    }
  };

  // 🔹 When user selects answer
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);

    const newAnswers = [...answers];
    newAnswers[currentIndex] = answer;
    setAnswers(newAnswers);
  };

  // 🔹 Next Question Logic
  const nextQuestion = () => {
    if (!selectedAnswer) return alert("Please select an option");

    // Update score if correct
    if (selectedAnswer === questions[currentIndex].correctAnswer) {
      // Only count score once per question
      if (answers[currentIndex] !== questions[currentIndex].correctAnswer) {
        setScore(score + 10);
      }
    } else {
      // If changing answer from correct to wrong, subtract score
      if (answers[currentIndex] === questions[currentIndex].correctAnswer) {
        setScore(score - 10);
      }
    }

    // Last question?
    if (currentIndex === questions.length - 1) {
      setShowResult(true);
    } else {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);

      // Shuffle options for next question
      const nextOptions = shuffleOptions([
        questions[nextIndex].correctAnswer,
        ...questions[nextIndex].incorrectAnswers,
      ]);
      setCurrentOptions(nextOptions);

      // Restore previous selection if exists
      setSelectedAnswer(answers[nextIndex] || "");
    }
  };

  // 🔹 Previous Question Logic
  const previousQuestion = () => {
    if (currentIndex === 0) return; // cannot go back from first question

    const prevIndex = currentIndex - 1;
    setCurrentIndex(prevIndex);

    // Shuffle options for previous question
    const prevOptions = shuffleOptions([
      questions[prevIndex].correctAnswer,
      ...questions[prevIndex].incorrectAnswers,
    ]);
    setCurrentOptions(prevOptions);

    // Restore previous selection
    setSelectedAnswer(answers[prevIndex] || "");
  };

  // 🔹 Restart Quiz
  const restartQuiz = () => {
    setQuizStart(false);
    setShowResult(false);
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer("");
    setCurrentOptions([]);
    setAnswers([]);
  };

  return (
    <div className="quiz-container">
      {!quizStart && !showResult && (
        <><h2>Let's Go!</h2>
        <button className="start-btn" onClick={startQuiz}>
          Start Quiz
        </button>
        </>
      )}

      {quizStart && !showResult && questions.length > 0 && (
        <>
          <h3>
            Question {currentIndex + 1} / {questions.length}
          </h3>

          <p className="question-text">{questions[currentIndex].question}</p>

          <Options
            options={currentOptions}
            onAnswer={handleAnswer}
            selected={selectedAnswer}
          />

          <div className="navigation-buttons">
            {currentIndex > 0 && (
              <button className="prev-btn" onClick={previousQuestion}>
                Previous
              </button>
            )}

            <button className="next-btn" onClick={nextQuestion}>
              {currentIndex === questions.length - 1 ? "Finish" : "Next"}
            </button>
          </div>
        </>
      )}

      {showResult && (
        <div className="result">
          <h2>Your Score: {score}</h2>
          {score >= 50 ? <p>🎉 Excellent!</p> : <p>😢 Try Again</p>}
          <button className="retry-btn" onClick={restartQuiz}>
            Retry Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
