// store.js
import {
	createStore
} from 'vuex';
import {
	dataApi
} from "@/utils/api";


const store = createStore({
	state() {
		return {
			choosedStreet: {},
			choosedVillage: {}, // 需要存储的数据
			placeSearchVal: '',
			memberDetailOb: {},
			regionListX: [],
			realtionDetail: []
		};
	},
	mutations: {
		// Mutation 用于同步地修改 state 数据
		setChoosedStreet(state, payload) {
			state.choosedStreet = payload;
			state.choosedVillage = {};
			console.log('setChoosedStreet', payload)
		},
		setChoosedVillage(state, payload) {
			state.choosedVillage = payload;
			console.log('choosedVillage', payload)
		},
		placeSearchVal(state, payload) {
			state.placeSearchVal = payload;
			console.log('placeSearchVal', payload)
		},
		memberDetailOb(state, payload) {
			state.memberDetailOb = payload;
			console.log('memberDetailOb', payload)
		},
		regionListX(state, payload) {
			state.regionList = payload;
			console.log('regionListS', payload)
		},
		realtionDetailX(state, payload) {
			state.realtionDetail = payload;
			console.log('realtionDetailX', payload)
		},
	},
	actions: {
		// Action 用于异步处理，可以通过 commit 调用 mutations
		updateChoosedStreet({
			commit
		}, payload) {
			// 异步操作可以放在这里，比如 API 请求
			setTimeout(() => {
				commit('setChoosedStreet', payload);
			}, 1000);
		},
		updateChoosedVillage({
			commit
		}, payload) {
			// 异步操作可以放在这里，比如 API 请求
			setTimeout(() => {
				commit('setChoosedVillage', payload);
			}, 1000);
		},
		// getRelationShip({
		// 	commit
		// }, id) {
		// 	// 准备请求参数
		// 	 let params = { id };
		// 	try {
		// 		// 发起异步请求
		// 		const result = await dataApi.getRealtionDetail(params);

		// 		// 如果请求成功，提交数据到 Vuex
		// 		if (result.code === 200) {
		// 			commit('realtionDetailX', result.data);
		// 		} else {
		// 			// 处理失败的情况
		// 			console.error('请求失败:', result.message);
		// 		}
		// 	} catch (error) {
		// 		// 异常处理
		// 		console.error('请求异常:', error);
		// 	}
		// }
	},
	getters: {
		// Getter 用于获取 state 数据
		choosedStreet(state) {
			return state.choosedStreet;
		},
		choosedVillage(state) {
			return state.choosedVillage;
		},
		placeSearchVal(state) {
			return state.placeSearchVal;
		},
		regionListX(state) {
			return state.regionListX;
		},
		realtionDetail(state) {
			return state.realtionDetail;
		},
	}
});

export default store;