<template>
  <div class="space-y-6">
    <h1
      class="text-3xl font-extrabold capitalize text-secondary-350"
    >
      {{ $route.meta.title || $route.name }}
    </h1>

    <div>
      <div class="flex space-x-4 h-48 text-primary-500">
        <Logo class="h-48 w-48" />

        <form class="space-y-6" action="#" method="POST">
          <div class="text-text-100">
            <div class="py-5 gap-10">
              <div v-for="color in schemes" :key="color" class="flex gap-2 items-center uppercase">
                <input :id="color" v-model="preffered" type="radio" :value="color" />
                <label :for="color" class="cursor-pointer">{{ color }}</label>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div class="md:grid md:grid-cols-3 md:gap-6">
      <div class="mt-5 md:mt-0 md:col-span-2">
        <div class="p-10 border space-y-10 bg-layer-400 mt-10 rounded-md">
          <div class="flex gap-10">
            <div class="w-16 h-16 rounded-md shadow-md grid place-items-center bg-primary-100">
              100
            </div>
            <div class="w-16 h-16 rounded-md shadow-md grid place-items-center bg-primary-200">
              200
            </div>
            <div class="w-16 h-16 rounded-md shadow-md grid place-items-center bg-primary-300">
              300
            </div>
            <div class="w-16 h-16 rounded-md shadow-md grid place-items-center bg-primary-400">
              400
            </div>
            <div class="w-16 h-16 rounded-md shadow-md grid place-items-center bg-primary-500">
              500
            </div>
            <div class="w-16 h-16 rounded-md shadow-md grid place-items-center bg-primary-600">
              600
            </div>
            <div class="w-16 h-16 rounded-md shadow-md grid place-items-center bg-primary-700">
              700
            </div>
            <div class="w-16 h-16 rounded-md shadow-md grid place-items-center bg-primary-800">
              800
            </div>
            <div class="w-16 h-16 rounded-md shadow-md grid place-items-center bg-primary-900">
              900
            </div>
          </div>
          <div class="flex h-full">
            <div class="flex gap-10 w-[700px] h-fullflex-wrap text-text-100">
              <div class="bg-layer-100 shadow-md grid p-2 text-2xl rounded-2xl w-3/4 h-full">
                Layer 100
                <div class="bg-layer-200 shadow-md grid p-2 text-2xl rounded-2xl w-3/4 h-full">
                  Layer 200
                  <div class="bg-layer-300 shadow-md grid p-2 text-2xl rounded-2xl w-3/4 h-full">
                    Layer 300
                    <div
                      class="bg-layer-400 shadow-md grid p-2 text-2xl rounded-2xl w-3/4 h-full"
                    >
                      Layer 400
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class>
              <h1 class="text-text-100">
                Playground
              </h1>
              <div class="py-10">
                <input
                  v-model="hueValue"
                  type="range"
                  class="w-full"
                  :min="0"
                  :max="359"
                  :step="1"
                />
              </div>

              <div class="space-y-2">
                <div class="flex items-center space-x-5">
                  <div class="bg-primary-500 w-16 h-16 rounded-md shadow-md"></div>

                  <div class="text-text-100">
                    Brand Color
                  </div>
                </div>
                <div class="flex items-center space-x-5">
                  <div class="bg-text-0 w-16 h-16 rounded-md shadow-md"></div>
                  <div class="text-text-100">
                    Text Color 100
                  </div>
                </div>
                <div class="flex items-center space-x-5">
                  <div class="bg-text-1 w-16 h-16 rounded-md shadow-md"></div>
                  <div class="text-text-200">
                    Text Color 200
                  </div>
                </div>
                <div class="flex items-center space-x-5">
                  <div class="bg-text-2 w-16 h-16 rounded-md shadow-md"></div>
                  <div class="text-text-300">
                    Text Color 300
                  </div>
                </div>
                <div class="flex items-center space-x-5">
                  <div class="bg-text-3 w-16 h-16 rounded-md shadow-md"></div>
                  <div class="text-text-400">
                    Text Color 400
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Logo from './Logo.vue'
export default {
  components: { Logo },
  data() {
    return {
      email: '',
      schemes: ['light', 'dim', 'dark'],
      preffered: 'light',
      hueValue: 168,
      saturationValue: 90,
      lightnessValue: 15,
    }
  },
  computed: {
    watchHSL() {
      return `--brand-hue:${this.hueValue}; --brand-saturation:${this.saturationValue}%; --brand-lightness:${this.lightnessValue}%;`
    },
  },
  watch: {
    preffered: {
      immediate: false,
      handler(n: string, o: string) {
        this.setColorScheme(n)
      },
    },
    watchHSL: {
      immediate: true,
      handler(n, o) {
        document.body.setAttribute('style', `${n}`)
      },
    },
  },
  methods: {

    setColorScheme(preffered: string): any {
      document.body.setAttribute('color-scheme', preffered)
    },
  },
}
</script>
