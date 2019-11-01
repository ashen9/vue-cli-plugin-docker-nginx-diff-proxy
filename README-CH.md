# vue-cli-plugin-docker-nginx-diff-proxy
[中文](https://github.com/ashen9/vue-cli-plugin-docker-nginx-diff-proxy/blob/master/README-CH.md) | [English](https://github.com/ashen9/vue-cli-plugin-docker-nginx-diff-proxy/blob/master/README.md)
> 此插件用于构建不同环境反向代理的docker镜像

这是一个vue cli插件，它使用nginx添加了一个最小的docker部署（**~19mb**+静态文件）来为vue应用提供服务。

**准备:** *你必须有一个'build-proxy'的启动命令在你的package.json内 , 并且'build-proxy'可以将你的项目构建为请求路径<proxy_prefix>*


### 安装

```
vue add vue-cli-plugin-docker-nginx-diff-proxy
```

这将自动添加现有VUE CLI项目所需的所有文件。
                                                                          
  
1. 在package.json中，将添加一些脚本:
    * docker-build-dev  
        >_构建开发环境_
    * docker-build-qa  
        >_构建测试环境_
    * docker-build-pro  
        >_构建生产环境_
    * docker-run-dev  
        >_构建开发环境并且通过3000端口启动一个容器_
    * docker-run-qa  
        >_构建测试环境并且通过3000端口启动一个容器_
    * docker-run-pro
        >_构建生产环境并且通过3000端口启动一个容器_  

2. nginx文件夹将添加到根目录中，它包含四个文件:
    * default-dev.conf  
        >_nginx在开发环境中的配置文件_
    * default-qa.conf  
        >_nginx在测试环境中的配置文件_ 
    * default-pro.conf  
        >_nginx在生产环境中的配置文件_
    * gzip.conf  
        >_Gzip压缩默认是开启的，你可以根据需要自行关闭

3. 在vue.conf.js中，一个dockernginxproxy属性将被添加到pluginoptions中
    * proxy_prefix  
        >_反向代理的前缀，默认为'/proxy'_ 
    * env_prefix  
        >_不同环境的代理地址，可以随意添加环境_      
        - dev  
            _开发环境代理地址，默认为“http://localhost:8080”_
        - qa  
            _测试环境代理地址，默认为“http://localhost:8080”_
        - pro  
            _生产环境代理地址，默认为“http://localhost:8080”_
                        
4. Dockerfile将添加到根目录
    * Dockerfile  
        >_根据env参数动态加载不同环境nginx配置_
 
### 生成并运行本地Docker容器

```
npm run docker-run-<ENV>
```

这将构建一个Docker容器并在端口“3000”上运行它。如果要在不同的端口上运行，请更改“package.json”中的运行脚本

```
  "docker-run-<ENV>": "docker run docker-build-<ENV> && docker run -d -p <PORT>:80 <your project>-<ENV>"
```

请确保已在您的计算机上安装并运行[Docker]（https://docs.docker.com/install/）。

### 调整nginx配置

您会发现自动生成的三个nginx配置文件是相同的，这是为了增加灵活性，您可以在任何环境中随意添加和修改任何nginx配置。您还可以添加更多环境的nginx模板以支持更多环境。
