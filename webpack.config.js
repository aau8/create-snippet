import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const src = __dirname + '/src'
const PAGES = fs.readdirSync(src).filter(file => file.includes('.html')) // Массив с названиями файлов в папке src с расширением html

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

// console.log(isProd, isDev)
// const isProd = compiler.options.mode === 'production' || !compiler.options.mode; 
export default {
  entry: './src/js/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  devServer: {
    port: 'auto', // Порт сервера
    open: true, // Открывает бразуер после запуска сервера
    compress: true, // Включает сжатие gzip для более быстрой загрузки страниц
    hot: false, // Обновление страницы после изменений, без перезагрузки
    client: {
      overlay: { // Показывает во весь экран ошибки, если они есть
        errors: true, // Только ошибки
        warnings: false // Предупреждения не показывать
      }
    }
  },
  plugins: [
    // Вывод html файлов
    ...PAGES.map((page) => new HtmlWebpackPlugin({
      template: `./src/${page}`, // Где находится файл
      filename: `./${page}`, // Название файла
      inject: page === 'index.html' ? false : 'body', // Все скрипты помещаются внизу body, кроме страницы index.html
      minify: isDev ? false : {
        caseSensitive: false,
        removeComments: true,
        collapseWhitespace: false,
        removeRedundantAttributes: true,
        useShortDoctype: true,
      }
    })),
    // Очищаем папку dist
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/style.css'
    })
  ],
  module: {
      rules: [
        // HTML
        {
          test: /\.html$/i,
          use: 'html-loader'
        },
        // CSS
        {
          test: /\.(s[ac]ss|css)$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader', 
            'sass-loader'
          ]
        },
        // Изображения
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
          generator: {
            filename: content => {
              return content.filename.replace('src/', '')
            },
          }
        },
        // Шрифты
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/i,
          type: 'asset/resource',
          generator: {
            filename: content => {
              return content.filename.replace('src/', '')
            },
          }
        },
      ]
  },
}