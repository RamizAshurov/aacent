import gulp from "gulp"
import { path } from "./gulp/config/path.js"
import { plugins } from "./gulp/config/plugins.js"

global.app = {
    path: path,
    gulp: gulp,
    plugins: plugins
}

import { reset } from "./gulp/tasks/reset.js"
import { images } from "./gulp/tasks/images.js"
import { html } from "./gulp/tasks/html.js"
import { server } from "./gulp/tasks/server.js"
import { scss } from "./gulp/tasks/scss.js"
import { js } from "./gulp/tasks/js.js"
import { fonts } from "./gulp/tasks/fonts.js"
import { json } from "./gulp/tasks/json.js"
import { zip } from "./gulp/tasks/zip.js"

// наблюдение за изменениями в файлах
// 1ый аргумент - путь, 2ой - задача
function watcher() {
    gulp.watch(path.watch.files, images)
    gulp.watch(path.watch.pug, html)
    gulp.watch(path.watch.scss, scss)
    gulp.watch(path.watch.js, js)
}

const mainTasks = gulp.parallel(html, images, scss, js, fonts, json)

// последовательное выолнение задач
const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server))
const build = gulp.series(reset, mainTasks)
const zipping = gulp.series(reset, mainTasks, zip)

//регистрация задачи
gulp.task('default', dev)
gulp.task('build', build)
gulp.task("zipping", zipping)