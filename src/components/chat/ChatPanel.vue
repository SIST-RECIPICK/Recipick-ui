<template>
  <div>
    <div class="chat_overlay"></div>
    <div class="chat_panel">

      <!-- 채팅 리스트 -->
      <div class="chat_list">
        <div class="list_header">
          <button class="back_button" @click="$emit('close')">
            x
          </button>
          <span>채팅 목록</span>
        </div>
        <!-- 채팅 목록 -->
        <div class="room_list">
          <div
            v-for="room in chatRooms"
            :key="room?.id"
            class="chat_room"
            :class="{ active: selectedRoom?.id === room?.id }"
            @click="selectRoom(room)"
          >
            <!-- 프로필 -->
            <div class="profile">
              {{ room?.name.substring(0, 1) }}
            </div>
            <!-- 채팅 정보 -->
            <div class="room_info">
              <div class="room_top">
                <span class="room_name">
                  {{ room?.name }}
                </span>
                <span class="room_date">
                  {{ room?.date }}
                </span>
              </div>
              <div class="room_message">
                {{ room?.lastMessage }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!--채팅방-->
      <div class="chat_content">
        <!-- 채팅방 헤더 -->
        <div class="chat_header">
          <div class="header_profile">
            {{ selectedRoom?.name.substring(0, 1) }}
          </div>
          <div class="header_info">
            <div class="header_name">
              {{ selectedRoom?.name }}
            </div>
          </div>
        </div>

        <!-- 메시지 영역 -->
        <div class="message_area">
          <div
            v-for="message in messages"
            :key="message?.id"
            class="message_wrapper"
            :class="message.mine ? 'mine' : 'other'"
          >
            <!-- 상대방 프로필 -->
            <div
              v-if="!message.mine"
              class="message_profile"
            >
              {{ selectedRoom?.name.substring(0, 1) }}
            </div>
            <div class="message_box">
              <div class="message" v-html="message?.text"></div>
              <div class="message_time">
                {{ message?.time }}
              </div>
            </div>
          </div>
        </div>
        <!-- 메세지 입력-->
        <div class="input_area">
          <textarea
            v-model="messageInput"
            placeholder="메시지를 입력하세요"
            @keydown.enter.exact.prevent="sendMessage"
            :readonly="roomList.length===0"
          ></textarea>
          <button class="send_button" @click="sendMessage()">
            ➤
          </button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>

import { computed, onMounted, ref } from 'vue'
import { chatStore } from '@/stores/ChatStore'
import { storeToRefs } from 'pinia'

defineEmits(['close'])

const props = defineProps({
  client: { type: Object, required: true },
  room_id: {type: Number, default: 0}
})

const chatstore = chatStore()
const { roomList } = storeToRefs(chatstore)
const { messageList } = storeToRefs(chatstore)

// 채팅방 목록
const chatRooms = computed(() =>
  roomList.value.map(item => ({
    id:item.room_id,
    name: item.nickname,
    lastMessage: item.message,
  }))
)

// 현재 선택된 채팅방
const selectedRoom = ref(null)
//const selectedRoom = ref(chatRooms?.value.find(room => room.id === props.room_id))

// 메시지 리스트
const messages = computed(() =>
  messageList.value.map(item => ({
    id:item.create_at,
    text: item.message,
    time: new Date(item.create_at).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    }),
    mine: item.user_id == 2 ? true : false
  }))
)

onMounted(async () => {

  //채팅방 목록 가져오기
  await chatstore.chatRoomList()

  // room_id가 존재하면 그 방 선택 없으면 첫 번째 방 선택
  selectedRoom.value =
    chatRooms.value.find(
      room => Number(room.id) === Number(props.room_id)
    ) || chatRooms.value[0]

  //메시지 조회
  if (selectedRoom.value) {

    await chatstore.chatMessageList(
      selectedRoom.value.id
    )

    console.log('메시지:', messageList.value)

    //해당 방 WebSocket 구독
    subscribeRoom(selectedRoom.value.id)
  }
})

  // 채팅방 선택
  const selectRoom = async (room) => {
  selectedRoom.value = room
  // 선택한 방의 기존 메시지 가져오기
  await chatstore.chatMessageList(room.id)
  // 선택한 방 실시간 구독
  subscribeRoom(room.id)
}

