// @flow

const SEARCH_PREFIX = 'entity';

const getSearchTerm = (propertyTypeId :UUID, searchString :string, exact :boolean = false) => {
  const searchTerm = exact ? `"${searchString}"` : searchString;
  return `${SEARCH_PREFIX}.${propertyTypeId}:${searchTerm}`;
};

export {
  getSearchTerm,
  SEARCH_PREFIX,
};
