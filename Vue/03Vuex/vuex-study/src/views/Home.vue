<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <VuexTest/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import VuexTest from '../components/VuexTest'
export default {
  name: 'Home',
  components: {
    HelloWorld,
    VuexTest
  }
}
</script>
