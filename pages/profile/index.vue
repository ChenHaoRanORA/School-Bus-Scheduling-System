<template>
	<view class="profile-page">
		<!-- 功能入口区 -->
		<view class="function-section">
			<view class="function-grid">
				<view class="function-item" @click="onAuth">
					<view class="function-icon" style="background-color: #1E50A2;">
						<text class="icon-text">👤</text>
					</view>
					<text class="function-text">身份认证</text>
				</view>
				
				<view class="function-item" @click="onNotice">
					<view class="function-icon" style="background-color: #52C41A;">
						<text class="icon-text">📋</text>
					</view>
					<text class="function-text">预约须知</text>
				</view>
				
				<view class="function-item" @click="onFeedback">
					<view class="function-icon" style="background-color: #FAAD14;">
						<text class="icon-text">💬</text>
					</view>
					<text class="function-text">客服反馈</text>
				</view>
				
				<view class="function-item" @click="onHistory">
					<view class="function-icon" style="background-color: #722ED1;">
						<text class="icon-text">📊</text>
					</view>
					<text class="function-text">乘车历史</text>
				</view>
			</view>
		</view>

		<!-- 身份信息区 -->
		<view class="identity-section">
			<view class="identity-card" v-if="userInfo && userInfo.isAuthenticated">
				<view class="identity-header">
					<view class="avatar">
						<text class="avatar-text">{{ userInfo.name ? userInfo.name.charAt(0) : 'U' }}</text>
					</view>
					<view class="identity-info">
						<view class="identity-name">{{ userInfo.name }}</view>
						<view class="identity-type">
							<text class="type-badge">{{ getUserTypeText(userInfo.userType) }}</text>
						</view>
					</view>
				</view>
				
				<view class="identity-details">
					<view class="detail-item">
						<text class="detail-label">学号/工号</text>
						<text class="detail-value">{{ userInfo.studentId }}</text>
					</view>
					<view class="detail-item">
						<text class="detail-label">认证时间</text>
						<text class="detail-value">{{ formatAuthTime(userInfo.authenticatedAt) }}</text>
					</view>
				</view>
				
				<view class="auth-badge">
					<text class="badge-icon">✓</text>
					<text class="badge-text">已认证</text>
				</view>
			</view>

			<!-- 未认证状态 -->
			<view class="identity-card unauthenticated" v-else>
				<view class="unauth-icon">⚠️</view>
				<text class="unauth-text">您还未进行身份认证</text>
				<text class="unauth-tip">请先完成身份认证后才能预约校车</text>
				<button class="auth-btn" @click="onAuth">立即认证</button>
			</view>
		</view>

		<!-- 预约须知弹窗 -->
		<view class="modal" v-if="showNoticeModal" @click="showNoticeModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">预约须知</text>
					<text class="modal-close" @click="showNoticeModal = false">×</text>
				</view>
				<scroll-view class="modal-body" scroll-y>
					<text class="notice-text">1. 预约时间: 可预约未来7天内的校车车次</text>
					<text class="notice-text">2. 预约限制: 每个车次每人仅限预约1次</text>
					<text class="notice-text">3. 取消预约: 发车前可随时取消预约</text>
					<text class="notice-text">4. 乘车凭证: 上车时出示乘车码供司机扫描</text>
					<text class="notice-text">5. 候车时间: 请提前5-10分钟到达候车位置</text>
					<text class="notice-text">6. 失约处理: 累计3次未乘车将限制预约功能</text>
					<text class="notice-text">7. 如有疑问: 请联系客服反馈</text>
				</scroll-view>
			</view>
		</view>

		<!-- 客服反馈弹窗 -->
		<view class="modal" v-if="showFeedbackModal" @click="showFeedbackModal = false">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">客服反馈</text>
					<text class="modal-close" @click="showFeedbackModal = false">×</text>
				</view>
				<view class="modal-body">
					<view class="contact-item">
						<text class="contact-label">客服电话</text>
						<text class="contact-value">027-88888888</text>
					</view>
					<view class="contact-item">
						<text class="contact-label">工作时间</text>
						<text class="contact-value">周一至周五 8:00-18:00</text>
					</view>
					<view class="contact-item">
						<text class="contact-label">邮箱</text>
						<text class="contact-value">bus@hubu.edu.cn</text>
					</view>
					<view class="feedback-tip">
						<text>如有问题或建议,请通过以上方式联系我们</text>
					</view>
				</view>
			</view>
		</view>

		<!-- 乘车历史列表 -->
		<view class="modal" v-if="showHistoryModal" @click="showHistoryModal = false">
			<view class="modal-content modal-large" @click.stop>
				<view class="modal-header">
					<text class="modal-title">乘车历史</text>
					<text class="modal-close" @click="showHistoryModal = false">×</text>
				</view>
				<scroll-view class="modal-body" scroll-y>
					<view v-if="historyList.length > 0">
						<view class="history-item" v-for="item in historyList" :key="item.id">
							<view class="history-route">{{ item.route }}</view>
							<view class="history-info">
								<text>{{ item.dateDisplay }} {{ item.time }}</text>
								<text class="history-status" :class="'status-' + item.status">
									{{ getStatusText(item.status) }}
								</text>
							</view>
						</view>
					</view>
					<view v-else class="empty-history">
						<text>暂无乘车记录</text>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
