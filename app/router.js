'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  router.get('/h',controller.public.profile)
  router.post('/uploads',controller.home.upload);
  router.get('/', controller.home.index);
  router.get('/test',controller.home.test);
  router.get('/smb2',controller.home.smb2);


  //脚本
  router.post('/smb/create',controller.script.create);
  router.get('/script/list',controller.script.list);
};
