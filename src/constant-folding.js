// See https://github.com/babel/minify/tree/master/packages/babel-plugin-minify-constant-folding
const fs = require("fs");
const deb = require('../src/deb.js');
const escodegen = require("escodegen");
const espree = require("espree");
const estraverse = require("estraverse");

"use strict";

module.exports = constantFolding;


/**
 * A function that apply constant folding 
 * @param {string} code A string that contains the code we want to do a constatn folding
 * blah document
 * @returns {string} Returns the js code of with de constant folding done
 */
function constantFolding(code, pattern) {
	/* ... */
	const t = espree.parse(code, { ecmaVersion: 6, loc: false });
	estraverse.traverse(t, {
		leave: function (n, p) {
			if (n.type == "BinaryExpression" && n.left.type == "Literal" && n.right.type == "Literal") { 
				replaceByLiteral(n); 
			}
			else if (n.type == "CallExpression") {
				replaceByCallExpression(n);
			}
			else if (n.type == "MemberExpression" && p.type != "CallExpression") {
				replaceByMemberExpression(n);
			}	
			else if (n.type == "BinaryExpression" && n.left.type == "BinaryExpression" && n.right.type == "BinaryExpression") {
				replaceByBinaryExpression(n);
			}
		},
	});
	//deb(t);
	let c = escodegen.generate(t);
	//console.error(c);
	return c;	
}

function replaceByBinaryExpression(n) {
	if (n.operator == '+' || n.operator == '-') {
		if (n.left.operator == '*' && n.right.operator == '*') {
			if (n.left.left == n.right.left) {
				let oldOp =  n.operator;
				n.left.type = "Indentifier";
				n.operator = "*";
				n.left.name = n.left.left.name;

				let leftightName = n.left.right.name;
				let rightightName = n.right.right.name;

				n.right.type = "BinaryExpression";
				n.right.operator = oldOp;
				n.right.left = "Indentifier";
				n.right.right = "Indentifier";
				n.left.name = leftightName;
				n.right.name = rightightName;
			}
		}
	}
}

function replaceByLiteral(n) {
	n.type = "Literal";

	n.value = eval(`${n.left.raw} ${n.operator} ${n.right.raw}`);
	n.raw = String(n.value);

	delete n.left;
	delete n.right;
}

function replaceByMemberExpression(n) {
	//console.log(n.type)
	n.type = "Literal";
	if (n.object.type == "ArrayExpression") {
		var arr = generateArray(n.object.elements);
		if (n.property.type == "Literal") {
			n.value = eval(`[${arr}][${n.property.value}]`);
		}
		else {
			n.value = eval(`[${arr}].${n.property.name}`);
		}
	}
	else if (n.object.type == "Literal") {
		if (n.property.type == "Literal") {
			n.value = eval(`"${n.object.value}"[${n.property.value}]`);
		}
		else {
			n.value = eval(`"${n.object.value}".${n.property.name}`);
		}
		
	}
	n.raw = String(n.value);
	n.computed = true;
	delete n.object;
	delete n.property;
}

function replaceByCallExpression(n) {
	if (n.callee.object.type == "ArrayExpression") {
		var arr = generateArray(n.callee.object.elements);
		if (n.callee.property.name == "join" || n.callee.property.name == "shift" || n.callee.property.name == "pop") {
			n.type = "Literal";
			if (n.arguments.length > 0) {
				var args = generateArray(n.arguments);
				n.value = eval(`[${arr}].${n.callee.property.name}(${args})`);
			}
			else {
				n.value = eval(`[${arr}].${n.callee.property.name}()`);
			}
			n.raw = String(n.value);	
		}
		else {
			n.type = "ArrayExpression";
			var result = "";
			if (n.arguments.length > 0) {
				var args = generateArray(n.arguments)
				result = eval(`[${arr}].${n.callee.property.name}(${args})`);
			}
			else {
				result = eval(`[${arr}].${n.callee.property.name}()`);
			}
			var tmp = new Array();
			for (var i = 0; i < result.length; i++) {
				var node =  Object.assign({} , n.callee.object.elements[0]);
				if (node.hasOwnProperty("name")) {
					node.name = result[i];
				}
				else if (node.hasOwnProperty("value")) {
					node.value = result[i];
				}
				tmp.push(node);
			}
			n.elements =  tmp;
		}
	}
	else if (n.callee.object.type == "Literal") {
		n.type = "Literal";
		if (n.arguments.length > 0) {
			var args = generateArray(n.arguments);
			n.value = eval(`"${n.callee.object.value}".${n.callee.property.name}(${args})`);
		}
		else {
			n.value = eval(`"${n.callee.object.value}".${n.callee.property.name}()`);
		}
		n.raw = String(n.value);
	}
	delete n.callee;
	delete n.arguments;
}

/**
 * @desc Generates a new array
 * @param {node} node 
 * @returns New array with the name values and name values
 */
function generateArray (node) {
	var arr = new Array();
	for (var i in node) {
		if (node[i].type == "Identifier") {
			arr.push(`"${node[i].name}"`);
		}
		else if (node[i].type == "Literal") {
			if (typeof(node[i].value) == "string") {
				arr.push(`"${node[i].value}"`);
			}
			else {
				arr.push(`${node[i].value}`);
			}
		}
		else if (node[i].type == "ArrayExpression") {
			arr.push(generateArray(node[i].elements));
		}
		else {
			console.log("Error, not valid expresion in generateArray");
		}
	}
	return arr;
}
