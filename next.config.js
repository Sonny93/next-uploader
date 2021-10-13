module.exports = {
	reactStrictMode: true,
	images: {
		domains: ['localhost'],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"]
		});

		return config;
	}
}
