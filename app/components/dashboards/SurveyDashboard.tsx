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
import { useSession } from "next-auth/react"

const ibm = IBM_Plex_Mono({
  weight: ["100", "200", "300", "400", "700"],
  subsets: ["latin"],
})



export default function SurveyDashboard({surveys}) {
  const allRequisites = Array.from(new Set(surveys.flatMap(survey => survey.segmentation).sort()))
  const [filters, setFilters] = useState<string[]>([])
  const [showWorldcoinOnly, setShowWorldcoinOnly] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentSurvey, setCurrentSurvey] = useState<typeof surveys[0] | null>(null)
  const [isEligible, setIsEligible] = useState(false)
  const { data: session, status } = useSession();

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
    const elegible = survey.requirements.includes("World ID") && (session !== null)  
    console.log("Sesion World ID", session)
    setIsEligible(elegible)
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