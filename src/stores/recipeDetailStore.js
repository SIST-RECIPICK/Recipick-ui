import { defineStore } from 'pinia'
import axios from 'axios'

export const recipeDetailStore = defineStore('detail', {
  state: () => ({
    recipeData: {},
	  manualList: [],
    ingredientUnitList: [],
  }),
  actions: {
    async recipeDetailData(no) {
      const res = await axios.get('http://localhost:8080/recipe/detail', {
        params: {
          rcp_seq: no,
        },
      })
      console.log(res.data)
      this.recipeData = res.data.recipeData
	    this.manualList = res.data.manualList
      this.ingredientUnitList = res.data.ingredientUnitList
    },
  },
})
