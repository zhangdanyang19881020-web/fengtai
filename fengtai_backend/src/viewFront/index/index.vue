<template>
	<div class="index-page">
		<div class="bottom-mountain"></div>
	</div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
	.index-page {
		width: 100%;
		height: 100%;
		background: url('../../static/f-Images/home-bg.jpg') repeat;
		background-size: cover;
		position: relative;

		.bottom-mountain {
			position: absolute;
			background: url('../../static/f-Images/mountain.png') 50% no-repeat;
			background-size: contain;
			/* 图片等比缩放，完全包含 */
			background-position: right bottom;
			/* 背景图居中 */
			bottom: 0;
			right: 0;
			width: 100%;
			height: 100%;
			z-index: 100;

		}
	}
</style>