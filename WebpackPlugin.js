const FS = require('fs');
const ID = 'vue-cli:nginx-proxy-webpack-Plugin'

//读取文件，并且替换文件中指定的字符串
let taskConfFile = function(filePath,targetStr,text){
  FS.readFile(filePath,function(err,data){
    if(err){
      return err;
    }
    let str = data.toString();
    if (str.includes(text)) {
      var regExp = new RegExp(`${text}.*\}`, 'g');

      str = str.replace(regExp, targetStr);
      FS.writeFile(filePath, str, function (err) {
        if (err) return err;
      });
    } else {
      resertFile(filePath, targetStr + '\n');
    }
  });
}
//读取文件，并且替换文件中指定的字符串
/*let replaceFile = function(filePath,sourceRegx,targetStr){
  FS.readFile(filePath,function(err,data){
    if(err){
      return err;
    }
    let str = data.toString();
    str = str.replace(sourceRegx,targetStr);
    FS.writeFile(filePath, str, function (err) {
      if (err) return err;
    });
  });
}*/
//向文件倒数第二行插入
let resertFile = function (filePath, targetStr) {
  const data = FS.readFileSync(filePath, 'utf8').split('\n');
  data.splice(data.length - 2, 0, targetStr)
  FS.writeFileSync(filePath, data.join('\n'), 'utf8')
}


module.exports = class WebpckPlugin {
  constructor (options = {}) {
    this.env_prefix = options.env_prefix;
    this.proxy_prefix = options.proxy_prefix;
  }

  apply (compiler) {
    var emit = (compilation, callback) => {
      //nginx，找到*.conf文件
      const nginxPath = './nginx';
      FS.readdir(nginxPath, (err, files) => {
        if (err) {
          return err;
        }
        if (files.length != 0) {
          files.forEach((item) => {

            let path = nginxPath + '/' + item;
            //判断文件的状态，用于区分文件名/文件夹
            FS.stat(path, (err, status) => {
              if (err) {
                return err;
              }
              let isFile = status.isFile();//是文件
              // let isDir = status.isDirectory();//是文件夹
              if (isFile && item.match(new RegExp(/\.conf$/))) {
                const prefix_key = Object.keys(this.env_prefix).find((key) => {
                  return item.includes(key);
                });

                const text = `location ${this.proxy_prefix}`
                const insertText = `${text} { proxy_pass  ${this.env_prefix[prefix_key]} }`;
                taskConfFile(path, insertText, text);
              }
            });
            callback();
          });
        }
      });
    }
    if (compiler.hooks) {
      var plugin = {name: ID};
      compiler.hooks.emit.tapAsync(plugin, emit);
    } else {
      compiler.plugin('emit', emit);

    }
  }
}
