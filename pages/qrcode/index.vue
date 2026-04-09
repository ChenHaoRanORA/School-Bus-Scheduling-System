<template>
	<view class="qrcode-page">
		<view class="qrcode-container">
			<!-- 有有效预约 -->
			<view v-if="todayBooking" class="valid-booking">
				<!-- 二维码区域 -->
				<view class="qrcode-section">
					<canvas 
						canvas-id="qrcode" 
						:style="{ width: qrcodeSize + 'px', height: qrcodeSize + 'px' }"
						class="qrcode-canvas"
					></canvas>
					<view class="qrcode-tip">
						<text>请使用此二维码上车扫码</text>
					</view>
				</view>

				<!-- 预约信息 -->
				<view class="booking-info-section">
					<view class="info-title">预约信息</view>
					<view class="info-item">
						<text class="info-label">路线</text>
						<text class="info-value">{{ todayBooking.route }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">日期时间</text>
						<text class="info-value">{{ todayBooking.dateDisplay }} {{ todayBooking.time }}</text>
					</view>
					<view class="info-item">
						<text class="info-label">候车位置</text>
						<text class="info-value">{{ todayBooking.location }}</text>
					</view>
				</view>

				<!-- 使用说明 -->
				<view class="usage-tips">
					<view class="tips-title">使用说明</view>
					<text class="tips-item">1. 上车时出示此二维码供司机扫描</text>
					<text class="tips-item">2. 二维码每30秒自动刷新</text>
					<text class="tips-item">3. 请勿截图,截图可能失效</text>
					<text class="tips-item">4. 请提前到达候车位置等候</text>
				</view>
			</view>

			<!-- 无有效预约 -->
			<view v-else class="no-booking">
				<view class="empty-icon">🚌</view>
				<text class="empty-text">暂无有效预约</text>
				<text class="empty-tip">请先预约今天的车次</text>
				<button class="go-book-btn" @click="goToBooking">去预约</button>
			</view>
		</view>
	</view>
</template>

<script>
import bookingApi from '@/api/booking.js'

export default {
	data() {
		return {
			todayBooking: null,
			qrcodeSize: 280,
			refreshTimer: null
		}
	},
	
	onShow() {
		this.loadTodayBooking()
	},
	
	onUnload() {
		// 清除定时器
		if (this.refreshTimer) {
			clearInterval(this.refreshTimer)
		}
	},
	
	methods: {
		// 加载今日有效预约
		async loadTodayBooking() {
			try {
				const booking = await bookingApi.getTodayValidBooking()
				this.todayBooking = booking
				
				// 如果有预约,生成二维码
				if (booking) {
					this.$nextTick(() => {
						this.generateQRCode()
						// 启动定时刷新
						this.startAutoRefresh()
					})
				}
			} catch (error) {
				console.error('加载今日预约失败:', error)
			}
		},
		
		// 生成二维码
		generateQRCode() {
			if (!this.todayBooking) return
			
			// 简单的二维码生成 (使用canvas绘制简易版本)
			// 实际项目中建议使用 uQRCode 等成熟库
			const ctx = uni.createCanvasContext('qrcode', this)
			const size = this.qrcodeSize
			
			// 生成二维码数据
			const qrcodeData = `${this.todayBooking.id}_${Date.now()}`
			
			// 简易实现:绘制网格模拟二维码
			// 注意:这里只是一个示例,实际应该使用真正的二维码生成库
			ctx.setFillStyle('#ffffff')
			ctx.fillRect(0, 0, size, size)
			
			// 生成随机黑白格子 (示例代码)
			const cellSize = 10
			const cells = Math.floor(size / cellSize)
			
			ctx.setFillStyle('#000000')
			for (let i = 0; i < cells; i++) {
				for (let j = 0; j < cells; j++) {
					// 使用预约ID和时间戳作为种子生成固定图案
					const seed = this.hashCode(qrcodeData + i + j)
					if (seed % 2 === 0) {
						ctx.fillRect(i * cellSize, j * cellSize, cellSize, cellSize)
					}
				}
			}
			
			// 绘制三个定位角
			this.drawPositionPattern(ctx, 0, 0, cellSize)
			this.drawPositionPattern(ctx, (cells - 7) * cellSize, 0, cellSize)
			this.drawPositionPattern(ctx, 0, (cells - 7) * cellSize, cellSize)
			
			ctx.draw()
		},
		
		// 绘制定位角图案
		drawPositionPattern(ctx, x, y, size) {
			ctx.setFillStyle('#000000')
			ctx.fillRect(x, y, size * 7, size * 7)
			ctx.setFillStyle('#ffffff')
			ctx.fillRect(x + size, y + size, size * 5, size * 5)
			ctx.setFillStyle('#000000')
			ctx.fillRect(x + size * 2, y + size * 2, size * 3, size * 3)
		},
		
		// 简单的哈希函数
		hashCode(str) {
			let hash = 0
			for (let i = 0; i < str.length; i++) {
				const char = str.charCodeAt(i)
				hash = ((hash << 5) - hash) + char
				hash = hash & hash // Convert to 32bit integer
			}
			return Math.abs(hash)
		},
		
		// 启动自动刷新
		startAutoRefresh() {
			// 清除旧的定时器
			if (this.refreshTimer) {
				clearInterval(this.refreshTimer)
			}
			
			// 每30秒刷新一次二维码
			this.refreshTimer = setInterval(() => {
				this.generateQRCode()
			}, 30000)
		},
		
		// 跳转到预约页面
		goToBooking() {
			uni.switchTab({
				url: '/pages/booking/index'
			})
		}
	}
}
</script>

<style scoped>
.qrcode-page {
	min-height: 100vh;
	background: linear-gradient(180deg, #1E50A2 0%, #F5F5F5 30%);
	padding-top: 60rpx;
}

.qrcode-container {
	padding: 0 30rpx;
}

/* 有效预约 */
.valid-booking {
	display: flex;
	flex-direction: column;
	gap: 30rpx;
}

.qrcode-section {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.qrcode-canvas {
	border: 1rpx solid #E8E8E8;
	border-radius: 12rpx;
}

.qrcode-tip {
	margin-top: 24rpx;
	padding: 12rpx 24rpx;
	background-color: #F0F5FF;
	border-radius: 8rpx;
}

.qrcode-tip text {
	font-size: 24rpx;
	color: #1E50A2;
}

/* 预约信息 */
.booking-info-section {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 40rpx;
	box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
}

.info-title {
	font-size: 32rpx;
	font-weight: bold;
	color: #333333;
	margin-bottom: 24rpx;
}

.info-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 1rpx solid #F0F0F0;
}

.info-item:last-child {
	border-bottom: none;
}

.info-label {
	font-size: 28rpx;
	color: #666666;
}

.info-value {
	font-size: 28rpx;
	color: #333333;
	font-weight: 500;
	text-align: right;
	flex: 1;
	margin-left: 24rpx;
}

.info-value.highlight {
	color: #1E50A2;
	font-size: 32rpx;
	font-weight: bold;
}

/* 使用说明 */
.usage-tips {
	background-color: #FFF7E6;
	border-radius: 16rpx;
	padding: 30rpx;
	border-left: 6rpx solid #FAAD14;
}

.tips-title {
	font-size: 28rpx;
	font-weight: bold;
	color: #FA8C16;
	margin-bottom: 16rpx;
}

.tips-item {
	display: block;
	font-size: 24rpx;
	color: #8C6D3F;
	line-height: 1.8;
	margin-bottom: 8rpx;
}

/* 无预约 */
.no-booking {
	background-color: #ffffff;
	border-radius: 24rpx;
	padding: 120rpx 60rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);
}

.empty-icon {
	font-size: 160rpx;
	margin-bottom: 40rpx;
}

.empty-text {
	font-size: 36rpx;
	color: #333333;
	font-weight: bold;
	margin-bottom: 16rpx;
}

.empty-tip {
	font-size: 28rpx;
	color: #999999;
	margin-bottom: 60rpx;
}

.go-book-btn {
	width: 100%;
	height: 88rpx;
	line-height: 88rpx;
	background-color: #1E50A2;
	color: #ffffff;
	font-size: 32rpx;
	border-radius: 44rpx;
	border: none;
}
</style>
