const { Controller } = require("egg");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const qiniu = require("qiniu");
class publicController extends Controller
{
    async login(){
        const {usersname,password} = this.ctx.request.body;
        if(!usersname || !password)
        {
            this.ctx.helper.re(500,'参数不合法!');
            return
        }
        let md5 = crypto.createHash("md5");
        let newPas = md5.update(password).digest("hex");
        let user = await this.ctx.sqlModel.Users.findOne({where:{username:usersname,password:newPas}});
        if(!user)
        {
            this.ctx.helper.re(500,'用户名密码错误!');
            return
        }else
        {
            let role_id = await this.ctx.sqlModel.UserHasRole.findOne({where:{user_id:user.id}});
            let role = await this.ctx.sqlModel.Roles.findOne({where:{id:role_id.role_id}});

            role['user_id']=user['id'];
            const token = jwt.sign({
                name:user.name,
                id:user.id,
                is_lead:user.is_lead,
                role:{
                    id:role.id,
                    name:role.name,
                    user_id:user.id
                }
            },this.app.config.passportJwt.secret,{expiresIn:24*3600})
            let userInfo = {name:user.name,id:user.id}
            this.ctx.helper.re(200,'登陆成功',{token,role,userInfo})
        }

    }

    async profile () {

        console.log('profile here');
        console.log(this.ctx.user.payload);
        // this.ctx.payload 在app.js 的 app.passport.verify(async callback => {});中获得，
        // 详情请看app.js中的app.passport.verify() 函数。
        this.ctx.body = 'i am '+this.ctx.user.payload.name;
      }

    async getQiniuMac(){
        var mac = await new qiniu.auth.digest.Mac(this.app.config.qiniu.accessKey, this.app.config.qiniu.secretKey);
        var options = {
            scope: 'moshi-yushan-public-bucket',
        };
        var putPolicy = new qiniu.rs.PutPolicy(options);
        var uploadToken=putPolicy.uploadToken(mac);
        this.ctx.helper.re(200,'',{uploadToken});
    }




}
module.exports = publicController
