<script lang="ts" setup>
const route = useRoute();
useHead({
	title: "活动详情",
	meta: [
		{
			name: "description",
			content: "极物圈-活动详情",
		},
	],
});
</script>
<template>
	<NuxtLayout :left-menu="false" :menu="['shopcart','back']">
		<template>
			{{ route.query.eid }}
		</template>
	</NuxtLayout>
</template>
<style scoped lang="scss"></style>
