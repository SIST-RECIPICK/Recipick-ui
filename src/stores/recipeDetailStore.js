import { defineStore } from 'pinia'
import axios from 'axios'

export const recipeDetailStore = defineStore('detail', {
  state: () => ({
    recipeData: {},
    manualList: [],
    ingredientUnitList: [],
    likeExist: 0,
    markExist: 0,
  }),
  actions: {
    async recipeDetailData(no) {
      const res = await axios.get('http://localhost:8080/recipe/detail', {
        params: {
          user_id: 1,
          rcp_seq: no,
        },
        withCredentials: true,
      })
      console.log(res.data)
      this.recipeData = res.data.recipeData
      this.manualList = res.data.manualList
      this.ingredientUnitList = res.data.ingredientUnitList
      this.likeExist = res.data.likeExist
      this.markExist = res.data.markExist
    },

    async recipeLikeClick(no, type) {
      await axios.get('http://localhost:8080/recipe/interaction', {
        params: {
          user_id: 2,
          rcp_seq: no,
          type: type,
        },
        withCredentials: true,
      })
    },
  },
})
