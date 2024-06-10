<script setup lang="ts">

import NavBar from './NavBar.vue';
import type { UserType, Address } from '../types'
import { User } from '../user'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()
const user = new User()
const user_profile = ref<UserType>({} as UserType)
const user_id = ref()
const address = ref<Address>({} as Address);
const update_user = ref(false)
const email = defineModel<string>('email')
const password = defineModel<string>('password')

onMounted(async () => {
  const user_info = await user.userProfile()
  user_profile.value = user_info
  user_id.value = user_info.id
  if (user_info.address) {
    address.value = user_info.address
  }

  console.log(user_profile.value)
})

function onUpdate(){
  console.log('lets atualizar')
  user.userUpdate(email.value || '', password.value || '', user_profile.value.id)
}

function deleteUser() {
  console.log('excluir usuario')
  if (confirm('Você tem certeza que deseja desativar sua conta?')) {
    user.deleteUser(user_id.value)
    router.push('/sign_in')
    alert('Conta desativada com sucesso!')
  } else {
    alert('Ação cancelada!')
  }
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
      <button style="margin-right: 20px;" class="btn btn-outline-primary" @click="update_user = true">Editar</button>
      <button class="btn btn-outline-danger" @click="deleteUser">Excluir</button> 

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