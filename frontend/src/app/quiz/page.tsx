'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"

interface Question {
  image: string
  options: string[]
  answer: string
}

const questions: Question[] = [
  {
    image: 'https://gateway.pinata.cloud/ipfs/<c2ktSiBa5nJqtMnpkrk5hbrNDntPGPyUcfQojtBiGqsD>/happy_1.png',
    options: ['Happy', 'Sad', 'Angry'],
    answer: 'Happy',
  },
  {
    image: 'https://gateway.pinata.cloud/ipfs/<c2ktSiBa5nJqtMnpkrk5hbrNDntPGPyUcfQojtBiGqsD>/happy_2.png',
    options: ['Happy', 'Sad', 'Angry'],
    answer: 'Happy',
  },
  {
    image: 'https://gateway.pinata.cloud/ipfs/<c2ktSiBa5nJqtMnpkrk5hbrNDntPGPyUcfQojtBiGqsD>/happy_3.png',
    options: ['Happy', 'Sad', 'Angry'],
    answer: 'Happy',
  },
  {
    image: 'https://gateway.pinata.cloud/ipfs/<c2ktSiBa5nJqtMnpkrk5hbrNDntPGPyUcfQojtBiGqsD>/mad_1.png',
    options: ['Happy', 'Sad', 'Angry'],
    answer: 'Angry',
  },
  {
    image: 'https://gateway.pinata.cloud/ipfs/<c2ktSiBa5nJqtMnpkrk5hbrNDntPGPyUcfQojtBiGqsD>/mad_2.png',
    options: ['Happy', 'Sad', 'Angry'],
    answer: 'Angry',
  },
  {
    image: 'https://gateway.pinata.cloud/ipfs/<c2ktSiBa5nJqtMnpkrk5hbrNDntPGPyUcfQojtBiGqsD>/mad_3.png',
    options: ['Happy', 'Sad', 'Angry'],
    answer: 'Angry',
  },
  {
    image: 'https://gateway.pinata.cloud/ipfs/<c2ktSiBa5nJqtMnpkrk5hbrNDntPGPyUcfQojtBiGqsD>/sad_1.png',
    options: ['Happy', 'Sad', 'Angry'],
    answer: 'Sad',
  },
  {
    image: 'https://gateway.pinata.cloud/ipfs/<c2ktSiBa5nJqtMnpkrk5hbrNDntPGPyUcfQojtBiGqsD>/sad_3.png',
    options: ['Happy', 'Sad', 'Angry'],
    answer: 'Sad',
  },
]

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [quizComplete, setQuizComplete] = useState<boolean>(false)

 // Fetch files from Pinata via the backend API
 useEffect(() => {
  const fetchPinataFiles = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/get_pinata_files`); //ERROR HERE
      const data = await response.json();

      if (data.rows) {
        // Dynamically create questions from Pinata file data
        const fetchedQuestions = data.rows.map((file: any) => ({
          image: `https://gateway.pinata.cloud/ipfs/${file.ipfs_hash}`,
          options: ['Happy', 'Sad', 'Angry'], // Default options
          answer: file.emotion, // Adjust to reflect the actual answer
        }));

        setQuestions(fetchedQuestions);
      }
    } catch (e) {
      console.error('Error fetching Pinata files:', e);
    }
  };

  fetchPinataFiles();
}, []);

const handleAnswer = (option: string) => {
  if (option === questions[currentQuestionIndex].answer) {
    setScore(score + 1);
  }

  const nextQuestion = currentQuestionIndex + 1;
  if (nextQuestion < questions.length) {
    setCurrentQuestionIndex(nextQuestion);
  } else {
    setQuizComplete(true);
  }
};

return (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <h1 className="text-2xl font-bold mb-4">Emotion Quiz</h1>
    {quizComplete ? (
      <div>
        <h2 className="text-lg font-semibold">Quiz Complete!</h2>
        <p>
          Your score: {score} / {questions.length}
        </p>
        <Button
          className="mt-4"
          onClick={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setQuizComplete(false);
          }}
        >
          Retry Quiz
        </Button>
      </div>
    ) : (
      <div>
        {questions.length > 0 ? (
          <>
            <img
              src={questions[currentQuestionIndex].image}
              alt="Facial Expression"
              className="rounded-lg shadow-lg max-w-full h-auto mb-4"
            />
            <div className="flex flex-col items-center">
              {questions[currentQuestionIndex].options.map((option, index) => (
                <Button
                  key={index}
                  className="mb-2 w-64"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <p>Loading questions...</p>
        )}
      </div>
    )}
  </div>
);
}
