"use client"

import { useState, useEffect } from 'react'
import { DollarSignIcon, PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from 'next/link'

interface Question {
  text: string
  type: 'multipleChoice' | 'checkbox'
  options: string[]
}

interface SurveyParameters {
  participantQuota: {
    enabled: boolean
    quota: string
    reward: {
      enabled: boolean
      amount: string
    }
  }
  worldId: 'required' | 'optional'
  quarkId: 'required' | 'optional'
}

interface Survey {
  id: string
  title: string
  description: string
  questions: Question[]
  parameters: SurveyParameters
  createdAt: string
}

export default function Dashboard() {
  const [surveys, setSurveys] = useState<Survey[]>([])

  useEffect(() => {
    // Retrieve surveys from localStorage
    const storedSurveys = JSON.parse(localStorage.getItem('surveys') || '[]')
    setSurveys(storedSurveys)
  }, [])

  const deleteSurvey = (id: string) => {
    const updatedSurveys = surveys.filter(survey => survey.id !== id)
    setSurveys(updatedSurveys)
    localStorage.setItem('surveys', JSON.stringify(updatedSurveys))
  }

return (
    <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Survey Dashboard</h1>
            <Link href="/researcher/CreateSurvey" passHref>
                <Button size="lg" className="rounded-full bg-white text-black">
                    <PlusIcon className="h-6 w-6 mr-2" />
                    Create New Survey
                </Button>
            </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {surveys.map((survey) => (
                <Card className="relative border-primary border-4 " key={survey.id}>
                    <div className="absolute top-2 right-2">
                        <Button 
                            variant="destructive" 
                            size="icon" 
                            onClick={() => deleteSurvey(survey.id)}
                        >
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    </div>
                    <CardHeader>
                        <CardTitle>{survey.title}</CardTitle>
                        <CardDescription>{survey.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>{survey.questions.length} question/s</span>
                            <span>Created on {new Date(survey.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mt-4 gap-4 text-sm">
                            {survey.parameters.participantQuota.enabled && (
                                <div className="mb-4">
                                    <strong>Quota:</strong> {survey.parameters.participantQuota.quota} participants
                                    {survey.parameters.participantQuota.reward.enabled && (
                                        <div >
                                            <strong>Total cost: $</strong> {parseInt(survey.parameters.participantQuota.quota)*parseInt(survey.parameters.participantQuota.reward.amount)}
                                            {survey.parameters.participantQuota.reward.enabled}
                                        </div>
                                    )}
                                </div>
                            )}
                            <div className="mb-4">
                                <strong>World ID:</strong> {survey.parameters.worldId === 'required' ? 'Required' : 'Optional'}
                            </div>
                            <div>
                                <strong>Quark ID:</strong> {survey.parameters.quarkId === 'required' ? 'Required' : 'Optional'}
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">View Results</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
)
}
