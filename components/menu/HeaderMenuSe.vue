<template>
	<!-- 顶部header -->
	<div class="nav un-select" :class="topClass" flex-row-bt-c py-4 px-6 text-m dark:text="light">
		<!-- 左侧 -->
		<div class="left" flex-row-c-c group>
			<NuxtLink mx-2 to="/" flex-row-c-c class="group">
				<img
					w-42px
					object-contain
					group-hover:opacity-85
					transition-300
					group-hover:filter-blur-2px
					src="@/assets/images/logo/logo.png"
					dark:hidden
				/>
				<img
					w-42px
					object-contain
					group-hover:opacity-85
					transition-300
					group-hover:filter-blur-2px
					src="@/assets/images/logo/logo_dark.png"
					hidden
					dark:block
				/>
				<span
					transition-300
					group-hover:block
					hidden
					w-32px
					h-32px
					i-solar:home-2-bold
					absolute
					left-9
					style="color: var(--el-text-color-primary)"
				></span>
				<span tracking-2 m-4 font-700 text-xl hidden md:inline-block>极物圈</span>
			</NuxtLink>
		</div>
		<!-- 右侧 -->
		<div class="right" flex-row-c-c hidden md:flex>
			<ClientOnly>
				<!-- 切换主题 -->
				<BtnSwitch />
			</ClientOnly>
		</div>
	</div>
</template>

<script lang="ts" setup>
const { topClass } = defineProps<{
	topClass?: string;
}>();

// 搜索
let searchWord = ref<string>('');
// 登录表单
const store = useUserStore();
enum FormType {
	LOGIN,
	REGISTER,
}
// 表单
const onLogin = (type: FormType) => {
	if (type === FormType.LOGIN) {
		// 登录
		store.showLoginForm = true;
		store.showRegisterForm = false;
	} else {
		// 注册
		store.showLoginForm = false;
		store.showRegisterForm = true;
	}
};
const onSerch = (val: string) => {};
// 搜索
</script>
<style lang="scss" scoped>
.nav {
	position: sticky;
	box-shadow: rgba(9, 30, 66, 0.1) 0px 4px 2px -2px;
	top: 0;
	z-index: 999;
	height: $top-nav-height;
	background-size: 4px 4px;
	backdrop-filter: saturate(50%) blur(6px);
	background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
}

.dark .nav {
	background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
	background-size: 4px 4px;
	box-shadow: rgba(92, 97, 124, 0.02) 12px 12px 60px;
}

.login:hover {
	transition: $transition-delay;
	border-color: var(--el-color-primary);
	opacity: 0.8;
}

.input-search {
	position: absolute;
	left: 50%;
	transform: translate(-50%, -130%);
	transition: all 2 * $transition-delay $animate-cubic-bount;
}

.nav:focus,
.nav:hover {
	overflow: hidden;

	.input-search {
		animation-duration: 0.6s;
		transform: translate(-50%, 0);
	}

	.input-search:focus {
		animation-duration: 0.6s;
		transform: translate(-50%, 0);
	}
}
</style>
