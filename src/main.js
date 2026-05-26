import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

(async () => {

    const app = createApp(App)

    const components = import.meta.glob(
        './components/framework/**/*.vue'
    )

    for (const path in components) {

        const fileName = path
            .split('/')
            .pop()
            .replace(/\.vue$/, '')

        const module = await components[path]()

        app.component(fileName, module.default)
    }

app.use(createPinia())
    app.use(router)

    await router.isReady()

    app.mount('#app')

})()