module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/home-bundle',
      handler: 'homepage.bundle',   
       config: {
        auth: false, 
      },
    },
  ],
};
