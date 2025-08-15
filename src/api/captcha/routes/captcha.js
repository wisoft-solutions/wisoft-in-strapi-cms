'use strict';

module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/captcha',
      handler: 'captcha.generate',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/captcha/verify',
      handler: 'captcha.verify',
      config: { auth: false },
    },
  ],
};
