import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import generatedRoutes from 'virtual:generated-pages'
import { setupLayouts } from 'virtual:generated-layouts'
import { createPinia } from 'pinia'
import { createHead } from '@vueuse/head'
import App from '@/App.vue'
import vheme from '@/libs/vheme'
import '@/styles/main.css'
const routes = setupLayouts(generatedRoutes)

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        offset: { x: 0, y: 10 },
      }
    }
    else {
      return { el: 'body' }
    }
  },
})

const pinia = createPinia()
const head = createHead()

const app = createApp(App)

app.use(vheme)
app.use(router)
app.use(pinia)
app.use(head);
app.mount('#app')
