import PropTypes from 'fusion:prop-types'

const Textfile = ({ customFields }) => {
  const { Text = '' } = customFields || {}
  return Text
}

Textfile.label = 'Text File – Arc Block'

Textfile.icon = 'notes-paper-text'

Textfile.propTypes = {
  customFields: PropTypes.shape({
    // eslint-disable-next-line react/no-typos
    Text: PropTypes.richtext,
  }),
}
export default Textfile
