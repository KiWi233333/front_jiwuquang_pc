<script lang="ts" setup>
import { UploadProps } from 'element-plus';
import { BaseUrlImg } from '~/composables/utils/useFetchUtil';
const props = defineProps({
	userInfo: {
		type: Object,
		required: false,
	},
});
const store = useUserStore();
const p = props.userInfo || store.userInfo;
const formData = new FormData();

// 表单
const avatarUrl = ref<string>(p.avatar);
/**
 * 上传之前验证类型
 */
const imageTypeList = ref<string[]>(['image/png', 'image/jpg', 'image/jpeg', 'image/svg']);
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (!imageTypeList.value.includes(rawFile.type)) {
		ElMessage.error('文件格式不是图片格式!');
		return false;
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('头像需要小于2MB!');
		return false;
	}
	// check success
	formData.append('file', rawFile);
	return true;
};
/**
 * 更新
 */
const updateSucess: UploadProps['onSuccess'] = async (data, file) => {
	if (data.code === StatusCode.SUCCESS) {
		store.$patch({
			userInfo: {
				avatar: data.data,
			},
		});
		avatarUrl.value = data.data || '';
		ElMessage.success('更换头像成功！');
	} else {
		ElMessage.error('更换头像失败！');
	}
};
// 退出登录
const exitLogin = () => {
	const cWidth = document.body.clientWidth || document.documentElement.clientWidth; //页面可视区域宽度
	const iWidth = window.innerWidth; //浏览器窗口大小
	const init = document.body.style.paddingRight;
	document.body.style.paddingRight = `${iWidth - cWidth}px`;
	ElMessageBox.confirm('是否确认退出登录？', '退出登录', {
		confirmButtonText: '确认退出',
		cancelButtonText: '取消',
		type: 'warning',
	})
		.then((e) => {
			// 退出登录
			store.onUserExit(store.token);
			document.body.style.paddingRight = init + 'px';
			ElMessage.success('退出成功！');
		})
		.catch(() => {
			document.body.style.paddingRight = init + 'px';
		});
};
// 跳转
const router = useRouter();
const toView = (path: string) => {
	router.push({ path });
};
</script>
<template>
	<div class="user-card" flex-row-c-c cursor-pointer p-1>
		<ClientOnly>
			<!-- 头像弹窗 -->
			<el-popover placement="top" :offset="20" :width="320" trigger="hover">
				<template #reference>
					<!-- 替换头像 -->
					<el-badge :is-dot="!p.avatar || p.avatar === 'default.png'" class="item">
						<el-avatar
							:src="
								!p.avatar || p.avatar === 'default.png' ? '' : BaseUrlImg + p.avatar
							"
							class="hovers"
						>
							<span i-solar:user-bold style="width: 60%; height: 60%"></span>
						</el-avatar>
					</el-badge>
				</template>
				<!-- 卡片 -->
				<template #default>
					<div class="top" p-10></div>
					<div class="popup">
						<!-- 上传 -->
						<el-upload
							class="avatar-uploader"
							ref="uploader"
							style="width: 100%; height: 100%; border-radius: 50%"
							drag
							action="/api/user/info/avatar"
							:headers="{ Authorization: store.token }"
							method="PUT"
							:limit="1"
							:multiple="false"
							:auto-upload="true"
							:show-file-list="false"
							list-type="picture"
							:before-upload="beforeUpload"
							:on-success="updateSucess"
						>
							<img
								w-6em
								h-6em
								v-if="avatarUrl"
								:src="BaseUrlImg + avatarUrl"
								class="avatar"
							/>
							<ElIconPlus size="2em" v-else />
						</el-upload>
						<div class="bottom" flex-col>
							<h3 class="title" py-1>{{ p.nickname }}</h3>
							<div flex flex-wrap>
								<el-card shadow="hover" class="v-card" @click="toView('/my/info')">
									<p
										class="icon myself"
										bg-yellow-5
										i-solar:user-id-bold-duotone
									></p>
									<p>主页</p>
								</el-card>
								<el-card shadow="hover" class="v-card" @click="toView('/shopcart')">
									<p
										class="icon shopcart"
										bg-yellow-5
										i-solar:cart-large-2-bold
									></p>
									<p>购物车</p>
								</el-card>
								<el-card
									shadow="hover"
									class="v-card"
									@click="toView('/my/wallet')"
								>
									<p class="icon wallet" bg-red-5 i-solar:wallet-bold-duotone></p>
									<p>钱包</p>
								</el-card>
							</div>
							<div class="btn" flex-row-bt-c pt-4>
								<el-button size="large" @click="exitLogin" ml-3>退出登录</el-button>
								<NuxtLink to="/my/info" mr-3>
									<el-button size="large" type="primary">个人主页</el-button>
								</NuxtLink>
							</div>
						</div>
					</div>
				</template>
			</el-popover>
		</ClientOnly>
		<div px-4>
			<h4 tracking-1px w-7em class="overflow-hidden truncate ...">
				{{ p.nickname }}
			</h4>
			<el-tag opacity-70 class="p-0 overflow-hidden truncate ...">{{ p.gender }}</el-tag>
		</div>
	</div>
</template>
<style scoped lang="scss">
.hovers {
	width: 2.3em;
	height: 2.3em;
	border-radius: 50%;
}

// 标签
:deep(.el-tag) {
	padding: 0.1em 0.2em;
	height: 1.2rem;
}

.hovers:hover {
	transition: $transition-delay;
	position: relative;

	&::before {
		content: '';
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0.7em;
		left: 0;
		z-index: 2;
		transition: $transition-delay;
		font-size: 1em;
		margin: auto;
		color: var(--el-bg-color-primary);
	}
}

.user-card {
	// 弹窗
	.popup {
		border-radius: 4px;

		.img {
			.avatar-uploader {
				width: 100%;

				:deep(.el-upload) {
					display: flex;
				}
			}
		}
	}
}

.top {
	background-color: var(--el-color-primary);
	border-radius: 6px 6px 0 0;
	box-shadow: rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset,
		rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;
}

.avatar-uploader {
	transform: translateY(-50%);

	:deep(.el-upload--picture) {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	:deep(.el-upload-dragger) {
		border-radius: 50%;
		width: 6em;
		height: 6em;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: var(--el-bg-color);
		opacity: 0.95;
		box-shadow: rgba(60, 64, 67, 0.2) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
	}
}

.popup .bottom {
	margin-top: -3.8em;
	padding: 0.8em;
	border-radius: 6px;

	.title {
		text-align: center;
	}
}

.btn {
	border-top: 1px solid rgba(128, 128, 128, 0.12);
}

:deep(.el-card__body) {
	padding: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 6em;
	height: 6em;
	border-radius: 6px;
	cursor: pointer;
	margin: 0.2em;
}

.v-card {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	width: 6em;
	height: 6em;
	border-radius: 6px;
	cursor: pointer;
	margin: 0.2em;
}

.icon {
	cursor: pointer;
	width: 3em;
	height: 3em;
}
</style>
~/composables/utils/useFetchUtil