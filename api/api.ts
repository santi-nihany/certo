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
  segmentation: string[]
  created_at?: Date
}

// worldID -> index 0 -> Required/Optional
// QuarkID -> index 1 -> Required/Optional
// Quota -> index 2 -> Nan or number
// Prize -> index 3 -> yes/no
// 
// Example: Requirements = ['Required', 'Optional', '130', 'yes']

export type Question = {
  index: number
  question: string
  options: string[]
  multiple: boolean
  is_ac: boolean
}

export type Answer = {
  id?: UUID
  survey_id: UUID
  data: {index: number, answers: string[]}[]

  // For a survey with 2 questions, where the first one is a multiple choice, and the second one is a checkbox.
  // Data = {[0, ['Very Satisfied']],[1, ['Design', ['Performance]]]}
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
    .eq('surveys.id', id.toString())
  if (error) throw Error(error.message)
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
  console.log(surveyId)
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