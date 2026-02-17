import { defineStore } from 'pinia'
import { myMSALObj, msalConfig, graphScopes } from '../config/msalConfig'
import { type AccountInfo, InteractionRequiredAuthError } from '@azure/msal-browser'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    user: null as AccountInfo | null,
    accessToken: '',
    loginError: ''
  }),
  actions: {
    async login() {
      await myMSALObj.loginRedirect(graphScopes)
    },
    async logout() {
      await myMSALObj.logoutRedirect({ postLogoutRedirectUri: msalConfig.auth.postLogoutUri })
      this.isAuthenticated = false
      this.user = null
      this.accessToken = ''
    },
    async handleRedirect() {
      try {
        const response = await myMSALObj.handleRedirectPromise()
        if (response?.account) this.setActiveAccount(response.account)
        else {
          const accounts = myMSALObj.getAllAccounts()
          if (accounts.length > 0) this.setActiveAccount(accounts[0])
        }
      } catch (err) {
        console.error('Redirect failed', err)
        this.loginError = 'Authentication failed'
      }
    },
    setActiveAccount(account: AccountInfo) {
      myMSALObj.setActiveAccount(account)
      this.user = account
      this.isAuthenticated = true
      this.acquireTokenSilent()
    },
    async acquireTokenSilent() {
      if (!this.user) return
      try {
        const tokenResponse = await myMSALObj.acquireTokenSilent({ account: this.user, ...graphScopes })
        this.accessToken = tokenResponse.accessToken
      } catch (err: any) {
        if (err instanceof InteractionRequiredAuthError) {
          await myMSALObj.acquireTokenRedirect(graphScopes)
        }
      }
    }
  }
})
