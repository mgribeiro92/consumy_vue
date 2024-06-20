<script setup lang="ts">

import router from '@/router';
import { ref } from 'vue'
import { User } from '@/user'
import { Auth } from '@/auth'
import Message from '../components/Message.vue'
import event from '../event';

const auth = new Auth()
const user = new User()
const email = defineModel<string>('email')
const password = defineModel<string>('password')
const password_confirmation = defineModel<string>('password_confirmation')
const address = ref(false)

const msg = ref('')
const alert = ref('')
const cep = ref()
const address_street = ref()
const address_number = ref()
const address_city = ref()
const address_state = ref()
const user_id = ref()

async function sendSignUp() {
	if (!password.value || !password_confirmation.value || !email.value) {
		console.log(password.value)
		console.log(password_confirmation.value)
		console.log(email.value)
		msg.value = "Por favor preencha todos os dados!"
		alert.value = "error"
	} else if (password.value != password_confirmation.value ) {
		msg.value = "Senhas não sao iguais!"
		alert.value = "error"
	} else {
		const response_signup = await user.signUp(email.value || '', password.value || '', password_confirmation.value || '')
		console.log(response_signup)
		if (response_signup.email == "has already been taken") {
			msg.value = "Email ja existe!"
			alert.value = "error"
		} else if (response_signup.id) {
			user_id.value = response_signup.id
			address.value = true
		}
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

async function sendAddress() {
  const response_address = await auth.newAddress(user_id.value, address_street.value, address_number.value, cep.value, address_city.value, address_state.value)
  console.log(response_address)
	router.push('/sign_in')
}

</script>

<template>
<header>
	<div>
		<div style="width: 400px">
			<Message v-show="msg" :message="msg" :alert="alert"/>
		</div>
		<div v-if="!address" class="signup">		
			<form class="form-signup" @submit.prevent="sendSignUp">           
				<h2>Sign Up</h2>                                
				<div class="form-outline mb-2">                  
					<label>Email</label>
					<input type="text" class="form-control" v-model="email">
				</div>        
				<div class="form-outline mb-2">                    
					<label>Password</label>
					<input type="password" class="form-control" v-model="password">
				</div> 
				<div class="form-outline mb-2">                    
					<label>Password Confirmation</label>
					<input type="password" class="form-control" v-model="password_confirmation">
				</div>
				<input type="submit" class="btn-signup" value="Sign Up"></input>		           
			</form>
			<p>If you already have an account: <RouterLink :to="{name: 'sign_in'}">Log in</RouterLink></p>
		</div>
		<div v-else class="signup">
			<Message v-show="msg" :message="msg" :alert="alert"/>	
			<div class="form-outline mb-2">
				<h5>Endereço</h5>                 
				<label>CEP</label>
				<input style="width: 200px" class="form-control" maxlength="8" v-model="cep" @input="fetchAddress" @keyup.enter="fetchAddress">
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
			<button @click="sendAddress" class="btn-signup">Concluir Cadastro</button>  
		</div>
	</div>
</header>
</template>

<style scoped>

  header {
		display: flex;
		align-items: center;
		justify-content: right;
		height: 100vh;	
		background-image: url('../assets/background-site.png');  
    background-size: cover;		
	}

	.signup {
		width: 400px;
		opacity: 1.0;
    border-radius: 20px;
    background-color: white;    
    padding: 40px 20px;
    margin-right: 120px;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);	
	}

		
	h2 {
		color: #fa9901
	}
	
	p {
		margin-top: 15px;
		color: #421010
	}

	label {
		color: #421010
	}	

	.btn-signup {    
		padding: 0px 10px;
		margin: 10px 0px;  
		color: #421010;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 35px;
		border: 1px solid #421010;
	}

	.btn-signup:hover {
		color: white;
		background-color: #421010;
	}

</style>