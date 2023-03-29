import del from "del"

const reset = () => {
    return del([`${app.path.clean}/css/*`, `${app.path.clean}/js/*`])
}

export { reset }