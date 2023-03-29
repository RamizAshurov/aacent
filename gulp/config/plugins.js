import plumber from "gulp-plumber";
import notify from "gulp-notify"
import browserSync from "browser-sync"

const plugins = {
    plumber: plumber,
    notify: notify,
    browserSync: browserSync
}

export { plugins }