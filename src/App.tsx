import { useEffect, useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Check, X } from "lucide-react"

export default function MathGame() {
  const generateProblem = (digits: number, numTerms: number, allowNegative: boolean) => {
    const terms = Array.from({ length: numTerms }, () => {
      const min = Math.pow(10, digits - 1)
      const max = Math.pow(10, digits) - 1
      const number = Math.floor(Math.random() * (max - min + 1)) + min;
      return allowNegative ? (Math.random() >= 0.3 ? number : -number) : number;
    })
    // Sort terms in descending order to ensure the result is non-negative
    terms.sort((a, b) => b - a)
    const correctAnswer = terms.reduce((acc, term) => acc + term, 0);
    return { terms, correctAnswer }
  }

  const [numDigits, setNumDigits] = useState(2)
  const [numTerms, setNumTerms] = useState(2)
  const [allowNegative, setAllowNegative] = useState('Yes')
  const [currentProblem, setCurrentProblem] = useState<{ terms: number[], correctAnswer: number }>({ terms: [], correctAnswer: 0 })
  const [userAnswer, setUserAnswer] = useState('')
  const [showFeedback, setShowFeedback] = useState<number|null>(null)
  const [isCorrect, setIsCorrect] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [score, setScore] = useState(0);
  const answerRef = useRef<HTMLInputElement>();

  const handleAnswerSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const userAnswerNumber = parseInt(userAnswer, 10)
    const isCorrectAnswer = userAnswerNumber === currentProblem.correctAnswer;
    setTotalScore(old => old + 1);
    setIsCorrect(isCorrectAnswer);
    if (isCorrectAnswer) {
      setScore(old => old + 1);
    }
    setUserAnswer('')
    setShowFeedback(currentProblem.correctAnswer);
    setTimeout(() => {
      setShowFeedback(null);
    }, 1000);
    if (answerRef && answerRef.current) {
      answerRef.current.focus();
    }
    setCurrentProblem(generateProblem(numDigits, numTerms, allowNegative == 'Yes'));
  }

  const reset = () => {
    if (!confirm('Do you really want to reset the game ?')) {
        return;
    }
    setTotalScore(0);
    setScore(0);
    setCurrentProblem(generateProblem(numDigits, numTerms, allowNegative == 'Yes'));
  }

  const handleNumDigitsChange = (value: string) => {
    if (!confirm('This will reset the game. Are you sure ?')) {
      return;
  }
    setNumDigits(parseInt(value, 10))
    setCurrentProblem(generateProblem(parseInt(value, 10), numTerms, allowNegative == 'Yes'))
    setTotalScore(0);
    setScore(0);
  }

  const handleNumTermsChange = (value: string) => {
    if (!confirm('This will reset the game. Are you sure ?')) {
      return;
  }
    setNumTerms(parseInt(value, 10))
    setCurrentProblem(generateProblem(numDigits, parseInt(value, 10), allowNegative == 'Yes'));
    setTotalScore(0);
    setScore(0);
  }

  const handleAllowNegativeChange = (value: string) => {
    if (!confirm('This will reset the game. Are you sure ?')) {
        return;
    }
    setAllowNegative(value)
    setCurrentProblem(generateProblem(numDigits, parseInt(value, 10), value == 'Yes'));
    setTotalScore(0);
    setScore(0);
  }


  useEffect(() => {
    setCurrentProblem(generateProblem(numDigits, numTerms, allowNegative == 'Yes'));
  }, [])

  return (
    <Card className={`w-full max-w-md mx-auto mt-10 ring-4 ${ showFeedback !== null ? (isCorrect ? 'ring-green-600' : 'ring-red-600') : 'ring-transparent' }`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Math Game</CardTitle>
        <CardDescription>Test your math skills with customizable problems.</CardDescription>
      </CardHeader>
      <div className="w-full text-xl font-bold text-center py-2">
        Score : <span className='text-green-700'>{score}</span> / <span className='text-blue-700'>{totalScore}</span>
      </div>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center space-x-4">
          <div className="space-y-1">
            <Label htmlFor="numDigits">Number of Digits</Label>
            <Select value={numDigits.toString()} onValueChange={handleNumDigitsChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Number of Digits" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 7 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="numTerms">Number of Terms</Label>
            <Select value={numTerms.toString()} onValueChange={handleNumTermsChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Number of Terms" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 2} value={(i + 2).toString()}>
                    {i + 2}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="allowNegative">Allow Negative Number</Label>
            <Select value={allowNegative.toString()} onValueChange={handleAllowNegative}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Allow Negative Number" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Yes">Yes</SelectItem>
                <SelectItem value="No">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <form className="text-center" onSubmit={handleAnswerSubmit}>
          <div className="text-3xl font-bold mb-2">
            {currentProblem.terms.map((term, index) => (
              <div key={index} className="text-right font-mono">
                {term.toString().padStart(numDigits, ' ')}
              </div>
            ))}
            <hr className="border-t-2 border-gray-300 my-2" />
            <Input
              ref={answerRef as React.LegacyRef<HTMLInputElement>}
              type="number"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="mt-2 w-full"
              placeholder="Your answer"
              required
            />
          </div>
          <Button className="w-full mt-4">
            Check
          </Button>
        </form>
        {showFeedback !== null && (
          <div className="flex items-center space-x-2">
            {isCorrect ? <Check className="h-6 w-6 text-green-500" /> : <X className="h-6 w-6 text-red-500" />}
            <p className="font-semibold">
              {isCorrect ? 'Correct!' : `Incorrect! The correct answer is ${showFeedback}.`}
            </p>
          </div>
        )}
        <Button className="w-full mt-4" variant={'destructive'} onClick={reset}>
          Reset
        </Button>
        <CardFooter className="p-4 text-center w-full">
          Made with ❤️ by &nbsp; &nbsp;<a className="underline" target="_blank" href="https://github.com/HazzazBinFaiz">MD. Hazzaz Bin Faiz</a>
        </CardFooter>
      </CardContent>
    </Card>
  )
}
