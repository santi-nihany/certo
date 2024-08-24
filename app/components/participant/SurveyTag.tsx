"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DollarSignIcon } from "lucide-react"

interface SurveyTagProps {
    key?: number
    survey: {
        id: number
        title: string
        description: string
        requisites: string[]
        reward: number
        requiresWorldcoinId: boolean
    }
    checkEligibilityAndParticipate: (survey: any) => void
    }


export default function SurveyTag({key, survey, checkEligibilityAndParticipate}: SurveyTagProps) {
    return (
        <Card key={survey.id} className="flex flex-col border-primary border-4">
            <CardHeader>
              <CardTitle>{survey.title}</CardTitle>
              <CardDescription>{survey.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <h3 className="font-semibold mb-2">Requisites:</h3>
              <ul className="list-disc list-inside mb-4">
                {survey.requisites.map((requisite, index) => (
                  <li key={index} className="text-sm text-gray-600">{requisite}</li>
                ))}
              </ul>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="flex items-center gap-1">
                  <DollarSignIcon className="w-4 h-4" />
                  {survey.reward.toFixed(2)}
                </Badge>
                {survey.requiresWorldcoinId && (
                  <Badge variant="outline" className="bg-blue-50">Worldcoin ID</Badge>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-primary text-dark" 
                onClick={() => checkEligibilityAndParticipate(survey)}
              >
                Check Eligibility & Participate
              </Button>
            </CardFooter>
          </Card>
    )
}