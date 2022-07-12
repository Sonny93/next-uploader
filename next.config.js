
const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
	images: {
		domains: ['localhost', 'lh3.googleusercontent.com']
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"]
		});
		config.module.rules.push({
			test: /\.pdf$/,
			use: ["file-loader"]
		});

		return config;
	},
	pwa: {
		dest: 'public',
		register: true,
		skipWaiting: true,
		runtimeCaching,
		disable: process.env.NODE_ENV === 'development'
	},
	optimizeFonts: false // fonts are not loaded with production build
});