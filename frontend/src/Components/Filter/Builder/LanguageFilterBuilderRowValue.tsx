import React from 'react';
import { useLanguages } from 'Language/useLanguages';
import FilterBuilderRowValue from './FilterBuilderRowValue';
import FilterBuilderRowValueProps from './FilterBuilderRowValueProps';

const EXCLUDED_LANGUAGES = ['Any'];

function LanguageFilterBuilderRowValue(props: FilterBuilderRowValueProps) {
  const { items } = useLanguages(EXCLUDED_LANGUAGES);

  return <FilterBuilderRowValue {...props} tagList={items} />;
}

export default LanguageFilterBuilderRowValue;
