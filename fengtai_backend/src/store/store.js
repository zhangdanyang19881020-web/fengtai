// store.js
import {
	createStore
} from 'vuex';

const store = createStore({
	state() {
		return {
			choosedStreet: {},
			choosedVillage: {}, // 需要存储的数据
		};
	},
	mutations: {
		// Mutation 用于同步地修改 state 数据
		setChoosedStreet(state, payload) {
			state.choosedStreet = payload;
			state.choosedVillage = "";
			console.log('setChoosedStreet', payload)
		},
		setChoosedVillage(state, payload) {
			state.choosedVillage = payload;
			console.log('choosedVillage', payload)
		}
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
		}
	},
	getters: {
		// Getter 用于获取 state 数据
		choosedStreet(state) {
			return state.choosedStreet;
		},
		choosedVillage(state) {
			return state.choosedVillage;
		}
	}
});

export default store;