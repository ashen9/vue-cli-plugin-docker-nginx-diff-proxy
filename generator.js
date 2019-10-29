module.exports = (api, options, rootOptions) => {
  const APPNAME = rootOptions.projectName;
  let envEntity = ['dev', 'qa', 'pro'];
  let scripts = {};
  let dockerNginxProxy = {};
  envEntity.map((e) => {
    const key = `docker-build-${e}`;
    scripts[key] = `docker build --build-arg ENV=${e} . -t ${APPNAME}-${e}`;
    const key2 = `docker-run-${e}`;
    scripts[key2] = `npm run ${key} && docker run -d -p 3000:80 ${APPNAME}-${e}`;
    dockerNginxProxy[e] = 'http://localhost:8080';
  });
  api.extendPackage({
    scripts: scripts,
    vue: {
      pluginOptions: api.hasPlugin('vue-cli-plugin-docker-nginx-diff-proxy') ? {} : {
        dockerNginxProxy: dockerNginxProxy
      }
    }
  });
  // api.injectImports(api.entryFile, `import './registerServiceWorker'`)
  api.render('./template');
};
