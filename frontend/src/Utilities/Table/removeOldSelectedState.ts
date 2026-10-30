import ModelBase from 'App/ModelBase';
import areAllSelected, { SelectedState } from './areAllSelected';

export default function removeOldSelectedState(
  state: { selectedState: SelectedState },
  prevItems: ReadonlyArray<ModelBase>
) {
  const selectedState = {
    ...state.selectedState,
  };

  prevItems.forEach((item) => {
    delete selectedState[item.id];
  });

  return {
    ...areAllSelected(selectedState),
    selectedState,
  };
}
