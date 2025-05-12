"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Label } from "./ui/Label";
import { Rocket, Gamepad2 } from "lucide-react";
import { Button } from "./ui/Button";
import { useGetCategories } from "@/lib/hooks/useGetCategories";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import Game from "./Game";

// Define the form schema with zod
const gameSetupSchema = z.object({
  difficulty: z.enum(["easy", "medium", "hard"], {
    required_error: "Please select a difficulty level",
  }),
  category: z.string({
    required_error: "Please select a category",
  }),
});

// Type inference from the schema
type GameSetupFormValues = z.infer<typeof gameSetupSchema>;

export default function GameSetup() {
  const { data: categoryData } = useGetCategories();
  const [formData, setFormData] = useState<GameSetupFormValues | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize react-hook-form with zod resolver
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<GameSetupFormValues>({
    resolver: zodResolver(gameSetupSchema),
    defaultValues: {
      difficulty: undefined,
      category: undefined,
    },
  });

  // Form submission handler
  const onSubmit = (data: GameSetupFormValues) => {

    // Update form data to trigger the query
    setFormData(data);
    setGameStarted(true);
  };

  if (gameStarted && formData) {
    // Ensure questionsParams is defined when passing to Game
    const gameParams = {
      amount: 10,
      category: parseInt(formData.category),
      difficulty: formData.difficulty,
      type: "multiple" as const
    };
    
    return (
      <Game questionParams={gameParams} onBackToSetup={() => {
        setGameStarted(false);
        setFormData(null);
        reset();
      }}></Game>
    )
  }

  return (
    <>
      <Card className="shadow-lg border-purple-200 dark:border-purple-900">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gamepad2 className="text-purple-600 dark:text-purple-400" />
            Game Setup
          </CardTitle>
          <CardDescription>
            Choose a category and a difficulty to start the game
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categoryData?.trivia_categories.map((category) => (
                        <SelectItem
                          value={category.id.toString()}
                          key={category.id}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">
                {errors.category.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="difficulty">Difficulty</Label>
            <Controller
              name="difficulty"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.difficulty && (
              <p className="text-sm text-red-500 mt-1">
                {errors.difficulty.message}
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleSubmit(onSubmit)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Rocket />
            Start Game
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}
