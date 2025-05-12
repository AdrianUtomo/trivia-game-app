import { useQuery } from "@tanstack/react-query"

export interface Category {
  id: number;
  name: string;
}

export interface CategoryData {
  trivia_categories: Category[];
}

export const useGetCategories = () => {
  return useQuery<CategoryData>({
    queryKey: ["get-categories"],
    queryFn: async () => {
      const url = new URL("/api/proxy/api_category.php", window.location.origin)
      
      // Prepare fetch options
      const fetchOptions: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }

      const response = await fetch(url.toString(), fetchOptions)
      return response.json()
    }
  })
}