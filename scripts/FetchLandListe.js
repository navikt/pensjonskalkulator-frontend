import fs from 'fs'
import prettier from 'prettier'

fetch(`https://staging.ekstern.dev.nav.no/pensjon/kalkulator/v1/land-liste`)
  .then((response) => response.text())
  .then(async (body) => {
    const formattedJson = await prettier.format(
      JSON.stringify(JSON.parse(body)),
      {
        parser: 'json',
      }
    )
    fs.writeFileSync('./src/assets/land-liste.json', formattedJson)
  })
  .catch((error) => {
    console.error('Error while fetching or processing /v1/land-liste', error)
  })
