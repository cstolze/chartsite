const tree = document.getElementById("tree");
const memory = document.getElementById("memory");
const cont = document.getElementById("cont");
const output = document.getElementById("output");
const parsing = document.getElementById("parsing");
const examples = document.getElementById("examples");

async function draw(dot) {
    const viz = new Viz();
    const graph = await viz.renderSVGElement(dot);
    tree.innerHTML = "";
    tree.appendChild(graph);
}

function out(s) {
    output.innerHTML = s;
}

function show_cont(s) {
    cont.innerHTML = s;
}

function make_table(input, output) {
    let i;
    let len = input.length;
    let first = "";
    let second = "";

    for (i = 0; i < len; i+=2) {
	first += "<th>" + input[i] + "</th>"
	second += "<td><textarea onChange=\"update('" + input[i] + "', this.value)\">" + input[i+1] + "</textarea></td>"
    }
    len = output.length;
    for (i = 0; i < len; i+=2) {
	first += "<th>" + output[i] + "</th>"
	second += "<td>" + output[i+1] + "</td>"
    }
    memory.innerHTML = "<tr>"+first+"</tr><tr>"+second+"</tr>"
}

const abro = "chart ABRO {\n\
    input bool A, B, R\n\
    output bool O = true\n\
    region rABRO {\n\
        initial state ABO {\n\
            entry do O = false;\n\
\n\
            region rABO {\n\
                initial state WaitAB {\n\
                    region rA {\n\
                        initial state wA\n\
                        if A go to dA\n\
\n\
                        final state dA\n\
                    }\n\
\n\
                    region rB {\n\
                        initial state wB\n\
                        if B go to dB\n\
\n\
                        final state dB\n\
                    }\n\
                }\n\
                do O = true; join to done\n\
\n\
                state done {\n\
                    exit do print(\"Restarting...\");\n\
                }\n\
            }\n\
        }\n\
        if R abort to ABO\n\
    }\n\
}"

const connector = "chart Connect {\n\
    input int A, B\n\
    output bool O = false\n\
    region Foo {\n\
        initial connector state AAA {\n\
            entry do print(\"Entering AAA\");\n\
            during do print(\"Staying in AAA\");\n\
            exit do print(\"Exiting AAA\");\n\
        }\n\
        if (A == B) go to BBB\n\
\n\
        connector state BBB {\n\
            entry do print(\"Entering BBB\");\n\
            during do print(\"Staying in BBB\");\n\
            exit do print(\"Exiting BBB\");\n\
        }\n\
        if (B == 5) do O = true; go to CCC\n\
\n\
        final state CCC {\n\
            entry do print(\"Entering CCC\");\n\
            during do print(\"Staying in CCC\");\n\
            exit do print(\"Exiting CCC\");\n\
        }\n\
    }\n\
}"

const example_list = { abro: abro, connector: connector };

function change() {
    const v = examples.value;
    parsing.value = example_list[v];
}
