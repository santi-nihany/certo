import VisualizationDashboard from "@/app/components/dashboards/VisualizationDashboard";
import { getSurvey, getAnswers } from "@/app/api/api";

export default async function Home({ params }) {
  const { id } = params;
  const survey = await getSurvey(id)
  const answers = await getAnswers(id)
  return (
    <VisualizationDashboard survey={survey} answers={answers} />
  );
}
