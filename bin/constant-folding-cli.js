#!/usr/bin/env node
const {program} = require('commander');
const fs = require('fs');
const {version, description} = require('../package.json');
const constantFolding = require('../src/constant-folding'); // Your libs

"use strict";

program
    .version(version)
    .name('blah')
    .arguments("<filename>")
    .description(description, {
        filename: 'file with the original code'
    })
    .option("-o, --output <filename>", "description 1", "output.js")
    .option("-p, --pattern <pattern>", "other parameters")
    .action((filename, options) => {
        if (options.pattern === undefined) {
            transpile(filename, options.output);
        } else {
            transpile(filename, options.output, options.pattern);
        }
    });

program.parse(process.argv);

/**
 * A function that takes two file names and blah,
 *  ...
 *  ...
 * @param {string} input_file The file from which to read the code
 * @param {string} output_file The file to which to write the code with the logs
 *  etc.
 * @private
 */
function transpile(input_file, output_file) {
    fs.readFile(input_file, 'utf-8', (err, input) => {
        if (err) {
            console.log("Couldn't read the file: " + err);
            return;
        }
        console.log("File read succesfully");
        fs.writeFile(output_file, output, (err) => {
            if (err) {
                console.log("Couldn't write the output to " + output_file + ": " + err);
                return;
            }
            console.log("Output written succesfully in " + output_file);
        });
    });
} 