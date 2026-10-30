export type SelectedState = Record<string | number, boolean>;

export default function areAllSelected(selectedState: SelectedState) {
  let allSelected = true;
  let allUnselected = true;

  Object.keys(selectedState).forEach((key) => {
    if (selectedState[key]) {
      allUnselected = false;
    } else {
      allSelected = false;
    }
  });

  return {
    allSelected,
    allUnselected,
  };
}
