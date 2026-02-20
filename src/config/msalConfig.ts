 import { PublicClientApplication, type AccountInfo, type RedirectRequest } from '@azure/msal-browser'
 import { reactive } from 'vue';

 export const msalConfig = {
 auth: {
 clientId: 'd12df531-8e2c-4d85-ac14-ab56707004c6',
 authority: 'https://login.microsoftonline.com/1e499b00-b34d-4461-b219-a45d602ca97c',
 redirectUri: window.location.origin, // Replace with your actual redirect URI
 postLogoutUri: window.location.origin
 },
 cache: {
 cacheLocation: 'sessionStorage', // This configures where your cache will be stored
 storeAuthStateInCookie: false
 }
 }

 export const graphScopes: RedirectRequest = {
 scopes: ['user.read', 'openid', 'profile']
 };
 export const state = reactive({
 isAuthenticated: false,
 user: null as AccountInfo | null});

 export const myMSALObj = new PublicClientApplication (msalConfig)