import userApi from '@/api/user.js'
import bookingApi from '@/api/booking.js'

export default {
	data() {
		return {
			userInfo: null,
			showNoticeModal: false,
			showFeedbackModal: false,
			showHistoryModal: false,
			historyList: []
		}
	},
	
	onShow() {
		this.loadUserInfo()
	},
	
	methods: {
		// 加载用户信息
		async loadUserInfo() {
			try {
				this.userInfo = await userApi.getUserInfo()
			} catch (error) {
				console.error('加载用户信息失败:', error)
			}
		},
		
		// 身份认证
		onAuth() {
			if (this.userInfo && this.userInfo.isAuthenticated) {
				uni.showToast({
					title: '您已认证',
					icon: 'none'
				})
				return
			}
			
			uni.navigateTo({
				url: '/pages/auth/index'
			})
		},
		
		// 预约须知
		onNotice() {
			this.showNoticeModal = true
		},
		
		// 客服反馈
		onFeedback() {
			this.showFeedbackModal = true
		},
		
		// 乘车历史
		async onHistory() {
			try {
				const bookings = await bookingApi.getMyBookings()
				this.historyList = bookings
				this.showHistoryModal = true
			} catch (error) {
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		
		// 获取用户类型文本
		getUserTypeText(type) {
			const typeMap = {
				'student': '学生',
				'teacher': '教职工'
			}
			return typeMap[type] || '未知'
		},
		
		// 格式化认证时间
		formatAuthTime(timeStr) {
			if (!timeStr) return ''
			const date = new Date(timeStr)
			const month = date.getMonth() + 1
			const day = date.getDate()
			return `${month}月${day}日`
		},
		
		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				'pending': '待出行',
				'completed': '已完成',
				'cancelled': '已取消'
			}
			return statusMap[status] || status
		}
	}
}
</script>

<style scoped>
.profile-page {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding: 30rpx;
}

