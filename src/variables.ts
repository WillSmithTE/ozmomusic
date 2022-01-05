import Constants from 'expo-constants';

const ENV = {
  dev: {
    apiUrl: "http://192.168.0.3:5000",
  },
  staging: {
    apiUrl: '',
  },
  prod: {
    apiUrl: 'https://q15zfa6w12.execute-api.us-east-1.amazonaws.com/dev'
  }
};

function getEnvVars(env = "") {
  console.debug(`env=${env}`)
  if (env === null || env === undefined || env === "") return ENV.dev;
  if (env.indexOf("dev") !== -1) return ENV.dev;
  if (env.indexOf("staging") !== -1) return ENV.staging;
  if (env.indexOf("prod") !== -1) return ENV.prod;
  if (env.indexOf("default") !== -1) return ENV.prod;
}

export const ENV_VARS = getEnvVars(Constants.manifest!!.releaseChannel)!!;
