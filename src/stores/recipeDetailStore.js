import { defineStore } from 'pinia'
import axios from "axios";


export const recipeDetailStore = defineStore('detail',{
    state:()=>({
		recipeData:{}
	}),
	actions:{
		async recipeDetailData(no){

			const res = await axios.get('/recipe/detail',{
				params:{
					no:no
				}
			})
            this.recipeData = res.data.recipeData
		},
    }
})
