module.exports = {
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
	dontAutoRegisterSw: true
};