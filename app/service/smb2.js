'use strict';
var SMB2 = require('@marsaud/smb2');
const Service = require('egg').Service;
const share = '\\\\192.168.1.73\\lzad';
const username = 'server_nas';
const password = 'Lingzhong123'

class Smb2Service extends Service {
    async writerFile(name, buffer) {
        let smb2Client = new SMB2({
            share,
            domain: 'DOMAIN',
            username,
            password
        })
       

        try {
            //检查文件路径，不存在则创建
            await this.existsAndMkdir(name)
            //写入文件！
            let file = await smb2Client.writeFile(name, buffer)
        } catch (err) {
            throw new Error(err.message)
            console.log(err.message)
        }
        return true;
    }

    async getFiles(path) {
        let smb2Client = new SMB2({
            share,
            domain: 'DOMAIN',
            username,
            password
        })

        let files = await smb2Client.readdir('素材/2-28/c/马瑞辛');
        return files;
    }

    async existsAndMkdir(name) {

        let smb2Client = new SMB2({
            share,
            domain: 'DOMAIN',
            username,
            password
        })
        let filepath = name.split("/");
        //filepath = name.replace(filepath[filepath.length - 1], '');
        let tem_path = ''
        for(let item of filepath)
        {   
            if(item == filepath[filepath.length - 1])
            {
                break;
            }
            if(item!=''){
                tem_path+=item+"/"
                let files = await smb2Client.exists(tem_path);
                 if (!files) {
                    let dir = await smb2Client.mkdir(tem_path)
                 }
            }

            

        }


        // let files = await smb2Client.exists(path);
        // if (!files) {
        //     try {
        //         let dir = await smb2Client.mkdir("asdasd/a/a/a/a")
        //     } catch (err) {
        //         console.log('-----------')
        //         console.log(err.message)
        //     }

        // }
        
    }
}

module.exports = Smb2Service;
