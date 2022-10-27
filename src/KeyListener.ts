type Dict<K extends string|number|symbol, V> = {[key in K]: V}
type fn = () => void

interface IKeyboardEvent {
    key: string,

}

export default class KeyListener {
    combo: string[] = []
    eventRegistry: Dict<string, fn> = {}
    debug: boolean

    constructor (debugOn: boolean) {
        this.debug = debugOn
        addEventListener("keydown", (e) => {
            if (e.repeat) {
                if (this.isRegistered()) {
                    console.log("what")
                    e.preventDefault()
                    return
                }
            } else {
                this.addToCombo(e.key)
                if (this.isRegistered()) {
                    console.log("what")
                    e.preventDefault()
                    this.executeEvent()
                    if (this.debug) console.log("Current combo: ", this.combo.join("+"))
                }
            };
        })
        addEventListener("keyup", (e) => {
            this.removeFromCombo(e.key);
            if (this.debug) console.log("Current combo: ", this.combo.join("+"))
        })
    }

    isRegistered () {
        console.log(this.eventRegistry[this.combo.join("+")] != undefined)
        return this.eventRegistry[this.combo.join("+")] != undefined
    }

    register(combo: string, fn: fn) {
        this.eventRegistry[combo.toUpperCase()] = fn
    }

    executeEvent() {
        let key = this.combo.join("+")
        let event = this.eventRegistry[key] || (() => {console.log(`No event related to ${key}`)})
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