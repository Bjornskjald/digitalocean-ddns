require('dotenv').config()
const { API_KEY, DOMAIN_NAME, RECORD_NAME } = process.env
const publicIp = require('public-ip')
const DigitalOcean = require('do-wrapper').default
const api = new DigitalOcean(API_KEY, 100)

async function update () {
  const ip = await publicIp.v4()
  console.log(ip)
  const { body: { domain_records } } = await api.domainRecordsGetAll(DOMAIN_NAME) // eslint-disable-line camelcase
  const record = domain_records.find(record => record.name === RECORD_NAME && record.type === 'A')
  await api.domainRecordsUpdate(DOMAIN_NAME, record.id, { data: ip })
  console.log('Changed successfully!')
}
update()
setInterval(update, 10 * 60 * 1000)
