export const useApiService = () => {
  const config = useRuntimeConfig()
  const token = useCookie("auth_token")
  const apiBaseUrl = config.public.apiBaseUrl

  const getHeaders = () => {
    return {
      "Content-Type": "application/json",
      Authorization: token.value ? `Bearer ${token.value}` : "",
    }
  }

  const api = {
    async get(endpoint: string) {
      try {
        return await $fetch(`${apiBaseUrl}${endpoint}`, {
          method: "GET",
          headers: getHeaders(),
        })
      } catch (error) {
        handleApiError(error)
        throw error
      }
    },

    async post(endpoint: string, data: any) {
      try {
        return await $fetch(`${apiBaseUrl}${endpoint}`, {
          method: "POST",
          headers: getHeaders(),
          body: data,
        })
      } catch (error) {
        handleApiError(error)
        throw error
      }
    },

    async put(endpoint: string, data: any) {
      try {
        return await $fetch(`${apiBaseUrl}${endpoint}`, {
          method: "PUT",
          headers: getHeaders(),
          body: data,
        })
      } catch (error) {
        handleApiError(error)
        throw error
      }
    },

    async delete(endpoint: string) {
      try {
        return await $fetch(`${apiBaseUrl}${endpoint}`, {
          method: "DELETE",
          headers: getHeaders(),
        })
      } catch (error) {
        handleApiError(error)
        throw error
      }
    },
  }

  const handleApiError = (error: any) => {
    // Gérer les erreurs (401, 403, etc.)
    const toast = useToast()

    if (error.response?.status === 401) {
      // Rediriger vers la page de connexion
      navigateTo("/login")
      toast.error("Votre session a expiré, veuillez vous reconnecter")
    } else if (error.response?.status === 403) {
      toast.error("Vous n'avez pas les permissions requises")
    } else {
      toast.error("Une erreur est survenue")
    }
  }

  return { api }
}

const useToast = () => {
  const nuxtApp = useNuxtApp()

  return {
    error: (message: string) => {
      console.error(message)
      nuxtApp.$toast.error(message)
    },
    success: (message: string) => {
      console.log(message)
      nuxtApp.$toast.success(message)
    },
    info: (message: string) => {
      console.info(message)
      nuxtApp.$toast.info(message)
    },
  }
}
