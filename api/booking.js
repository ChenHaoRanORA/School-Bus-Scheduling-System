/**
 * 预约相关API接口
 * 当前使用mock数据,后期替换为真实后端API
 */

import * as mock from './mock.js'

export default {
	/**
	 * 获取车次列表
	 * @param {String} route - 路线
	 * @param {String} date - 日期
	 */
	getBusList(route, date) {
		// 当前使用mock数据
		return mock.getBusList(route, date)
		
		// 后期接入后端API:
		// return new Promise((resolve, reject) => {
		// 	uni.request({
		// 		url: 'http://your-python-backend/api/bus/list',
		// 		method: 'POST',
		// 		data: { route, date },
		// 		header: {
		// 			'Content-Type': 'application/json',
		// 			'Authorization': 'Bearer ' + uni.getStorageSync('token')
		// 		},
		// 		success: (res) => {
		// 			if (res.data.code === 200) {
		// 				resolve(res.data.data)
		// 			} else {
		// 				reject(new Error(res.data.message))
		// 			}
		// 		},
		// 		fail: (err) => {
		// 			reject(err)
		// 		}
		// 	})
		// })
	},

	/**
	 * 创建预约
	 * @param {String} busId - 车次ID
	 * @param {Object} busInfo - 车次信息
	 */
	createBooking(busId, busInfo) {
		// 当前使用mock数据
		return mock.createBooking(busId, busInfo)
		
		// 后期接入后端API:
		// return new Promise((resolve, reject) => {
		// 	uni.request({
		// 		url: 'http://your-python-backend/api/booking/create',
		// 		method: 'POST',
		// 		data: { busId, busInfo },
		// 		header: {
		// 			'Content-Type': 'application/json',
		// 			'Authorization': 'Bearer ' + uni.getStorageSync('token')
		// 		},
		// 		success: (res) => {
		// 			if (res.data.code === 200) {
		// 				resolve(res.data.data)
		// 			} else {
		// 				reject(new Error(res.data.message))
		// 			}
		// 		},
		// 		fail: (err) => {
		// 			reject(err)
		// 		}
		// 	})
		// })
	},

	/**
	 * 获取我的预约列表
	 */
	getMyBookings() {
		// 当前使用mock数据
		return mock.getMyBookings()
		
		// 后期接入后端API:
		// return new Promise((resolve, reject) => {
		// 	uni.request({
		// 		url: 'http://your-python-backend/api/booking/my',
		// 		method: 'GET',
		// 		header: {
		// 			'Authorization': 'Bearer ' + uni.getStorageSync('token')
		// 		},
		// 		success: (res) => {
		// 			if (res.data.code === 200) {
		// 				resolve(res.data.data)
		// 			} else {
		// 				reject(new Error(res.data.message))
		// 			}
		// 		},
		// 		fail: (err) => {
		// 			reject(err)
		// 		}
		// 	})
		// })
	},

	/**
	 * 取消预约
	 * @param {String} bookingId - 预约ID
	 */
	cancelBooking(bookingId) {
		// 当前使用mock数据
		return mock.cancelBooking(bookingId)
		
		// 后期接入后端API:
		// return new Promise((resolve, reject) => {
		// 	uni.request({
		// 		url: 'http://your-python-backend/api/booking/cancel',
		// 		method: 'POST',
		// 		data: { bookingId },
		// 		header: {
		// 			'Content-Type': 'application/json',
		// 			'Authorization': 'Bearer ' + uni.getStorageSync('token')
		// 		},
		// 		success: (res) => {
		// 			if (res.data.code === 200) {
		// 				resolve(res.data.data)
		// 			} else {
		// 				reject(new Error(res.data.message))
		// 			}
		// 		},
		// 		fail: (err) => {
		// 			reject(err)
		// 		}
		// 	})
		// })
	},

	/**
	 * 获取今日有效预约
	 */
	getTodayValidBooking() {
		// 当前使用mock数据
		return mock.getTodayValidBooking()
		
		// 后期接入后端API:
		// return new Promise((resolve, reject) => {
		// 	uni.request({
		// 		url: 'http://your-python-backend/api/booking/today',
		// 		method: 'GET',
		// 		header: {
		// 			'Authorization': 'Bearer ' + uni.getStorageSync('token')
		// 		},
		// 		success: (res) => {
		// 			if (res.data.code === 200) {
		// 				resolve(res.data.data)
		// 			} else {
		// 				resolve(null)
		// 			}
		// 		},
		// 		fail: (err) => {
		// 			resolve(null)
		// 		}
		// 	})
		// })
	}
}
