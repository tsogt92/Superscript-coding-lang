const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function ask(promptText) {
    return new Promise((resolve) => {
        rl.question(promptText, (answer) => resolve(answer));
    });
}

function substituteVars(text, vars) {
    for (const key in vars) {
        text = text.replace(new RegExp(`\\b${key}\\b`, "g"), vars[key]);
    }
    return text;
}

/* Each key is a command name. Each value is a function that receives
(args, vars) and does whatever that command means. */
const commands = {
    "logTo.console": (args, vars) => {
        const text = substituteVars(args.join(" "), vars);
        console.log(text);
    },

    "input.get": async (args, vars) => {
        const varName = args[0];
        const answer = await ask("> ");
        vars[varName] = answer;
    },

    "set": (args, vars) => {
        const [varName, ...valueParts] = args;
        vars[varName] = valueParts.join(" ");
    },

    "add": (args, vars) => {
        const [a, b, target] = args;
        const valA = Number(vars[a] ?? a);
        const valB = Number(vars[b] ?? b);
        vars[target] = valA + valB;
    },

    "let": (args, vars) => {
        const [varName, ...valueParts] = args;
        vars[varName] = valueParts.join(" ");
    },

    "const": (args, vars) => {
        const [varName, ...valueParts] = args;
        vars[varName] = valueParts.join(" ");
    },

    "if": (args, vars) => {
        const [conditionVar, trueCommand, ...trueArgs] = args;
        const conditionValue = vars[conditionVar];
    },

    "else": (args, vars) => {
        // This is a placeholder for the 'else' command. In a real implementation,
        // you would need to handle the logic for executing the 'else' block.
        console.log("Else command is not implemented yet.");
    },

    "help": (args, vars) => {
        console.log("Available commands:");
        console.log("  logTo.console <text> - Logs text to the console.");
        console.log("  input.get <varName> - Prompts for input and stores it in a variable.");
        console.log("  set <varName> <value> - Sets a variable to a value.");
        console.log("  add <a> <b> <target> - Adds two numbers and stores the result in a variable.");
        console.log("  let <varName> <value> - Declares a variable with a value.");
        console.log("  const <varName> <value> - Declares a constant with a value.");
        console.log("  if <conditionVar> <trueCommand> [args...] - Executes a command if the condition is true.");
        console.log("  else [args...] - Executes commands if the previous 'if' condition was false.");
        console.log("  help - Displays this help message.");
    }
};

async function main() {
    const vars = {};

    console.log("SuperScript REPL — type 'exit' to quit. Also, type 'help' for a list of commands. And oh, I almost forgot, you have to change the contents of multi_line_code.ss to make well, multi-line code work and type node superscript.js multi_line_code.ss. I know, it's a bit of a pain, but hey, at least you can still use the REPL for single-line commands!");

    while (true) {
        const line = await ask("ss> ");

        if (line === "exit") break;
        if (line.trim() === "") continue;

        const tokens = line.trim().split(" ");
        const cmdName = tokens[0];
        const args = tokens.slice(1);

        const handler = commands[cmdName];

        if (handler) {
            await handler(args, vars);
        } else {
            console.log(`Unknown command: ${line}`);
        }
    }

    rl.close();
}

main();