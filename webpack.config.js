var path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/DataTable.jsx',
    output: {
        path: path.resolve('lib'),
        filename: 'DataTable.js',
        libraryTarget: 'commonjs2'
    },
    resolve: {
		alias: {
		  'react': path.resolve(__dirname, './node_modules/react'),
		  'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
		}
    },	
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: 'babel-loader'
            }
        ]
    },
    externals: {
        // Don't bundle react or react-dom or Semantic.     
        react: {
            commonjs: "react",
            commonjs2: "react",
            amd: "React",
            root: "React"
          },
          "react-dom": {
            commonjs: "react-dom",
            commonjs2: "react-dom",
            amd: "ReactDOM",
            root: "ReactDOM"
          },
          "semantic-ui-react":  "semantic-ui-react"
    }
}   
