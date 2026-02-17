import { ref } from 'vue'
import { myMSALObj, state, graphScopes } from './msalConfig'

export function useAuth() {
  const isAuthenticated = ref(false)

  const login = async () => {
    await myMSALObj.loginRedirect(graphScopes)
  }

  const logout = () => {
    myMSALObj.logoutRedirect()
    state.isAuthenticated = false
    state.user = null
    isAuthenticated.value = false
  }

  const handleRedirect = async () => {
    const response = await myMSALObj.handleRedirectPromise()
    if (response?.account) {
      state.user = response.account
      state.isAuthenticated = true
      myMSALObj.setActiveAccount(response.account)
    } else {
      const accounts = myMSALObj.getAllAccounts()
      if (accounts.length > 0) {
        state.user = accounts[0]
        state.isAuthenticated = true
        myMSALObj.setActiveAccount(accounts[0])
      } else {
        // If no account found, redirect immediately
        await login()
      }
    }
    isAuthenticated.value = state.isAuthenticated
  }

  return { isAuthenticated, login, logout, handleRedirect }
}
