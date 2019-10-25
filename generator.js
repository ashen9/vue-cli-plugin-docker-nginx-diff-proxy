module.exports = api => {
  // console.log(api.rootOptions.projectName);
  const APPNAME = api.rootOptions.projectName;
  let envEntity = ['dev', 'qa', 'pro'];
  let scripts = {};
  let dockerNginxProxy = {};
  envEntity.map((e) => {
    const key = `docker-build-${e}`;
    scripts[key] = `docker build --build-arg ENV=${e} . -t ${APPNAME}-${e}`;
    const key2 = `docker-run-${e}`;
    scripts[key2] = `npm run ${key} && docker run -d -p 3000:80 ${APPNAME}-${e}`;
    dockerNginxProxy[e] = 'localhost:8080';
  });
  api.extendPackage({
    scripts: scripts,
    vue: {
      pluginOptions: {
        dockerNginxProxy: dockerNginxProxy
      }
    }
  });
  // api.injectImports(api.entryFile, `import './registerServiceWorker'`)
  api.render('./template');
};
