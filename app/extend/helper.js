const fs = require('fs');
module.exports={
    re(code,msg='success',data='')
    {
        if(msg=='')
        {
          msg='success';
        }
        if(data!=''){
             this.ctx.body={code,msg,data}
        }else{
             this.ctx.body={code,msg}
        }
    },
    async fs_access(file_path){
      let myP = new Promise(function(resolve,reject){
          fs.access(file_path,fs.F_OK,(err)=>{
            if(err) {
              resolve('false')
           
            }
            resolve('true')
          })
      })
      let result = await myP;
      if(result=='true')
      {
        return true;
      }else
      {
        return false;
      }
    },
     async sleep(ms) {
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve('');
          }, ms)
      });
  },streamToBuffer(stream) {

    return new Promise((resolve, reject) => {
      const chunks = [];

      stream.on('data', function(chunk) {
        chunks.push(chunk);
      });
      stream.on('end', function() {
        const buf = Buffer.concat(chunks);
        resolve(buf);

      });
      stream.on('error', function(err) {
        reject(err);

      });
    });
  },

}
