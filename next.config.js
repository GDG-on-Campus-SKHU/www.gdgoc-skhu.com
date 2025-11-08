const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
  'three',
  '@react-three/fiber',
  '@react-three/drei',
]);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const CompressionPlugin = require('compression-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    emotion: true,
  },

  webpack: config => {
    config.plugins.push(new CompressionPlugin());
    return config;
  },
};

module.exports = withPlugins([[withTM], [withBundleAnalyzer]], nextConfig);
