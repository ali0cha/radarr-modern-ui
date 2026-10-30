import moment, { MomentInput, unitOfTime } from 'moment';

function isAfter(
  date: MomentInput,
  offsets: Partial<Record<unitOfTime.DurationConstructor, number>> = {}
) {
  if (!date) {
    return false;
  }

  const offsetTime = moment();

  Object.entries(offsets).forEach(([key, value]) => {
    offsetTime.add(value, key as unitOfTime.DurationConstructor);
  });

  return moment(date).isAfter(offsetTime);
}

export default isAfter;
