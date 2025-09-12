<template>
	<div class="index-page">
		<div class="moon"></div>
		<div class="top-mountain"></div>
		<div class="bototm-left--house"></div>
		<div class="bottom-mountain"></div>
	</div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
	.index-page {
		width: 100%;
		height: 100%;
		background: url('../../static/f-Images/home-bg.jpg') 100% 100% repeat;
		background-size: contain;
		position: relative;

		.moon {
			position: absolute;
			background: url('../../static/f-Images/moon.png') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			right: -20px;
			top: -20px;
			width: 200px;
			height: 200px;
			z-index: 1;
		}

		.bottom-mountain {
			position: absolute;
			background: url('../../static/f-Images/bottom-house.jpg') 100% 100% no-repeat;
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
			background: url('../../static/f-Images/bottom-left--house.png') 100% 100% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			/* 背景图居中 */
			bottom: 0;
			left: 0;
			width: 70%;
			height: 70%;
			max-width:400px;
			z-index: 2;
		}

		.top-mountain {
			position: absolute;
			background: url('../../static/f-Images/top-left--bg.png') no-repeat;
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
	}
</style>