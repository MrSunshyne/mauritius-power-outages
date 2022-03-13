import Configurator from './components/Configurator.vue'
import '@/libs/vheme/themes.css'

export default {
  install: (app, options) => {
    /* declare global component */
    app.component('Configurator', Configurator as any)
  },
}
