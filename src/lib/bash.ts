export const gotoFunc = `
# Used for goto
goto() {
    goto-cli "$@" && cd $(cat ~/.goto/goto)
}
`