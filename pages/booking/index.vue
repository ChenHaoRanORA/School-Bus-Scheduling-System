<template>
	<view class="booking-page">
		<!-- 我的预约板块 -->
		<view class="my-bookings-section">
			<view class="section-title">我的预约</view>
			<scroll-view class="bookings-scroll" scroll-x v-if="myBookings.length > 0">
				<view class="bookings-container">
					<view class="booking-card" v-for="item in myBookings" :key="item.id" @click="showBookingDetail(item)">
						<view class="booking-route">{{ item.route }}</view>
						<view class="booking-date">{{ item.dateDisplay }}</view>
						<view class="booking-time">{{ item.time }}</view>
						<view class="booking-status" :class="'status-' + item.status">
							{{ getStatusText(item.status) }}
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="empty-bookings" v-else>
				<text class="empty-text">暂无预约,快去预约吧~</text>
			</view>
		</view>

		<!-- 车辆预约板块 -->
		<view class="bus-booking-section">
			<view class="section-title">车辆预约</view>
			
			<!-- 筛选栏 (固定) -->
			<view class="filter-bar">
				<!-- 路线选择 -->
				<picker @change="onRouteChange" :value="selectedRouteIndex" :range="routes">
					<view class="filter-item">
						<text class="filter-label">路线:</text>
						<text class="filter-value">{{ routes[selectedRouteIndex] }}</text>
						<text class="filter-arrow">▼</text>
					</view>
				</picker>
				
				<!-- 日期选择 -->
				<scroll-view class="date-scroll" scroll-x>
					<view class="date-container">
						<view 
							class="date-item" 
							:class="{ 'date-active': selectedDateIndex === index }"
							v-for="(item, index) in futureDays" 
							:key="index"
							@click="onDateChange(index)"
						>
							<text class="date-text">{{ item.display }}</text>
						</view>
					</view>
				</scroll-view>
			</view>

			<!-- 车次列表 -->
			<scroll-view class="bus-list-scroll" scroll-y>
				<view class="bus-list" v-if="busList.length > 0">
					<view class="bus-card" v-for="bus in busList" :key="bus.id">
						<view class="bus-time-section">
							<text class="bus-time">{{ bus.departureTime }}</text>
							<text class="bus-label">出发</text>
						</view>
						
						<view class="bus-info-section">
							<view class="bus-seats" :class="'seats-' + bus.status">
								<text v-if="bus.status === 'available'">剩余 {{ bus.remainingSeats }} 座位</text>
								<text v-else-if="bus.status === 'full'">已满员</text>
								<text v-else>已预约</text>
							</view>
							<view class="bus-location">
								<text class="location-icon">📍</text>
								<text class="location-text">{{ bus.location }}</text>
							</view>
						</view>
						
						<view class="bus-action-section">
							<button 
								class="booking-btn" 
								:class="'btn-' + bus.status"
								:disabled="bus.status !== 'available'"
								@click="onBookBus(bus)"
							>
								<text v-if="bus.status === 'available'">立即预约</text>
								<text v-else-if="bus.status === 'full'">已满员</text>
								<text v-else>已预约</text>
							</button>
						</view>
					</view>
				</view>
				
				<view class="empty-bus" v-else>
					<text class="empty-text">暂无车次信息</text>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
import bookingApi from '@/api/booking.js'
import { getFutureDays } from '@/utils/date.js'

