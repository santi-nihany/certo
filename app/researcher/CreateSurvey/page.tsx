"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { pushSurvey, Survey, Question } from '@/app/api/api'

type QuestionType = 'multipleChoice' | 'checkbox'

interface LocalQuestion {
  text: string
  type: QuestionType
  options: string[]
}

interface SurveyParameters {
  participantQuota: {
    enabled: boolean
    quota: string
    reward: {
      enabled: boolean
      amount: string
    }
  }
  worldId: 'required' | 'optional'
  quarkId: 'required' | 'optional'
}

export default function CreateSurvey() {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<LocalQuestion[]>([
    { text: '', type: 'multipleChoice', options: [''] }
  ])
  const [segmentations, setSegmentations] = useState<string[]>([''])
  const [parameters, setParameters] = useState<SurveyParameters>({
    participantQuota: {
      enabled: false,
      quota: '',
      reward: {
        enabled: false,
        amount: ''
      }
    },
    worldId: 'optional',
    quarkId: 'optional'
  })

  const addQuestion = () => {
    setQuestions([...questions, { text: '', type: 'multipleChoice', options: [''] }])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: keyof LocalQuestion, value: string) => {
    const updatedQuestions = [...questions]
    if (field === 'type') {
      updatedQuestions[index] = { 
        ...updatedQuestions[index], 
        [field]: value as QuestionType 
      }
    } else {
      updatedQuestions[index] = { ...updatedQuestions[index], [field]: value }
    }
    setQuestions(updatedQuestions)
  }

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options.push('')
    setQuestions(updatedQuestions)
  }

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options[optionIndex] = value
    setQuestions(updatedQuestions)
  }

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions]
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex)
    setQuestions(updatedQuestions)
  }

  const updateParameters = (field: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const updateSegmentation = (index: number, value: string) => {
    const updatedSegmentations = [...segmentations]
    updatedSegmentations[index] = value
    setSegmentations(updatedSegmentations)
  }

  const addSegmentation = () => {
    setSegmentations([...segmentations, ''])
  }

  const removeSegmentation = (index: number) => {
    setSegmentations(segmentations.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Construct the requirements array dynamically
    const requirements = []
    if (parameters.worldId === 'required') requirements.push('World ID')
    if (parameters.quarkId === 'required') requirements.push('Quark ID')

    // Convert local questions to backend-compatible questions
    const backendQuestions: Question[] = questions.map((q, index) => ({
      index,
      question: q.text,
      options: q.options,
      multiple: q.type === 'checkbox'
    }))

    // Construct the new survey object
    const newSurvey: Survey = {
        name: title,
        description,
        owner: 'owner-id',  // Replace with actual owner ID
        prize: parameters.participantQuota.reward.enabled ? parseFloat(parameters.participantQuota.reward.amount) : 0,
        timeLimit: new Date(),  // Set this if you have a specific time limit in mind
        maxAmount: parseInt(parameters.participantQuota.quota) || 0,
        minAmount: 0,  // Set this if applicable
        questions: backendQuestions,
        requirements, 
        created_at: new Date(),
        segmentation: segmentations // Add the segmentations
    }

    try {
      // Push the survey to the backend
      await pushSurvey(newSurvey)

      // Redirect to dashboard
      router.push('/researcher/dashboard')
    } catch (error) {
      console.error('Failed to create survey:', error)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Create a New Survey</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Survey Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter survey title"
              required
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter survey description"
              rows={3}
              className="w-full"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Survey Parameters</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="participantQuota">Participant Quota</Label>
                <Switch
                  id="participantQuota"
                  checked={parameters.participantQuota.enabled}
                  onCheckedChange={(checked) => updateParameters('participantQuota', { ...parameters.participantQuota, enabled: checked })}
                />
              </div>
              {parameters.participantQuota.enabled && (
                <div className="space-y-4 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="quotaAmount">Quota Amount</Label>
                    <Input
                      id="quotaAmount"
                      value={parameters.participantQuota.quota}
                      onChange={(e) => updateParameters('participantQuota', { ...parameters.participantQuota, quota: e.target.value })}
                      placeholder="Enter quota amount"
                      type="number"
                      className="w-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="rewardEnabled">Enable Reward</Label>
                    <Switch
                      id="rewardEnabled"
                      checked={parameters.participantQuota.reward.enabled}
                      onCheckedChange={(checked) => updateParameters('participantQuota', { ...parameters.participantQuota, reward: { ...parameters.participantQuota.reward, enabled: checked } })}
                    />
                  </div>
                  {parameters.participantQuota.reward.enabled && (
                    <div className="space-y-2">
                      <Label htmlFor="rewardAmount">Reward Amount (USD)</Label>
                      <Input
                        id="rewardAmount"
                        value={parameters.participantQuota.reward.amount}
                        onChange={(e) => updateParameters('participantQuota', { ...parameters.participantQuota, reward: { ...parameters.participantQuota.reward, amount: e.target.value } })}
                        placeholder="Enter reward amount"
                        type="number"
                        step="0.01"
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="worldId">World ID</Label>
                <Select
                  value={parameters.worldId}
                  onValueChange={(value) => updateParameters('worldId', value)}
                >
                  <SelectTrigger id="worldId">
                    <SelectValue placeholder="Select World ID requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="required">Required</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="quarkId">Quark ID</Label>
                <Select
                  value={parameters.quarkId}
                  onValueChange={(value) => updateParameters('quarkId', value)}
                >
                  <SelectTrigger id="quarkId">
                    <SelectValue placeholder="Select Quark ID requirement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="required">Required</SelectItem>
                    <SelectItem value="optional">Optional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <Label>Participants Segmentations</Label>
            {segmentations.map((segmentation, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={segmentation}
                  onChange={(e) => updateSegmentation(index, e.target.value)}
                  placeholder={`Segmentation ${index + 1}`}
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => removeSegmentation(index)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" onClick={addSegmentation} variant="outline" className="w-full">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Another Segmentation
            </Button>
          </div>
          <div className="space-y-4">
            <Label>Questions</Label>
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="bg-gray-50 p-4 rounded-md space-y-2">
                <div className="flex items-center space-x-2">
                  <Input
                    value={question.text}
                    onChange={(e) => updateQuestion(questionIndex, 'text', e.target.value)}
                    placeholder={`Question ${questionIndex + 1}`}
                    required
                    className="flex-grow"
                  />
                  <Select
                    value={question.type}
                    onValueChange={(value) => updateQuestion(questionIndex, 'type', value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                      <SelectItem value="checkbox">Checkbox</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeQuestion(questionIndex)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div className="pl-4 space-y-2">
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                        placeholder={`Option ${optionIndex + 1}`}
                        required
                        className="flex-grow"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeOption(questionIndex, optionIndex)}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addOption(questionIndex)}
                  >
                    Add Option
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" onClick={addQuestion} variant="outline" className="w-full">
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>
          <Button type="submit" className="w-full">
            Create Survey
          </Button>
        </form>
      </div>
    </div>
  )
}
