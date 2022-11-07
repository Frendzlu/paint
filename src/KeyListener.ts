type Dict<K extends string | number | symbol, V> = { [key in K]: V }
type fn = () => void

interface IKeyboardEvent {
    key: string,

}

export default class KeyListener {
    combo: string[] = []
    downEventRegistry: Dict<string, fn> = {}
    upEventRegistry: Dict<string, fn> = {}
    debug: boolean

    constructor(debugOn: boolean) {
        this.debug = debugOn
        addEventListener("keydown", (e) => {
            if (e.repeat) {
                return
            } else {
                this.addToCombo(e.key)
                console.log(this.combo.join("+"))
                if (this.isDownRegistered()) {
                    e.preventDefault()
                    this.executeDownEvent()
                    if (this.debug) console.log("Current combo: ", this.combo.join("+"))
                }
            };
        })
        addEventListener("keyup", (e) => {
            if (this.isUpRegistered()) {
                e.preventDefault()
                this.executeUpEvent()
                if (this.debug) console.log("Current combo: ", this.combo.join("+"))
            }
            this.removeFromCombo(e.key);
            if (this.debug) console.log("Current combo: ", this.combo.join("+"))
        })
        window.addEventListener("blur", () => this.combo = [])
    }

    isDownRegistered() {
        return this.downEventRegistry[this.combo.join("+")] != undefined
    }

    isUpRegistered() {
        return this.upEventRegistry[this.combo.join("+")] != undefined
    }

    registerDown(combo: string, fn: fn) {
        this.downEventRegistry[combo.toUpperCase()] = fn
    }

    registerUp(combo: string, fn: fn) {
        this.upEventRegistry[combo.toUpperCase()] = fn
    }

    executeDownEvent() {
        let key = this.combo.join("+")
        let event = this.downEventRegistry[key] || (() => { console.log(`No down event related to ${key}`) })
        event()
    }

    executeUpEvent() {
        let key = this.combo.join("+")
        let event = this.upEventRegistry[key] || (() => { console.log(`No up event related to ${key}`) })
        event()
    }

    addToCombo(key: string) {
        let pressedKey = key.toUpperCase()
        let plChars = ["Ś", "Ą", "Ż", "Ź", "Ć", "Ń", "Ł", "Ó", "Ę"]
        let enChars = ["S", "A", "Z", "X", "C", "N", "L", "O", "E"]
        if (plChars.includes(pressedKey)) {
            pressedKey = enChars[plChars.indexOf(pressedKey)]
        }
        if (!this.combo.find(el => el == pressedKey)) {
            this.combo.push(pressedKey)
        }
    }

    removeFromCombo(key: string) {
        let i = this.combo.indexOf(key.toUpperCase())
        if (i >= 0) {
            this.combo.splice(i)
        }
    }
}

export let listener = new KeyListener(false)