# Feeds Content Source Utils

A collection of globals and helper functions shared by content sources

## Globals

- defaultANSFields - Array of ANS fields to use in \_source_includes parameter

  To reduce the Content-API response size, only fields used are included. Multi-site
  clients can have a lot of data in taxonomy.sections. Multiple records for each website.
  That is why it's not includes, the section will come from websites.

  - The content source needs to add the calling website into this list `websites.{arc-site}`
  - content_elements is not included. It needs to be added by the content_source if needed.

- validANSDates - Array of valid ANS date fields

## functions

- formatSections - takes a comma separated string of sections, returns an object to use in the DSL
- generateDistributor - looks for the 4 distributor params and returns up to one param
- generateParamList - takes an object of key:values, and returns a string of key=value to use as url parameters
- transform - put websites data into expected locations
  move websites.{website}.website_section to taxonomy.sections
  move websites.{website}.website_url to root
  create website at root
