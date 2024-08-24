"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"

// Mock survey data
const surveyData = {
  id: "001",
  title: "Customer Satisfaction Survey",
  description: "Help us improve our services by providing your feedback.",
  questions: [
    {
      id: "q1",
      type: "radio",
      question: "How satisfied are you with our product?",
      options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"]
    },
    {
      id: "q2",
      type: "checkbox",
      question: "Which features do you use most? (Select all that apply)",
      options: ["Feature A", "Feature B", "Feature C", "Feature D"]
    },
  ]
}

export default function SurveyComponent({params}) {
  const [responses, setResponses] = useState<Record<string, string | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const {id} = params

  const handleInputChange = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Survey responses:", responses)
    setSubmitted(true)
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
          <CardTitle>Encuesta: {id}</CardTitle>
          <CardDescription>{surveyData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {surveyData.questions.map((question) => (
            <div key={question.id} className="space-y-2">
              <Label htmlFor={question.id} className="text-base font-medium">
                {question.question}
              </Label>
              {question.type === "radio" && (
                <RadioGroup
                  onValueChange={(value) => handleInputChange(question.id, value)}
                  className="flex flex-col space-y-1"
                >
                  {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                      <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              {question.type === "checkbox" && (
                <div className="space-y-2">
                  {question.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox
                        id={`${question.id}-${option}`}
                        onCheckedChange={(checked) => {
                          const currentResponses = responses[question.id] as string[] || []
                          if (checked) {
                            handleInputChange(question.id, [...currentResponses, option])
                          } else {
                            handleInputChange(
                              question.id,
                              currentResponses.filter((item) => item !== option)
                            )
                          }
                        }}
                      />
                      <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
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