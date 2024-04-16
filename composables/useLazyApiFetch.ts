type useLazyFetchType = typeof useLazyFetch

export const useLazyApiFetch: useLazyFetchType = (request: any, options?: any) => {
  return useLazyFetch(request, {
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
