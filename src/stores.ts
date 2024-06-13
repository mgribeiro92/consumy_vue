import { Auth } from "./auth"

async function getStores() {
  const auth = new Auth()
  const current_user = auth.currentUser()
  const response = await fetch (
    import.meta.env.VITE_BASE_URL + '/stores', {
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

async function getStoresSearch(search: string) {
  const auth = new Auth()
  const current_user = auth.currentUser()
  const response = await fetch (
    import.meta.env.VITE_BASE_URL + '/stores?' + search, {
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
  const auth = new Auth()
  const current_user = auth.currentUser()
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
  getStoresSearch,
  getStore
}