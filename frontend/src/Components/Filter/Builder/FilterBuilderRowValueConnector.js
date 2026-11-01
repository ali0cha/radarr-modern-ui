import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { filterBuilderTypes } from 'Helpers/Props';
import * as filterTypes from 'Helpers/Props/filterTypes';
import sortByProp from 'Utilities/Array/sortByProp';
import FilterBuilderRowValue from './FilterBuilderRowValue';

function getTagList(filterType, sectionItems, selectedFilterBuilderProp) {
  if (
    (selectedFilterBuilderProp.type === filterBuilderTypes.NUMBER ||
    selectedFilterBuilderProp.type === filterBuilderTypes.STRING) &&
    filterType !== filterTypes.EQUAL &&
    filterType !== filterTypes.NOT_EQUAL ||
    !selectedFilterBuilderProp.optionsSelector
  ) {
    return [];
  }

  let items = [];

  if (selectedFilterBuilderProp.optionsSelector) {
    items = selectedFilterBuilderProp.optionsSelector(sectionItems);
  } else {
    items = sectionItems.reduce((acc, item) => {
      const name = item[selectedFilterBuilderProp.name];

      if (name) {
        acc.push({
          id: name,
          name
        });
      }

      return acc;
    }, []).sort(sortByProp('name'));
  }

  return _.uniqBy(items, 'id');
}

function FilterBuilderRowValueConnector(props) {
  const {
    filterType,
    sectionItems,
    selectedFilterBuilderProp
  } = props;

  const tagList = useMemo(
    () => getTagList(filterType, sectionItems, selectedFilterBuilderProp),
    [filterType, sectionItems, selectedFilterBuilderProp]
  );

  return (
    <FilterBuilderRowValue
      {...props}
      tagList={tagList}
    />
  );
}

FilterBuilderRowValueConnector.propTypes = {
  filterType: PropTypes.string,
  sectionItems: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedFilterBuilderProp: PropTypes.object.isRequired
};

export default FilterBuilderRowValueConnector;
