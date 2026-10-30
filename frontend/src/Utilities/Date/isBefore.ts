import moment, { MomentInput, unitOfTime } from 'moment';

function isBefore(
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

  return moment(date).isBefore(offsetTime);
}

export default isBefore;
