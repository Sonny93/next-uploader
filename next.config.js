module.exports = {
	images: {
		domains: ['localhost']
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