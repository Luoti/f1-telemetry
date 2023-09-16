const { constants } = require('../node_modules/@racehub-io/f1-telemetry-client');

class Parser
{
  static parseParticipants(data) {
    let response = {
      packetID: data.packetID,
      data : []
    };
    for (const participant in data.parsed.m_participants) {
      response.data.push({
        ai: data.parsed.m_participants[participant].m_aiControlled,
        driver: constants.DRIVERS[data.parsed.m_participants[participant].m_driverId]?.abbreviation ?? '',
        name: data.parsed.m_participants[participant].m_name,
        // nationality: constants.NATIONALITIES[data.parsed.m_participants[participant].m_nationality],
        number: data.parsed.m_participants[participant].m_raceNumber,
        team: constants.TEAMS[data.parsed.m_participants[participant].m_teamId]?.name ?? '',
        color: constants.TEAMS[data.parsed.m_participants[participant].m_teamId]?.color ?? ''
      });
    }
  
    return response
  }

  static parseMotion(data) {
    let response = {
      packetID: data.packetID,
      data : []
    };
  
    for (const participant in data.parsed.m_carMotionData) {
      response.data.push({
        x: data.parsed.m_carMotionData[participant].m_worldPositionX,
        y: data.parsed.m_carMotionData[participant].m_worldPositionY,
      });
    }
  
    return response
  }
  
  static parseLapData(data) {
    let response = {
      packetID: data.packetID,
      data : []
    };
    for (const participant in data.parsed.m_lapData) {
      response.data.push({
        pos: data.parsed.m_lapData[participant].m_carPosition,
        deltaToFront: data.parsed.m_lapData[participant].m_deltaToCarInFrontInMS,
        penalty: data.parsed.m_lapData[participant].m_penalties,
      });
    }
  
    return response
  }

  static parseSession(data) {
    let response = {
      packetID: data.packetID,
      data : {
        id: data.parsed.m_trackId,
        name: constants.TRACKS[data.parsed.m_trackId]?.name ?? 'Unknown'
      }
    };
  
    return response
  }
}

module.exports = Parser;