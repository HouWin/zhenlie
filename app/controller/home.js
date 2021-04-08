'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');

var SMB2 = require('@marsaud/smb2');
var os = require('os');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    console.log(os.networkInterfaces())
    let date =  moment().format("YYYY-MM-DD HH:mm:ss");
    ctx.body = os.networkInterfaces();
  }
  async test(){
    this.ctx.helper.re(200,'');
  }

  async upload() {
    const ctx = this.ctx;
    const stream = await ctx.getFileStream();
    
    let name =  stream.filename;
    ctx.set('Content-Type', 'text/plain;charset=UTF-8')
    let buf = await this.ctx.helper.streamToBuffer(stream)
    // const buff = new Buffer(buf, 'binary');
    // const obj = iconv.decode(buff, 'gb2312');
    
    // 文件处理，上传到云存储等等
    console.log(name);
    
     
      let smb2Client = new SMB2({
        share:'\\\\192.168.1.54\\jianji',
        domain:'DOMAIN',
        username:'jianji',
        password:'Juliangtc123'
      })
    try{
      let file = await smb2Client.writeFile(name,buf)
    }catch(err){
      console.log(err.message)
    }
    
    
    ctx.body = 'ok';
  }


  async smb2(){
    const smb2Client = new SMB2({
      share:'\\\\192.168.1.54\\jianji',
      domain:'DOMAIN',
      username:'jianji',
      password:'Juliangtc123'
    })

    let files = await smb2Client.readdir('素材/2-28/c/马瑞辛');

    let isfile = await smb2Client.exists('素材/2-28/c/马瑞辛/video_download (16).mp4');
    this.ctx.body ={files,isfile} 
  }
  async smb22(){
    let client = new SMB2({
      address: '192.168.1.54/jianji', // required
      username: 'jianji', // not required, defaults to guest
      password: 'Juliangtc123', // not required
      domain: 'DOMAIN', // not required
      //maxProtocol: 'SMB3', // not required
      maskCmd: true, // not required, defaults to false
    });

    // get a file
    let file =  await client.getFile('someRemotePath/file', 'destinationFolder/name');
    console.log(file)
    this.ctx.body='ok'
  }
}

module.exports = HomeController;
