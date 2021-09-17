export const generateDistributor = (key, paramList) => {
  if (key['Include-Distributor-Name']) {
    paramList.include_distributor_name = key['Include-Distributor-Name']
  } else if (key['Exclude-Distributor-Name']) {
    paramList.exclude_distributor_name = key['Exclude-Distributor-Name']
  } else if (key['Include-Distributor-Category']) {
    paramList.include_distributor_category = key['Include-Distributor-Category']
  } else if (key['Exclude-Distributor-Category']) {
    paramList.exclude_distributor_category = key['Exclude-Distributor-Category']
  }
  return paramList
}
