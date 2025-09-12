<template>
	<div class="index-page">
		<div class="moon"></div>
		<div class="top-mountain"></div>
		<div class="bototm-left--house"></div>
		<div class="bototm-right--house"></div>
		<div class="bottom-mountain"></div>
		<div class="bottom-light"></div>
		<div class="denglong"></div>
		<div class="logo"></div>
		<div class="input-box">
			<el-input class="z-input" v-model="searchVal"></el-input>
		</div>
	</div>
</template>

<script setup>
	import {
		ref
	} from 'vue'
	const searchVal = ref('');
</script>

<style lang="scss" scoped>
	.index-page {
		width: 100%;
		height: 100%;
		background: url('../../static/f-Images/home-bg.jpg') 100% 100% repeat;
		background-size: contain;
		position: relative;
		overflow-x: hidden;

		.input-box {
			.z-input {
				width:calc(100% - 40px);
				margin: 10px 20px;
				.el-input__wrapper{
					background: none;
				}
			}
		}

		.input-box {
			position: absolute;
			background: url('../../static/f-Images/webp/input-bg.webp') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			left: 10%;
			top: 370px;
			width: 80%;
			height: 50px;
			z-index: 11;
		}

		.moon {
			position: absolute;
			background: url('../../static/f-Images/webp/moon-2.webp') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			right: -20px;
			top: -20px;
			width: 200px;
			height: 200px;
			z-index: 3;
		}

		.bottom-mountain {
			position: absolute;
			background: url('../../static/f-Images/bottom-half-shan.jpg') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			/* 背景图居中 */
			bottom: 0;
			right: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
		}

		.bototm-left--house {
			position: absolute;
			background: url('../../static/f-Images/webp/bottom-left--cloud.webp') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			/* 背景图居中 */
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			max-width: 400px;
			z-index: 2;
		}

		.bototm-right--house {
			position: absolute;
			background: url('../../static/f-Images/webp/right-house-2.webp') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			/* 背景图居中 */
			bottom: 0;
			right: 0;
			width: 100%;
			height: 100%;
			max-width: 400px;
			z-index: 3;
		}

		.top-mountain {
			position: absolute;
			background: url('../../static/f-Images/webp/top-left--sky2.webp') no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: left top;
			/* 背景图居中 */
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1;
		}

		.bottom-light {
			position: absolute;
			background: url('../../static/f-Images/webp/bototm-light.webp') repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: left top;
			/* 背景图居中 */
			bottom: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 2;
		}

		.denglong {
			position: absolute;
			background: url('../../static/f-Images/webp/denglong-big.webp') no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: left top;
			/* 背景图居中 */
			top: 70px;
			left: 30%;
			width: 50%;
			height: 50%;
			z-index: 10;
			animation: moveAndDisappear 15s ease-in-out infinite;
		}

		.logo {
			position: absolute;
			background: url('../../static/f-Images/webp/logo-together.webp') no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: center top;
			/* 背景图居中 */
			top: 200px;
			left: 60px;
			width: calc(100% - 120px);
			height: 100%;
			z-index: 11;
		}
	}


	@keyframes moveAndDisappear {
		0% {
			transform: translateY(0) rotate(0deg);
			opacity: 1;
		}

		// 25% {
		//     transform: translateY(-100px) translateX(20px) rotate(5deg);
		//     opacity: 0.9;
		// }
		// 50% {
		//     transform: translateY(-200px) translateX(-15px) rotate(-3deg);
		//     opacity: 0.8;
		// }
		// 75% {
		//     transform: translateY(-300px) translateX(100px) rotate(2deg);
		//     opacity: 0.5;
		// }
		100% {
			transform: translateY(-400px) translateX(300px) rotate(0deg);
			opacity: 0;
		}
	}
</style>