<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import NavBar from './components/NavBar.vue';
import Chat from './components/Chat.vue';
import { chats } from '@/chats'

const show_chat = ref(false);
const chat_info = ref()

async function openChat() {
  chat_info.value = await chats.lastChat()
  console.log(chat_info.value)
  show_chat.value = !show_chat.value;
}

function closeChat() {
  console.log('closechat dos chats')
  show_chat.value = !show_chat.value
}

</script>

<template>

  <!-- <NavBar v-if="$route.meta.showNavBar != false"/> -->
  <button class="floating-button" @click="openChat">Chat</button>

  <div v-if="show_chat" class="chat-wrapper">
    <!-- Inclua aqui o componente Chat.vue ou similar -->
    <Chat :chat_info="chat_info" @closeChat="closeChat"/>
  </div>
  <RouterView />

</template>

<style>

  .floating-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }

  .chat-wrapper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 400px; /* Ajuste conforme necessário */
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000; /* Garante que o chat esteja acima de outros elementos */
  }

  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: white;
    margin: 100px auto;
    padding: 20px;
    border: 1px solid #888;
    width: 40%;
  }

</style>




