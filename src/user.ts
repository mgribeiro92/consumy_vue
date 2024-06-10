import { createStorage, type SimpleStorage } from './storage'

class User {
  private storage: SimpleStorage

  constructor(persistent = false) {
		this.storage = createStorage(persistent)
	}

  private getFallback(key: string) : string | null {
		let transient = createStorage(false)
		let persistent = createStorage(true)

		return transient.get(key) || persistent.get(key)
	}

  isToken() {
		return this.getFallback('token')
	}

  success (response: Response, onSuccess: () => void) {
    console.log('SUCESSO', response)
    onSuccess()
  }
  
  failure(response: Response, onFailure: () => void) {
    console.log("FRACASSO", response)    
    onFailure()
  }

  async signUp(email: string, password: string, password_confirmation: string, onSuccess: () => void, onFailure: () => void) {
    console.log("will try do sign up")
    const body = {
      user: {
        email: email,
        password: password,
        password_confirmation: password_confirmation,
      }
    }
    const response = await fetch (
      import.meta.env.VITE_BASE_URL + '/new', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
      },
      body: JSON.stringify(body)
    })
    .then((response) => {
      if (response.ok) {
        this.success(response, onSuccess)
        const resposta = response.json()
        console.log(resposta)
      }
      else {
        this.failure(response, onFailure)
      }
    })
  }
  
  async userProfile() { 
    const token = this.isToken()      
    const response = await fetch (
      'http://127.0.0.1:3000/me', {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + token
      },           
    })
    const userData = await response.json()
    return userData
  }

  async userUpdate(email: string, password: string, user_id:any){
    const token = this.isToken()
    const body = {
      user: {
        email: email,
        password: password,
      }
    }  
    const response = await fetch (
      import.meta.env.VITE_BASE_URL + '/users/' + user_id, {
      method: 'PUT',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body)            
    })
    const userData = await response.json()
    console.log(userData)
    return userData
  }

  async deleteUser(user_id: any) {
    const response = await fetch (
      import.meta.env.VITE_BASE_URL + '/users/' + user_id, {
      method: 'DELETE',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },      
    })
    const delete_user = await response.json()
    console.log(delete_user)
  }

}


export { User }