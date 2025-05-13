import { useQuery } from "@tanstack/react-query";
import { decodeHtmlEntities } from "../utils";

type QuestionParams = {
  amount?: number;
  category?: number;
  difficulty?: "easy" | "medium" | "hard";
  type?: "multiple" | "boolean";
  encode?: "url3986" | "base64" | "none";
  token?: string;
};

export type Question = {
  category: string
  type: string
  difficulty: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export const useGetQuestions = (
  params: QuestionParams = { amount: 10, type: "multiple" }
) => {
  return useQuery({
    queryKey: ["get-questions", params],
    queryFn: async () => {
      // Build URL with query parameters
      const url = new URL("/api/proxy/api.php", window.location.origin);

      // Add all params to the URL
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });

      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      };

      const response = await fetch(url.toString(), fetchOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      // Process questions to decode HTML entities
      return data.results.map((q: Question) => ({
        ...q,
        category: decodeHtmlEntities(q.category),
        question: decodeHtmlEntities(q.question),
        correct_answer: decodeHtmlEntities(q.correct_answer),
        incorrect_answers: q.incorrect_answers.map(decodeHtmlEntities),
      }));
    },
  });
};
