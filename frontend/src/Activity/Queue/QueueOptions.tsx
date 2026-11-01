import React, { useCallback } from 'react';
import FormGroup from 'Components/Form/FormGroup';
import FormInputGroup from 'Components/Form/FormInputGroup';
import FormLabel from 'Components/Form/FormLabel';
import { inputTypes } from 'Helpers/Props';
import { InputChanged } from 'typings/inputs';
import translate from 'Utilities/String/translate';
import {
  setIncludeUnknownMovieItems,
  useIncludeUnknownMovieItems,
} from './useQueue';

function QueueOptions() {
  const includeUnknownMovieItems = useIncludeUnknownMovieItems();

  const handleOptionChange = useCallback(({ value }: InputChanged<boolean>) => {
    setIncludeUnknownMovieItems(value);
  }, []);

  return (
    <FormGroup>
      <FormLabel>{translate('ShowUnknownMovieItems')}</FormLabel>

      <FormInputGroup
        type={inputTypes.CHECK}
        name="includeUnknownMovieItems"
        value={includeUnknownMovieItems}
        helpText={translate('ShowUnknownMovieItemsHelpText')}
        onChange={handleOptionChange}
      />
    </FormGroup>
  );
}

export default QueueOptions;
