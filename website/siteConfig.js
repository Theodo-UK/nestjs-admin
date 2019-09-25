/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
const users = []

const siteConfig = {
  title: 'NestJS Admin',
  tagline: 'A generic administration interface for TypeORM entities',
  url: 'https://williamdclt.github.io/',
  baseUrl: '/nestjs-admin/',

  // Used for publishing and more
  projectName: 'nestjs-admin',
  organizationName: 'williamdclt',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  headerLinks: [
    { doc: 'install', label: 'Docs' },
    { href: 'https://github.com/williamdclt/nestjs-admin', label: 'Github' },
  ],

  // If you have users set above, you add it here:
  // users,

  headerIcon: 'img/logo.png',
  footerIcon: 'img/logo.png',
  favicon: 'img/favicon.ico',

  colors: {
    primaryColor: '#343a40',
    secondaryColor: '#22272b',
  },

  // copyright: `Copyright © ${new Date().getFullYear()} Your Name or Your Company Name`,

  highlight: {
    theme: 'atom-one-dark',
  },

  scripts: ['https://buttons.github.io/buttons.js'],

  onPageNav: 'separate',
  cleanUrl: true,

  // Open Graph and Twitter card images.
  ogImage: 'img/logo-with-name.png',
  twitterImage: 'img/logo-with-name.png',

  // enableUpdateTime: true,
}

module.exports = siteConfig
