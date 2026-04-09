/**
 * 本地存储工具函数
 * 封装uni.setStorage/getStorage,便于后期替换为后端API
 */

export default {
	/**
	 * 获取用户信息
	 */
	getUserInfo() {
		return new Promise((resolve) => {
			uni.getStorage({
				key: 'user_info',
				success: (res) => {
					resolve(res.data)
				},
				fail: () => {
					resolve(null)
				}
			})
		})
	},

	/**
	 * 设置用户信息
	 */
	setUserInfo(data) {
		return new Promise((resolve) => {
			uni.setStorage({
				key: 'user_info',
				data: data,
				success: () => {
					resolve(true)
				}
			})
		})
	},

	/**
	 * 获取预约列表
	 */
	getBookings() {
		return new Promise((resolve) => {
			uni.getStorage({
				key: 'booking_list',
				success: (res) => {
					resolve(res.data || [])
				},
				fail: () => {
					resolve([])
				}
			})
		})
	},

	/**
	 * 设置预约列表
	 */
	setBookings(data) {
		return new Promise((resolve) => {
			uni.setStorage({
				key: 'booking_list',
				data: data,
				success: () => {
					resolve(true)
				}
			})
		})
	},

	/**
	 * 获取车次数据
	 */
	getBusData() {
		return new Promise((resolve) => {
			uni.getStorage({
				key: 'bus_data',
				success: (res) => {
					resolve(res.data)
				},
				fail: () => {
					resolve(null)
				}
			})
		})
	},

	/**
	 * 设置车次数据
	 */
	setBusData(data) {
		return new Promise((resolve) => {
			uni.setStorage({
				key: 'bus_data',
				data: data,
				success: () => {
					resolve(true)
				}
			})
		})
	},

	/**
	 * 清除所有本地数据
	 */
	clearAll() {
		return new Promise((resolve) => {
			uni.clearStorage({
				success: () => {
					resolve(true)
				}
			})
		})
	}
}
