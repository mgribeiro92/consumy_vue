<template>
  <div>
    <h1>TESTE da Mensagem</h1>
    <button @click="submit">Botão</button>
    <Message :message="messageTeste" :alert="alert"/>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Message from '@/components/Message.vue'
import router from '@/router'
import eventBus from '../event';

const messageTeste = ref('')
const alert = ref('')

const dados = {
  mensagem: 'User registered successfully. Please login to enter!',
  alert: 'success'
}

function submit() {
  console.log('botao chamado')
  router.push('/sign_in')
  setTimeout(() => {
    eventBus.emit("sign_in", dados);  
  }, 1000);
}

</script>
