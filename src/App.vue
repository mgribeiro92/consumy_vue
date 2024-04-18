<script setup>
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue';

</script>

<template>

  <NavBar v-if="$route.meta.showNavBar != false"/>
  <RouterView />

</template>




