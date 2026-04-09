/**
 * 日期处理工具函数
 */

/**
 * 获取未来N天的日期数组
 * @param {Number} days - 天数,默认7天
 * @returns {Array} 日期信息数组
 */
export function getFutureDays(days = 7) {
	const result = []
	const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	
	for (let i = 0; i < days; i++) {
		const date = new Date()
		date.setDate(date.getDate() + i)
		
		const month = date.getMonth() + 1
		const day = date.getDate()
		const weekday = weekdays[date.getDay()]
		
		const dateStr = `${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		const fullDate = `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
		
		result.push({
			date: fullDate,
			display: `${dateStr} ${weekday}`,
			isToday: i === 0
		})
	}
	
	return result
}

/**
 * 格式化日期
 * @param {Date|String} date - 日期对象或字符串
 * @param {String} format - 格式,默认 'MM-DD 周X'
 * @returns {String} 格式化后的日期字符串
 */
export function formatDate(date, format = 'MM-DD 周X') {
	if (typeof date === 'string') {
		date = new Date(date)
	}
	
	const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
	const month = date.getMonth() + 1
	const day = date.getDate()
	const weekday = weekdays[date.getDay()]
	
	return format
		.replace('MM', String(month).padStart(2, '0'))
		.replace('DD', String(day).padStart(2, '0'))
		.replace('周X', weekday)
}

/**
 * 判断是否是今天
 * @param {String} dateStr - 日期字符串 YYYY-MM-DD
 * @returns {Boolean}
 */
export function isToday(dateStr) {
	const today = new Date()
	const date = new Date(dateStr)
	
	return today.getFullYear() === date.getFullYear() &&
		today.getMonth() === date.getMonth() &&
		today.getDate() === date.getDate()
}

/**
 * 判断是否已过期
 * @param {String} dateStr - 日期字符串 YYYY-MM-DD
 * @param {String} timeStr - 时间字符串 HH:MM
 * @returns {Boolean}
 */
export function isExpired(dateStr, timeStr) {
	const dateTimeStr = `${dateStr} ${timeStr}`
	const dateTime = new Date(dateTimeStr)
	const now = new Date()
	
	return dateTime < now
}
