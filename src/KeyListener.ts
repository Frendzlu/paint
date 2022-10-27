type Dict<K extends string|number|symbol, V> = {[key in K]: V}
type fn = () => void

export default class KeyListener {
    combo: string[] = []
    eventRegistry: Dict<string, fn> = {}
    debug: boolean

    constructor (debugOn: boolean) {
        this.debug = debugOn
        addEventListener("keydown", (e) => {
            e.preventDefault()
            if (e.repeat) return
            this.addToCombo(e.key)
            this.executeEvent()
            if (this.debug) console.log("Current combo: ", this.combo.join("+"))
        })
        addEventListener("keyup", (e) => {
            e.preventDefault()
            this.removeFromCombo(e.key)
            if (this.debug) console.log("Current combo: ", this.combo.join("+"))
        })
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
        this.combo.push(pressedKey)
    }

    removeFromCombo(key: string) {
        let i = this.combo.indexOf(key.toUpperCase())
        if (i >= 0) {
            this.combo.splice(i)
        }
    }
}