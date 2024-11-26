export interface Meal {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  fiber: number;
  name: string;
}

export interface UserProfile {
  age: number;
  sex: string;
  weight: number;
  height: number;
  ethnicity: string;
  goal: string;
  activity_level: string;
}

interface CalResponse {
  meals: Meal[];
}

interface AnalysisResponse {
  response: string;
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async fetchApi<T>(endpoint: string, method: string, body?: object): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json();
  }

  async estimateMealInfo(prompt: string): Promise<Meal[]> {
    const data = await this.fetchApi<CalResponse>('/cal', 'POST', { prompt });
    return data.meals;
  }

  async getDailyAnalysis(meals: Meal[], userProfile: UserProfile): Promise<string> {
    const data = await this.fetchApi<AnalysisResponse>('/analysis', 'POST', { meals, user_profile: userProfile });
    return data.response;
  }
}

// Create and export a single instance of the API service
const apiService = new ApiService(process.env.OUR_API_BASE_URL || 'http://localhost:8000');
// const apiService = new ApiService('http://localhost:8000');
export default apiService;

