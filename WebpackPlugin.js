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
      console.log(str);
      FS.writeFile(filePath, str, function (err) {
        if (err) return err;
      });
    } else {
      resertFile(filePath, targetStr);
    }
  });
}
//读取文件，并且替换文件中指定的字符串
let replaceFile = function(filePath,sourceRegx,targetStr){
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
}
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
    compiler.hooks.compilation.tap(ID, compilation => {
      //nginx，找到*.conf文件
      const nginxPath = './nginx';
      FS.readdir(nginxPath, (err,files) => {
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
              let isDir = status.isDirectory();//是文件夹
              if (isFile) {
                if (item.match(new RegExp(/\.conf$/))) {
                  Object.keys(this.env_prefix).map((key) => {
                    if (item.includes(key)) {
                      // replaceFile(path, /http\:\/\/localhost\:8080/g, this.env_prefix[key]); // ^ 以什么开头
                      // replaceFile(path, /location \/proxy/g, `location ${this.proxy_prefix[key]}`); // ^ 以什么开头
                      const text = `location ${this.proxy_prefix}`
                      const insertText = `      ${text} { proxy_pass  ${this.env_prefix[key]} }\n`;
                      taskConfFile(path, insertText, text);
                      // resertFile(path, insertText);
                    }
                  });
                  // replaceFile(path,/console\.log\(\"0function0\"\)/g,"zyk");

                }
              }
              if (isDir) {
                console.log("文件夹：" + item);
              }
            });
          });
        }
      });
    })
  }
}
