<template>
	<view class="auth-page">
		<view class="auth-container">
			<!-- 标题区 -->
			<view class="auth-header">
				<view class="header-icon">🎓</view>
				<text class="header-title">身份认证</text>
				<text class="header-desc">请填写您的真实信息完成认证</text>
			</view>

			<!-- 表单区 -->
			<view class="form-section">
				<!-- 姓名 -->
				<view class="form-item">
					<view class="form-label">
						<text class="label-text">姓名</text>
						<text class="label-required">*</text>
					</view>
					<input 
						class="form-input" 
						v-model="form.name" 
						placeholder="请输入真实姓名"
						placeholder-class="input-placeholder"
						@input="onNameInput"
					/>
				</view>

				<!-- 学号/工号 -->
				<view class="form-item">
					<view class="form-label">
						<text class="label-text">学号/工号</text>
						<text class="label-required">*</text>
					</view>
					<input 
						class="form-input" 
						v-model="form.studentId" 
						placeholder="请输入学号或工号"
						placeholder-class="input-placeholder"
						type="idcard"
						@input="onIdInput"
					/>
				</view>

				<!-- 身份类型 -->
				<view class="form-item">
					<view class="form-label">
						<text class="label-text">身份类型</text>
						<text class="label-required">*</text>
					</view>
					<view class="type-selector">
						<view 
							class="type-item" 
							:class="{ 'type-active': form.userType === 'student' }"
							@click="selectUserType('student')"
						>
							<text class="type-icon">👨‍🎓</text>
							<text class="type-text">学生</text>
						</view>
						<view 
							class="type-item" 
							:class="{ 'type-active': form.userType === 'teacher' }"
							@click="selectUserType('teacher')"
						>
							<text class="type-icon">👨‍🏫</text>
							<text class="type-text">教职工</text>
						</view>
					</view>
				</view>

				<!-- 错误提示 -->
				<view class="error-tip" v-if="errorMsg">
					<text class="error-icon">⚠️</text>
					<text class="error-text">{{ errorMsg }}</text>
				</view>

				<!-- 提交按钮 -->
				<button 
					class="submit-btn" 
					:disabled="submitting"
					@click="onSubmit"
				>
					<text v-if="submitting">提交中...</text>
					<text v-else>提交认证</text>
				</button>
			</view>

			<!-- 说明区 -->
			<view class="notice-section">
				<view class="notice-title">认证说明</view>
				<text class="notice-item">1. 请填写真实有效的身份信息</text>
				<text class="notice-item">2. 学号/工号为8-12位数字</text>
				<text class="notice-item">3. 认证信息将用于预约验证</text>
				<text class="notice-item">4. 如有疑问请联系客服</text>
			</view>
		</view>
	</view>
</template>

<script>
import userApi from '@/api/user.js'

export default {
	data() {
		return {
			form: {
				name: '',
				studentId: '',
				userType: 'student'
			},
			errorMsg: '',
			submitting: false
		}
	},
	
	methods: {
		// 姓名输入
		onNameInput(e) {
			this.form.name = e.detail.value
			this.errorMsg = ''
		},
		
		// 学号输入
		onIdInput(e) {
			// 只允许数字和字母
			let value = e.detail.value.replace(/[^\w]/g, '')
			this.form.studentId = value
			this.errorMsg = ''
		},
		
		// 选择身份类型
		selectUserType(type) {
			this.form.userType = type
		},
		
		// 表单验证
		validateForm() {
			const { name, studentId } = this.form
			
			// 验证姓名
			if (!name || name.trim().length < 2) {
				this.errorMsg = '请输入正确的姓名(至少2个字符)'
				return false
			}
			
			// 验证学号/工号
			if (!studentId || studentId.length < 6) {
				this.errorMsg = '请输入正确的学号/工号(至少6位)'
				return false
			}
			
			return true
		},
		
		// 提交认证
		async onSubmit() {
			// 验证表单
			if (!this.validateForm()) {
				return
			}
			
			this.submitting = true
			this.errorMsg = ''
			
			try {
				// 调用认证API
				await userApi.authenticate(this.form)
				
				uni.showToast({
					title: '认证成功',
					icon: 'success'
				})
				
				// 延迟返回
				setTimeout(() => {
					uni.navigateBack()
				}, 1500)
				
			} catch (error) {
				this.errorMsg = error.message || '认证失败,请重试'
				uni.showToast({
					title: '认证失败',
					icon: 'none'
				})
			} finally {
				this.submitting = false
			}
		}
	}
}
</script>

<style scoped>
.auth-page {
	min-height: 100vh;
	background-color: #F5F5F5;
}

.auth-container {
	padding: 60rpx 40rpx;
}

/* 标题区 */
.auth-header {
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-bottom: 60rpx;
}

.header-icon {
	font-size: 120rpx;
	margin-bottom: 24rpx;
}

.header-title {
	font-size: 40rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 16rpx;
}

.header-desc {
	font-size: 26rpx;
	color: #999999;
}

/* 表单区 */
.form-section {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 40rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.form-item {
	margin-bottom: 40rpx;
}

.form-item:last-of-type {
	margin-bottom: 30rpx;
}

.form-label {
	display: flex;
	align-items: center;
	margin-bottom: 16rpx;
}

.label-text {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

.label-required {
	color: #FF4D4F;
	margin-left: 4rpx;
	font-size: 28rpx;
}

.form-input {
	width: 100%;
	height: 88rpx;
	padding: 0 24rpx;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	font-size: 28rpx;
	color: #333333;
	border: 2rpx solid transparent;
	transition: all 0.3s;
}

.form-input:focus {
	background-color: #ffffff;
	border-color: #1E50A2;
}

.input-placeholder {
	color: #CCCCCC;
}

/* 身份类型选择 */
.type-selector {
	display: flex;
	gap: 20rpx;
}

.type-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 30rpx 20rpx;
	background-color: #F8F9FA;
	border-radius: 12rpx;
	border: 2rpx solid transparent;
	transition: all 0.3s;
}

.type-active {
	background-color: #F0F5FF;
	border-color: #1E50A2;
}

.type-icon {
	font-size: 56rpx;
	margin-bottom: 12rpx;
}

.type-text {
	font-size: 26rpx;
	color: #666666;
}

.type-active .type-text {
	color: #1E50A2;
	font-weight: 500;
}

/* 错误提示 */
.error-tip {
	display: flex;
	align-items: center;
	padding: 20rpx 24rpx;
	background-color: #FFF1F0;
	border-radius: 12rpx;
	margin-bottom: 24rpx;
	border-left: 4rpx solid #FF4D4F;
}

.error-icon {
	font-size: 32rpx;
	margin-right: 12rpx;
}

.error-text {
	flex: 1;
	font-size: 26rpx;
	color: #FF4D4F;
}

/* 提交按钮 */
.submit-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background-color: #1E50A2;
	color: #ffffff;
	font-size: 32rpx;
	font-weight: bold;
	border-radius: 44rpx;
	border: none;
	box-shadow: 0 8rpx 20rpx rgba(30, 80, 162, 0.3);
}

.submit-btn[disabled] {
	background-color: #CCCCCC;
	box-shadow: none;
}

/* 说明区 */
.notice-section {
	background-color: #FFF7E6;
	border-radius: 16rpx;
	padding: 30rpx;
	border-left: 6rpx solid #FAAD14;
}

.notice-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #FA8C16;
	margin-bottom: 16rpx;
}

.notice-item {
	display: block;
	font-size: 24rpx;
	color: #8C6D3F;
	line-height: 2;
	margin-bottom: 4rpx;
}
</style>
