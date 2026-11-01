import useSystemStatus from './useSystemStatus';

function useIsWindows() {
  return useSystemStatus().isWindows;
}

export default useIsWindows;
