export const gotoFunc = `
# Used for goto
goto() {
    goto-cli "$@" && eval $(cat ~/.goto/goto)
}
gotoc() {
    goto "$@" && code .
}
`
