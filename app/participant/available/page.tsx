"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DollarSignIcon, FilterIcon, CheckCircleIcon, XCircleIcon } from "lucide-react"

// Mock data for surveys
const surveys = [
  {
    id: 1,
    title: "Consumer Habits Survey",
    description: "Share your shopping preferences and habits",
    requisites: ["Age 18-65", "US Resident", "Online shopper"],
    reward: 5.50,
    requiresWorldcoinId: false,
  },
  {
    id: 2,
    title: "Tech Usage Survey",
    description: "Tell us about your technology usage patterns",
    requisites: ["Own a smartphone", "Use social media", "Age 16-40"],
    reward: 4.75,
    requiresWorldcoinId: true,
  },
  {
    id: 3,
    title: "Health and Fitness Survey",
    description: "Answer questions about your health and fitness routines",
    requisites: ["Exercise regularly", "Age 21-50", "No chronic conditions"],
    reward: 6.25,
    requiresWorldcoinId: false,
  },
  {
    id: 4,
    title: "Work-Life Balance Survey",
    description: "Share insights on managing work and personal life",
    requisites: ["Full-time employed", "Age 25-55", "Urban resident"],
    reward: 5.00,
    requiresWorldcoinId: true,
  },
]

// Get unique requisites from all surveys
const allRequisites = Array.from(new Set(surveys.flatMap(survey => survey.requisites)))

export default function Home() {
  const [filters, setFilters] = useState<string[]>([])
  const [showWorldcoinOnly, setShowWorldcoinOnly] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentSurvey, setCurrentSurvey] = useState<typeof surveys[0] | null>(null)
  const [isEligible, setIsEligible] = useState(false)

  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const filteredSurveys = surveys.filter(survey => 
    (filters.length === 0 || filters.every(filter => survey.requisites.includes(filter))) &&
    (!showWorldcoinOnly || survey.requiresWorldcoinId)
  )

  const checkEligibilityAndParticipate = (survey: typeof surveys[0]) => {
    setCurrentSurvey(survey)
    // Mock eligibility check - in a real app, this would be based on user data
    setIsEligible(Math.random() > 0.5)
    setModalOpen(true)
  }

  const participateInSurvey = () => {
    alert(`Starting survey ${currentSurvey?.id}`)
    setModalOpen(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Survey Hub</h1>
      
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <FilterIcon className="mr-2" /> Filters
          </h2>
          <div className="flex items-center space-x-2">
            <Switch
              id="worldcoin-mode"
              checked={showWorldcoinOnly}
              onCheckedChange={setShowWorldcoinOnly}
            />
            <Label htmlFor="worldcoin-mode">Worldcoin ID required</Label>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {allRequisites.map((requisite) => (
            <div key={requisite} className="flex items-center space-x-2">
              <Checkbox
                id={requisite}
                checked={filters.includes(requisite)}
                onCheckedChange={() => toggleFilter(requisite)}
              />
              <label
                htmlFor={requisite}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {requisite}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <Card key={survey.id} className="flex flex-col">
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
                className="w-full" 
                onClick={() => checkEligibilityAndParticipate(survey)}
              >
                Check Eligibility & Participate
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentSurvey?.title}</DialogTitle>
            <DialogDescription>
              {isEligible 
                ? "Congratulations! You are eligible for this survey." 
                : "We're sorry, but you are not eligible for this survey."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isEligible ? (
              <p className="text-green-600 flex items-center">
                <CheckCircleIcon className="w-5 h-5 mr-2" />
                You meet all the requirements for this survey.
              </p>
            ) : (
              <p className="text-red-600 flex items-center">
                <XCircleIcon className="w-5 h-5 mr-2" />
                You do not meet all the requirements for this survey.
              </p>
            )}
          </div>
          <DialogFooter>
            {isEligible ? (
              <Button onClick={participateInSurvey}>Participate Now</Button>
            ) : (
              <Button onClick={() => setModalOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}