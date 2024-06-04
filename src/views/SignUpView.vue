<script setup lang="ts">

import router from '@/router';
import { ref } from 'vue'
import { User } from '@/user'
import Message from '../components/Message.vue'
import event from '../event';

const user = new User()
const email = defineModel<string>('email')
const password = defineModel<string>('password')
const password_confirmation = defineModel<string>('password_confirmation')

const msg = ref('')
const alert = ref('')

function sendSignUp() {	
	user.signUp(email.value || '', password.value || '', password_confirmation.value || '', 
		() => {			
			router.push('/sign_in')
			setTimeout(() => {
				event.emit("sign_in", { 
					msg: 'User registered successfully. Please login to enter!', 
					alert: 'success' 
				})  
			}, 1000);						
		},
		() => {
			msg.value = 'User not registered, try again!',
			alert.value = 'error'
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
		<div class="signup">		
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
			<p>Return to home page: <RouterLink :to="{name: 'home'}">Home</RouterLink></p>			
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
    height: 450px;
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