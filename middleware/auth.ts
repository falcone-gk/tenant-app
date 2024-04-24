export default defineNuxtRouteMiddleware(() => {
    const token = useCookie('token', {
        sameSite: 'strict'
    })
    if (!token.value) {
        return navigateTo('/login')
    }
})
