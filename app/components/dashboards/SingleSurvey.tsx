"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { pushAnswer, Answer } from '@/api/api'

export default function SingleSurvey({ survey }) {
  const [responses, setResponses] = useState<{ [key: string]: string | string[] }>({})
  const [submitted, setSubmitted] = useState(false)

  const handleInputChange = (questionIndex: number, value: string | string[]) => {
    setResponses(prev => ({ ...prev, [questionIndex]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Map responses to the correct structure for the database
    const answerData: Answer = {
      survey_id: survey.id,
      data: Object.entries(responses).map(([index, answers]) => ({
        index: parseInt(index),
        answers: Array.isArray(answers) ? answers : [answers]
      }))
    }

    try {
      // Push the answer data to the backend
      await pushAnswer(answerData)
      setSubmitted(true)
    } catch (error) {
      console.error('Failed to submit survey answers:', error)
    }
  }

  if (submitted) {
    return (
      <Card className="w-full max-w-3xl mx-auto mt-4">
        <CardHeader>
          <CardTitle>Thank You!</CardTitle>
          <CardDescription>Your responses have been submitted successfully.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <form className="mt-8" onSubmit={handleSubmit}>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>{survey.name}</CardTitle>
          <CardDescription>{survey.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {survey.questions.map((question, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={index.toString()} className="text-base font-medium">
                {question.question}
              </Label>
              {!question.multiple && (
                <RadioGroup
                  onValueChange={(value) => handleInputChange(index, value)}
                  className="flex flex-col space-y-1"
                >
                  {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${index}-${option}`} />
                      <Label htmlFor={`${index}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {question.multiple && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${index}-${option}`}
                        onCheckedChange={(checked) => {
                          const currentResponses = (responses[index] as string[]) || []
                          if (checked) {
                            handleInputChange(index, [...currentResponses, option])
                          } else {
                            handleInputChange(index, currentResponses.filter((item) => item !== option))
                          }
                        }}
                      />
                      <Label htmlFor={`${index}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">Submit Survey</Button>
        </CardFooter>
      </Card>
    </form>
  )
}
