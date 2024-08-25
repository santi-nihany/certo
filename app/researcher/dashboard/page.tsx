"use client";

import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAllSurveys, Survey } from "@/app/api/api";
import { useActiveAccount } from "thirdweb/react";

export default function Dashboard() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const account = useActiveAccount();
  const router = useRouter();
  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const fetchedSurveys = await getAllSurveys();
        const filteredSurveys = fetchedSurveys.filter(
          (survey) => survey.owner === account?.address
        );
        setSurveys(filteredSurveys);
      } catch (error) {
        console.error("Failed to fetch surveys:", error);
      }
    };
    fetchSurveys();
  }, []);

  const deleteSurvey = async (id: string) => {
    // Implement survey deletion logic
    // After deletion, refresh the surveys list
    setSurveys(surveys.filter((survey) => survey.id !== id));
  };

  return (
    <div>
      {account?.address ? (
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Survey Dashboard</h1>
            <Link href="/researcher/CreateSurvey" passHref>
              <Button
                size="lg"
                className="rounded-full bg-white text-black p-4"
              >
                Create New Survey
                <PlusIcon className="ml-2 h-6 w-6 mr-2" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {surveys.map((survey) => (
              <Card
                className="relative border-primary border-4"
                key={survey.id}
              >
                <div className="absolute top-2 right-2">
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteSurvey(survey.id!)}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader>
                  <CardTitle>{survey.name}</CardTitle>
                  <CardDescription>{survey.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{survey.questions.length} question/s</span>
                    <span>
                      Created on{" "}
                      {new Date(survey.created_at!).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mt-4 gap-4 text-sm">
                    {survey.maxAmount !== 0 && (
                      <div className="mb-4">
                        <strong>Quota:</strong> {survey.maxAmount} participants
                        {survey.prize !== 0 && (
                          <div>
                            <strong>Total cost: $</strong>{" "}
                            {survey.maxAmount * survey.prize}
                          </div>
                        )}
                      </div>
                    )}
                    {survey.requirements.length > 0 && (
                      <div className="mb-4">
                        <strong>Requirements:</strong>{" "}
                        {survey.requirements.join(", ")}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-3xl font-bold text-white text-center mt-20">
            Please connect your wallet to view this page
          </h1>
          <Button className="bg-primary text-black hover:bg-black hover:border-2 hover:border-primary hover:text-primary">
            <Link href="/" passHref>
              Go back to home
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
