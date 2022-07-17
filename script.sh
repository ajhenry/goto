# Used for goto
goto() {
    if [[ -x "$(command -v goto-cli)" ]]; then
        goto-cli "$@" && cd $(cat ~/.goto/goto)
    else
        echo 'goto not installed, run `npm i -g @ajhenry/goto`'
    fi
}