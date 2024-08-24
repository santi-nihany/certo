"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircleIcon, XCircleIcon } from "lucide-react"
import Filters from "@/app/components/participant/Filters"
import SurveyTag from "@/app/components/participant/SurveyTag"
import { IBM_Plex_Mono } from "next/font/google"
import { useRouter } from "next/navigation"

const ibm = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "700"],
  subsets: ["latin"],
})

// Mock data for surveys
// const surveys = [
//   {
//     id: 1,
//     title: "Consumer Habits Survey",
//     description: "Share your shopping preferences and habits",
//     requisites: ["Age 18-65", "US Resident", "Online shopper"],
//     reward: 5.50,
//     requiresWorldcoinId: false,
//   },
//   {
//     id: 2,
//     title: "Tech Usage Survey",
//     description: "Tell us about your technology usage patterns",
//     requisites: ["Own a smartphone", "Use social media", "Age 16-40"],
//     reward: 4.75,
//     requiresWorldcoinId: true,
//   },
//   {
//     id: 3,
//     title: "Health and Fitness Survey",
//     description: "Answer questions about your health and fitness routines",
//     requisites: ["Exercise regularly", "Age 21-50", "No chronic conditions"],
//     reward: 6.25,
//     requiresWorldcoinId: false,
//   },
//   {
//     id: 4,
//     title: "Work-Life Balance Survey",
//     description: "Share insights on managing work and personal life",
//     requisites: ["Full-time employed", "Age 25-55", "Urban resident"],
//     reward: 5.00,
//     requiresWorldcoinId: true,
//   },
// ]

// Get unique requisites from all surveys

export default function SurveyDashboard({surveys}) {
  const allRequisites = Array.from(new Set(surveys.flatMap(survey => survey.segmentation).sort()))
  console.log(allRequisites)
  const [filters, setFilters] = useState<string[]>([])
  const [showWorldcoinOnly, setShowWorldcoinOnly] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentSurvey, setCurrentSurvey] = useState<typeof surveys[0] | null>(null)
  const [isEligible, setIsEligible] = useState(false)
  console.log(surveys)

  const router = useRouter()
  
  const toggleFilter = (filter: string) => {
    setFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    )
  }

  const filteredSurveys = surveys.filter(survey => 
    (filters.length === 0 || filters.every(filter => survey.segmentation.includes(filter))) &&
    (!showWorldcoinOnly || survey.requirements.includes("World ID"))
  )

  const checkEligibilityAndParticipate = (survey: typeof surveys[0]) => {
    setCurrentSurvey(survey)
    // Mock eligibility check - in a real app, this would be based on user data
    setIsEligible(Math.random() > 0.5)
    setModalOpen(true)
  }

  const participateInSurvey = () => {
    router.push(`/participant/available/${currentSurvey?.id}`);
    setModalOpen(false);
  }




  return (
    <main className={`${ibm.className} container mx-auto p-4`}>
      <Filters showWorldcoinOnly={showWorldcoinOnly} setShowWorldcoinOnly={setShowWorldcoinOnly} filters={filters} toggleFilter={toggleFilter} allRequisites={allRequisites} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSurveys.map((survey) => (
          <SurveyTag key={survey.id} survey={survey} checkEligibilityAndParticipate={checkEligibilityAndParticipate} />
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
    </main>
  )
}