import { defineStore } from 'pinia'
import axios from 'axios'

export const chatStore = defineStore('chat', {
  state: () => ({
    room_id: 0,
    roomList: [],
    messageList: [],
  }),
  actions: {
    async chatRoomCrerate(id, no) {
      const res = await axios.get('http://localhost:8080/chat/create', {
        params: {
          user_id1: 2,
          user_id2: id,
          recipe_id: no,
        },
        withCredentials: true,
      })
      this.room_id = res.data.vo.room_id
    },

    async chatRoomList() {
      const res = await axios.get('http://localhost:8080/chat/room_list', {
        params: {
          user_id: 2,
        },
        withCredentials: true,
      })
      this.roomList = res.data.roomList
    },

    async chatMessageList(no) {
      const res = await axios.get('http://localhost:8080/chat/message_list', {
        params: {
          room_id: no,
        },
        withCredentials: true,
      })
      this.messageList = res.data.messageList
    },
  },
})
