const path = require('path');
const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')([
  'three',
  '@react-three/fiber',
  '@react-three/drei',
  '@uiw/react-md-editor',
  '@uiw/react-markdown-preview',
]);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});
const CompressionPlugin = require('compression-webpack-plugin');
const removeImports = require('next-remove-imports')();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  compiler: {
    emotion: true,
  },

  webpack: config => {
    config.plugins.push(new CompressionPlugin());

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };

    return config;
  },
};

module.exports = withPlugins(
  [[withTM], [withBundleAnalyzer]],
  removeImports(nextConfig)
);
