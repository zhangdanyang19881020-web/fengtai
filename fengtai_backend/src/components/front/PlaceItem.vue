<template>
	<div class="street-list">
		<div class="street-list--item" v-for="(street, sIndex) in placeList" :key="street.id">
			<div class="relative-item" :class="{'active':street.childrenShow}" @click="toggleChildren(street,sIndex)">
				<label>{{ street.name }}</label>
				<div v-if="street.children && street.children.length>0">
					<i class="iconfont icon-jiantouxia" v-if="!street.childrenShow"></i>
					<i class="iconfont icon-icon_arrow_top" v-else></i>
				</div>
			</div>
			<transition name="fade-slide">
				<div class="children-box" v-if="street.children && street.children.length&&street.childrenShow">
					<i class="iconfont icon-zelvxuanzefeiyongzhengsanjiaoxingzhichi"></i>
					<place-item :level="1" :placeList="street.children"></place-item>
				</div>
			</transition>

		</div>
	</div>
</template>

<script setup>
	import {
		defineProps,
		defineEmits,
		reactive,
		onMounted,
		computed
	} from 'vue';
	import {
		useStore
	} from 'vuex';

	const store = useStore();
	// 定义发送数据的事件
	const emit = defineEmits();

	// 确保父组件传递了 placeList，并定义了正确的类型
	const props = defineProps({
		placeList: {
			type: Array, // 明确声明 placeList 是数组
			required: true // 确保父组件必须传递这个属性
		},
		level: {
			type: Number,
			required: true
		},
	});

	

	onMounted(() => {

	})
	const isActive = (street) => {
		const streetV = store.getters.choosedStreet;
		const villageV = store.getters.choosedVillage;
		if (street.id == streetV.id || street.if == villageV.id) {
			return true;
		} else {
			return false;
		}
	}

	// console.log('placeList--in0s--', props.placeList)
	const toggleChildren = (street, sIndex) => {
		// 切换当前街道的显示状态，收起其他所有街道
		if (props.level === 0) {
			//街道层级
			street.childrenShow = !street.childrenShow;
			props.placeList.forEach(item => {
				if (item !== street) {
					item.childrenShow = false; // 关闭其他的子项
				}
			});
			store.commit('setChoosedStreet', street);
		}
		if (props.level === 1) {
			store.commit('setChoosedVillage', street);
		}
	}
</script>

<style lang="scss" scoped>
	.street-list {
		.street-list--item {
			overflow: hidden;

			.relative-item {
				margin-bottom: 12px;
				background: #fff;
				border-radius: 8px;
				padding: 10px 20px;
				box-shadow: 0 1px 0 rgba(139, 69, 19, 0.2);
				display: flex;
				justify-content: space-between;
				align-items: center;


				&:hover,
				&.active {
					background: 0 rgba(139, 69, 19, 0.1);
				}
			}


		}

		.children-box {
			position: relative;
			// overflow: hidden;
			/* 隐藏超出部分 */
			max-height: 1000px;
			/* 初始状态是完全收缩 */
			box-sizing: border-box;
			margin: 0 10px 10px 0;
			padding: 20px 20px 10px 20px;
			background: rgba(139, 69, 19, 0.05);
			border-radius: 8px;

			.icon-zelvxuanzefeiyongzhengsanjiaoxingzhichi {
				color: rgba(139, 69, 19, 0.05);
				position: absolute;
				top: -12px;
				left: 35px
			}

		}
	}


	.fade-slide-enter-active,
	.fade-slide-leave-active {
		transition: transform 0.3s ease, opacity 0.3s ease;
	}

	.fade-slide-enter,
	.fade-slide-leave-to {
		opacity: 0;
		// transform: translateY(-100%);
		max-height: 0;
		/* 收缩时高度为0 */
	}

	.fade-slide-enter-to,
	.fade-slide-leave {
		opacity: 1;
		// transform: translateY(0);
		max-height: 1000px;
		/* 设置一个最大高度值，保证过渡动画平滑 */
	}

	.icon-jiantouxia {
		cursor: pointer;
		transition: transform 0.5s ease;
		/* 添加旋转过渡 */
	}

	.icon-jiantouxia.rotated {
		transform: rotate(90deg);
		/* 旋转180度 */
	}
</style>