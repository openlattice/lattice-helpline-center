module.exports = {
  stories: ['../stories/**/*.stories.@(js|mdx)', '../src/containers/**/*.stories.js'],
  core: {
    builder: 'webpack5',
  },
  addons: ['@storybook/addon-actions', '@storybook/addon-links', '@storybook/addon-docs'],
};
