import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore('userStore',{
    state:()=>({
        page:1
    }),
    actions:{
        async userList(page){
            const res = await axios.get('/admin/user/list',{
                params:{
                    page:page
                }
            })
            console.log(res.data)
        }
    }
})
