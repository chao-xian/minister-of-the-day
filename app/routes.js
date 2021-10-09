const express = require('express')
const { get } = require('lodash')
const fetch = require('node-fetch-cache')

const router = express.Router()

const getMinisters = (data) => {
  return get(data, 'links.ministers')
}

const getRandomMinister = (ministers) => {
  return ministers[12]
}

const getRole = (minister) => {
  return get(minister, "links.role_appointments[0]")
}

const getImage = (role) => {
  return get(role, "links.person[0].details.image.url")
}

router.get('/', (req, res) => {
  const ministers = fetch("https://www.gov.uk/api/content/government/ministers")
                    .then(response => response.json())
                    .then(data => {
                      const ministers = getMinisters(data)
                      const minister = getRandomMinister(ministers)
                      const role = getRole(minister)
                      const image = getImage(role)
                      const title = get(role, "title")

                      let ministerOfTheDay = {
                          'title': title,
                          'image': image
                      }
                      res.render('index', ministerOfTheDay)
                    })
                    .catch(err => {
                      console.error(err)
                    })
})

module.exports = router
