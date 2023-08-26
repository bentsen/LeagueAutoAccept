module.exports = {
  images: {
    domains: ["ddragon.leagueoflegends.com", "ddragon.canisback.com"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.target = "electron-renderer";
    }

    return config;
  },
};
