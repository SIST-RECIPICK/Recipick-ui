import { defineStore } from 'pinia'
import axios from 'axios'

export const recipeDetailStore = defineStore('detail', {
  state: () => ({
    recipeData: {},
    manualList: [],
    ingredientUnitList: [],
    relationList: [],
    cookieList: [],
    reviewList: [],
    likeExist: 0,
    markExist: 0,
  }),
  actions: {
    async recipeDetailData(no) {
      const res = await axios.get('http://localhost:8080/recipe/detail', {
        params: {
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

    async recipeCookie() {
      const res = await axios.get('http://localhost:8080/recipe/cookie', {
        params: {},
        withCredentials: true,
      })
      console.log(res.data)
      this.cookieList = res.data.cookieList
    },

    async recipeDetailSub(no) {
      const res = await axios.get('http://localhost:8080/recipe/detail_sub', {
        params: {
          rcp_seq: no,
        },
        withCredentials: true,
      })
      console.log(res.data)
      this.reviewList = res.data.reviewList
      this.relationList = res.data.relationList
    },

    async recipeLikeClick(no, type) {
      await axios.get('http://localhost:8080/recipe/interaction', {
        params: {
          rcp_seq: no,
          type: type,
        },
        withCredentials: true,
      })
    },
  },
})
