const calculateWidthAndHeight = ({ width, height, ansImage = {} }) => {
  const parsedWidth = parseInt(width) || 0
  const parsedHeight = parseInt(height) || 0

  if (!parsedWidth && !parsedHeight) {
    return {
      width: parseInt(ansImage?.width) || null,
      height: parseInt(ansImage?.height) || null,
    }
  }

  return { width: parsedWidth || null, height: parsedHeight || null }
}

export default calculateWidthAndHeight
