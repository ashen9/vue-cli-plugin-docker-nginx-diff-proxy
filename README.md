# vue-cli-plugin-docker-nginx-diff-proxy
[中文](https://github.com/ashen9/vue-cli-plugin-docker-nginx-diff-proxy/blob/master/README-CH.md) | [English](https://github.com/ashen9/vue-cli-plugin-docker-nginx-diff-proxy/blob/master/README.md)
> This plug-in is to build a docker image of multiple environment reverse proxy

This is a vue-cli-plugin that adds a minimal docker deployment (**~19MB** + static files) using nginx to serve your vue-app  
  
**prepare:** *you must have a 'build-proxy' Scripts in your package.json , and 'build-proxy' can build your app to request <proxy_prefix>*

### Installation

```
vue add vue-cli-plugin-docker-nginx-diff-proxy
```

This will automatically add all the files needed to your existing vue-cli project  
1. in your package.json, will add some scripts:
    * docker-build-dev  
        >_Build development environment_
    * docker-build-qa  
        >_Build test environment_
    * docker-build-pro  
        >_Build production environment_
    * docker-run-dev  
        >_Build development environment and Start with 3000 port_
    * docker-run-qa  
        >_Build test environment and Start with 3000 port_
    * docker-run-pro
        >_Build production environment and Start with 3000 port_  

2. a nginx folder will be added to the root, It contains four files
    * default-dev.conf  
        >_Configuration files for nginx in development environment_
    * default-qa.conf  
        >_Configuration files for nginx in test environment_ 
    * default-pro.conf  
        >_Configuration files for nginx in production environment_
    * gzip.conf  
        >_Gzip is on by default,You can close it if you don't need it

3. in your vue.conf.js,A dockerNginxProxy property will be added to pluginOptions
    * proxy_prefix  
        >_Prefix for reverse proxy, default is '/proxy'_ 
    * env_prefix  
        >_Proxy address of different environment, you can add environment at will_      
        - dev  
            _Proxy address of development enviroment, default is 'http://localhost:8080'_
        - qa  
            _Proxy address of test enviroment, default is 'http://localhost:8080'_
        - pro  
            _Proxy address of production enviroment, default is 'http://localhost:8080'_
                        
4. a Dockerfile will be added to the root
    * Dockerfile  
        >_Dynamically load nginx configuration according to Env parameters_
 
### Build and run local docker container

```
npm run docker-run-<ENV>
```

This will build a docker container and run it on port `3000`. If you want to run it on different port change the run script in your `package.json` to

```
  "docker-run-<ENV>": "docker run docker-build-<ENV> && docker run -d -p <PORT>:80 <your project>-<ENV>"
```

Please make sure to have [docker](https://docs.docker.com/install/) installed and running on your machine.

### Tweak nginx config

You will find that the three nginx configuration files generated automatically are the same,
This is to increase flexibility,You can add and modify any configuration at will in different environments.
You can also add templates to support more environments.



