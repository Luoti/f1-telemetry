const { constants } = require('../node_modules/@racehub-io/f1-telemetry-client');

class Parser
{
  static parseParticipants(data) {
    let response = {
      packetID: 'participants',
      data : []
    };
    for (const participant in data.m_participants) {
      response.data.push({
        ai: data.m_participants[participant].m_aiControlled,
        driver: constants.DRIVERS[data.m_participants[participant].m_driverId]?.abbreviation ?? '',
        networkId: data.m_participants[participant].m_networkId,
        name: data.m_participants[participant].m_name,
        // nationality: constants.NATIONALITIES[data.m_participants[participant].m_nationality],
        number: data.m_participants[participant].m_raceNumber,
        teamName: constants.TEAMS[data.m_participants[participant].m_teamId]?.name ?? '',
        teamId: data.m_participants[participant].m_teamId ?? '',
        color: constants.TEAMS[data.m_participants[participant].m_teamId]?.color ?? ''
      });
    }
  
    return response
  }

  static parseMotion(data) {
    let response = {
      packetID: 'motion',
      data : []
    };
  
    for (const participant in data.m_carMotionData) {
      response.data.push({
        x: data.m_carMotionData[participant].m_worldPositionX,
        y: data.m_carMotionData[participant].m_worldPositionZ,
      });
    }
  
    return response
  }
  
  static parseLapData(data) {
    let response = {
      packetID: 'lapData',
      data : []
    };
    for (const participant in data.m_lapData) {
      response.data.push({
        pos: data.m_lapData[participant].m_carPosition,
        lap: data.m_lapData[participant].m_currentLapNum,
        deltaToFront: data.m_lapData[participant].m_deltaToCarInFrontInMS,
        penalty: data.m_lapData[participant].m_penalties,
      });
    }
  
    return response
  }

  static parseSession(data) {
    let response = {
      packetID: 'session',
      data : {
        trackId: data.m_trackId,
        trackName: constants.TRACKS[data.m_trackId]?.name ?? 'Unknown',
        player1CarIndex: data.m_header.m_playerCarIndex,
        player2CarIndex: data.m_header.m_secondaryPlayerCarIndex,
        pitStop: {
          windowIdealLap: data.m_pitStopWindowIdealLap,
          windowLatestLap: data.m_pitStopWindowLatestLap,
          rejoinPosition: data.m_pitStopRejoinPosition,
        }
      }
    };
  
    return response
  }

  static parseCarStatus(data) {
    let response = {
      packetID: 'carStatus',
      data : []
    };

    for (const participant in data.m_carStatusData) {
      response.data.push({
        tyreAgeLaps: data.m_carStatusData[participant].m_tyresAgeLaps,
        visualTyreCompound: data.m_carStatusData[participant].m_visualTyreCompound
      });
    }
  
    return response
  }
}

module.exports = Parser;