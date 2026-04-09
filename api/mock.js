/**
 * 模拟数据
 * 用于前期开发测试,后期替换为后端API
 */

// 基础车次数据
const baseBusData = {
	'长江新区至武昌': [
		{ time: '07:30', location: '长江新区南大门', totalSeats: 45 },
		{ time: '09:00', location: '长江新区南大门', totalSeats: 45 },
		{ time: '12:00', location: '长江新区南大门', totalSeats: 45 },
		{ time: '17:30', location: '长江新区南大门', totalSeats: 45 }
	],
	'武昌至长江新区': [
		{ time: '08:00', location: '武昌校区教育超市旁', totalSeats: 45 },
		{ time: '10:00', location: '武昌校区教育超市旁', totalSeats: 45 },
		{ time: '14:00', location: '武昌校区教育超市旁', totalSeats: 45 },
		{ time: '18:00', location: '武昌校区教育超市旁', totalSeats: 45 }
	]
}

// 生成车次ID
function generateBusId(route, date, time) {
	const routeCode = route === '长江新区至武昌' ? 'CW' : 'WC'
	const dateCode = date.replace(/-/g, '')
	return `BUS_${routeCode}_${dateCode}_${time.replace(':', '')}`
}

// 生成预约ID
function generateBookingId() {
	const timestamp = Date.now()
	const random = Math.floor(Math.random() * 1000)
	return `BK_${timestamp}_${random}`
}



/**
 * 获取指定路线和日期的车次列表
 * @param {String} route - 路线
 * @param {String} date - 日期 YYYY-MM-DD
 * @returns {Promise<Array>}
 */
export function getBusList(route, date) {
	return new Promise((resolve) => {
		setTimeout(() => {
			const baseList = baseBusData[route] || []
			
			// 从本地存储获取已预约数据
			const busData = uni.getStorageSync('bus_data') || {}
			const dateKey = `${route}_${date}`
			const bookedData = busData[dateKey] || {}
			
			// 生成车次列表
			const result = baseList.map((item, index) => {
				const busId = generateBusId(route, date, item.time)
				const booked = bookedData[item.time] || Math.floor(Math.random() * 20) // 模拟随机预约数
				const remaining = item.totalSeats - booked
				
				let status = 'available'
				if (remaining <= 0) {
					status = 'full'
				}
				
				// 检查是否已预约
				const bookings = uni.getStorageSync('booking_list') || []
				const isBooked = bookings.some(b => b.busId === busId && b.status === 'pending')
				if (isBooked) {
					status = 'booked'
				}
				
				return {
					id: busId,
					route: route,
					date: date,
					departureTime: item.time,
					totalSeats: item.totalSeats,
					bookedSeats: booked,
					remainingSeats: Math.max(0, remaining),
					location: item.location,
					status: status
				}
			})
			
			resolve(result)
		}, 300) // 模拟网络延迟
	})
}

/**
 * 创建预约
 * @param {String} busId - 车次ID
 * @param {Object} busInfo - 车次信息
 * @returns {Promise<Object>}
 */
export function createBooking(busId, busInfo) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			// 检查是否已预约
			const bookings = uni.getStorageSync('booking_list') || []
			const existingBooking = bookings.find(b => b.busId === busId && b.status === 'pending')
			
			if (existingBooking) {
				reject(new Error('您已经预约过该车次'))
				return
			}
			
			// 检查座位是否充足
			if (busInfo.remainingSeats <= 0) {
				reject(new Error('该车次已满员'))
				return
			}
			
			// 创建预约记录
			const newBooking = {
				id: generateBookingId(),
				busId: busId,
				route: busInfo.route,
				date: busInfo.date,
				dateDisplay: busInfo.dateDisplay || busInfo.date,
				time: busInfo.departureTime,
				location: busInfo.location,
				status: 'pending',
				createdAt: new Date().toISOString()
			}
			
			// 保存预约记录
			bookings.push(newBooking)
			uni.setStorageSync('booking_list', bookings)
			
			// 更新车次数据
			const busData = uni.getStorageSync('bus_data') || {}
			const dateKey = `${busInfo.route}_${busInfo.date}`
			if (!busData[dateKey]) {
				busData[dateKey] = {}
			}
			if (!busData[dateKey][busInfo.departureTime]) {
				busData[dateKey][busInfo.departureTime] = busInfo.bookedSeats
			}
			busData[dateKey][busInfo.departureTime]++
			uni.setStorageSync('bus_data', busData)
			
			resolve(newBooking)
		}, 500) // 模拟网络延迟
	})
}

/**
 * 获取我的预约列表
 * @returns {Promise<Array>}
 */
export function getMyBookings() {
	return new Promise((resolve) => {
		setTimeout(() => {
			const bookings = uni.getStorageSync('booking_list') || []
			// 按创建时间倒序排列
			const sorted = bookings.sort((a, b) => {
				return new Date(b.createdAt) - new Date(a.createdAt)
			})
			resolve(sorted)
		}, 300)
	})
}

/**
 * 取消预约
 * @param {String} bookingId - 预约ID
 * @returns {Promise<Boolean>}
 */
export function cancelBooking(bookingId) {
	return new Promise((resolve) => {
		setTimeout(() => {
			const bookings = uni.getStorageSync('booking_list') || []
			const bookingIndex = bookings.findIndex(b => b.id === bookingId)
			
			if (bookingIndex !== -1) {
				const booking = bookings[bookingIndex]
				
				// 更新预约状态
				bookings[bookingIndex].status = 'cancelled'
				uni.setStorageSync('booking_list', bookings)
				
				// 恢复座位数
				const busData = uni.getStorageSync('bus_data') || {}
				const dateKey = `${booking.route}_${booking.date}`
				if (busData[dateKey] && busData[dateKey][booking.time]) {
					busData[dateKey][booking.time]--
					uni.setStorageSync('bus_data', busData)
				}
				
				resolve(true)
			} else {
				resolve(false)
			}
		}, 300)
	})
}

/**
 * 获取今日有效预约
 * @returns {Promise<Object|null>}
 */
export function getTodayValidBooking() {
	return new Promise((resolve) => {
		const bookings = uni.getStorageSync('booking_list') || []
		const today = new Date()
		const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
		
		// 查找今日待出行的预约
		const validBooking = bookings.find(b => {
			if (b.status !== 'pending') return false
			return b.date === todayStr || b.date.startsWith(todayStr.substring(5))
		})
		
		setTimeout(() => {
			resolve(validBooking || null)
		}, 300)
	})
}
