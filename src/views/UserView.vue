<script setup lang="ts">

import { Auth } from '@/auth'
import { User  } from '@/user'
import { createStorage, type SimpleStorage } from '@/storage'
import { onMounted } from 'vue';

const auth = new Auth()
const user = new User()

onMounted(() => {
	const resposta = user.userProfile()
	console.log(resposta)
})

</script>


<template>
  <!-- {{ currentUser }}
    <div class="card-user">
			<p><strong>Email:</strong> {{user.email}} </p>
			<p><strong>Id:</strong> {{user.id}} </p>
    </div> -->
    
</template>

<style>

	.card-user {
		border-radius: 5px;
		border: 2px solid #d0f0c0;
		margin: 10px;
		padding: 10px;
		width: 300px;
	}

</style>