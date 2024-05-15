<script setup lang="ts">

import { onMounted, onUnmounted } from 'vue';
import router from '@/router';
import { useRouter } from 'vue-router'
import { ref } from 'vue';
import { Auth } from '../auth'
import Message from './Message.vue'
import event from '@/event';

// const router = useRouter()
const auth = new Auth()
const email = defineModel<string>('email')
const password =  defineModel<string>('password')
const remember = defineModel<boolean>('remember', {default: true})
const awaiting = ref(false)

const msg = ref('')
const alert = ref('')

onMounted(() => {
	console.log('mounted sign in')	
	event.on("sign_in", (dados: any) => {
		console.log(dados)
		msg.value = dados.msg
		alert.value = dados.alert
		console.log('log dos dados recebidos')
	})
})

function onSubmit() {
	let auth = new Auth(remember.value)
  awaiting.value = true
  auth.signIn(email.value || '', password.value || '', () => {
		awaiting.value = false
		console.log('fez login')	
		// window.location.reload()
		router.push('/')
    }, 
		() => {
			awaiting.value = false			
			console.log('nao foi dessa vez')
			msg.value = "Email or password incorrect!"
			alert.value = "error"																
		}
	)
}

</script>

<template>	
<header>
	<div>
		<div style="width: 400px">
			<Message v-show="msg" :message="msg" :alert="alert"/>
		</div>		
		<div class="login">
			<h2>Welcome to Delivery!</h2>
			<p>Hello there! We're glad to have you here. Get ready for a delightful experience as we dive into our menu!</p>			   		   
			<form class="form-login" @submit.prevent="onSubmit">       
				<h3>Login</h3>                                
				<div class="form-outline mb-2">                  
					<label>Email</label>
					<input type="email" class="form-control" v-model="email">
				</div>           
				
				<div class="form-outline mb-2">                    
					<label>Password</label>
					<input type="password" class="form-control" v-model="password">
				</div>            
				<input v-show="!awaiting" type="submit" class="btn-login" value="Login"></input>
				<div class="form-group form-check">
					<input type="checkbox" class="form-check-input" v-model="remember">
					<label class="form-check-label">Remember me</label>
				</div>				 				           
			</form>
			<p>If you don't have an account: <RouterLink :to="{name: 'sign_up'}">Sign Up</RouterLink></p>
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

	.login {
		width: 400px;    
    opacity: 1.0;
    border-radius: 20px;
    background-color: white;    
    padding: 40px 20px;
    margin-right: 120px;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);		
	}

	.form-login {
		margin-bottom: 20px;
	}

	

	h3 {
		color: #fa9901
	}

	h2 {
		color: #fa9901;
		text-align: center;
	}
	
	p {
		color: #421010;
		text-align: center;
	}

	label {
		color: #421010
	}
		
	.btn-login {    
		padding: 0px 10px;
		margin: 10px 0px;  
		color: #421010;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 35px;
		border: 1px solid #421010;
	}

	.btn-login:hover {
		color: white; 
		background-color: #421010;
	}
 </style>