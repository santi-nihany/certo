import VisualizationDashboard from "@/app/components/dashboards/VisualizationDashboard";
import { getSurvey, getAnswers } from "@/app/api/api";

export default async function Home({ params }) {
  const { id } = params;
  const survey = await getSurvey(id)
  const answers = await getAnswers(id)
  // Send only the answers that match the survey id
  const filteredAnswers = answers.filter((answer) => answer.survey_id === id);
  return (
    <VisualizationDashboard survey={survey} answers={filteredAnswers} />
  );
}
