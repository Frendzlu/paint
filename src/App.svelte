<script lang="ts">
    import { listener } from "./KeyListener";
    import Canvas from "./lib/Canvas.svelte";
    import { Circle, Drawable, IBristle, type ITool, Rectangle, Line } from "./Tool";

    let size = 1;
    let sizeSlider: HTMLInputElement;
    let color = { primary: "#ffae42", secondary: "#ffffff" };
    $: paint = {
        drawing: false,
        color: color,
        size: updateValue(size),
        opacity: 1,
    };

    let predefinedColors = [
        [
            "#f00",
            "#0f0",
            "#00f",
            "#ff0",
            "#f0f",
            "#0ff",
            "#000",
            "#fff",
            "#abcdef",
            "#fedcba",
        ],
        //"#facade"
    ];

    let userColors = Array(10).fill(undefined);

    function coloredDiv(color: string) {
        return `background-color: ${color};`;
    }

    function handleClick(e) {
        if (!e.target.attributes.value) {
            userColorDef("#ffffffff", e.target.id);
            return;
        }
        paint.color.primary = e.target.attributes.value.value;
        paint = paint;
    }

    function switchColors() {
        let ref = paint.color.primary;
        color.primary = color.secondary;
        color.secondary = ref;
        color = color;
    }

    function userColorDef(
        previousColor: string,
        id: number,
        usrDef: boolean = true,
        primary: boolean = true
    ) {
        function update() {
            if (usrDef) {
                userColors[id] = inputRef.value;
                userColors = userColors;
            }
            if (primary) {
                color.primary = inputRef.value;
            } else {
                color.secondary = inputRef.value;
            }
        }
        inputRef.onchange = (e) => {
            update();
        };
        inputRef.value = previousColor;
        update();
        inputRef.focus();
        inputRef.click();
    }

    let inputRef: HTMLInputElement = undefined;
    let sizeInput: HTMLInputElement = undefined
    let fill = false

    listener.registerDown("X", switchColors);
    listener.registerDown("F", () => {fill = !fill; updateFill()});

    let sizeN = 1

    function updateSlider() {
        let adjusted = Math.max(Math.min(sizeN, max), min);
        size = Math.log(adjusted / min) / Math.log(base)
        sizeSlider.value = (size).toString();
    }

    function updateValue(value) {
        sizeN = parseInt((min * base ** value).toFixed(0));
        return sizeN
    }

    const min = 1,
        max = 1000;
    $: steps = sizeSlider ? +sizeSlider.max : 1;
    $: base = Math.pow(max / min, 1 / steps);

    //document.getElementById('value').addEventListener('change', updateSlider);
    //document.getElementById('slider').addEventListener('click', updateValue);
    let tools = [
        new Drawable("pencil", [new IBristle()]),
	    new Circle(),
	    new Rectangle(),
        new Line()
    ]

    function updateFill() {
        tools.forEach(t => t.fill = fill)
    }

    let tool: ITool = tools[0]
</script>

<main>
    <div class="row">
        <input bind:this={inputRef} type="color" style="display: none" />
        <div class="vert">
            <div id="preDefColors">
                {#each predefinedColors as colorRow}
                    <div class="row">
                        {#each colorRow as color}
                            <div
                                value={color}
                                class="sus"
                                style={coloredDiv(color)}
                                on:click={handleClick}
                                on:keydown={() => {}}
                            />
                        {/each}
                    </div>
                {/each}
            </div>
            <div class="row">
                {#each userColors as color, i}
                    <div
                        value={color}
                        id={i.toString()}
                        class="sus"
                        style={coloredDiv(color || "#dbdbdb")}
                        on:contextmenu={(e) => {
                            e.preventDefault();
                            userColorDef(color, i);
                        }}
                        on:click={handleClick}
                        on:keydown={() => {}}
                    />
                {/each}
            </div>
        </div>
        <div id="colorDisplay">
            <div
                class="primaryCol"
                style={coloredDiv(paint.color.primary)}
                on:click={() => userColorDef(paint.color.primary, 0, false)}
                on:keydown
            />
            <div
                class="secondaryCol"
                style={coloredDiv(paint.color.secondary)}
                on:click={() =>
                    userColorDef(paint.color.secondary, 0, false, false)}
                on:keydown
            />
        </div>
        <input
            style="height: 1rem; margin-top: 1.25rem; width: 4rem;"
            type="number"
            bind:this={sizeInput}
            on:change={updateSlider}
            placeholder="1"
            bind:value={sizeN}
        />
        <input
            type="range"
            bind:this={sizeSlider}
            bind:value={size}
            max="200"
            min="1"
        />
        <label class="switch" style="margin-top: 0.8rem">
            <input type="checkbox" bind:checked={fill} on:change={updateFill}>
            <span class="slider"></span>
        </label>
        <div id="shapes">
            {#each tools as ptool}
                <div class:selected={ptool.toolName == tool.toolName} class="tooldiv" on:click={() =>tool = ptool} on:keydown>
                    <img class="dafuq" src={ptool.imgURL} alt="sus">
                </div>
            {/each}
        </div>
    </div>
    <Canvas {paint} {tool} />
</main>

<style>
    .switch {
        margin: 1rem;
    }
    .sus {
        width: 1rem;
        height: 1rem;
        margin: 3px;
        border: 1px solid black;
    }
    .row {
        display: flex;
        flex-direction: row;
    }
    .vert {
        display: flex;
        flex-direction: column;
    }
    #colorDisplay {
        position: relative;
        margin-left: 1rem;
        width: 4rem;
    }
    .primaryCol,
    .secondaryCol {
        width: 2rem;
        height: 2rem;
        position: absolute;
    }

    .primaryCol {
        top: 0rem;
        left: 0rem;
        z-index: 10;
    }

    .secondaryCol {
        top: 1rem;
        left: 1rem;
    }

    .selected {
        background-color: rgba(69, 69, 169, 0.69);
    }
    .tooldiv {
        width: 3rem;
        height: 3rem;
        padding: 0.5rem;
    }

    .dafuq {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
    }
    #shapes {
        display: flex;
        flex-direction: row;
    }
</style>
