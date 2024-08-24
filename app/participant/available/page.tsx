import SurveyDashboard from "@/app/components/dashboards/SurveyDashboard";
import { getAllSurveys } from "@/app/api/api";

export default async function Home () {
  const surveys = await getAllSurveys()
  return (
      <SurveyDashboard surveys={surveys} />
  )
}