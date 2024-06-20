<script setup lang="ts">

import NavBar from './NavBar.vue'
import Chat from './Chat.vue'
import { Auth } from '@/auth'
import { ref, onMounted } from 'vue';
import { chats } from '@/chats'
import type { ChatRoom } from '@/types'

const auth = new Auth()
const current_user = auth.currentUser()
const all_chats = ref<ChatRoom[]>([])
const show_chat = ref()
const chat_info = ref()


async function openChat(chat_room_id: any) {
  chat_info.value = await chats.getChat(chat_room_id)
  console.log(chat_info.value)
  show_chat.value = !show_chat.value
}


onMounted(async() => {
  const chat_data = await chats.getChats()
  if (chat_data.chats.length > 0) {
    all_chats.value = chat_data.chats
  }
})

async function closeChat() {
  console.log('closechat dos chats')
  show_chat.value = !show_chat.value
  const chat_data = await chats.getChats()
  all_chats.value = chat_data.chats
}

</script>

<template>
  <NavBar/>
  <div v-if="show_chat" class="chat-wrapper">
    <Chat :chat_info="chat_info" @closeChat="closeChat"/>
  </div>
  <div class="container">
    <h3>Chats!</h3>
    <hr>
    <div v-for="chat in all_chats">
      <div class="card-chat">
        <div>Chat #{{ chat.id }}</div>
        <div>Loja: {{ chat.store_name }}</div>
        <div>Mensagens novas: {{ chat.unread_messages }}</div>
        <div @click="openChat(chat.id)" class="open-chat">Abrir Chat</div>
      </div>
    </div>
  </div>

</template>

<style scoped>

  .card-chat {
    display: flex;
    gap: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 20px;
    width: 600px;
  }

  .open-chat {
    color: blue;
    text-decoration: underline;
    cursor: pointer;
  }

</style>