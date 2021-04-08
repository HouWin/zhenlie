'use strict';

const Controller = require('egg').Controller;
const moment = require('moment');
const {Op} = require("sequelize");
class ScriptController extends Controller {
    async create() {
        const { ctx } = this;
        const stream = await ctx.getFileStream();
        const { title, content, kehu_id,type } = stream.fields


        
        let name = stream.filename;
        let typedir = ''
        if(type == '1')
        {
            typedir = '/原片/';
        }else if(type =='2')
        {
            typedir = '/成片/';
        }
        name = "zhenlie/" + kehu_id + "/" + moment().format("YYYY-MM") + typedir + name
        if (name) {
            let buf = await this.ctx.helper.streamToBuffer(stream)
            await this.ctx.service.smb2.writerFile(name, buf)
        }

        ctx.helper.re(200, '上传成功', name);
    }

    async list() {
        const { ctx } = this;
        let {search,start_date,end_date,status} = ctx.request.query;
        const page = parseInt(ctx.request.query.page) || 1;
        const pageSize = parseInt(ctx.request.query.pageSize) || 20;
        let where={}
        //搜索框
        if(search)
        {
            where[Op.or]=[{
                title:{[Op.like]:'%'+search+'%'},
            },{
                content:{[Op.like]:'%'+search+'%'}
            },{
                '$submitUser.name$':{[Op.like]:'%'+search+'%'}
            }]
        }
        //日期筛选
        if(start_date && end_date)
        {
            start_date = moment(start_date).format("YYYY-MM-DD");
            end_date = moment(end_date).format("YYYY-MM-DD");
            where[Op.and] = [{
                date:{[Op.gte]:start_date}               
            },
            {
                date:{[Op.lte]:end_date}
            }]
        }
        //审核状态筛选
        if(status && status!='all')
        {
            where[Op.and] = {status};
        }
        //按角色显示
        let userInfo = ctx.user.payload;
        if(userInfo.role.name != '管理员')
        {
            
        }

        const result =await ctx.sqlModel.Script.findAndCountAll({
            where,
            offset:(page - 1) * pageSize,
            limit:pageSize,
            include:
                [
                    {model:ctx.sqlModel.Users,as:"submitUser",attributes:['id','name']},
                    {model:ctx.sqlModel.Material,attributes:['id','name','url','size','duration','resolution','type']}
                ],
            order:[['id','desc']]
        })

        ctx.helper.re(200,result)
    }





}

module.exports = ScriptController;
