import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: "",
});

export const get = async route => {
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };
  return new Promise((resolve, reject) => {
    axiosInstance
      .get(route, config)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
};
