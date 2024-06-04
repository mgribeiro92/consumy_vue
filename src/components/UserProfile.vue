<script setup lang="ts">

import NavBar from './NavBar.vue';
import { User } from '../user'
import { ref, onMounted } from 'vue';

const user = new User()
const user_profile = ref([])
const update_user = ref(false)
const email = defineModel<string>('email')
const password = defineModel<string>('password')

onMounted(async () => {
  user_profile.value = await user.userProfile()
  console.log(user_profile)
})

function onUpdate(){
  console.log('lets atualizar')
  user.userUpdate(email.value || '', password.value || '', user_profile.value.id)
}

</script>

<template>

  <NavBar/>
  <div class="container">
    <h2>Usuário</h2>
    <hr>

    <div class="user-profile">
      <div v-if="!update_user">
        <p>Nome do usuario: {{ user_profile.email }}</p>
        <button @click="update_user = true">Editar</button>  
      </div>
      <div v-else class="update-user">
        <p>Altere seus dados</p>
        <form @submit.prevent="onUpdate">
          <label>Email</label>
          <input type="email" class="form-control" v-model="email">
          <label>Senha</label>
          <input type="password" class="form-control" v-model="password">
          <input type="submit" class="btn-login" value="Login"></input>
        </form>
      </div>
    </div>
  </div>
  
</template>

<style>

  .update-user {
    width: 400px;
  }

</style>