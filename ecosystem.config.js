module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'Blind-Aid-Server',
      script    : './index.js',
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'ubuntu',
      host : 'ec2-18-188-137-2.us-east-2.compute.amazonaws.com',
      key  : '~/Downloads/server_1.pem'
      ref  : 'origin/master',
      repo : ' git@github.com:abhijithsampathkrishna/Blind-Aid-Server.git',
      path : '/home/server',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    },

  }
};
