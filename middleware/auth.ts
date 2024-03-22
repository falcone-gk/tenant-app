export default defineNuxtRouteMiddleware((to, from) => {
    const token = useCookie('token', {
        sameSite: 'strict'
    })
    if (!token.value) {
        return navigateTo('/login')
    }
})
