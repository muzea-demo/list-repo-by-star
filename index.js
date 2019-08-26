const qs = require('querystring')

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

function desc(a, b) {
  return b.stargazers_count - a.stargazers_count
}

function asc(a, b) {
  return a.stargazers_count - b.stargazers_count
}

/**
 * Fetch and log a request
 * @param {Request} request
 */
async function handleRequest(request) {
  const { url } = request
  const [_, queryStr] = url.split('?')
  const reqQuery = qs.parse(queryStr)
  const {
    sort = 'created',
    direction,
    org = 'ant-design',
    ...restQuery
  } = reqQuery
  let apiUrl
  if (sort === 'star') {
    const query = { ...restQuery, per_page: 100 }
    apiUrl = `https://api.github.com/orgs/${org}/repos?${qs.stringify(query)}`
  } else {
    const query = { ...reqQuery, per_page: 100 }
    apiUrl = `https://api.github.com/orgs/${org}/repos?${qs.stringify(query)}`
  }
  const headers = {
    'User-Agent': 'list-repo-by-star v1',
    Accept: 'application/vnd.github.v3+json',
  }
  /**
   * @type {any[]}
   */
  const resp = await fetch(apiUrl, { headers })
    .then(response => response.json())
    .catch(err => console.warn(err))
  if (sort === 'star') {
    const cmp = direction === 'asc' ? asc : desc
    resp.sort(cmp)
  }
  return new Response(JSON.stringify(resp, null, 2), { status: 200 })
}
