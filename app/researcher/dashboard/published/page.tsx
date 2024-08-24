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
  publishedAt: string
  responses: number
}

export default function PublishedDashboard() {
  const [publishedSurveys, setPublishedSurveys] = useState<Survey[]>([])

  useEffect(() => {
    // Retrieve surveys from localStorage
    const storedSurveys = JSON.parse(localStorage.getItem('surveys') || '[]')
    // Filter only published surveys
    const published = storedSurveys.filter((survey: Survey) => survey.publishedAt)
    setPublishedSurveys(published)
  }, [])

  const closeSurvey = (id: string) => {
    const updatedSurveys = publishedSurveys.map(survey => 
      survey.id === id ? { ...survey, closed: true } : survey
    )
    setPublishedSurveys(updatedSurveys)
    localStorage.setItem('surveys', JSON.stringify(updatedSurveys))
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Published Surveys</h1>
        <Link href="/researcher/dashboard" passHref>
          <Button size="lg" className="rounded-full bg-white text-black">
            View All Surveys
          </Button>
        </Link>
      </div>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        {publishedSurveys.map((survey) => (
          <Card className="relative border-primary border-4" key={survey.id}>
            <CardHeader>
              <CardTitle>{survey.title}</CardTitle>
              <CardDescription>{survey.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{survey.questions.length} question/s</span>
                <span>Published on {new Date(survey.publishedAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 gap-4 text-sm">
                <div className="mb-4">
                  <strong>Responses:</strong> {survey.responses} / {survey.parameters.participantQuota.quota}
                </div>
                {survey.parameters.participantQuota.enabled && (
                  <div className="mb-4">
                    <strong>Quota:</strong> {survey.parameters.participantQuota.quota} participants
                    {survey.parameters.participantQuota.reward.enabled && (
                      <div>
                        <strong>Total cost: $</strong> {parseInt(survey.parameters.participantQuota.quota) * parseInt(survey.parameters.participantQuota.reward.amount)}
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
                <Button variant="outline" size="sm" onClick={() => closeSurvey(survey.id)}>
                  {survey.closed ? 'Closed' : 'Close Survey'}
                </Button>
                <Link href={`/researcher/results/${survey.id}`} passHref>
                  <Button variant="outline" size="sm">
                    View Results
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}