const subscribeRoom = (roomId) => {

  props.client.subscribe(
    `/sub/chat/room/${roomId}`,

    async (message) => {
      const data = JSON.parse(message.body)
      console.log('받은 메시지:', data)
      chatstore.messageList.push(data) // 전송한 메세지 표시
      await chatstore.chatRoomList()
    }
  )

}

const messageInput = ref('')

const sendMessage = async() => {

  if (!messageInput.value.trim()) {
    return
  }
  
  const data = {
    room_id: selectedRoom.value?.id, //방번호
    user_id: 2, //전송하는 사람
    message: messageInput.value
  }

  props.client.publish({
    destination: '/pub/chat-send',
    body: JSON.stringify(data)
  })
  
  messageInput.value = ''
}
</script>

<style scoped>

/* 전체 패널*/
.chat_overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1099;
}
.chat_panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 800px;
  height: 100vh;
  background: white;
  display: flex;
  box-shadow: -5px 0 20px rgba(0, 0, 0, 0.15);
  z-index: 1100;
}

/* 왼쪽 채팅 목록*/
.chat_list {
  width: 300px;
  border-right: 1px solid #ddd;
  flex-shrink: 0;
}

.list_header {
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  font-weight: bold;
}
.back_button {
  border: none;
  background: none;
  font-size: 27px;
  cursor: pointer;
  margin-right: 5px;
}

/* 채팅방 목록 */
.room_list {
  overflow-y: auto;
}
.chat_room {
  position: relative;
  display: flex;
  padding: 12px 8px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}
.chat_room:hover {
  background-color: #f8f8f8;
}
.chat_room.active {
  background-color: #f5f5f5;
}

/* 프로필 */
.profile {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  flex-shrink: 0;
}

/* 채팅 정보 */
.room_info {
  margin-left: 7px;
  min-width: 0;
  flex: 1;
}
.room_top {
  display: flex;
  justify-content: space-between;
}
.room_name {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
}
.room_date {
  font-size: 8px;
  color: #999;
}
.room_message {
  margin-top: 5px;
  font-size: 12px;
  color: #777;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

/* 오른쪽 채팅*/
.chat_content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

/* 채팅 헤더*/
.chat_header {
  height: 55px;
  border-bottom: 1px solid #ddd;
  display: flex;
  align-items: center;
  padding: 0 15px;
}
.header_profile {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.header_info {
  margin-left: 8px;
}
.header_name {
  font-size: 12px;
  font-weight: bold;
}

/* 메시지 영역*/
.message_area {
  flex: 1;
  padding: 20px 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

/* 메시지 하나 */
.message_wrapper {
  display: flex;
  margin-bottom: 12px;
  align-items: flex-end;
}

/* 상대방 */
.message_wrapper.other {
  justify-content: flex-start;
}

/* 나 */
.message_wrapper.mine {
  justify-content: flex-end;
}

/* 상대방 프로필 */
.message_profile {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  margin-right: 5px;
}

/* 메시지 박스 */
.message_box {
  max-width: 70%;
  display: flex;
  align-items: flex-end;
}
.message {
  padding: 9px 11px;
  border-radius: 8px;
  background: #f3f3f3;
  font-size: 14px;
  line-height: 1.5;
}
.mine .message {
  background: #f5f5f5;
}
.message_time {
  font-size: 8px;
  color: #aaa;
  margin: 0 4px;
}

/* 입력창*/
.input_area {
  position: relative;
  border-top: 1px solid #ddd;
  padding: 10px;
}
textarea {
  width: 100%;
  height: 55px;
  resize: none;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  padding-right: 40px;
  box-sizing: border-box;
  font-size: 11px;
  outline: none;
}
textarea:focus {
  border-color: #aaa;
}
.send_button {
  position: absolute;
  right: 15px;
  bottom: 32px;
  width: 27px;
  height: 27px;
  border: none;
  border-radius: 50%;
  background: #eee;
  cursor: pointer;
  font-size: 13px;
}

</style>