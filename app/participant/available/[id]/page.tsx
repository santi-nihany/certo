import SingleSurvey from "@/app/components/dashboards/SingleSurvey";
import { getSurvey } from "@/app/api/api";

export default async function Home({params}) {
   const {id} = params
   console.log(id)

    const survey = await getSurvey(id)
    return (
        <SingleSurvey survey={survey} />
    )
}