const path = require('path')
module.exports = {
  webpack: {
    alias: {
      '@src': path.resolve(__dirname, 'src'),
      '@atom': path.resolve(__dirname, 'src/atom'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@domain': path.resolve(__dirname, 'src/domain'),
      '@views': path.resolve(__dirname, 'src/views'),
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  devServer: {
    port: 1306,
  },
}
