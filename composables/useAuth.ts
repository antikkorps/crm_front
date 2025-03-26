import type { ApiResponseType, LoginResponse } from "~/types/response"
import type { User } from "~/types/user"

export const useAuth = () => {
  const user = useState<User | null>("user", () => null)
  const isAuthenticated = computed(() => !!user.value)
  const { api } = useApiService()
  const tokenCookie = useCookie<string | null>("auth_token")

  const login = async (email: string, password: string) => {
    try {
      const response = (await api.post("/auth/login", {
        email,
        password,
      })) as ApiResponseType

      console.log("API response:", response)

      const responseData = (response.data || response) as LoginResponse

      console.log("Response data:", responseData)

      tokenCookie.value = responseData.token
      user.value = responseData.user
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
        const response = (await api.get("/auth/me")) as ApiResponseType
        const userData = (response.data || response) as User
        user.value = userData
        return userData
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
