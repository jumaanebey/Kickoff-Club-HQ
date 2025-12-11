module.exports = {
  multipass: true,
  plugins: [
    'preset-default',
    'removeComments',
    'removeDesc',
    'removeTitle',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeEmptyContainers',
    'removeEmptyText',
    'removeHiddenElems',
    'removeMetadata',
    'removeUnusedNS',
    'removeUselessDefs',
    'removeUselessStrokeAndFill',
    'removeXMLProcInst',
    'sortAttrs',
    {
      name: 'removeAttrs',
      params: {
        attrs: ['data-name', 'class'],
      },
    },
    {
      name: 'convertColors',
      params: {
        currentColor: false,
        names2hex: true,
        rgb2hex: true,
        shorthex: true,
        shortname: false,
      },
    },
    {
      name: 'cleanupNumericValues',
      params: {
        floatPrecision: 2,
      },
    },
  ],
};
