const WebpackPlugin = require('./WebpackPlugin');
module.exports = (api, projectOptions) => {
    const development = process.env.NODE_ENV !== "production";

    const options =
        (projectOptions.pluginOptions || {}).dockerNginxProxy || {};

	api.configureWebpack(webpackConfig => {
		webpackConfig.plugins.push(new WebpackPlugin(options));
	});


  api.registerCommand(
    'docker',
    {
      description: 'building and starting docker container',
      usage: 'vue-cli-service docker [options]',
      options: {
        '--format [formatter]': 'specify formatter (default: codeframe)',
        '--no-fix': 'do not fix errors',
        '--max-errors [limit]':
          'specify number of errors to make build failed (default: 0)',
        '--max-warnings [limit]':
          'specify number of warnings to make build failed (default: Infinity)',
      },
      details:
        'For more options, see https://eslint.org/docs/user-guide/command-line-interface#options',
    },
    args => {
      require('./docker.js')(args);
      // npm install E:\workspace-webstorm\vue-cli-plugin-docker-nginx-diff-proxy 本地开发测试
      //  vue invoke vue-cli-plugin-docker-nginx-diff-proxy
    },
  );
};