export default {
	data() {
		return {
			routes: ['长江新区至武昌', '武昌至长江新区'],
			selectedRouteIndex: 0,
			futureDays: [],
			selectedDateIndex: 0,
			myBookings: [],
			busList: []
		}
	},
	
	onLoad() {
		this.initData()
	},
	
	onShow() {
		// 每次显示页面时刷新数据
		this.loadMyBookings()
		this.loadBusList()
	},
	
	methods: {
		// 初始化数据
		async initData() {
			// 获取未来7天
			this.futureDays = getFutureDays(7)
			
			// 加载我的预约
			await this.loadMyBookings()
			
			// 加载车次列表
			await this.loadBusList()
		},
		
		// 加载我的预约
		async loadMyBookings() {
			try {
				const bookings = await bookingApi.getMyBookings()
				// 只显示待出行的预约
				this.myBookings = bookings.filter(b => b.status === 'pending')
			} catch (error) {
				console.error('加载预约列表失败:', error)
			}
		},
		
		// 加载车次列表
		async loadBusList() {
			try {
				const route = this.routes[this.selectedRouteIndex]
				const date = this.futureDays[this.selectedDateIndex].date
				
				this.busList = await bookingApi.getBusList(route, date)
			} catch (error) {
				console.error('加载车次列表失败:', error)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			}
		},
		
		// 路线改变
		onRouteChange(e) {
			this.selectedRouteIndex = e.detail.value
			this.loadBusList()
		},
		
		// 日期改变
		onDateChange(index) {
			this.selectedDateIndex = index
			this.loadBusList()
		},
		
		// 预约车辆
		async onBookBus(bus) {
			if (bus.status !== 'available') {
				return
			}
			
			// 检查是否已认证
			const userInfo = uni.getStorageSync('user_info')
			if (!userInfo || !userInfo.isAuthenticated) {
				uni.showModal({
					title: '提示',
					content: '请先进行身份认证',
					confirmText: '去认证',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/auth/index'
							})
						}
					}
				})
				return
			}
			
			// 确认预约
			uni.showModal({
				title: '确认预约',
				content: `路线: ${bus.route}\n时间: ${bus.departureTime}\n地点: ${bus.location}`,
				success: async (res) => {
					if (res.confirm) {
						await this.doBooking(bus)
					}
				}
			})
		},
		
		// 执行预约
		async doBooking(bus) {
			uni.showLoading({
				title: '预约中...'
			})
			
			try {
				const busInfo = {
					route: bus.route,
					date: bus.date,
					dateDisplay: this.futureDays[this.selectedDateIndex].display,
					departureTime: bus.departureTime,
					location: bus.location,
					remainingSeats: bus.remainingSeats,
					bookedSeats: bus.bookedSeats
				}
				
				await bookingApi.createBooking(bus.id, busInfo)
				
				uni.hideLoading()
				uni.showToast({
					title: '预约成功',
					icon: 'success'
				})
				
				// 刷新数据
				await this.loadMyBookings()
				await this.loadBusList()
			} catch (error) {
				uni.hideLoading()
				uni.showToast({
					title: error.message || '预约失败',
					icon: 'none'
				})
			}
		},
		
		// 获取状态文本
		getStatusText(status) {
			const statusMap = {
				'pending': '待出行',
				'completed': '已完成',
				'cancelled': '已取消'
			}
			return statusMap[status] || status
		},
		
		// 显示预约详情
		showBookingDetail(booking) {
			uni.showModal({
				title: '预约详情',
				content: `路线: ${booking.route}\n日期: ${booking.dateDisplay}\n时间: ${booking.time}\n地点: ${booking.location}`,
				showCancel: booking.status === 'pending',
				cancelText: '取消预约',
				confirmText: '我知道了',
				success: (res) => {
					if (res.cancel && booking.status === 'pending') {
						// 使用setTimeout确保第一个弹窗完全关闭后再打开第二个
						setTimeout(() => {
							this.showCancelConfirm(booking)
						}, 300)
					}
				}
			})
		},
			
		// 显示取消确认弹窗
		showCancelConfirm(booking) {
			uni.showModal({
				title: '确认取消',
				content: '确定要取消该预约吗?',
				cancelText: '再想想',
				confirmText: '确定取消',
				success: async (res) => {
					if (res.confirm) {
						try {
							await bookingApi.cancelBooking(booking.id)
							uni.showToast({
								title: '已取消',
								icon: 'success'
							})
							await this.loadMyBookings()
							await this.loadBusList()
						} catch (error) {
							uni.showToast({
								title: '取消失败',
								icon: 'none'
							})
						}
					}
				}
			})
		}
	}
}
</script>

<style scoped>
.booking-page {
	min-height: 100vh;
	background-color: #F5F5F5;
	padding-bottom: 20rpx;
}

/* 我的预约板块 */
.my-bookings-section {
	background-color: #ffffff;
	padding: 30rpx;
	margin-bottom: 20rpx;
}

.section-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 24rpx;
}

.bookings-scroll {
	white-space: nowrap;
}

.bookings-container {
	display: inline-flex;
	gap: 20rpx;
}

