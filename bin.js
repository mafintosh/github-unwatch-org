#!/usr/bin/env node --no-warnings

const ghauth = require('ghauth')
const Octokit = require('@octokit/rest')
const fs = require('fs')

if (!process.argv[2]) {
  console.error('Usage: github-unwatch-org <file-with-org-names>')
  process.exit(1)
}

const unwatching = new Set()

for (const line of fs.readFileSync(process.argv[2]).trim().split('\n')) {
  const l = line.trim().toLowerCase()
  if (!l) continue
  unwatching.add(l)
}

ghauth({
  configName: 'github-unwatch-org',
  note: 'Github unwatch org tool',
  scopes: ['repo']
}, async function (err, auth) {
  if (err) throw err

  const o = Octokit({
    userAgent: 'github-unwatch-org',
    baseUrl: 'https://api.github.com',
    auth: auth.token
  })

  for (let i = 0; true; i++) {
    console.log('Processing page ' + i)

    const list = await o.activity.listReposWatchedByUser({
      username: auth.user,
      per_page: 100,
      page: i
    })

    for (const { full_name } of list.data) {
      const org = full_name.split('/')[0].toLowerCase()
      if (unwatching.has(org)) {
        console.log('Unwatching ' + full_name)
        await o.activity.deleteRepoSubscription({
          owner: org,
          repo: full_name.split('/')[1]
        })
      }
    }

    if (list.data.length < 100) break
  }
})
