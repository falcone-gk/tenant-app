type useFetchType = typeof useFetch

export const useApiFetch: useFetchType = <T>(request: any, options?: any) => {
  return useFetch<T>(request, {
    ...options,

    async onResponseError({ request, response, options }) {
      if (response.status === 401) {
        const token = useCookie('token', {
          sameSite: 'strict'
        })
        token.value = null
        navigateTo('/login')
      }
    }
  })
}