/* 功能入口区 */
.function-section {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 40rpx 20rpx;
	margin-bottom: 30rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.function-grid {
	display: flex;
	justify-content: space-around;
}

.function-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.function-icon {
	width: 100rpx;
	height: 100rpx;
	border-radius: 20rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.icon-text {
	font-size: 48rpx;
}

.function-text {
	font-size: 26rpx;
	color: #333333;
}

/* 身份信息区 */
.identity-section {
	margin-bottom: 30rpx;
}

.identity-card {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 50rpx 40rpx;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
	position: relative;
}

.identity-header {
	display: flex;
	align-items: center;
	margin-bottom: 40rpx;
}

.avatar {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	background: linear-gradient(135deg, #1E50A2 0%, #2E60B2 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 30rpx;
	box-shadow: 0 4rpx 12rpx rgba(30, 80, 162, 0.3);
}

.avatar-text {
	font-size: 56rpx;
	color: #ffffff;
	font-weight: bold;
}

.identity-info {
	flex: 1;
}

.identity-name {
	font-size: 40rpx;
	color: #333333;
	font-weight: bold;
	margin-bottom: 12rpx;
}

.identity-type {
	display: inline-block;
}

.type-badge {
	font-size: 24rpx;
	color: #1E50A2;
	background-color: #F0F5FF;
	padding: 6rpx 16rpx;
	border-radius: 8rpx;
}

.identity-details {
	background-color: #F8F9FA;
	border-radius: 16rpx;
	padding: 30rpx;
	margin-bottom: 30rpx;
}

.detail-item {
	display: flex;
	justify-content: space-between;
	padding: 16rpx 0;
	border-bottom: 1rpx solid #E8E8E8;
}

.detail-item:last-child {
	border-bottom: none;
}

.detail-label {
	font-size: 28rpx;
	color: #666666;
}

.detail-value {
	font-size: 28rpx;
	color: #333333;
}

.auth-badge {
	position: absolute;
	top: 40rpx;
	right: 40rpx;
	display: flex;
	align-items: center;
	gap: 8rpx;
	background-color: #F6FFED;
	padding: 8rpx 20rpx;
	border-radius: 20rpx;
	border: 2rpx solid #52C41A;
}

.badge-icon {
	font-size: 28rpx;
	color: #52C41A;
	font-weight: bold;
}

.badge-text {
	font-size: 24rpx;
	color: #52C41A;
}

/* 未认证状态 */
.unauthenticated {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 80rpx 40rpx;
}

.unauth-icon {
	font-size: 120rpx;
	margin-bottom: 30rpx;
}

.unauth-text {
	font-size: 32rpx;
	color: #333333;
	font-weight: bold;
	margin-bottom: 16rpx;
}

.unauth-tip {
	font-size: 26rpx;
	color: #999999;
	margin-bottom: 50rpx;
	text-align: center;
}

.auth-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background-color: #1E50A2;
	color: #ffffff;
	font-size: 32rpx;
	border-radius: 44rpx;
	border: none;
}

/* 弹窗 */
.modal {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 999;
}

.modal-content {
	width: 600rpx;
	max-height: 70vh;
	background-color: #ffffff;
	border-radius: 24rpx;
	overflow: hidden;
}

.modal-large {
	width: 90%;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 40rpx;
	border-bottom: 1rpx solid #E8E8E8;
}

.modal-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
}

.modal-close {
	font-size: 48rpx;
	color: #999999;
	line-height: 1;
}

.modal-body {
	padding: 40rpx;
	max-height: 60vh;
}

.notice-text {
	display: block;
	font-size: 26rpx;
	color: #666666;
	line-height: 2;
	margin-bottom: 8rpx;
}

.contact-item {
	display: flex;
	justify-content: space-between;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.contact-label {
	font-size: 28rpx;
	color: #666666;
}

.contact-value {
	font-size: 28rpx;
	color: #1E50A2;
	font-weight: 500;
}

.feedback-tip {
	margin-top: 30rpx;
	padding: 20rpx;
	background-color: #F0F5FF;
	border-radius: 12rpx;
}

.feedback-tip text {
	font-size: 24rpx;
	color: #1E50A2;
	text-align: center;
	display: block;
}

/* 乘车历史 */
.history-item {
	padding: 24rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
	width: 100%;
	box-sizing: border-box;
	overflow: hidden;
}

.history-item:last-child {
	border-bottom: none;
}

.history-route {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
	margin-bottom: 12rpx;
}

.history-info {
	display: flex;
	align-items: center;
	gap: 12rpx;
}

.history-info text:first-child {
	font-size: 24rpx;
	color: #999999;
}

.history-status {
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	white-space: nowrap;
	flex-shrink: 0;
}

.status-pending {
	background-color: #E6F7FF;
	color: #1890FF;
}

.status-completed {
	background-color: #F6FFED;
	color: #52C41A;
}

.status-cancelled {
	background-color: #FFF1F0;
	color: #FF4D4F;
}

.empty-history {
	padding: 80rpx 0;
	text-align: center;
	font-size: 28rpx;
	color: #999999;
}
</style>