.booking-card {
	display: inline-block;
	width: 280rpx;
	padding: 24rpx;
	background: linear-gradient(135deg, #1E50A2 0%, #2E60B2 100%);
	border-radius: 16rpx;
	color: #ffffff;
	box-shadow: 0 4rpx 12rpx rgba(30, 80, 162, 0.2);
}

.booking-route {
	font-size: 28rpx;
	font-weight: bold;
	margin-bottom: 16rpx;
	line-height: 1.4;
}

.booking-date {
	font-size: 24rpx;
	margin-bottom: 8rpx;
	opacity: 0.9;
}

.booking-time {
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 12rpx;
}

.booking-status {
	font-size: 22rpx;
	padding: 4rpx 12rpx;
	border-radius: 8rpx;
	display: inline-block;
}

.status-pending {
	background-color: rgba(255, 255, 255, 0.3);
}

.status-completed {
	background-color: rgba(82, 196, 26, 0.3);
}

.status-cancelled {
	background-color: rgba(255, 255, 255, 0.2);
}

.empty-bookings {
	padding: 40rpx 0;
	text-align: center;
}

.empty-text {
	font-size: 28rpx;
	color: #999999;
}

/* 车辆预约板块 */
.bus-booking-section {
	background-color: #ffffff;
	padding: 30rpx;
}

.filter-bar {
	position: sticky;
	top: 0;
	background-color: #ffffff;
	z-index: 10;
	padding-bottom: 20rpx;
	border-bottom: 1rpx solid #E8E8E8;
	margin-bottom: 20rpx;
}

.filter-item {
	display: flex;
	align-items: center;
	padding: 20rpx;
	background-color: #F5F5F5;
	border-radius: 12rpx;
	margin-bottom: 16rpx;
}

.filter-label {
	font-size: 28rpx;
	color: #666666;
	margin-right: 12rpx;
}

.filter-value {
	flex: 1;
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
}

.filter-arrow {
	font-size: 20rpx;
	color: #999999;
	margin-left: 8rpx;
}

.date-scroll {
	white-space: nowrap;
}

.date-container {
	display: inline-flex;
	gap: 16rpx;
}

.date-item {
	display: inline-block;
	padding: 16rpx 24rpx;
	background-color: #F5F5F5;
	border-radius: 12rpx;
	transition: all 0.3s;
}

.date-active {
	background-color: #1E50A2;
}

.date-text {
	font-size: 24rpx;
	color: #666666;
}

.date-active .date-text {
	color: #ffffff;
}

/* 车次列表 */
.bus-list-scroll {
	height: calc(100vh - 500rpx);
}

.bus-list {
	display: flex;
	flex-direction: column;
	gap: 20rpx;
}

.bus-card {
	display: flex;
	align-items: center;
	padding: 24rpx;
	background-color: #F8F9FA;
	border-radius: 16rpx;
	border-left: 6rpx solid #1E50A2;
}

.bus-time-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 120rpx;
	margin-right: 24rpx;
}

.bus-time {
	font-size: 40rpx;
	font-weight: bold;
	color: #1E50A2;
}

.bus-label {
	font-size: 22rpx;
	color: #999999;
	margin-top: 4rpx;
}

.bus-info-section {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.bus-seats {
	font-size: 26rpx;
	font-weight: 500;
}

.seats-available {
	color: #52C41A;
}

.seats-full {
	color: #FF4D4F;
}

.seats-booked {
	color: #1E50A2;
}

.bus-location {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.location-icon {
	font-size: 24rpx;
}

.location-text {
	font-size: 24rpx;
	color: #666666;
	flex: 1;
}

.bus-action-section {
	margin-left: 24rpx;
}

.booking-btn {
	padding: 0 32rpx;
	height: 64rpx;
	line-height: 64rpx;
	border-radius: 32rpx;
	font-size: 26rpx;
	border: none;
}

.btn-available {
	background-color: #1E50A2;
	color: #ffffff;
}

.btn-full {
	background-color: #E8E8E8;
	color: #999999;
}

.btn-booked {
	background-color: #52C41A;
	color: #ffffff;
}

.empty-bus {
	padding: 80rpx 0;
	text-align: center;
}
</style>
