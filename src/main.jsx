import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import QuizApp from "./QuizApp"; // make sure the path is correct


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QuizApp />
  </StrictMode>,
)
