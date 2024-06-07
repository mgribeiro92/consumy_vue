<script setup lang="ts">

import NavBar from './NavBar.vue';
import type { UserType, Address } from '../types'
import { User } from '../user'
import { ref, onMounted } from 'vue';

const user = new User()
const user_profile = ref<UserType>({} as UserType)
const address = ref<Address>({} as Address);
const update_user = ref(false)
const email = defineModel<string>('email')
const password = defineModel<string>('password')

onMounted(async () => {
  const user_info = await user.userProfile()
  user_profile.value = user_info
  address.value = user_info.address
  console.log(user_profile.value)
})

function onUpdate(){
  console.log('lets atualizar')
  user.userUpdate(email.value || '', password.value || '', user_profile.value.id)
}

function deleteUser() {
  console.log('excluir usuario')
}

</script>

<template>

  <NavBar/>
  <div class="container">
    <h2>Usuário</h2>
    <hr>

    <div v-if="!update_user" class="user-profile">
      <div class="user-title">Email</div>
      <div>{{ user_profile.email }}</div>      
      <div class="user-title">Endereço:</div>
      <div><span class="user-subtitle">Rua: </span>{{ address.street }}, {{ address.number }}</div>
      <div><span class="user-subtitle">Cidade: </span>{{ address.city }} - {{ address.state }}</div>
      <div><span class="user-subtitle">CEP: </span>{{ address.zip_code }}</div>
      <div><span class="user-subtitle">Pais: </span>{{ address.country }}</div>
      <button @click="update_user = true">Editar</button>
      <button @click="deleteUser">Excluir</button> 

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
  
</template>

<style>

  .user-title {
    font-size: 20px;
    font-weight: bold;
  }

  .user-subtitle {
    font-weight: bold;
  }

</style>