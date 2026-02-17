import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { myMSALObj } from './config/msalConfig'
// Vuetify imports
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// Icons
import '@mdi/font/css/materialdesignicons.css'


const vuetify = createVuetify({
  components,
  directives,
})

// createApp(App)
//   .use(router)
//   .use(vuetify)
//   .mount('#app')
async function bootstrap() {
  // 1️⃣ Initialize MSAL
  await myMSALObj.initialize()

  // 2️⃣ Handle redirect BEFORE mounting app
  const response = await myMSALObj.handleRedirectPromise()

  if (response?.account) {
    myMSALObj.setActiveAccount(response.account)
  }

  // 3️⃣ Mount Vue app AFTER MSAL is ready
  createApp(App)
    .use(router)
    .use(vuetify)
    .mount('#app')
}

bootstrap()
