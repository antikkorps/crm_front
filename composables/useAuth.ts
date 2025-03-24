import type { ApiResponse, LoginResponse } from "~/types/response"
import type { User } from "~/types/user"

export const useAuth = () => {
  const user = useState<User | null>("user", () => null)
  const isAuthenticated = computed(() => !!user.value)
  const { api } = useApiService()
  const tokenCookie = useCookie<string | null>("auth_token")

  // Helper function to properly type API responses
  const parseApiResponse = <T>(response: any): ApiResponse<T> => {
    return response.data as ApiResponse<T>
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      })

      const responseData = parseApiResponse<LoginResponse>(response)
      tokenCookie.value = responseData.data.token
      user.value = responseData.data.user
      return responseData
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  const logout = () => {
    user.value = null
    tokenCookie.value = null
    navigateTo("/login")
  }

  const checkAuth = async () => {
    if (tokenCookie.value) {
      try {
        const response = await api.get("/auth/me")
        const userData = parseApiResponse<User>(response)
        user.value = userData.data
        return userData.data
      } catch (error) {
        console.error("Auth check failed:", error)
        logout()
      }
    }
    return null
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  }
}
