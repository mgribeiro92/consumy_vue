import { createStorage, type SimpleStorage } from './storage'

class User {
  // private storage: SimpleStorage

  // constructor(persistent = false) {
	// 	this.storage = createStorage(persistent)
	// }

  private getFallback(key: string) : string | null {
		let transient = createStorage(false)
		let persistent = createStorage(true)

		return transient.get(key) || persistent.get(key)
	}

  isToken() {
		return this.getFallback('token')
	}

  // success (response: Response, onSuccess: () => void) {
  //   console.log('SUCESSO', response)
  //   onSuccess()
  // }
  
  // failure(response: Response, onFailure: () => void) {
  //   console.log("FRACASSO", response)    
  //   onFailure()
  // }

  async signUp(email: string, password: string, password_confirmation: string) {
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
        "X-API-KEY": "5VdKWFE09B5O8gnjZ5+OuEKanoI="
      },
      body: JSON.stringify(body)
    })
    return response.json()
    // .then((response) => {
    //   if (response.ok) {
    //     this.success(response, onSuccess)
    //     const resposta = response.json()
    //     console.log(resposta)
    //   }
    //   else {
    //     this.failure(response, onFailure)
    //   }
    // })
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

  async userUpdate(email: string, user_id:any){
    const token = this.isToken()
    const body = {
      user: {
        email: email,
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

  async newAddress(user_id: any, street: any, number: any, cep: any, city: any, state: any) {
    const body = {
      address: {
        user_id: user_id,
        street: street,
        number: number,
        zip_code: cep,
        city: city,
        state: state,
        country: "Brazil"
      }
    }
    const response = await fetch(
      import.meta.env.VITE_BASE_URL + '/addresses', {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer" + ' ' + this.isToken()
        },
        body: JSON.stringify(body)          
      } 
    )
    const data = await response.json()
    console.log(data)
  }
  
  async updateAddress(address_id: any, street: any, number: any, cep: any, city: any, state: any) {
    const body = {
      address: {
        street: street,
        number: number,
        zip_code: cep,
        city: city,
        state: state,
        country: "Brazil"
      }
    }
    const response = await fetch(
      import.meta.env.VITE_BASE_URL + '/addresses/' + address_id, {
        method: 'PUT',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer" + ' ' + this.isToken()
        },
        body: JSON.stringify(body)          
      } 
    )
    return await response.json()
  }
}


export { User }