module.exports = (api, options, rootOptions) => {
  const APPNAME = api.rootOptions.projectName;
  let envEntity = ['dev', 'qa', 'pro'];
  let scripts = {};
  let env_prefix = {};
  const proxy_prefix = '/proxy';
  envEntity.map((e) => {
    const key = `docker-build-${e}`;
    scripts[key] = `docker build --build-arg ENV=${e} . -t ${APPNAME}-${e}`;
    const key2 = `docker-run-${e}`;
    scripts[key2] = `npm run ${key} && docker run -d -p 3000:80 ${APPNAME}-${e}`;
	  env_prefix[e] = 'http://localhost:8080';
  });
  api.extendPackage({
    scripts: scripts,
    vue: {
      pluginOptions: {
        dockerNginxProxy: {
	        proxy_prefix,
	        env_prefix
        }
      }
    }
  });
  // api.injectImports(api.entryFile, `import './registerServiceWorker'`)
  api.render('./template');
};
