#!/usr/bin/env /usr/local/bin/node

import util from 'node:util'
import child_process from 'node:child_process'
import xbar from '@sindresorhus/xbar'
import geoip from 'geoip-lite'
const exec = util.promisify(child_process.exec)

const requestIP = async () => {
  const { stdout } = (await exec(`dig +short myip.opendns.com @resolver1.opendns.com`)) || {}
  return stdout?.replace(/.*?(([\d\.])*)[^\d\.]*/, '$1')
}

const countryCodeToFlag = (countryCode) => {
  const codePoints = countryCode.split('').map((char) => 127397 + char.charCodeAt(0))
  return String.fromCodePoint(...codePoints)
}

const update = async () => {
  let ip = (await requestIP()) || '127.0.0.1'
  const { country: countryCode } = geoip.lookup(ip) || {}
  const flag = countryCodeToFlag(countryCode) || '🏴‍☠️'

  xbar([
    {
      text: `${ip} ${flag} ${countryCode}`,
      color: 'white'
    }
  ])
}

await update()
