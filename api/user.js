/**
 * 用户相关API接口
 * 当前使用本地存储,后期替换为真实后端API
 */

import storage from '@/utils/storage.js'

export default {
	/**
	 * 获取用户信息
	 */
	getUserInfo() {
		return storage.getUserInfo()
		
		// 后期接入后端API:
		// return new Promise((resolve, reject) => {
		// 	uni.request({
		// 		url: 'http://your-python-backend/api/user/profile',
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
	 * 更新用户信息
	 * @param {Object} userInfo - 用户信息
	 */
	updateUserInfo(userInfo) {
		return storage.setUserInfo(userInfo)
		
		// 后期接入后端API:
		// return new Promise((resolve, reject) => {
		// 	uni.request({
		// 		url: 'http://your-python-backend/api/user/update',
		// 		method: 'POST',
		// 		data: userInfo,
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
	 * 身份认证
	 * @param {Object} authInfo - 认证信息 {name, studentId, userType}
	 */
	authenticate(authInfo) {
		return new Promise((resolve, reject) => {
			// 简单的本地验证
			const { name, studentId, userType } = authInfo
			
			// 基础验证
			if (!name || name.trim().length < 2) {
				reject(new Error('请输入正确的姓名'))
				return
			}
			
			if (!studentId || studentId.length < 6) {
				reject(new Error('请输入正确的学号/工号'))
				return
			}
			
			// 保存到本地
			const userInfo = {
				isAuthenticated: true,
				name: name.trim(),
				studentId: studentId.trim(),
				userType: userType,
				authenticatedAt: new Date().toISOString()
			}
			
			storage.setUserInfo(userInfo).then(() => {
				resolve(userInfo)
			})
		})
		
		// 后期接入后端API:
		// return new Promise((resolve, reject) => {
		// 	uni.request({
		// 		url: 'http://your-python-backend/api/auth/login',
		// 		method: 'POST',
		// 		data: authInfo,
		// 		header: {
		// 			'Content-Type': 'application/json'
		// 		},
		// 		success: (res) => {
		// 			if (res.data.code === 200) {
		// 				// 保存token和用户信息
		// 				uni.setStorageSync('token', res.data.data.token)
		// 				storage.setUserInfo(res.data.data.userInfo)
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
	}
}
