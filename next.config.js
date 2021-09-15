module.exports = {
	reactStrictMode: true,
	images: {
		domains: ['localhost', 'main.sonnydata.fr', 'test.sonnydata.fr'],
	},
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"]
		});

		return config;
	}
}
