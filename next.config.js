const withPWA = require('next-pwa');
const withOffline = require('next-offline');

module.exports = withOffline({
	// reactStrictMode: true,
	images: {
		domains: ['localhost']
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"]
		});

		return config;
	},
	dontAutoRegisterSw: true
});