<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/* 每个页面公共css */
	page {
		background-color: #F5F5F5;
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
	}
	
	/* 全局按钮样式优化 */
	button {
		border: none;
		outline: none;
	}
	
	button::after {
		border: none;
	}

	/* ȫ�������box-sizing */
	input, textarea {
		box-sizing: border-box;
	}
</style>
