const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
	title: 'Style Guide',
	getComponentPathLine(componentPath) {
    if (componentPath.includes('/styleguide/')) {
			return ''
		}
		return componentPath;
	},
	pagePerSection: true,
	sections: [
	  {
	    name: 'Base Elements',
			content: './src/widgets/docs/Readme.md',
			components: [
				'./src/widgets/vue/shared/components/styleguide/*.vue',
			],
			usageMode: 'hide',
			exampleMode: 'hide'
		},
		{
			name: 'Vue Components',
			components: [
				'./src/widgets/vue/shared/components/core/cStyleguideDemo.vue',
			]
		}
	],
	webpackConfig: {
		resolve: {
			alias: {
				"@styles": path.resolve(__dirname, "src/styles")
			}
		},
    module: {
      rules: [
        // Vue loader
        {
          test: /\.vue$/,
          exclude: /node_modules/,
          loader: 'vue-loader'
        },
        // Other loaders that are needed for your components
        {
          test: /\.css$/,
          loader: 'style-loader!css-loader'
				},
				{
					test: /\.scss$/,
					use: ['style-loader', 'css-loader', 'sass-loader']
				}
      ]
		},
    plugins: [
      // add vue-loader plugin
      new VueLoaderPlugin()
    ]
  },
	exampleMode: 'expand',
	require: [
    path.join(__dirname, 'src/assets/theme.css')
  ]
}

