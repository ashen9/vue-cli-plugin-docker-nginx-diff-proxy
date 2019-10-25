const FS = require('fs');
const ID = 'vue-cli:nginx-proxy-webpack-Plugin'

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


module.exports = class WebpckPlugin {
  constructor (options = {}) {
    this.options = options;
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
            console.log(path);
            //判断文件的状态，用于区分文件名/文件夹
            FS.stat(path, (err, status) => {
              if (err) {
                return err;
              }
              let isFile = status.isFile();//是文件
              let isDir = status.isDirectory();//是文件夹
              if (isFile) {
                if (item.match(new RegExp(/\.conf$/))) {
                  Object.keys(this.options).map((key) => {
                    if (item.includes(key)) {
                      console.log(this.options[key]);
                      replaceFile(path, /http\:\/\/localhost\:8080/g, this.options[key]); // ^ 以什么开头
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
