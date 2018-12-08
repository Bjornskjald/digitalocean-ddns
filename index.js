require('dotenv').config()
const { API_KEY, DOMAIN_NAME, RECORD_NAME } = process.env
const publicIp = require('public-ip')
const DigitalOcean = require('do-wrapper').default
const api = new DigitalOcean(API_KEY, 100)

async function update () {
  console.log('Updating...')
  const ip = await publicIp.v4()
  console.log(`Your current IP address: ${ip}`)
  console.log(`Searching for domain records for ${DOMAIN_NAME}...`)
  const { body: { domain_records } } = await api.domainRecordsGetAll(DOMAIN_NAME) // eslint-disable-line camelcase
  console.log(`Found ${domain_records.length} records:`)
  console.dir(domain_records)
  const record = domain_records.find(record => record.name === RECORD_NAME && record.type === 'A')
  console.log(`Target record:`)
  console.dir(record)
  console.log(`Updating...`)
  await api.domainRecordsUpdate(DOMAIN_NAME, record.id, { data: ip })
  console.log('Updated successfully!')
}
update()
setInterval(update, 10 * 60 * 1000)
