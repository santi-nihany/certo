"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { pushSurvey, Survey, Question } from "@/app/api/api";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useActiveAccount } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";
import { approveUSDC, createSurvey } from "@/app/api/survey";

type QuestionType = "multipleChoice" | "checkbox";

interface LocalQuestion {
  text: string;
  type: QuestionType;
  options: string[];
  is_ac: boolean;
  ac_correct?: string;
}

interface SurveyParameters {
  participantQuota: {
    enabled: boolean;
    quota: string;
    reward: {
      enabled: boolean;
      amount: string;
    };
  };
  worldId: "required" | "optional";
  quarkId: "required" | "optional";
  surveyEndDate: Date;
}

const client = createThirdwebClient({
  clientId: "989b407de9ce25994a3ba556785c54f6",
});

export default function CreateSurvey() {
  const router = useRouter();
  const account = useActiveAccount();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<LocalQuestion[]>([
    { text: "", type: "multipleChoice", options: [""], is_ac: false },
  ]);
  const [segmentations, setSegmentations] = useState<string[]>([""]);
  const [parameters, setParameters] = useState<SurveyParameters>({
    participantQuota: {
      enabled: false,
      quota: "",
      reward: {
        enabled: false,
        amount: "",
      },
    },
    worldId: "optional",
    quarkId: "optional",
    surveyEndDate: new Date(),
  });

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: "",
        type: "multipleChoice",
        options: [""],
        is_ac: false,
        ac_correct: "",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (
    index: number,
    field: keyof LocalQuestion,
    value: any
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const updateOption = (
    questionIndex: number,
    optionIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const updateParameters = (field: string, value: any) => {
    setParameters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateSegmentation = (index: number, value: string) => {
    const updatedSegmentations = [...segmentations];
    updatedSegmentations[index] = value;
    setSegmentations(updatedSegmentations);
  };

  const addSegmentation = () => {
    setSegmentations([...segmentations, ""]);
  };

  const removeSegmentation = (index: number) => {
    setSegmentations(segmentations.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Construct the requirements array dynamically
    const requirements = [];
    if (parameters.worldId === "required") requirements.push("World ID");
    if (parameters.quarkId === "required") requirements.push("Quark ID");

    // Convert local questions to backend-compatible questions
    const backendQuestions: Question[] = questions.map((q, index) => ({
      index,
      question: q.text,
      options: q.options,
      multiple: q.type === "checkbox",
      is_ac: q.is_ac,
      ac_correct: q.ac_correct,
    }));

    // Construct the new survey object
    const newSurvey: Survey = {
      name: title,
      description,
      owner: account?.address, // Replace with actual owner ID
      prize: parameters.participantQuota.reward.enabled
        ? parseFloat(parameters.participantQuota.reward.amount)
        : 0,
      timeLimit: new Date(parameters.surveyEndDate), // Set this if you have a specific time limit in mind
      maxAmount: parseInt(parameters.participantQuota.quota) || 0,
      minAmount: 1, // Set this if applicable
      questions: backendQuestions,
      requirements,
      created_at: new Date(),
      segmentation: segmentations, // Add the segmentations
    };

    console.log(
      client,
      account,
      newSurvey.prize * 1e18,
      newSurvey.minAmount,
      newSurvey.maxAmount,
      Math.floor(newSurvey.timeLimit.getTime() / 1000)
    );
    try {
      // await approveUSDC(client, account, newSurvey.prize * 1e18);
      // await createSurvey(
      //   client,
      //   account,
      //   newSurvey.prize * 1e18,
      //   newSurvey.minAmount,
      //   newSurvey.maxAmount,
      //   Math.floor(newSurvey.timeLimit.getTime() / 1000)
      // );

      // Push the survey to the backend
      await pushSurvey(newSurvey);

      // Redirect to dashboard
      router.push("/researcher/dashboard");
    } catch (error) {
      console.error("Failed to create survey:", error);
    }
  };

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
                <Label htmlFor="SurveyEndDate">Survey End Date</Label>
                <Input
                  id="SurveyEndDate"
                  type="date"
                  value={parameters.surveyEndDate}
                  onChange={(e) =>
                    updateParameters("surveyEndDate", e.target.value)
                  }
                  className="w-30"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="participantQuota">Participant Quota</Label>
                <Switch
                  id="participantQuota"
                  checked={parameters.participantQuota.enabled}
                  onCheckedChange={(checked) =>
                    updateParameters("participantQuota", {
                      ...parameters.participantQuota,
                      enabled: checked,
                    })
                  }
                />
              </div>
              {parameters.participantQuota.enabled && (
                <div className="space-y-4 pl-4">
                  <div className="space-y-2">
                    <Label htmlFor="quotaAmount">Quota Amount</Label>
                    <Input
                      id="quotaAmount"
                      value={parameters.participantQuota.quota}
                      onChange={(e) =>
                        updateParameters("participantQuota", {
                          ...parameters.participantQuota,
                          quota: e.target.value,
                        })
                      }
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
                      onCheckedChange={(checked) =>
                        updateParameters("participantQuota", {
                          ...parameters.participantQuota,
                          reward: {
                            ...parameters.participantQuota.reward,
                            enabled: checked,
                          },
                        })
                      }
                    />
                  </div>
                  {parameters.participantQuota.reward.enabled && (
                    <div className="space-y-2">
                      <Label htmlFor="rewardAmount">Reward Amount (USD)</Label>
                      <Input
                        id="rewardAmount"
                        value={parameters.participantQuota.reward.amount}
                        onChange={(e) =>
                          updateParameters("participantQuota", {
                            ...parameters.participantQuota,
                            reward: {
                              ...parameters.participantQuota.reward,
                              amount: e.target.value,
                            },
                          })
                        }
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
                  onValueChange={(value) => updateParameters("worldId", value)}
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
                  onValueChange={(value) => updateParameters("quarkId", value)}
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
            <Button
              type="button"
              onClick={addSegmentation}
              variant="outline"
              className="w-full"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Segmentation
            </Button>
          </div>
          <div className="space-y-4">
            <Label>Questions</Label>
            {questions.map((question, questionIndex) => (
              <div
                key={questionIndex}
                className="bg-gray-50 p-4 rounded-md space-y-2 relative"
              >
                <div className="flex items-center space-x-2">
                  <Input
                    value={question.text}
                    onChange={(e) =>
                      updateQuestion(questionIndex, "text", e.target.value)
                    }
                    placeholder={`Question ${questionIndex + 1}`}
                    required
                    className="flex-grow"
                  />
                  <Select
                    value={question.type}
                    onValueChange={(value) =>
                      updateQuestion(questionIndex, "type", value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Question Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multipleChoice">
                        Multiple Choice
                      </SelectItem>
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
                    <div
                      key={optionIndex}
                      className="flex items-center space-x-2"
                    >
                      {question.is_ac && (
                        <input
                          type="radio"
                          name={`ac_correct_${questionIndex}`}
                          value={option}
                          checked={question.ac_correct === option}
                          onChange={(e) =>
                            updateQuestion(
                              questionIndex,
                              "ac_correct",
                              e.target.value
                            )
                          }
                        />
                      )}
                      <Input
                        value={option}
                        onChange={(e) =>
                          updateOption(
                            questionIndex,
                            optionIndex,
                            e.target.value
                          )
                        }
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
                <div className="flex justify-end mt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={question.is_ac}
                            onChange={(e) =>
                              updateQuestion(
                                questionIndex,
                                "is_ac",
                                e.target.checked
                              )
                            }
                          />
                          <span>Is attention check</span>
                        </Label>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        Adding an attention check question can help ensure the
                        quality of responses by identifying inattentive
                        participants.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            ))}
            <Button
              type="button"
              onClick={addQuestion}
              variant="outline"
              className="w-full"
            >
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
  );
}
