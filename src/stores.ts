import { Auth } from "./auth"

const auth = new Auth()
const current_user = auth.currentUser()

async function getStores() {
  const response = await fetch (
    "http://localhost:3000" + '/stores', {
      method: "GET",
      headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo=",
        "Authorization": "Bearer" + ' ' + current_user?.token
			},
    }
  )
  return await response.json()
}

async function getStore(store_id: any) {
  const response = await fetch (
    "http://localhost:3000" + '/stores/' + store_id, {
      method: "GET",
      headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo=",
        "Authorization": "Bearer" + ' ' + current_user?.token
			},
    }
  )
  return await response.json()
}


export const stores = {
  getStores,
  getStore
}