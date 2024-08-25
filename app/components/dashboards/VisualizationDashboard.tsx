"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useState } from "react";

// const surveyData = {
//   index: "001",
//   title: "Customer Satisfaction Survey",
//   description: "Results of our customer satisfaction survey.",
//   questions: [
//     {
//       id: "q1",
//       type: "radio",
//       question: "How satisfied are you with our product?",
//       options: [
//         "Very Satisfied",
//         "Satisfied",
//         "Neutral",
//         "Dissatisfied",
//         "Very Dissatisfied",
//       ],
//       results: [
//         { name: "Very Satisfied", value: 45 },
//         { name: "Satisfied", value: 30 },
//         { name: "Neutral", value: 15 },
//         { name: "Dissatisfied", value: 7 },
//         { name: "Very Dissatisfied", value: 3 },
//       ],
//     },
//     {
//       id: "q2",
//       type: "checkbox",
//       question: "Which features do you use most? (Select all that apply)",
//       options: ["Feature A", "Feature B", "Feature C", "Feature D"],
//       results: [
//         { name: "Feature A", value: 75 },
//         { name: "Feature B", value: 60 },
//         { name: "Feature C", value: 45 },
//         { name: "Feature D", value: 30 },
//       ],
//     },
//   ],
// };

// Count Answers should get each answer and count the number of times it appears
function countAnswers(answers, id) {
  const results = {};
  answers.forEach((answer) => {
    const question = answer.data.find((data) => data.index === id);
    if (question) {
      question.answers.forEach((answer) => {
        if (results[answer]) {
          results[answer] += 1;
        } else {
          results[answer] = 1;
        }
      });
    }
  });

  return Object.keys(results).map((key) => ({
    name: key,
    value: results[key],
  }));
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function VisualizationDashboard({ survey, answers }) {
  const [activeTab, setActiveTab] = useState("q1");

  const surveyData = {
    name: survey.name,
    description: survey.description,
    questions: survey.questions.map((question) => {
      const results = countAnswers(answers, question.index);
      return {
        id: question.index,
        multiple: question.multiple,
        question: question.question,
        options: question.options,
        results,
        amount: answers.length,
      };
    }),
  };

  console.log("Questions", survey.questions);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-light">{surveyData.name}</h1>
      <p className="text-lg mb-8 text-light">{surveyData.description}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {surveyData.questions.map((question) => (
          <Card key={question.id}>
            <CardHeader>
              <CardTitle>{question.question}</CardTitle>
              <CardDescription>Answers:{question.amount}</CardDescription>
            </CardHeader>
            <CardContent>
              {question && (
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    {!question.multiple ? (
                      <PieChart>
                        <Pie
                          data={question.results}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={150}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {question.results.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    ) : (
                      <BarChart data={question.results}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8">
                          {question.results.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    )}
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
