import React from 'react';
import { useCalendarStore } from 'Calendar/useCalendar';
import { icons, kinds } from 'Helpers/Props';
import useUISettings from 'Settings/UI/useUISettings';
import translate from 'Utilities/String/translate';
import LegendIconItem from './LegendIconItem';
import LegendItem from './LegendItem';
import styles from './Legend.module.css';

function Legend() {
  const view = useCalendarStore((state) => state.view);
  const { showCutoffUnmetIcon, fullColorEvents } = useCalendarStore(
    (state) => state.options
  );
  const { enableColorImpairedMode } = useUISettings();

  const iconsToShow = [];
  const isAgendaView = view === 'agenda';

  if (showCutoffUnmetIcon) {
    iconsToShow.push(
      <LegendIconItem
        name={translate('CutoffNotMet')}
        icon={icons.MOVIE_FILE}
        kind={kinds.WARNING}
        fullColorEvents={fullColorEvents}
        tooltip={translate('QualityCutoffNotMet')}
      />
    );
  }

  return (
    <div className={styles.legend}>
      <div>
        <LegendItem
          status="downloaded"
          name={translate('DownloadedAndMonitored')}
          isAgendaView={isAgendaView}
          fullColorEvents={fullColorEvents}
          colorImpairedMode={enableColorImpairedMode}
        />

        <LegendItem
          status="unmonitored"
          name={translate('DownloadedButNotMonitored')}
          isAgendaView={isAgendaView}
          fullColorEvents={fullColorEvents}
          colorImpairedMode={enableColorImpairedMode}
        />
      </div>

      <div>
        <LegendItem
          status="missingMonitored"
          name={translate('MissingMonitoredAndConsideredAvailable')}
          isAgendaView={isAgendaView}
          fullColorEvents={fullColorEvents}
          colorImpairedMode={enableColorImpairedMode}
        />

        <LegendItem
          status="missingUnmonitored"
          name={translate('MissingNotMonitored')}
          isAgendaView={isAgendaView}
          fullColorEvents={fullColorEvents}
          colorImpairedMode={enableColorImpairedMode}
        />
      </div>

      <div>
        <LegendItem
          status="queue"
          name={translate('Queued')}
          isAgendaView={isAgendaView}
          fullColorEvents={fullColorEvents}
          colorImpairedMode={enableColorImpairedMode}
        />

        <LegendItem
          status="continuing"
          name={translate('Unreleased')}
          isAgendaView={isAgendaView}
          fullColorEvents={fullColorEvents}
          colorImpairedMode={enableColorImpairedMode}
        />
      </div>

      {iconsToShow.length > 0 ? <div>{iconsToShow[0]}</div> : null}
    </div>
  );
}

export default Legend;
