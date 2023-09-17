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
        name: data.m_participants[participant].m_name,
        // nationality: constants.NATIONALITIES[data.m_participants[participant].m_nationality],
        number: data.m_participants[participant].m_raceNumber,
        team: constants.TEAMS[data.m_participants[participant].m_teamId]?.name ?? '',
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
        id: data.m_trackId,
        name: constants.TRACKS[data.m_trackId]?.name ?? 'Unknown'
      }
    };
  
    return response
  }
}

module.exports = Parser;