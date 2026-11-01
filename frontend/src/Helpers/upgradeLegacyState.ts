import { get } from 'lodash';

type LegacyState = Record<string, unknown>;

interface LegacyAddDefaults {
  monitor?: string;
  minimumAvailability?: string;
}

// The name of the blocklist used to be blacklist
function upgradeBlacklistToBlocklist(state: LegacyState) {
  const blocklist = get(state, 'blacklist');

  if (!blocklist) {
    return;
  }

  state.blocklist = blocklist;
  delete state.blacklist;
}

// What is used when adding movies was saved by older versions as true or
// false for the monitor, and as preDB for the minimum availability
function upgradeAddDefaults(state: LegacyState) {
  ['addMovie', 'discoverMovie'].forEach((section) => {
    const defaults = get(state, [section, 'defaults']) as
      | LegacyAddDefaults
      | undefined;

    if (!defaults) {
      return;
    }

    if (defaults.monitor === 'true') {
      defaults.monitor = 'movieOnly';
    }

    if (defaults.monitor === 'false') {
      defaults.monitor = 'none';
    }

    if (defaults.minimumAvailability === 'preDB') {
      defaults.minimumAvailability = 'released';
    }
  });
}

// The preferences that were saved by redux-localstorage by older versions are
// brought up to date before the stores that replaced them read them.
function upgradeLegacyState(state: LegacyState) {
  upgradeBlacklistToBlocklist(state);
  upgradeAddDefaults(state);

  return state;
}

export default upgradeLegacyState;
