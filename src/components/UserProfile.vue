<script setup lang="ts">

import NavBar from './NavBar.vue';
import Message from './Message.vue';
import Chat from './Chat.vue'
import { Auth } from '@/auth'
import type { UserType, Address } from '../types'
import { User } from '../user'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const auth = new Auth()
const router = useRouter()
const user = new User()
const user_profile = ref<UserType>({} as UserType)
const user_id = ref()
const address = ref<Address>();
const update_user = ref(false)
const email = defineModel<string>('email')
const password = defineModel<string>('password')
const cep = ref()
const address_street = ref()
const address_number = ref()
const address_city = ref()
const address_state = ref()
const address_id = ref()
const update_address = ref(false)

onMounted(async () => {
  auth.verifyToken()
  auth.validToken()  
  getUser()
})

async function getUser() {
  const user_info = await user.userProfile()
  user_profile.value = user_info
  user_id.value = user_info.id
  if (user_info.address) {
    address.value = user_info.address
    address_city.value = address.value?.city
    address_street.value = address.value?.street
    address_state.value = address.value?.state
    address_number.value = address.value?.number
    cep.value = address.value?.zip_code
  }
}

function onUpdate(){
  user.userUpdate(email.value || '', user_profile.value.id)
}

function changeAddress() {
  address_id.value = address.value?.id
  if (!address.value) {
    console.log(address_id.value)
    user.newAddress(user_id.value, address_street.value, address_number.value, cep.value, address_city.value, address_state.value)
    getUser()
  } else {
    user.updateAddress(address_id.value, address_street.value, address_number.value, cep.value, address_city.value, address_state.value)
    getUser()
  }
  update_address.value = false
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

async function fetchAddress() {
  if (cep.value.length == 8) {
    console.log('CEP completo:', cep.value)
    const response = await fetch(
      "https://viacep.com.br/ws/" + cep.value + "/json/", {
        method: "GET"
      }
    )
    const address = await response.json()
    if (response.ok) {
      address_street.value = address.logradouro
      address_city.value = address.localidade
      address_state.value = address.uf
    }   
  }
}


</script>

<template>

  <NavBar/>
  <div class="container">
    <h2>Usuário</h2>
    <hr>

    <div v-if="!update_user && !update_address" class="user-profile">
      <div class="user-title">Email</div>
      <div>{{ user_profile.email }}</div>
      <button class="btn btn-outline-primary" @click="update_user = true">Editar Email</button>   
      <div class="user-title">Endereço:</div>
      <div><span class="user-subtitle">Rua: </span>{{ address?.street }}, {{ address?.number }}</div>
      <div><span class="user-subtitle">Cidade: </span>{{ address?.city }} - {{ address?.state }}</div>
      <div><span class="user-subtitle">CEP: </span>{{ address?.zip_code }}</div>
      <div><span class="user-subtitle">Pais: </span>{{ address?.country }}</div>
      <button class="btn btn-outline-primary" @click="update_address = true">Editar Endereço</button>
      <button class="btn btn-outline-danger" @click="deleteUser">Excluir Conta</button> 
    </div>


    <div v-if="update_user" class="update-user">
      <div class="user-info">
        <h4>Altere seus dados</h4>
        <form @submit.prevent="onUpdate">
          <label>Email</label>
          <input type="email" class="form-control" :placeholder="user_profile.email" v-model="email">
          <button @click="update_user = false" class="btn btn-outline-success">Voltar</button>
          <input type="submit" class="btn btn-outline-primary" value="Editar"></input>
        </form>
      </div>
    </div>
    <div v-if="update_address" class="user-address">
      <h4>Endereço</h4>
      <div class="form-outline mb-2">           
        <label>CEP</label>
        <input style="width: 150px" class="form-control" maxlength="8" v-model="cep" @input="fetchAddress" @keyup.enter="fetchAddress">
        <small class="form-text text-muted">Por favor coloque seu cep para continuar.</small>
      </div>
      <div class="address-number">
        <div class="form-outline mb-2 logradouro">
          <label>Logradouro</label>
          <input class="form-control" type="text" :placeholder="address_street" readonly>
        </div>
        <div class="form-outline mb-2 number">
          <label>Número</label>
          <input class="form-control" type="text" v-model="address_number">
        </div>          
      </div>
      <div class="address-number">
        <div class="form-outline mb-2 logradouro">
          <label>Cidade</label>
          <input class="form-control" type="text" :placeholder="address_city" readonly>
        </div>
        <div class="form-outline mb-2 number">
          <label>Estado</label>
          <input class="form-control" type="text" :placeholder="address_state" readonly>
        </div>          
      </div>
      <button @click="update_address = false" class="btn btn-outline-success">Voltar</button> 
      <button @click="changeAddress" class="btn btn-outline-primary">Editar</button>
    </div>    
  </div>

 
</template>

<style scoped>

  .user-title {
    font-size: 20px;
    font-weight: bold;
  }

  .user-subtitle {
    font-weight: bold;
  }

  .update-user{
    display: flex;
    gap: 50px;
  }

  .user-info {
    flex: 1;
  }

  .user-address{
    flex: 1;
  }

  .address-number {
    display: flex;
    gap: 10px;
  }

  .logradouro {
    flex: 8;
  }

  .number {
    flex: 2;
  }

  .btn {
    margin-top: 20px;
    margin-bottom: 10px;
    margin-right: 10px;
  }

</style>