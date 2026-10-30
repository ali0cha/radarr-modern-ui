import { SelectedState } from './areAllSelected';

function selectAll(selectedState: SelectedState, selected: boolean) {
  const newSelectedState = Object.keys(selectedState).reduce<SelectedState>(
    (result, item) => {
      result[item] = selected;
      return result;
    },
    {}
  );

  return {
    allSelected: selected,
    allUnselected: !selected,
    lastToggled: null as number | null,
    selectedState: newSelectedState,
  };
}

export default selectAll;
