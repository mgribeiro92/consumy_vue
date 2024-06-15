<script setup lang="ts">

import { ref, onMounted, onUpdated } from 'vue'
import { Auth } from '@/auth'
import { User } from '@/user'
import consumer from '@/websocket/consumer';
// import chatChannel from '../websocket/chat_channel';

const { chat_info } = defineProps(['chat_info'])

const auth = new Auth()
const user = new User()
const current_user = auth.currentUser()
const user_profile = ref()
const messages = ref();
const newMessage = ref()
const chat = ref()

if (chat_info) {
  chat.value = chat_info.chat
  messages.value = chat_info.chat_messages
  console.log(chat_info)
}

const chatChannel = consumer.subscriptions.create({ channel: "ChatChannel", chat_room_id: chat.value.id }, {
  connected() {
    console.log("Conectado ao ChatChannel")
  },
  disconnected() {
    console.log("Desconectado do ChatChannel")
  },
  received(data: any) {
    messages.value.push(data);
    scrollToBottom()
  },
  speak(message: any) {
    this.perform('speak', { message })
  }
});

onMounted(async () => {
  user_profile.value =  await user.userProfile()
  scrollToBottom()
})

function sendMessage() {
  const new_message = {
    content: newMessage.value,
    sender_id: user_profile.value.id,
    sender_type: "User",
    sent_at: new Date().toLocaleString(),
    chat_room_id: chat.value.id
  };
  chatChannel.speak(new_message);
  console.log(new_message)
  scrollToBottom()
  newMessage.value = '';  
}

function getMessageClass(message: { sender_type: string; }) {
  return message.sender_type === "User" ? 'message-right' : 'message-left';
}

function scrollToBottom() {
  setTimeout(() => {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, 100);
}

const emit = defineEmits(['closeChat'])
function closedChat() {
  console.log('fechar chat')
  emit('closeChat')
}

</script>

<template>
  <div class="chat-info">
    <div class="chat-title">
      <div>Chat #{{ chat.id }}</div>
      <div class="store-name">{{ chat.store_name }}</div>
    </div>
    <div class="chat-close" @click="closedChat">Fechar</div>
  </div>
  <div class="chat-container">    
    <div v-for="message in messages" :class="getMessageClass(message)">
      <div class="message-wrapper">
        <div class="message-bubble">{{ message.content }}</div>
      </div>
     </div>
    <div ref="bottom"></div>    
  </div>
  <div class="input-wrapper">
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Digite sua mensagem...">
    <button @click="sendMessage">Enviar</button>
  </div>
</template>

<style>

  .chat-info {
    display: flex;
    padding: 10px;
    position: absolute;
    width: 100%;
    color: #8b0000;
    border-radius: 5px;
    border-bottom: 2px solid #8b0000;
    justify-content: space-between;
    align-items: end;
  }
  
  .chat-container {
    position: relative;
    max-width: 400px; /* Ajuste conforme necessário */
    height: 300px; /* Ajuste conforme necessário */
    overflow-y: auto;
    margin-bottom: 70px;
    margin-top: 100px;
  }

  .chat-title {
    font-size: 25px;
  }

  .store-name {
    font-size: 15px;
  }

  .chat-close:hover {
    cursor: pointer;
    color: darkblue;
    text-decoration: underline;
  }

  .message-wrapper {
    display: flex;
    justify-content: flex-end; 
    padding: 5px;
  }

  .message-bubble {
    padding: 8px 12px;
    border-radius: 10px;
    max-width: 90%;
  }

  .message-left .message-wrapper {
    justify-content: flex-start; 
  }

  .message-right .message-bubble {
    background-color:	aqua
  }

  .message-left .message-bubble {
    background-color: greenyellow
  }

  .input-wrapper {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0px 10px;
  }

  .input-wrapper input {
    flex: 1;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
  }

  .input-wrapper button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }


</style>