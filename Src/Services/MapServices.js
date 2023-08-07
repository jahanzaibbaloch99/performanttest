// https://cx6bmbl1e3.execute-api.us-east-2.amazonaws.com/venues

import {get} from './ApiServices';

export default class MapServices {
  static async getMapMarkers(payload) {
    let response = await get('https://cx6bmbl1e3.execute-api.us-east-2.amazonaws.com/venues');
    return response;
  }
}
