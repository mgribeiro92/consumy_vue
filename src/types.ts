export interface UserType {
  id: number,
  email: string
}

export interface Address {
  id: number,
  street: string,
  city: string,
  number: string,
  zip_code: string,
  country: string
  state: string
}

export interface ChatRoom {
  id: number, 
  store_name: string, 
  unread_messages: number, 
}