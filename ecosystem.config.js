module.exports = {
  apps: [
    {
      name: 'fanscript-api',
      cwd: '/Users/damienaltman/Documents/openClawProject/fanscript/apps/api',
      script: 'dist/main.js',
      interpreter: 'node',
      watch: false,
      env: { NODE_ENV: 'development' }
    },
    {
      name: 'fanscript-web',
      cwd: '/Users/damienaltman/Documents/openClawProject/fanscript/apps/web',
      script: 'pnpm',
      args: 'dev',
      interpreter: 'none',
      watch: false,
      env: { NODE_ENV: 'development', PORT: '3000' }
    }
  ]
}
