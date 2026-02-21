import { Command } from 'commander'
import { startServer } from './server/index.js'

const program = new Command()

program
  .name('don-draper-seo-dashboard')
  .description('Launch the Don Draper SEO web dashboard')
  .version('1.0.0')
  .option('-p, --port <number>', 'Port number', '3749')
  .option('--no-open', "Don't open browser automatically")
  .action(async (options: { port: string; open: boolean }) => {
    const port = parseInt(options.port)
    await startServer(port)

    if (options.open) {
      const url = `http://localhost:${port}`
      const { exec } = await import('child_process')
      const cmd = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' : 'xdg-open'
      exec(`${cmd} ${url}`)
    }

    // Keep process alive
    process.on('SIGINT', () => process.exit(0))
  })

program.parse()
