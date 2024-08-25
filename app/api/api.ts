import { createClient } from '@supabase/supabase-js'
import { UUID } from 'crypto'

const supabase = createClient(
  process.env.NEXT_PUBLIC_URL ?? '',
  process.env.NEXT_PUBLIC_SECRET ?? ''
)

export type Survey = {
  id?: UUID
  name: string
  description: string
  owner: string
  prize: number
  ipfs?: string
  timeLimit: Date
  maxAmount: number
  minAmount: number
  questions: Question[]
  requirements: string[]
}

export type Question = {
  index: number
  question: string
  options: string[]
  multiple: boolean
}

export type Answer = {
  id?: UUID
  survey_id: UUID
  data: { index: number, answers: string[] }[]
}

export const getAllSurveys = async (): Promise<Survey[]> => {
  const { data, error } = await supabase
    .from('surveys')
    .select()
  if (error) throw Error(error.message)
  return data as Survey[]
}

export const getSurvey = async (id: UUID): Promise<Survey> => {
  const { data, error } = await supabase
    .from('surveys')
    .select()
    .eq('id', id.toString())
  if (error) throw Error(error.message)
    console.log(data)
  return data[0] as Survey
}

export const pushSurvey = async (survey: Survey): Promise<Survey> => {
  const { data, error } = await supabase
    .from('surveys')
    .insert(survey)
    .select()
  if (error) throw Error(error.message)
  return data[0] as Survey
}
export const getAnswers = async (surveyId: UUID): Promise<Answer[]> => {
  const { data, error } = await supabase
    .from('answers')
    .select()
  if (error) throw Error(error.message)
  const answers = (data) as Answer[]
  // todo fix
  return answers.filter(a => a.survey_id == surveyId)
}

export const pushAnswer = async (answer: Answer): Promise<Answer> => {
  const { data, error } = await supabase
  .from('answers')
  .insert(answer)
  .select()
  if (error) throw Error(error.message)
  return data[0] as Answer
}