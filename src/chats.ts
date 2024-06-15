import { Auth } from '@/auth'

const auth = new Auth()
const current_user = auth.currentUser()

async function lastChat() {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/last_chat', {
      method: "GET",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json",
         "Authorization": "Bearer" + ' ' + current_user?.token,
         "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
      }
    }
  )
  const chat_data = await response.json()
  return chat_data
}

async function createChat(buyer_id: any, store_id: any) {
  const body = {
    chat_room: {
      buyer_id: buyer_id,
      store_id: store_id
    }
  }
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/chat_rooms', {
      method: "POST",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json",
         "Authorization": "Bearer" + ' ' + current_user?.token,
         "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
      },
      body: JSON.stringify(body)
    }
  )
  const chat_data = await response.json()
  console.log(chat_data)
}

async function getChat(chat_room_id: any) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + `/chat_rooms/${chat_room_id}`, {
      method: "GET",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json",
         "Authorization": "Bearer" + ' ' + current_user?.token,
         "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
      },
    }
  )
  return response.json()
}

export const chats = {
  lastChat,
  getChat,
  createChat
}