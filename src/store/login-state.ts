import { UserDataImpl, UserData } from "~/model/user-data"

export const state = () => ({
  user: UserDataImpl
})

export const mutations = {
  login(state: any, user: UserData) {
    state.user = user
  },
  logout(state: any) {
    state.user = null
  }
}
