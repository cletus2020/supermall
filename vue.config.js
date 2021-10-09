const path = require('path');
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, './src'),
        'common': '@/common',
        'components': '@/components',
        'content': 'components/content',
        
        'assets': '@/assets',
        'network': '@/network',
        'views': '@/views',
      }
    }
  }
}