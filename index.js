require('dotenv').config()
const util = require('util')
const { API_KEY, DOMAIN_NAME, RECORD_NAME } = process.env
const publicIp = require('public-ip')
const DigitalOcean = require('do-wrapper').default
const api = new DigitalOcean(API_KEY, 100)

const getDate = _ => {
  let date = new Date()
  date.setMinutes(date.getMinutes() + -(new Date()).getTimezoneOffset())
  return date.toJSON().replace('T', ' ').replace(/\..*/, '')
}

const log = m => console.log(`[${getDate()}] ${m}`)
const inspect = o => util.inspect(o, { colors: true, breakLength: (process.stdout.columns - 20) })

async function update () {
  log('Updating...')
  const ip = await publicIp.v4()
  log(`Your current IP address: ${ip}`)

  log(`Searching for domain records for ${DOMAIN_NAME}...`)
  const { body: { domain_records } } = await api.domainRecordsGetAll(DOMAIN_NAME) // eslint-disable-line camelcase
  log(`Found ${domain_records.length} records:`)
  inspect(domain_records)

  const record = domain_records.find(record => record.name === RECORD_NAME && record.type === 'A')
  log(`Target record:`)
  inspect(record)

  log(`Updating...`)
  await api.domainRecordsUpdate(DOMAIN_NAME, record.id, { data: ip })
  log('Updated successfully!')
}
update()
setInterval(update, 10 * 60 * 1000)
