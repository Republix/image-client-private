// project config
const path = require('path')

const htmlConfig = {
  author: 'republix',
  keywords: '',

  // Short description of the page (limit to 150 characters)
  // In *some* situations this description is used as a part of the snippet shown in the search results.
  description: '',

  // Name of web application (only should be used if the website is used as an app)
  applicationName: '',

  // Control the behavior of search engine crawling and indexing
  // Google Specific
  googlebot: '',
  // All Search Engines

  robots: '',
  // Short description of your site's subject
  subject: '',
  // Very short sentence describing the purpose of the website
  abstract: '',
  // Describes the topic of the website
  topic: '',
  // Brief summary of the company or purpose of the website
  summary: '',
  // Full domain name or web address
  url: '',
  // Makes sure your website shows up in all countries and languages
  coverage: 'Worldwide',
  // Gives a general age rating based on sites content
  rating: 'General',
  //  Allows control over how referrer information is passed
  referrer: 'never',
  // Disable automatic detection and formatting of possible phone numbers
  formatDetection: 'telephone=no'
}

const cdnLinks = ['//at.alicdn.com/t/font_1861801_f2gu7oyg6pm.css'];

exports.appConfig = {
  // document.title
  title: 'ima',

  htmlConfig,
  cdnLinks
}

exports.amapConfig = {
  amapKey: 'a3ec34ee8234fec69e10cf11e078e99a',
  lightStyleKey: '9a39ac0ebf3ef160b01557a166c9695f',
  darkStyleKey: 'b7572b3907c76f61f04194434d8ed3df',
  styleList: ['dark', 'light']
}

const buildDistPath = '/dist'
const buildStaticPrefixPath = '/static'

exports.buildConfig = {
  distPath: path.join(process.cwd(), buildDistPath),
  staticPrefixPath: path.join(process.cwd(), buildStaticPrefixPath)
}