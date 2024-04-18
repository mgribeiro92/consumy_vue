<script setup lang="ts">

import Home from '@/components/Home.vue';
import NavBar from '@/components/NavBar.vue';
import SignIn from '@/components/SignIn.vue';
import { ref } from 'vue';
import { Auth } from '@/auth'

const auth = new Auth()
const isLoggedIn = ref(auth.isLoggedIn())

</script>

<template>

  <template v-if="isLoggedIn">
    <NavBar />    
    <Home />   
  </template>
  
  <template v-else>
    <SignIn/>
  </template>
  
</template>

