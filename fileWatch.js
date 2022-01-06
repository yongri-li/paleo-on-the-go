const watch = require('node-watch')
const copyfiles = require('copyfiles')
const fs = require('fs')
const folders = [
  'assets',
  'config',
  'layout',
  'locales',
  'sections',
  'snippets',
  'templates',
  'templates/customers'
]

watch('src', { recursive: true }, function(evt, name) {
  let path = name.replace('src/', '')
  let pathArray = path.split('/')
  let folder = pathArray[0]

  if (path.startsWith('templates/customers')) {
    folder += '/' + pathArray[1]
  }

  if (folders.includes(folder)) {
    copyfiles([`src/${folder}/**`, `dist/${folder}`], true, () =>
      console.log(`copied ${folder}`)
    )
  }

  if (folder === 'assets' && pathArray[1].includes('.svg')) {
    const fileNameLiquid = 'icon-' + pathArray[1].replace('.svg', '.liquid')
    const svg = fs.readFileSync(name, { encoding: 'utf-8' })
    const regex = /(<svg.*fill=").*?(".*>)/
    const liquidFile = svg.replace(regex, '$1' + '{{ fill }}' + '$2')
    fs.mkdirSync('src/snippets/svg', { recursive: true })
    fs.writeFileSync(`src/snippets/svg/${fileNameLiquid}`, liquidFile)
  }
})
