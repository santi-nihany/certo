"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DollarSignIcon } from "lucide-react";
import Link from "next/link";

interface SurveyTagProps {
  key?: number;
  survey: {
    id: number;
    title: string;
    description: string;
    requisites: string[];
    reward: number;
    requiresWorldcoinId: boolean;
  };
  checkEligibilityAndParticipate: (survey: any) => void;
}

export default function SurveyTag({
  survey,
  checkEligibilityAndParticipate,
}: SurveyTagProps) {
  return (
    <Card key={survey.id} className="flex flex-col border-primary border-4">
      <CardHeader>
        <CardTitle>{survey.name}</CardTitle>
        <CardDescription>{survey.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <h3 className="font-semibold mb-2">Requisites:</h3>
        <ul className="list-disc list-inside mb-4">
          {survey.segmentation?.map((requisite, index) => (
            <li key={index} className="text-sm text-gray-600">
              {requisite}
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between">
          <Badge variant="secondary" className="flex items-center gap-1">
            <DollarSignIcon className="w-4 h-4" />
            {survey.prize.toFixed(2)}
          </Badge>
          {survey.requirements.includes("World ID") && (
            <Badge variant="outline" className="bg-blue-50">
              Worldcoin ID
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button variant="outline" className="text-sm">
          <Link href={`/visualization/${survey.id}`}>View Results</Link>
        </Button>
        <Button
          className="w-full bg-primary text-dark "
          onClick={() => checkEligibilityAndParticipate(survey)}
        >
          Check Eligibility & Participate
        </Button>
      </CardFooter>
    </Card>
  );
}
