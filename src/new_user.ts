import { BASE_URL } from "./plugins/fetch"

function success (response: Response, onSuccess: () => void) {
  console.log('SUCESSO', response)
  onSuccess()
}

function failure(response: Response, onFailure: () => void) {
  console.log("FRACASSO", response)
  onFailure()
}

async function signUp(email: string, password: string, password_confirmation: string, onSuccess: () => void, onFailure: () => void) {
  console.log("will try do sign up")
  const body = {
    user: {
      email: email,
      password: password,
      password_confirmation: password_confirmation,
      role: "buyer"
    }
  }
  const response = await fetch (
    BASE_URL + '/new', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
  .then((response) => {
    if (response.ok) {
      success(response, onSuccess)
    }
    else {
      failure(response, onFailure)
    }
  })
}

export const new_user = {
  signUp
}
