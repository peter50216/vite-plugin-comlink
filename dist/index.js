var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[Object.keys(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  __markAsModule(target);
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toModule = (module2) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", module2 && module2.__esModule && "default" in module2 ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};

// node_modules/tsup/assets/cjs_shims.js
var importMetaUrlShim;
var init_cjs_shims = __esm({
  "node_modules/tsup/assets/cjs_shims.js"() {
    importMetaUrlShim = typeof document === "undefined" ? new (require("url")).URL("file:" + __filename).href : document.currentScript && document.currentScript.src || new URL("main.js", document.baseURI).href;
  }
});

// node_modules/rollup/dist/es/shared/rollup.js
function decode(mappings) {
  var decoded = [];
  var line = [];
  var segment = [
    0,
    0,
    0,
    0,
    0
  ];
  var j = 0;
  for (var i = 0, shift = 0, value = 0; i < mappings.length; i++) {
    var c = mappings.charCodeAt(i);
    if (c === 44) {
      segmentify(line, segment, j);
      j = 0;
    } else if (c === 59) {
      segmentify(line, segment, j);
      j = 0;
      decoded.push(line);
      line = [];
      segment[0] = 0;
    } else {
      var integer = charToInteger[c];
      if (integer === void 0) {
        throw new Error("Invalid character (" + String.fromCharCode(c) + ")");
      }
      var hasContinuationBit = integer & 32;
      integer &= 31;
      value += integer << shift;
      if (hasContinuationBit) {
        shift += 5;
      } else {
        var shouldNegate = value & 1;
        value >>>= 1;
        if (shouldNegate) {
          value = value === 0 ? -2147483648 : -value;
        }
        segment[j] += value;
        j++;
        value = shift = 0;
      }
    }
  }
  segmentify(line, segment, j);
  decoded.push(line);
  return decoded;
}
function segmentify(line, segment, j) {
  if (j === 4)
    line.push([segment[0], segment[1], segment[2], segment[3]]);
  else if (j === 5)
    line.push([segment[0], segment[1], segment[2], segment[3], segment[4]]);
  else if (j === 1)
    line.push([segment[0]]);
}
function encode(decoded) {
  var sourceFileIndex = 0;
  var sourceCodeLine = 0;
  var sourceCodeColumn = 0;
  var nameIndex = 0;
  var mappings = "";
  for (var i = 0; i < decoded.length; i++) {
    var line = decoded[i];
    if (i > 0)
      mappings += ";";
    if (line.length === 0)
      continue;
    var generatedCodeColumn = 0;
    var lineMappings = [];
    for (var _i = 0, line_1 = line; _i < line_1.length; _i++) {
      var segment = line_1[_i];
      var segmentMappings = encodeInteger(segment[0] - generatedCodeColumn);
      generatedCodeColumn = segment[0];
      if (segment.length > 1) {
        segmentMappings += encodeInteger(segment[1] - sourceFileIndex) + encodeInteger(segment[2] - sourceCodeLine) + encodeInteger(segment[3] - sourceCodeColumn);
        sourceFileIndex = segment[1];
        sourceCodeLine = segment[2];
        sourceCodeColumn = segment[3];
      }
      if (segment.length === 5) {
        segmentMappings += encodeInteger(segment[4] - nameIndex);
        nameIndex = segment[4];
      }
      lineMappings.push(segmentMappings);
    }
    mappings += lineMappings.join(",");
  }
  return mappings;
}
function encodeInteger(num) {
  var result = "";
  num = num < 0 ? -num << 1 | 1 : num << 1;
  do {
    var clamped = num & 31;
    num >>>= 5;
    if (num > 0) {
      clamped |= 32;
    }
    result += chars$1[clamped];
  } while (num > 0);
  return result;
}
function guessIndent(code) {
  var lines = code.split("\n");
  var tabbed = lines.filter(function(line) {
    return /^\t+/.test(line);
  });
  var spaced = lines.filter(function(line) {
    return /^ {2,}/.test(line);
  });
  if (tabbed.length === 0 && spaced.length === 0) {
    return null;
  }
  if (tabbed.length >= spaced.length) {
    return "	";
  }
  var min = spaced.reduce(function(previous, current2) {
    var numSpaces = /^ +/.exec(current2)[0].length;
    return Math.min(numSpaces, previous);
  }, Infinity);
  return new Array(min + 1).join(" ");
}
function getRelativePath(from, to) {
  var fromParts = from.split(/[/\\]/);
  var toParts = to.split(/[/\\]/);
  fromParts.pop();
  while (fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }
  if (fromParts.length) {
    var i = fromParts.length;
    while (i--) {
      fromParts[i] = "..";
    }
  }
  return fromParts.concat(toParts).join("/");
}
function isObject(thing) {
  return toString$1.call(thing) === "[object Object]";
}
function getLocator$1(source) {
  var originalLines = source.split("\n");
  var lineOffsets = [];
  for (var i = 0, pos = 0; i < originalLines.length; i++) {
    lineOffsets.push(pos);
    pos += originalLines[i].length + 1;
  }
  return function locate2(index) {
    var i2 = 0;
    var j = lineOffsets.length;
    while (i2 < j) {
      var m = i2 + j >> 1;
      if (index < lineOffsets[m]) {
        j = m;
      } else {
        i2 = m + 1;
      }
    }
    var line = i2 - 1;
    var column = index - lineOffsets[line];
    return { line, column };
  };
}
function relative(from, to) {
  const fromParts = from.split(/[/\\]/).filter(Boolean);
  const toParts = to.split(/[/\\]/).filter(Boolean);
  if (fromParts[0] === ".")
    fromParts.shift();
  if (toParts[0] === ".")
    toParts.shift();
  while (fromParts[0] && toParts[0] && fromParts[0] === toParts[0]) {
    fromParts.shift();
    toParts.shift();
  }
  while (toParts[0] === ".." && fromParts.length > 0) {
    toParts.shift();
    fromParts.pop();
  }
  while (fromParts.pop()) {
    toParts.unshift("..");
  }
  return toParts.join("/");
}
function getOrCreate(map, key, init) {
  const existing = map.get(key);
  if (existing) {
    return existing;
  }
  const value = init();
  map.set(key, value);
  return value;
}
function isLegal(str) {
  if (startsWithDigit(str) || blacklisted.has(str)) {
    return false;
  }
  return !illegalCharacters.test(str);
}
function makeLegal(str) {
  str = str.replace(/-(\w)/g, (_, letter) => letter.toUpperCase()).replace(illegalCharacters, "_");
  if (startsWithDigit(str) || blacklisted.has(str))
    str = `_${str}`;
  return str || "_";
}
function isAbsolute(path) {
  return absolutePath.test(path);
}
function isRelative(path) {
  return relativePath.test(path);
}
function normalize(path) {
  if (path.indexOf("\\") == -1)
    return path;
  return path.replace(/\\/g, "/");
}
function printQuotedStringList(list, verbs) {
  const isSingleItem = list.length <= 1;
  const quotedList = list.map((item) => `"${item}"`);
  let output = isSingleItem ? quotedList[0] : `${quotedList.slice(0, -1).join(", ")} and ${quotedList.slice(-1)[0]}`;
  if (verbs) {
    output += ` ${isSingleItem ? verbs[0] : verbs[1]}`;
  }
  return output;
}
function getAliasName(id) {
  const base2 = (0, import_path.basename)(id);
  return base2.substr(0, base2.length - (0, import_path.extname)(id).length);
}
function relativeId(id) {
  if (!isAbsolute(id))
    return id;
  return (0, import_path.relative)((0, import_path.resolve)(), id);
}
function isPathFragment(name) {
  return name[0] === "/" || name[0] === "." && (name[1] === "/" || name[1] === ".") || isAbsolute(name);
}
function getLocator(source, options) {
  if (options === void 0) {
    options = {};
  }
  var offsetLine = options.offsetLine || 0;
  var offsetColumn = options.offsetColumn || 0;
  var originalLines = source.split("\n");
  var start = 0;
  var lineRanges = originalLines.map(function(line, i2) {
    var end = start + line.length + 1;
    var range = { start, end, line: i2 };
    start = end;
    return range;
  });
  var i = 0;
  function rangeContains(range, index) {
    return range.start <= index && index < range.end;
  }
  function getLocation(range, index) {
    return { line: offsetLine + range.line, column: offsetColumn + index - range.start, character: index };
  }
  function locate2(search, startIndex) {
    if (typeof search === "string") {
      search = source.indexOf(search, startIndex || 0);
    }
    var range = lineRanges[i];
    var d = search >= range.end ? 1 : -1;
    while (range) {
      if (rangeContains(range, search))
        return getLocation(range, search);
      i += d;
      range = lineRanges[i];
    }
  }
  return locate2;
}
function locate(source, search, options) {
  if (typeof options === "number") {
    throw new Error("locate takes a { startIndex, offsetLine, offsetColumn } object as the third argument");
  }
  return getLocator(source, options)(search, options && options.startIndex);
}
function createInclusionContext() {
  return {
    brokenFlow: BROKEN_FLOW_NONE,
    includedCallArguments: new Set(),
    includedLabels: new Set()
  };
}
function createHasEffectsContext() {
  return {
    accessed: new PathTracker(),
    assigned: new PathTracker(),
    brokenFlow: BROKEN_FLOW_NONE,
    called: new DiscriminatedPathTracker(),
    ignore: {
      breaks: false,
      continues: false,
      labels: new Set(),
      returnYield: false
    },
    includedLabels: new Set(),
    instantiated: new DiscriminatedPathTracker(),
    replacedVariableInits: new Map()
  };
}
function skipThrough(node, st, c) {
  c(node, st);
}
function ignore(_node, _st, _c) {
}
function handlePureAnnotationsOfNode(node, state, type = node.type) {
  const { annotations } = state;
  let comment = annotations[state.annotationIndex];
  while (comment && node.start >= comment.end) {
    markPureNode(node, comment, state.code);
    comment = annotations[++state.annotationIndex];
  }
  if (comment && comment.end <= node.end) {
    base$1[type](node, state, handlePureAnnotationsOfNode);
    while ((comment = annotations[state.annotationIndex]) && comment.end <= node.end) {
      ++state.annotationIndex;
      annotateNode(node, comment, false);
    }
  }
}
function markPureNode(node, comment, code) {
  const annotatedNodes = [];
  let invalidAnnotation;
  const codeInBetween = code.slice(comment.end, node.start);
  if (doesNotMatchOutsideComment(codeInBetween, neitherWithespaceNorBrackets)) {
    const parentStart = node.start;
    while (true) {
      annotatedNodes.push(node);
      switch (node.type) {
        case ExpressionStatement$1:
        case ChainExpression$1:
          node = node.expression;
          continue;
        case SequenceExpression$1:
          if (doesNotMatchOutsideComment(code.slice(parentStart, node.start), noWhitespace)) {
            node = node.expressions[0];
            continue;
          }
          invalidAnnotation = true;
          break;
        case ConditionalExpression$1:
          if (doesNotMatchOutsideComment(code.slice(parentStart, node.start), noWhitespace)) {
            node = node.test;
            continue;
          }
          invalidAnnotation = true;
          break;
        case LogicalExpression$1:
        case BinaryExpression$1:
          if (doesNotMatchOutsideComment(code.slice(parentStart, node.start), noWhitespace)) {
            node = node.left;
            continue;
          }
          invalidAnnotation = true;
          break;
        case CallExpression$1:
        case NewExpression$1:
          break;
        default:
          invalidAnnotation = true;
      }
      break;
    }
  } else {
    invalidAnnotation = true;
  }
  if (invalidAnnotation) {
    annotateNode(node, comment, false);
  } else {
    for (const node2 of annotatedNodes) {
      annotateNode(node2, comment, true);
    }
  }
}
function doesNotMatchOutsideComment(code, forbiddenChars) {
  let nextMatch;
  while ((nextMatch = forbiddenChars.exec(code)) !== null) {
    if (nextMatch[0] === "/") {
      const charCodeAfterSlash = code.charCodeAt(forbiddenChars.lastIndex);
      if (charCodeAfterSlash === 42) {
        forbiddenChars.lastIndex = code.indexOf("*/", forbiddenChars.lastIndex + 1) + 2;
        continue;
      } else if (charCodeAfterSlash === 47) {
        forbiddenChars.lastIndex = code.indexOf("\n", forbiddenChars.lastIndex + 1) + 1;
        continue;
      }
    }
    forbiddenChars.lastIndex = 0;
    return false;
  }
  return true;
}
function addAnnotations(comments, esTreeAst, code) {
  const annotations = [];
  const sourceMappingComments = [];
  for (const comment of comments) {
    if (pureCommentRegex.test(comment.value)) {
      annotations.push(comment);
    } else if (SOURCEMAPPING_URL_RE.test(comment.value)) {
      sourceMappingComments.push(comment);
    }
  }
  for (const comment of sourceMappingComments) {
    annotateNode(esTreeAst, comment, false);
  }
  handlePureAnnotationsOfNode(esTreeAst, {
    annotationIndex: 0,
    annotations,
    code
  });
}
function annotateNode(node, comment, valid) {
  const key = valid ? ANNOTATION_KEY : INVALID_COMMENT_KEY;
  const property2 = node[key];
  if (property2) {
    property2.push(comment);
  } else {
    node[key] = [comment];
  }
}
function getAndCreateKeys(esTreeNode) {
  keys[esTreeNode.type] = Object.keys(esTreeNode).filter((key) => typeof esTreeNode[key] === "object" && key.charCodeAt(0) !== 95);
  return keys[esTreeNode.type];
}
function treeshakeNode(node, code, start, end) {
  code.remove(start, end);
  if (node.annotations) {
    for (const annotation of node.annotations) {
      if (annotation.start < start) {
        code.remove(annotation.start, annotation.end);
      } else {
        return;
      }
    }
  }
}
function removeAnnotations(node, code) {
  if (!node.annotations && node.parent.type === ExpressionStatement$1) {
    node = node.parent;
  }
  if (node.annotations) {
    for (const annotation of node.annotations) {
      code.remove(annotation.start, annotation.end);
    }
  }
}
function findFirstOccurrenceOutsideComment(code, searchString, start = 0) {
  let searchPos, charCodeAfterSlash;
  searchPos = code.indexOf(searchString, start);
  while (true) {
    start = code.indexOf("/", start);
    if (start === -1 || start >= searchPos)
      return searchPos;
    charCodeAfterSlash = code.charCodeAt(++start);
    ++start;
    start = charCodeAfterSlash === 47 ? code.indexOf("\n", start) + 1 : code.indexOf("*/", start) + 2;
    if (start > searchPos) {
      searchPos = code.indexOf(searchString, start);
    }
  }
}
function findNonWhiteSpace(code, index) {
  NON_WHITESPACE.lastIndex = index;
  const result = NON_WHITESPACE.exec(code);
  return result.index;
}
function findFirstLineBreakOutsideComment(code) {
  let lineBreakPos, charCodeAfterSlash, start = 0;
  lineBreakPos = code.indexOf("\n", start);
  while (true) {
    start = code.indexOf("/", start);
    if (start === -1 || start > lineBreakPos)
      return [lineBreakPos, lineBreakPos + 1];
    charCodeAfterSlash = code.charCodeAt(start + 1);
    if (charCodeAfterSlash === 47)
      return [start, lineBreakPos + 1];
    start = code.indexOf("*/", start + 3) + 2;
    if (start > lineBreakPos) {
      lineBreakPos = code.indexOf("\n", start);
    }
  }
}
function renderStatementList(statements, code, start, end, options) {
  let currentNode, currentNodeStart, currentNodeNeedsBoundaries, nextNodeStart;
  let nextNode = statements[0];
  let nextNodeNeedsBoundaries = !nextNode.included || nextNode.needsBoundaries;
  if (nextNodeNeedsBoundaries) {
    nextNodeStart = start + findFirstLineBreakOutsideComment(code.original.slice(start, nextNode.start))[1];
  }
  for (let nextIndex2 = 1; nextIndex2 <= statements.length; nextIndex2++) {
    currentNode = nextNode;
    currentNodeStart = nextNodeStart;
    currentNodeNeedsBoundaries = nextNodeNeedsBoundaries;
    nextNode = statements[nextIndex2];
    nextNodeNeedsBoundaries = nextNode === void 0 ? false : !nextNode.included || nextNode.needsBoundaries;
    if (currentNodeNeedsBoundaries || nextNodeNeedsBoundaries) {
      nextNodeStart = currentNode.end + findFirstLineBreakOutsideComment(code.original.slice(currentNode.end, nextNode === void 0 ? end : nextNode.start))[1];
      if (currentNode.included) {
        currentNodeNeedsBoundaries ? currentNode.render(code, options, {
          end: nextNodeStart,
          start: currentNodeStart
        }) : currentNode.render(code, options);
      } else {
        treeshakeNode(currentNode, code, currentNodeStart, nextNodeStart);
      }
    } else {
      currentNode.render(code, options);
    }
  }
}
function getCommaSeparatedNodesWithBoundaries(nodes, code, start, end) {
  const splitUpNodes = [];
  let node, nextNode, nextNodeStart, contentEnd, char;
  let separator = start - 1;
  for (let nextIndex2 = 0; nextIndex2 < nodes.length; nextIndex2++) {
    nextNode = nodes[nextIndex2];
    if (node !== void 0) {
      separator = node.end + findFirstOccurrenceOutsideComment(code.original.slice(node.end, nextNode.start), ",");
    }
    nextNodeStart = contentEnd = separator + 1 + findFirstLineBreakOutsideComment(code.original.slice(separator + 1, nextNode.start))[1];
    while (char = code.original.charCodeAt(nextNodeStart), char === 32 || char === 9 || char === 10 || char === 13)
      nextNodeStart++;
    if (node !== void 0) {
      splitUpNodes.push({
        contentEnd,
        end: nextNodeStart,
        node,
        separator,
        start
      });
    }
    node = nextNode;
    start = nextNodeStart;
  }
  splitUpNodes.push({
    contentEnd: end,
    end,
    node,
    separator: null,
    start
  });
  return splitUpNodes;
}
function removeLineBreaks(code, start, end) {
  while (true) {
    const [removeStart, removeEnd] = findFirstLineBreakOutsideComment(code.original.slice(start, end));
    if (removeStart === -1) {
      break;
    }
    code.remove(start + removeStart, start += removeEnd);
  }
}
function getSystemExportStatement(exportedVariables, { compact, exportNamesByVariable }, modifier = "") {
  const _ = compact ? "" : " ";
  if (exportedVariables.length === 1 && exportNamesByVariable.get(exportedVariables[0]).length === 1) {
    const variable = exportedVariables[0];
    return `exports('${exportNamesByVariable.get(variable)}',${_}${variable.getName()}${modifier})`;
  } else {
    return `exports({${_}${exportedVariables.map((variable) => {
      return exportNamesByVariable.get(variable).map((exportName) => `${exportName}:${_}${variable.getName()}${modifier}`).join(`,${_}`);
    }).join(`,${_}`)}${_}})`;
  }
}
function renderSystemExportExpression(exportedVariable, expressionStart, expressionEnd, code, { compact, exportNamesByVariable }) {
  const _ = compact ? "" : " ";
  code.prependRight(expressionStart, `exports('${exportNamesByVariable.get(exportedVariable)}',${_}`);
  code.appendLeft(expressionEnd, ")");
}
function renderSystemExportFunction(exportedVariables, expressionStart, expressionEnd, needsParens, code, options) {
  const _ = options.compact ? "" : " ";
  const s = options.compact ? "" : ";";
  code.prependRight(expressionStart, `function${_}(v)${_}{${_}return ${getSystemExportStatement(exportedVariables, options)},${_}v${s}${_}}(`);
  code.appendLeft(expressionEnd, ")");
  if (needsParens) {
    code.prependRight(expressionStart, "(");
    code.appendLeft(expressionEnd, ")");
  }
}
function renderSystemExportSequenceAfterExpression(exportedVariable, expressionStart, expressionEnd, needsParens, code, options) {
  const _ = options.compact ? "" : " ";
  code.appendLeft(expressionEnd, `,${_}${getSystemExportStatement([exportedVariable], options)},${_}${exportedVariable.getName()}`);
  if (needsParens) {
    code.prependRight(expressionStart, "(");
    code.appendLeft(expressionEnd, ")");
  }
}
function renderSystemExportSequenceBeforeExpression(exportedVariable, expressionStart, expressionEnd, needsParens, code, options, modifier) {
  const _ = options.compact ? "" : " ";
  code.prependRight(expressionStart, `${getSystemExportStatement([exportedVariable], options, modifier)},${_}`);
  if (needsParens) {
    code.prependRight(expressionStart, "(");
    code.appendLeft(expressionEnd, ")");
  }
}
function toBase64(num) {
  let outStr = "";
  do {
    const curDigit = num % base;
    num = Math.floor(num / base);
    outStr = chars[curDigit] + outStr;
  } while (num !== 0);
  return outStr;
}
function getSafeName(baseName, usedNames) {
  let safeName = baseName;
  let count = 1;
  while (usedNames.has(safeName) || RESERVED_NAMES[safeName]) {
    safeName = `${baseName}$${toBase64(count++)}`;
  }
  usedNames.add(safeName);
  return safeName;
}
function assembleMemberDescriptions(memberDescriptions, inheritedDescriptions = null) {
  return Object.create(inheritedDescriptions, memberDescriptions);
}
function getLiteralMembersForValue(value) {
  switch (typeof value) {
    case "boolean":
      return literalBooleanMembers;
    case "number":
      return literalNumberMembers;
    case "string":
      return literalStringMembers;
    default:
      return Object.create(null);
  }
}
function hasMemberEffectWhenCalled(members, memberName, callOptions, context) {
  if (typeof memberName !== "string" || !members[memberName]) {
    return true;
  }
  if (!members[memberName].callsArgs)
    return false;
  for (const argIndex of members[memberName].callsArgs) {
    if (callOptions.args[argIndex] && callOptions.args[argIndex].hasEffectsWhenCalledAtPath(EMPTY_PATH, {
      args: NO_ARGS,
      thisParam: null,
      withNew: false
    }, context))
      return true;
  }
  return false;
}
function getMemberReturnExpressionWhenCalled(members, memberName) {
  if (typeof memberName !== "string" || !members[memberName])
    return UNKNOWN_EXPRESSION;
  return members[memberName].returns;
}
function is_reference(node, parent) {
  if (node.type === "MemberExpression") {
    return !node.computed && is_reference(node.object, node);
  }
  if (node.type === "Identifier") {
    if (!parent)
      return true;
    switch (parent.type) {
      case "MemberExpression":
        return parent.computed || node === parent.object;
      case "MethodDefinition":
        return parent.computed;
      case "PropertyDefinition":
        return parent.computed || node === parent.value;
      case "Property":
        return parent.computed || node === parent.value;
      case "ExportSpecifier":
      case "ImportSpecifier":
        return node === parent.local;
      case "LabeledStatement":
      case "BreakStatement":
      case "ContinueStatement":
        return false;
      default:
        return true;
    }
  }
  return false;
}
function getGlobalAtPath(path) {
  let currentGlobal = knownGlobals;
  for (const pathSegment of path) {
    if (typeof pathSegment !== "string") {
      return null;
    }
    currentGlobal = currentGlobal[pathSegment];
    if (!currentGlobal) {
      return null;
    }
  }
  return currentGlobal[ValueProperties];
}
function isPureGlobal(path) {
  const globalAtPath = getGlobalAtPath(path);
  return globalAtPath !== null && globalAtPath.pure;
}
function isGlobalMember(path) {
  if (path.length === 1) {
    return path[0] === "undefined" || getGlobalAtPath(path) !== null;
  }
  return getGlobalAtPath(path.slice(0, -1)) !== null;
}
function closestParentFunctionOrProgram(node) {
  while (node && !/^Program|Function/.test(node.type)) {
    node = node.parent;
  }
  return node;
}
function getDeclarationStart(code, start) {
  return findNonWhiteSpace(code, findFirstOccurrenceOutsideComment(code, "default", start) + 7);
}
function getIdInsertPosition(code, declarationKeyword, endMarker, start) {
  const declarationEnd = findFirstOccurrenceOutsideComment(code, declarationKeyword, start) + declarationKeyword.length;
  code = code.slice(declarationEnd, findFirstOccurrenceOutsideComment(code, endMarker, declarationEnd));
  const generatorStarPos = findFirstOccurrenceOutsideComment(code, "*");
  if (generatorStarPos === -1) {
    return declarationEnd;
  }
  return declarationEnd + generatorStarPos + 1;
}
function isReassignedExportsMember(variable, exportNamesByVariable) {
  return variable.renderBaseName !== null && exportNamesByVariable.has(variable) && variable.isReassigned;
}
function areAllDeclarationsIncludedAndNotExported(declarations, exportNamesByVariable) {
  for (const declarator of declarations) {
    if (!declarator.id.included)
      return false;
    if (declarator.id.type === Identifier$1) {
      if (exportNamesByVariable.has(declarator.id.variable))
        return false;
    } else {
      const exportedVariables = [];
      declarator.id.addExportedVariables(exportedVariables, exportNamesByVariable);
      if (exportedVariables.length > 0)
        return false;
    }
  }
  return true;
}
function gatherSystemExportsAndGetSingleExport(separatedNodes, options, aggregatedSystemExports) {
  var _a;
  let singleSystemExport = null;
  if (options.format === "system") {
    for (const { node } of separatedNodes) {
      if (node.id instanceof Identifier && node.init && aggregatedSystemExports.length === 0 && ((_a = options.exportNamesByVariable.get(node.id.variable)) === null || _a === void 0 ? void 0 : _a.length) === 1) {
        singleSystemExport = node.id.variable;
        aggregatedSystemExports.push(singleSystemExport);
      } else {
        node.id.addExportedVariables(aggregatedSystemExports, options.exportNamesByVariable);
      }
    }
    if (aggregatedSystemExports.length > 1) {
      singleSystemExport = null;
    } else if (singleSystemExport) {
      aggregatedSystemExports.length = 0;
    }
  }
  return singleSystemExport;
}
function getResolvablePropertyKey(memberExpression) {
  return memberExpression.computed ? getResolvableComputedPropertyKey(memberExpression.property) : memberExpression.property.name;
}
function getResolvableComputedPropertyKey(propertyKey) {
  if (propertyKey instanceof Literal) {
    return String(propertyKey.value);
  }
  return null;
}
function getPathIfNotComputed(memberExpression) {
  const nextPathKey = memberExpression.propertyKey;
  const object = memberExpression.object;
  if (typeof nextPathKey === "string") {
    if (object instanceof Identifier) {
      return [
        { key: object.name, pos: object.start },
        { key: nextPathKey, pos: memberExpression.property.start }
      ];
    }
    if (object instanceof MemberExpression) {
      const parentPath = getPathIfNotComputed(object);
      return parentPath && [...parentPath, { key: nextPathKey, pos: memberExpression.property.start }];
    }
  }
  return null;
}
function getStringFromPath(path) {
  let pathString = path[0].key;
  for (let index = 1; index < path.length; index++) {
    pathString += "." + path[index].key;
  }
  return pathString;
}
function isDefaultAProperty(interopType, externalLiveBindings) {
  return interopType === "esModule" || externalLiveBindings && (interopType === "auto" || interopType === "true");
}
function canDefaultBeTakenFromNamespace(interopType, externalLiveBindings) {
  return isDefaultAProperty(interopType, externalLiveBindings) && defaultInteropHelpersByInteropType[interopType] === INTEROP_DEFAULT_VARIABLE;
}
function getDefaultOnlyHelper() {
  return INTEROP_NAMESPACE_DEFAULT_ONLY_VARIABLE;
}
function getHelpersBlock(usedHelpers, accessedGlobals, _, n2, s, t, liveBindings, freeze, namespaceToStringTag) {
  return HELPER_NAMES.map((variable) => usedHelpers.has(variable) || accessedGlobals.has(variable) ? HELPER_GENERATORS[variable](_, n2, s, t, liveBindings, freeze, namespaceToStringTag, usedHelpers) : "").join("");
}
function getDefaultLiveBinding(_) {
  return `e${_}:${_}{${_}'default':${_}e${_}}`;
}
function getDefaultStatic(_) {
  return `e['default']${_}:${_}e`;
}
function createNamespaceObject(_, n2, t, i, liveBindings, freeze, namespaceToStringTag) {
  return `${i}var n${_}=${_}${namespaceToStringTag ? `{__proto__:${_}null,${_}[Symbol.toStringTag]:${_}'Module'}` : "Object.create(null)"};${n2}${i}if${_}(e)${_}{${n2}${i}${t}Object.keys(e).forEach(function${_}(k)${_}{${n2}` + (liveBindings ? copyPropertyLiveBinding : copyPropertyStatic)(_, n2, t, i + t + t) + `${i}${t}});${n2}${i}}${n2}${i}n['default']${_}=${_}e;${n2}${i}return ${getFrozen("n", freeze)};${n2}`;
}
function copyPropertyLiveBinding(_, n2, t, i) {
  return `${i}if${_}(k${_}!==${_}'default')${_}{${n2}${i}${t}var d${_}=${_}Object.getOwnPropertyDescriptor(e,${_}k);${n2}${i}${t}Object.defineProperty(n,${_}k,${_}d.get${_}?${_}d${_}:${_}{${n2}${i}${t}${t}enumerable:${_}true,${n2}${i}${t}${t}get:${_}function${_}()${_}{${n2}${i}${t}${t}${t}return e[k];${n2}${i}${t}${t}}${n2}${i}${t}});${n2}${i}}${n2}`;
}
function copyPropertyStatic(_, n2, _t, i) {
  return `${i}n[k]${_}=${_}e[k];${n2}`;
}
function getFrozen(fragment, freeze) {
  return freeze ? `Object.freeze(${fragment})` : fragment;
}
function getInteropHelper(resolution, exportMode, interop) {
  return exportMode === "external" ? namespaceInteropHelpersByInteropType[String(interop(resolution instanceof ExternalModule ? resolution.id : null))] : exportMode === "default" ? getDefaultOnlyHelper() : null;
}
function spaces(i) {
  let result = "";
  while (i--)
    result += " ";
  return result;
}
function tabsToSpaces(str) {
  return str.replace(/^\t+/, (match) => match.split("	").join("  "));
}
function getCodeFrame(source, line, column) {
  let lines = source.split("\n");
  const frameStart = Math.max(0, line - 3);
  let frameEnd = Math.min(line + 2, lines.length);
  lines = lines.slice(frameStart, frameEnd);
  while (!/\S/.test(lines[lines.length - 1])) {
    lines.pop();
    frameEnd -= 1;
  }
  const digits = String(frameEnd).length;
  return lines.map((str, i) => {
    const isErrorLine = frameStart + i + 1 === line;
    let lineNum = String(i + frameStart + 1);
    while (lineNum.length < digits)
      lineNum = ` ${lineNum}`;
    if (isErrorLine) {
      const indicator = spaces(digits + 2 + tabsToSpaces(str.slice(0, column)).length) + "^";
      return `${lineNum}: ${tabsToSpaces(str)}
${indicator}`;
    }
    return `${lineNum}: ${tabsToSpaces(str)}`;
  }).join("\n");
}
function error(base2) {
  if (!(base2 instanceof Error))
    base2 = Object.assign(new Error(base2.message), base2);
  throw base2;
}
function augmentCodeLocation(props, pos, source, id) {
  if (typeof pos === "object") {
    const { line, column } = pos;
    props.loc = { column, file: id, line };
  } else {
    props.pos = pos;
    const { line, column } = locate(source, pos, { offsetLine: 1 });
    props.loc = { column, file: id, line };
  }
  if (props.frame === void 0) {
    const { line, column } = props.loc;
    props.frame = getCodeFrame(source, line, column);
  }
}
function errAssetNotFinalisedForFileName(name) {
  return {
    code: Errors.ASSET_NOT_FINALISED,
    message: `Plugin error - Unable to get file name for asset "${name}". Ensure that the source is set and that generate is called first.`
  };
}
function errCannotEmitFromOptionsHook() {
  return {
    code: Errors.CANNOT_EMIT_FROM_OPTIONS_HOOK,
    message: `Cannot emit files or set asset sources in the "outputOptions" hook, use the "renderStart" hook instead.`
  };
}
function errChunkNotGeneratedForFileName(name) {
  return {
    code: Errors.CHUNK_NOT_GENERATED,
    message: `Plugin error - Unable to get file name for chunk "${name}". Ensure that generate is called first.`
  };
}
function errChunkInvalid({ fileName, code }, exception) {
  const errorProps = {
    code: Errors.CHUNK_INVALID,
    message: `Chunk "${fileName}" is not valid JavaScript: ${exception.message}.`
  };
  augmentCodeLocation(errorProps, exception.loc, code, fileName);
  return errorProps;
}
function errCircularReexport(exportName, importedModule) {
  return {
    code: Errors.CIRCULAR_REEXPORT,
    id: importedModule,
    message: `"${exportName}" cannot be exported from ${relativeId(importedModule)} as it is a reexport that references itself.`
  };
}
function errCyclicCrossChunkReexport(exportName, exporter, reexporter, importer) {
  return {
    code: Errors.CYCLIC_CROSS_CHUNK_REEXPORT,
    exporter,
    importer,
    message: `Export "${exportName}" of module ${relativeId(exporter)} was reexported through module ${relativeId(reexporter)} while both modules are dependencies of each other and will end up in different chunks by current Rollup settings. This scenario is not well supported at the moment as it will produce a circular dependency between chunks and will likely lead to broken execution order.
Either change the import in ${relativeId(importer)} to point directly to the exporting module or do not use "preserveModules" to ensure these modules end up in the same chunk.`,
    reexporter
  };
}
function errAssetReferenceIdNotFoundForSetSource(assetReferenceId) {
  return {
    code: Errors.ASSET_NOT_FOUND,
    message: `Plugin error - Unable to set the source for unknown asset "${assetReferenceId}".`
  };
}
function errAssetSourceAlreadySet(name) {
  return {
    code: Errors.ASSET_SOURCE_ALREADY_SET,
    message: `Unable to set the source for asset "${name}", source already set.`
  };
}
function errNoAssetSourceSet(assetName) {
  return {
    code: Errors.ASSET_SOURCE_MISSING,
    message: `Plugin error creating asset "${assetName}" - no asset source set.`
  };
}
function errBadLoader(id) {
  return {
    code: Errors.BAD_LOADER,
    message: `Error loading ${relativeId(id)}: plugin load hook should return a string, a { code, map } object, or nothing/null`
  };
}
function errDeprecation(deprecation) {
  return __spreadValues({
    code: Errors.DEPRECATED_FEATURE
  }, typeof deprecation === "string" ? { message: deprecation } : deprecation);
}
function errFileReferenceIdNotFoundForFilename(assetReferenceId) {
  return {
    code: Errors.FILE_NOT_FOUND,
    message: `Plugin error - Unable to get file name for unknown file "${assetReferenceId}".`
  };
}
function errFileNameConflict(fileName) {
  return {
    code: Errors.FILE_NAME_CONFLICT,
    message: `The emitted file "${fileName}" overwrites a previously emitted file of the same name.`
  };
}
function errInputHookInOutputPlugin(pluginName, hookName) {
  return {
    code: Errors.INPUT_HOOK_IN_OUTPUT_PLUGIN,
    message: `The "${hookName}" hook used by the output plugin ${pluginName} is a build time hook and will not be run for that plugin. Either this plugin cannot be used as an output plugin, or it should have an option to configure it as an output plugin.`
  };
}
function errCannotAssignModuleToChunk(moduleId, assignToAlias, currentAlias) {
  return {
    code: Errors.INVALID_CHUNK,
    message: `Cannot assign ${relativeId(moduleId)} to the "${assignToAlias}" chunk as it is already in the "${currentAlias}" chunk.`
  };
}
function errInvalidExportOptionValue(optionValue) {
  return {
    code: Errors.INVALID_EXPORT_OPTION,
    message: `"output.exports" must be "default", "named", "none", "auto", or left unspecified (defaults to "auto"), received "${optionValue}"`,
    url: `https://rollupjs.org/guide/en/#outputexports`
  };
}
function errIncompatibleExportOptionValue(optionValue, keys2, entryModule) {
  return {
    code: "INVALID_EXPORT_OPTION",
    message: `"${optionValue}" was specified for "output.exports", but entry module "${relativeId(entryModule)}" has the following exports: ${keys2.join(", ")}`
  };
}
function errInternalIdCannotBeExternal(source, importer) {
  return {
    code: Errors.INVALID_EXTERNAL_ID,
    message: `'${source}' is imported as an external by ${relativeId(importer)}, but is already an existing non-external module id.`
  };
}
function errInvalidOption(option, explanation) {
  return {
    code: Errors.INVALID_OPTION,
    message: `Invalid value for option "${option}" - ${explanation}.`
  };
}
function errInvalidRollupPhaseForAddWatchFile() {
  return {
    code: Errors.INVALID_ROLLUP_PHASE,
    message: `Cannot call addWatchFile after the build has finished.`
  };
}
function errInvalidRollupPhaseForChunkEmission() {
  return {
    code: Errors.INVALID_ROLLUP_PHASE,
    message: `Cannot emit chunks after module loading has finished.`
  };
}
function errMissingExport(exportName, importingModule, importedModule) {
  return {
    code: Errors.MISSING_EXPORT,
    message: `'${exportName}' is not exported by ${relativeId(importedModule)}, imported by ${relativeId(importingModule)}`,
    url: `https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module`
  };
}
function errImplicitDependantCannotBeExternal(unresolvedId, implicitlyLoadedBefore) {
  return {
    code: Errors.MISSING_IMPLICIT_DEPENDANT,
    message: `Module "${relativeId(unresolvedId)}" that should be implicitly loaded before "${relativeId(implicitlyLoadedBefore)}" cannot be external.`
  };
}
function errUnresolvedImplicitDependant(unresolvedId, implicitlyLoadedBefore) {
  return {
    code: Errors.MISSING_IMPLICIT_DEPENDANT,
    message: `Module "${relativeId(unresolvedId)}" that should be implicitly loaded before "${relativeId(implicitlyLoadedBefore)}" could not be resolved.`
  };
}
function errImplicitDependantIsNotIncluded(module2) {
  const implicitDependencies = Array.from(module2.implicitlyLoadedBefore, (dependency) => relativeId(dependency.id)).sort();
  return {
    code: Errors.MISSING_IMPLICIT_DEPENDANT,
    message: `Module "${relativeId(module2.id)}" that should be implicitly loaded before ${printQuotedStringList(implicitDependencies)} is not included in the module graph. Either it was not imported by an included module or only via a tree-shaken dynamic import, or no imported bindings were used and it had otherwise no side-effects.`
  };
}
function errMixedExport(facadeModuleId, name) {
  return {
    code: Errors.MIXED_EXPORTS,
    id: facadeModuleId,
    message: `Entry module "${relativeId(facadeModuleId)}" is using named and default exports together. Consumers of your bundle will have to use \`${name || "chunk"}["default"]\` to access the default export, which may not be what you want. Use \`output.exports: "named"\` to disable this warning`,
    url: `https://rollupjs.org/guide/en/#outputexports`
  };
}
function errNamespaceConflict(name, reexportingModule, additionalExportAllModule) {
  return {
    code: Errors.NAMESPACE_CONFLICT,
    message: `Conflicting namespaces: "${relativeId(reexportingModule.id)}" re-exports "${name}" from both "${relativeId(reexportingModule.exportsAll[name])}" and "${relativeId(additionalExportAllModule.exportsAll[name])}" (will be ignored)`,
    name,
    reexporter: reexportingModule.id,
    sources: [reexportingModule.exportsAll[name], additionalExportAllModule.exportsAll[name]]
  };
}
function errAmbiguousExternalNamespaces(name, reexportingModule, usedExternalModule, externalModules) {
  return {
    code: Errors.AMBIGUOUS_EXTERNAL_NAMESPACES,
    message: `Ambiguous external namespace resolution: "${relativeId(reexportingModule)}" re-exports "${name}" from one of the external modules ${printQuotedStringList(externalModules.map((module2) => relativeId(module2)))}, guessing "${relativeId(usedExternalModule)}".`,
    name,
    reexporter: reexportingModule,
    sources: externalModules
  };
}
function errNoTransformMapOrAstWithoutCode(pluginName) {
  return {
    code: Errors.NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE,
    message: `The plugin "${pluginName}" returned a "map" or "ast" without returning a "code". This will be ignored.`
  };
}
function errPreferNamedExports(facadeModuleId) {
  const file = relativeId(facadeModuleId);
  return {
    code: Errors.PREFER_NAMED_EXPORTS,
    id: facadeModuleId,
    message: `Entry module "${file}" is implicitly using "default" export mode, which means for CommonJS output that its default export is assigned to "module.exports". For many tools, such CommonJS output will not be interchangeable with the original ES module. If this is intended, explicitly set "output.exports" to either "auto" or "default", otherwise you might want to consider changing the signature of "${file}" to use named exports only.`,
    url: `https://rollupjs.org/guide/en/#outputexports`
  };
}
function errSyntheticNamedExportsNeedNamespaceExport(id, syntheticNamedExportsOption) {
  return {
    code: Errors.SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT,
    id,
    message: `Module "${relativeId(id)}" that is marked with 'syntheticNamedExports: ${JSON.stringify(syntheticNamedExportsOption)}' needs ${typeof syntheticNamedExportsOption === "string" && syntheticNamedExportsOption !== "default" ? `an export named "${syntheticNamedExportsOption}"` : "a default export"} that does not reexport an unresolved named export of the same module.`
  };
}
function errUnexpectedNamedImport(id, imported, isReexport) {
  const importType = isReexport ? "reexport" : "import";
  return {
    code: Errors.UNEXPECTED_NAMED_IMPORT,
    id,
    message: `The named export "${imported}" was ${importType}ed from the external module ${relativeId(id)} even though its interop type is "defaultOnly". Either remove or change this ${importType} or change the value of the "output.interop" option.`,
    url: "https://rollupjs.org/guide/en/#outputinterop"
  };
}
function errUnexpectedNamespaceReexport(id) {
  return {
    code: Errors.UNEXPECTED_NAMED_IMPORT,
    id,
    message: `There was a namespace "*" reexport from the external module ${relativeId(id)} even though its interop type is "defaultOnly". This will be ignored as namespace reexports only reexport named exports. If this is not intended, either remove or change this reexport or change the value of the "output.interop" option.`,
    url: "https://rollupjs.org/guide/en/#outputinterop"
  };
}
function errEntryCannotBeExternal(unresolvedId) {
  return {
    code: Errors.UNRESOLVED_ENTRY,
    message: `Entry module cannot be external (${relativeId(unresolvedId)}).`
  };
}
function errUnresolvedEntry(unresolvedId) {
  return {
    code: Errors.UNRESOLVED_ENTRY,
    message: `Could not resolve entry module (${relativeId(unresolvedId)}).`
  };
}
function errUnresolvedImport(source, importer) {
  return {
    code: Errors.UNRESOLVED_IMPORT,
    message: `Could not resolve '${source}' from ${relativeId(importer)}`
  };
}
function errUnresolvedImportTreatedAsExternal(source, importer) {
  return {
    code: Errors.UNRESOLVED_IMPORT,
    importer: relativeId(importer),
    message: `'${source}' is imported by ${relativeId(importer)}, but could not be resolved \u2013 treating it as an external dependency`,
    source,
    url: "https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency"
  };
}
function errExternalSyntheticExports(source, importer) {
  return {
    code: Errors.EXTERNAL_SYNTHETIC_EXPORTS,
    importer: relativeId(importer),
    message: `External '${source}' can not have 'syntheticNamedExports' enabled.`,
    source
  };
}
function errFailedValidation(message) {
  return {
    code: Errors.VALIDATION_ERROR,
    message
  };
}
function errAlreadyClosed() {
  return {
    code: Errors.ALREADY_CLOSED,
    message: 'Bundle is already closed, no more calls to "generate" or "write" are allowed.'
  };
}
function warnDeprecation(deprecation, activeDeprecation, options) {
  warnDeprecationWithOptions(deprecation, activeDeprecation, options.onwarn, options.strictDeprecations);
}
function warnDeprecationWithOptions(deprecation, activeDeprecation, warn, strictDeprecations) {
  if (activeDeprecation || strictDeprecations) {
    const warning = errDeprecation(deprecation);
    if (strictDeprecations) {
      return error(warning);
    }
    warn(warning);
  }
}
function getId(m) {
  return m.id;
}
function getOriginalLocation(sourcemapChain, location) {
  const filteredSourcemapChain = sourcemapChain.filter((sourcemap) => sourcemap.mappings);
  while (filteredSourcemapChain.length > 0) {
    const sourcemap = filteredSourcemapChain.pop();
    const line = sourcemap.mappings[location.line - 1];
    let locationFound = false;
    if (line !== void 0) {
      for (const segment of line) {
        if (segment[0] >= location.column) {
          if (segment.length === 1)
            break;
          location = {
            column: segment[3],
            line: segment[2] + 1,
            name: segment.length === 5 ? sourcemap.names[segment[4]] : void 0,
            source: sourcemap.sources[segment[1]]
          };
          locationFound = true;
          break;
        }
      }
    }
    if (!locationFound) {
      throw new Error("Can't resolve original location of error.");
    }
  }
  return location;
}
function setTimeHelpers() {
  if (typeof process !== "undefined" && typeof process.hrtime === "function") {
    getStartTime = process.hrtime.bind(process);
    getElapsedTime = (previous) => normalizeHrTime(process.hrtime(previous));
  } else if (typeof performance !== "undefined" && typeof performance.now === "function") {
    getStartTime = () => [performance.now(), 0];
    getElapsedTime = (previous) => performance.now() - previous[0];
  }
  if (typeof process !== "undefined" && typeof process.memoryUsage === "function") {
    getMemory = () => process.memoryUsage().heapUsed;
  }
}
function getPersistedLabel(label, level) {
  switch (level) {
    case 1:
      return `# ${label}`;
    case 2:
      return `## ${label}`;
    case 3:
      return label;
    default:
      return `${"  ".repeat(level - 4)}- ${label}`;
  }
}
function timeStartImpl(label, level = 3) {
  label = getPersistedLabel(label, level);
  if (!timers.hasOwnProperty(label)) {
    timers[label] = {
      memory: 0,
      startMemory: void 0,
      startTime: void 0,
      time: 0,
      totalMemory: 0
    };
  }
  const currentMemory = getMemory();
  timers[label].startTime = getStartTime();
  timers[label].startMemory = currentMemory;
}
function timeEndImpl(label, level = 3) {
  label = getPersistedLabel(label, level);
  if (timers.hasOwnProperty(label)) {
    const currentMemory = getMemory();
    timers[label].time += getElapsedTime(timers[label].startTime);
    timers[label].totalMemory = Math.max(timers[label].totalMemory, currentMemory);
    timers[label].memory += currentMemory - timers[label].startMemory;
  }
}
function getTimings() {
  const newTimings = {};
  for (const [label, { time, memory, totalMemory }] of Object.entries(timers)) {
    newTimings[label] = [time, memory, totalMemory];
  }
  return newTimings;
}
function getPluginWithTimers(plugin, index) {
  const timedPlugin = {};
  for (const hook of Object.keys(plugin)) {
    if (TIMED_PLUGIN_HOOKS[hook] === true) {
      let timerLabel = `plugin ${index}`;
      if (plugin.name) {
        timerLabel += ` (${plugin.name})`;
      }
      timerLabel += ` - ${hook}`;
      timedPlugin[hook] = function(...args) {
        timeStart(timerLabel, 4);
        let result = plugin[hook].apply(this === timedPlugin ? plugin : this, args);
        timeEnd(timerLabel, 4);
        if (result && typeof result.then === "function") {
          timeStart(`${timerLabel} (async)`, 4);
          result = result.then((hookResult) => {
            timeEnd(`${timerLabel} (async)`, 4);
            return hookResult;
          });
        }
        return result;
      };
    } else {
      timedPlugin[hook] = plugin[hook];
    }
  }
  return timedPlugin;
}
function initialiseTimers(inputOptions) {
  if (inputOptions.perf) {
    timers = {};
    setTimeHelpers();
    timeStart = timeStartImpl;
    timeEnd = timeEndImpl;
    inputOptions.plugins = inputOptions.plugins.map(getPluginWithTimers);
  } else {
    timeStart = NOOP;
    timeEnd = NOOP;
  }
}
function markModuleAndImpureDependenciesAsExecuted(baseModule) {
  baseModule.isExecuted = true;
  const modules = [baseModule];
  const visitedModules = new Set();
  for (const module2 of modules) {
    for (const dependency of [...module2.dependencies, ...module2.implicitlyLoadedBefore]) {
      if (!(dependency instanceof ExternalModule) && !dependency.isExecuted && (dependency.info.hasModuleSideEffects || module2.implicitlyLoadedBefore.has(dependency)) && !visitedModules.has(dependency.id)) {
        dependency.isExecuted = true;
        visitedModules.add(dependency.id);
        modules.push(dependency);
      }
    }
  }
}
function getVariableForExportNameRecursive(target, name, importerForSideEffects, isExportAllSearch, searchedNamesAndModules = new Map(), skipExternalNamespaceReexports) {
  const searchedModules = searchedNamesAndModules.get(name);
  if (searchedModules) {
    if (searchedModules.has(target)) {
      return isExportAllSearch ? null : error(errCircularReexport(name, target.id));
    }
    searchedModules.add(target);
  } else {
    searchedNamesAndModules.set(name, new Set([target]));
  }
  return target.getVariableForExportName(name, {
    importerForSideEffects,
    isExportAllSearch,
    searchedNamesAndModules,
    skipExternalNamespaceReexports
  });
}
function getAndExtendSideEffectModules(variable, module2) {
  const sideEffectModules = getOrCreate(module2.sideEffectDependenciesByVariable, variable, () => new Set());
  let currentVariable = variable;
  const referencedVariables = new Set([currentVariable]);
  while (true) {
    const importingModule = currentVariable.module;
    currentVariable = currentVariable instanceof ExportDefaultVariable ? currentVariable.getDirectOriginalVariable() : currentVariable instanceof SyntheticNamedExportVariable ? currentVariable.syntheticNamespace : null;
    if (!currentVariable || referencedVariables.has(currentVariable)) {
      break;
    }
    referencedVariables.add(currentVariable);
    sideEffectModules.add(importingModule);
    const originalSideEffects = importingModule.sideEffectDependenciesByVariable.get(currentVariable);
    if (originalSideEffects) {
      for (const module3 of originalSideEffects) {
        sideEffectModules.add(module3);
      }
    }
  }
  return sideEffectModules;
}
function setAlternativeExporterIfCyclic(variable, importer, reexporter) {
  if (variable.module instanceof Module && variable.module !== reexporter) {
    const exporterCycles = variable.module.cycles;
    if (exporterCycles.size > 0) {
      const importerCycles = reexporter.cycles;
      for (const cycleSymbol of importerCycles) {
        if (exporterCycles.has(cycleSymbol)) {
          importer.alternativeReexportModules.set(variable, reexporter);
          break;
        }
      }
    }
  }
}
function removeJsExtension(name) {
  return name.endsWith(".js") ? name.slice(0, -3) : name;
}
function getCompleteAmdId(options, chunkId) {
  if (!options.autoId) {
    return options.id || "";
  } else {
    return `${options.basePath ? options.basePath + "/" : ""}${removeJsExtension(chunkId)}`;
  }
}
function getExportBlock$1(exports, dependencies, namedExportsMode, interop, compact, t, externalLiveBindings, mechanism = "return ") {
  const _ = compact ? "" : " ";
  const n2 = compact ? "" : "\n";
  if (!namedExportsMode) {
    return `${n2}${n2}${mechanism}${getSingleDefaultExport(exports, dependencies, interop, externalLiveBindings)};`;
  }
  let exportBlock = "";
  for (const { defaultVariableName, id, isChunk, name, namedExportsMode: depNamedExportsMode, namespaceVariableName, reexports } of dependencies) {
    if (reexports && namedExportsMode) {
      for (const specifier of reexports) {
        if (specifier.reexported !== "*") {
          const importName = getReexportedImportName(name, specifier.imported, depNamedExportsMode, isChunk, defaultVariableName, namespaceVariableName, interop, id, externalLiveBindings);
          if (exportBlock)
            exportBlock += n2;
          exportBlock += specifier.imported !== "*" && specifier.needsLiveBinding ? `Object.defineProperty(exports,${_}'${specifier.reexported}',${_}{${n2}${t}enumerable:${_}true,${n2}${t}get:${_}function${_}()${_}{${n2}${t}${t}return ${importName};${n2}${t}}${n2}});` : `exports.${specifier.reexported}${_}=${_}${importName};`;
        }
      }
    }
  }
  for (const { exported, local } of exports) {
    const lhs = `exports${RESERVED_NAMES[exported] ? `['${exported}']` : `.${exported}`}`;
    const rhs = local;
    if (lhs !== rhs) {
      if (exportBlock)
        exportBlock += n2;
      exportBlock += `${lhs}${_}=${_}${rhs};`;
    }
  }
  for (const { name, reexports } of dependencies) {
    if (reexports && namedExportsMode) {
      for (const specifier of reexports) {
        if (specifier.reexported === "*") {
          if (exportBlock)
            exportBlock += n2;
          if (specifier.needsLiveBinding) {
            exportBlock += `Object.keys(${name}).forEach(function${_}(k)${_}{${n2}${t}if${_}(k${_}!==${_}'default'${_}&&${_}!exports.hasOwnProperty(k))${_}Object.defineProperty(exports,${_}k,${_}{${n2}${t}${t}enumerable:${_}true,${n2}${t}${t}get:${_}function${_}()${_}{${n2}${t}${t}${t}return ${name}[k];${n2}${t}${t}}${n2}${t}});${n2}});`;
          } else {
            exportBlock += `Object.keys(${name}).forEach(function${_}(k)${_}{${n2}${t}if${_}(k${_}!==${_}'default'${_}&&${_}!exports.hasOwnProperty(k))${_}exports[k]${_}=${_}${name}[k];${n2}});`;
          }
        }
      }
    }
  }
  if (exportBlock) {
    return `${n2}${n2}${exportBlock}`;
  }
  return "";
}
function getSingleDefaultExport(exports, dependencies, interop, externalLiveBindings) {
  if (exports.length > 0) {
    return exports[0].local;
  } else {
    for (const { defaultVariableName, id, isChunk, name, namedExportsMode: depNamedExportsMode, namespaceVariableName, reexports } of dependencies) {
      if (reexports) {
        return getReexportedImportName(name, reexports[0].imported, depNamedExportsMode, isChunk, defaultVariableName, namespaceVariableName, interop, id, externalLiveBindings);
      }
    }
  }
}
function getReexportedImportName(moduleVariableName, imported, depNamedExportsMode, isChunk, defaultVariableName, namespaceVariableName, interop, moduleId, externalLiveBindings) {
  if (imported === "default") {
    if (!isChunk) {
      const moduleInterop = String(interop(moduleId));
      const variableName = defaultInteropHelpersByInteropType[moduleInterop] ? defaultVariableName : moduleVariableName;
      return isDefaultAProperty(moduleInterop, externalLiveBindings) ? `${variableName}['default']` : variableName;
    }
    return depNamedExportsMode ? `${moduleVariableName}['default']` : moduleVariableName;
  }
  if (imported === "*") {
    return (isChunk ? !depNamedExportsMode : namespaceInteropHelpersByInteropType[String(interop(moduleId))]) ? namespaceVariableName : moduleVariableName;
  }
  return `${moduleVariableName}.${imported}`;
}
function getEsModuleExport(_) {
  return `Object.defineProperty(exports,${_}'__esModule',${_}{${_}value:${_}true${_}});`;
}
function getNamespaceToStringExport(_) {
  return `exports[Symbol.toStringTag]${_}=${_}'Module';`;
}
function getNamespaceMarkers(hasNamedExports, addEsModule, addNamespaceToStringTag, _, n2) {
  let namespaceMarkers = "";
  if (hasNamedExports) {
    if (addEsModule) {
      namespaceMarkers += getEsModuleExport(_);
    }
    if (addNamespaceToStringTag) {
      if (namespaceMarkers) {
        namespaceMarkers += n2;
      }
      namespaceMarkers += getNamespaceToStringExport(_);
    }
  }
  return namespaceMarkers;
}
function getInteropBlock(dependencies, varOrConst, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, _, n2, s, t) {
  const neededInteropHelpers = new Set();
  const interopStatements = [];
  const addInteropStatement = (helperVariableName, helper, dependencyVariableName) => {
    neededInteropHelpers.add(helper);
    interopStatements.push(`${varOrConst} ${helperVariableName}${_}=${_}/*#__PURE__*/${helper}(${dependencyVariableName});`);
  };
  for (const { defaultVariableName, imports, id, isChunk, name, namedExportsMode, namespaceVariableName, reexports } of dependencies) {
    if (isChunk) {
      for (const { imported, reexported } of [
        ...imports || [],
        ...reexports || []
      ]) {
        if (imported === "*" && reexported !== "*") {
          if (!namedExportsMode) {
            addInteropStatement(namespaceVariableName, getDefaultOnlyHelper(), name);
          }
          break;
        }
      }
    } else {
      const moduleInterop = String(interop(id));
      let hasDefault = false;
      let hasNamespace = false;
      for (const { imported, reexported } of [
        ...imports || [],
        ...reexports || []
      ]) {
        let helper;
        let variableName;
        if (imported === "default") {
          if (!hasDefault) {
            hasDefault = true;
            if (defaultVariableName !== namespaceVariableName) {
              variableName = defaultVariableName;
              helper = defaultInteropHelpersByInteropType[moduleInterop];
            }
          }
        } else if (imported === "*" && reexported !== "*") {
          if (!hasNamespace) {
            hasNamespace = true;
            helper = namespaceInteropHelpersByInteropType[moduleInterop];
            variableName = namespaceVariableName;
          }
        }
        if (helper) {
          addInteropStatement(variableName, helper, name);
        }
      }
    }
  }
  return `${getHelpersBlock(neededInteropHelpers, accessedGlobals, _, n2, s, t, externalLiveBindings, freeze, namespaceToStringTag)}${interopStatements.length > 0 ? `${interopStatements.join(n2)}${n2}${n2}` : ""}`;
}
function removeExtensionFromRelativeAmdId(id) {
  return id[0] === "." ? removeJsExtension(id) : id;
}
function warnOnBuiltins(warn, dependencies) {
  const externalBuiltins = dependencies.map(({ id }) => id).filter((id) => id in builtins);
  if (!externalBuiltins.length)
    return;
  warn({
    code: "MISSING_NODE_BUILTINS",
    message: `Creating a browser bundle that depends on Node.js built-in modules (${printQuotedStringList(externalBuiltins)}). You might need to include https://github.com/snowpackjs/rollup-plugin-polyfill-node`,
    modules: externalBuiltins
  });
}
function amd(magicString, { accessedGlobals, dependencies, exports, hasExports, id, indentString: t, intro, isEntryFacade, isModuleFacade, namedExportsMode, outro, varOrConst, warn }, { amd: amd2, compact, esModule, externalLiveBindings, freeze, interop, namespaceToStringTag, strict }) {
  warnOnBuiltins(warn, dependencies);
  const deps = dependencies.map((m) => `'${removeExtensionFromRelativeAmdId(m.id)}'`);
  const args = dependencies.map((m) => m.name);
  const n2 = compact ? "" : "\n";
  const s = compact ? "" : ";";
  const _ = compact ? "" : " ";
  if (namedExportsMode && hasExports) {
    args.unshift(`exports`);
    deps.unshift(`'exports'`);
  }
  if (accessedGlobals.has("require")) {
    args.unshift("require");
    deps.unshift(`'require'`);
  }
  if (accessedGlobals.has("module")) {
    args.unshift("module");
    deps.unshift(`'module'`);
  }
  const completeAmdId = getCompleteAmdId(amd2, id);
  const params = (completeAmdId ? `'${completeAmdId}',${_}` : ``) + (deps.length ? `[${deps.join(`,${_}`)}],${_}` : ``);
  const useStrict = strict ? `${_}'use strict';` : "";
  magicString.prepend(`${intro}${getInteropBlock(dependencies, varOrConst, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, _, n2, s, t)}`);
  const exportBlock = getExportBlock$1(exports, dependencies, namedExportsMode, interop, compact, t, externalLiveBindings);
  let namespaceMarkers = getNamespaceMarkers(namedExportsMode && hasExports, isEntryFacade && esModule, isModuleFacade && namespaceToStringTag, _, n2);
  if (namespaceMarkers) {
    namespaceMarkers = n2 + n2 + namespaceMarkers;
  }
  magicString.append(`${exportBlock}${namespaceMarkers}${outro}`);
  return magicString.indent(t).prepend(`${amd2.define}(${params}function${_}(${args.join(`,${_}`)})${_}{${useStrict}${n2}${n2}`).append(`${n2}${n2}});`);
}
function cjs(magicString, { accessedGlobals, dependencies, exports, hasExports, indentString: t, intro, isEntryFacade, isModuleFacade, namedExportsMode, outro, varOrConst }, { compact, esModule, externalLiveBindings, freeze, interop, namespaceToStringTag, strict }) {
  const n2 = compact ? "" : "\n";
  const s = compact ? "" : ";";
  const _ = compact ? "" : " ";
  const useStrict = strict ? `'use strict';${n2}${n2}` : "";
  let namespaceMarkers = getNamespaceMarkers(namedExportsMode && hasExports, isEntryFacade && esModule, isModuleFacade && namespaceToStringTag, _, n2);
  if (namespaceMarkers) {
    namespaceMarkers += n2 + n2;
  }
  const importBlock = getImportBlock$1(dependencies, compact, varOrConst, n2, _);
  const interopBlock = getInteropBlock(dependencies, varOrConst, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, _, n2, s, t);
  magicString.prepend(`${useStrict}${intro}${namespaceMarkers}${importBlock}${interopBlock}`);
  const exportBlock = getExportBlock$1(exports, dependencies, namedExportsMode, interop, compact, t, externalLiveBindings, `module.exports${_}=${_}`);
  return magicString.append(`${exportBlock}${outro}`);
}
function getImportBlock$1(dependencies, compact, varOrConst, n2, _) {
  let importBlock = "";
  let definingVariable = false;
  for (const { id, name, reexports, imports } of dependencies) {
    if (!reexports && !imports) {
      if (importBlock) {
        importBlock += !compact || definingVariable ? `;${n2}` : ",";
      }
      definingVariable = false;
      importBlock += `require('${id}')`;
    } else {
      importBlock += compact && definingVariable ? "," : `${importBlock ? `;${n2}` : ""}${varOrConst} `;
      definingVariable = true;
      importBlock += `${name}${_}=${_}require('${id}')`;
    }
  }
  if (importBlock) {
    return `${importBlock};${n2}${n2}`;
  }
  return "";
}
function es(magicString, { intro, outro, dependencies, exports, varOrConst }, { compact }) {
  const _ = compact ? "" : " ";
  const n2 = compact ? "" : "\n";
  const importBlock = getImportBlock(dependencies, _);
  if (importBlock.length > 0)
    intro += importBlock.join(n2) + n2 + n2;
  if (intro)
    magicString.prepend(intro);
  const exportBlock = getExportBlock(exports, _, varOrConst);
  if (exportBlock.length)
    magicString.append(n2 + n2 + exportBlock.join(n2).trim());
  if (outro)
    magicString.append(outro);
  return magicString.trim();
}
function getImportBlock(dependencies, _) {
  const importBlock = [];
  for (const { id, reexports, imports, name } of dependencies) {
    if (!reexports && !imports) {
      importBlock.push(`import${_}'${id}';`);
      continue;
    }
    if (imports) {
      let defaultImport = null;
      let starImport = null;
      const importedNames = [];
      for (const specifier of imports) {
        if (specifier.imported === "default") {
          defaultImport = specifier;
        } else if (specifier.imported === "*") {
          starImport = specifier;
        } else {
          importedNames.push(specifier);
        }
      }
      if (starImport) {
        importBlock.push(`import${_}*${_}as ${starImport.local} from${_}'${id}';`);
      }
      if (defaultImport && importedNames.length === 0) {
        importBlock.push(`import ${defaultImport.local} from${_}'${id}';`);
      } else if (importedNames.length > 0) {
        importBlock.push(`import ${defaultImport ? `${defaultImport.local},${_}` : ""}{${_}${importedNames.map((specifier) => {
          if (specifier.imported === specifier.local) {
            return specifier.imported;
          } else {
            return `${specifier.imported} as ${specifier.local}`;
          }
        }).join(`,${_}`)}${_}}${_}from${_}'${id}';`);
      }
    }
    if (reexports) {
      let starExport = null;
      const namespaceReexports = [];
      const namedReexports = [];
      for (const specifier of reexports) {
        if (specifier.reexported === "*") {
          starExport = specifier;
        } else if (specifier.imported === "*") {
          namespaceReexports.push(specifier);
        } else {
          namedReexports.push(specifier);
        }
      }
      if (starExport) {
        importBlock.push(`export${_}*${_}from${_}'${id}';`);
      }
      if (namespaceReexports.length > 0) {
        if (!imports || !imports.some((specifier) => specifier.imported === "*" && specifier.local === name)) {
          importBlock.push(`import${_}*${_}as ${name} from${_}'${id}';`);
        }
        for (const specifier of namespaceReexports) {
          importBlock.push(`export${_}{${_}${name === specifier.reexported ? name : `${name} as ${specifier.reexported}`} };`);
        }
      }
      if (namedReexports.length > 0) {
        importBlock.push(`export${_}{${_}${namedReexports.map((specifier) => {
          if (specifier.imported === specifier.reexported) {
            return specifier.imported;
          } else {
            return `${specifier.imported} as ${specifier.reexported}`;
          }
        }).join(`,${_}`)}${_}}${_}from${_}'${id}';`);
      }
    }
  }
  return importBlock;
}
function getExportBlock(exports, _, varOrConst) {
  const exportBlock = [];
  const exportDeclaration = [];
  for (const specifier of exports) {
    if (specifier.expression) {
      exportBlock.push(`${varOrConst} ${specifier.local}${_}=${_}${specifier.expression};`);
    }
    exportDeclaration.push(specifier.exported === specifier.local ? specifier.local : `${specifier.local} as ${specifier.exported}`);
  }
  if (exportDeclaration.length) {
    exportBlock.push(`export${_}{${_}${exportDeclaration.join(`,${_}`)}${_}};`);
  }
  return exportBlock;
}
function property(prop) {
  return shouldUseDot.test(prop) ? `.${prop}` : `['${prop}']`;
}
function keypath(keypath2) {
  return keypath2.split(".").map(property).join("");
}
function setupNamespace(name, root, globals, compact) {
  const _ = compact ? "" : " ";
  const parts = name.split(".");
  parts[0] = (typeof globals === "function" ? globals(parts[0]) : globals[parts[0]]) || parts[0];
  parts.pop();
  let acc = root;
  return parts.map((part) => (acc += property(part), `${acc}${_}=${_}${acc}${_}||${_}{}${compact ? "" : ";"}`)).join(compact ? "," : "\n") + (compact && parts.length ? ";" : "\n");
}
function assignToDeepVariable(deepName, root, globals, compact, assignment) {
  const _ = compact ? "" : " ";
  const parts = deepName.split(".");
  parts[0] = (typeof globals === "function" ? globals(parts[0]) : globals[parts[0]]) || parts[0];
  const last = parts.pop();
  let acc = root;
  let deepAssignment = parts.map((part) => (acc += property(part), `${acc}${_}=${_}${acc}${_}||${_}{}`)).concat(`${acc}${property(last)}`).join(`,${_}`).concat(`${_}=${_}${assignment}`);
  if (parts.length > 0) {
    deepAssignment = `(${deepAssignment})`;
  }
  return deepAssignment;
}
function trimEmptyImports(dependencies) {
  let i = dependencies.length;
  while (i--) {
    const { imports, reexports } = dependencies[i];
    if (imports || reexports) {
      return dependencies.slice(0, i + 1);
    }
  }
  return [];
}
function iife(magicString, { accessedGlobals, dependencies, exports, hasExports, indentString: t, intro, namedExportsMode, outro, varOrConst, warn }, { compact, esModule, extend: extend2, freeze, externalLiveBindings, globals, interop, name, namespaceToStringTag, strict }) {
  const _ = compact ? "" : " ";
  const s = compact ? "" : ";";
  const n2 = compact ? "" : "\n";
  const isNamespaced = name && name.indexOf(".") !== -1;
  const useVariableAssignment = !extend2 && !isNamespaced;
  if (name && useVariableAssignment && !isLegal(name)) {
    return error({
      code: "ILLEGAL_IDENTIFIER_AS_NAME",
      message: `Given name "${name}" is not a legal JS identifier. If you need this, you can try "output.extend: true".`
    });
  }
  warnOnBuiltins(warn, dependencies);
  const external = trimEmptyImports(dependencies);
  const deps = external.map((dep) => dep.globalName || "null");
  const args = external.map((m) => m.name);
  if (hasExports && !name) {
    warn({
      code: "MISSING_NAME_OPTION_FOR_IIFE_EXPORT",
      message: `If you do not supply "output.name", you may not be able to access the exports of an IIFE bundle.`
    });
  }
  if (namedExportsMode && hasExports) {
    if (extend2) {
      deps.unshift(`${thisProp(name)}${_}=${_}${thisProp(name)}${_}||${_}{}`);
      args.unshift("exports");
    } else {
      deps.unshift("{}");
      args.unshift("exports");
    }
  }
  const useStrict = strict ? `${t}'use strict';${n2}` : "";
  const interopBlock = getInteropBlock(dependencies, varOrConst, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, _, n2, s, t);
  magicString.prepend(`${intro}${interopBlock}`);
  let wrapperIntro = `(function${_}(${args.join(`,${_}`)})${_}{${n2}${useStrict}${n2}`;
  if (hasExports) {
    if (name && !(extend2 && namedExportsMode)) {
      wrapperIntro = (useVariableAssignment ? `${varOrConst} ${name}` : thisProp(name)) + `${_}=${_}${wrapperIntro}`;
    }
    if (isNamespaced) {
      wrapperIntro = setupNamespace(name, "this", globals, compact) + wrapperIntro;
    }
  }
  let wrapperOutro = `${n2}${n2}}(${deps.join(`,${_}`)}));`;
  if (hasExports && !extend2 && namedExportsMode) {
    wrapperOutro = `${n2}${n2}${t}return exports;${wrapperOutro}`;
  }
  const exportBlock = getExportBlock$1(exports, dependencies, namedExportsMode, interop, compact, t, externalLiveBindings);
  let namespaceMarkers = getNamespaceMarkers(namedExportsMode && hasExports, esModule, namespaceToStringTag, _, n2);
  if (namespaceMarkers) {
    namespaceMarkers = n2 + n2 + namespaceMarkers;
  }
  magicString.append(`${exportBlock}${namespaceMarkers}${outro}`);
  return magicString.indent(t).prepend(wrapperIntro).append(wrapperOutro);
}
function getStarExcludes({ dependencies, exports }) {
  const starExcludes = new Set(exports.map((expt) => expt.exported));
  starExcludes.add("default");
  for (const { reexports } of dependencies) {
    if (reexports) {
      for (const reexport of reexports) {
        if (reexport.imported !== "*")
          starExcludes.add(reexport.reexported);
      }
    }
  }
  return starExcludes;
}
function getExportsBlock(exports, _, t, n2) {
  if (exports.length === 0) {
    return "";
  }
  if (exports.length === 1) {
    return `${t}${t}${t}exports('${exports[0].name}',${_}${exports[0].value});${n2}${n2}`;
  }
  return `${t}${t}${t}exports({${n2}` + exports.map(({ name, value }) => `${t}${t}${t}${t}${name}:${_}${value}`).join(`,${n2}`) + `${n2}${t}${t}${t}});${n2}${n2}`;
}
function system(magicString, { accessedGlobals, dependencies, exports, hasExports, indentString: t, intro, outro, usesTopLevelAwait, varOrConst }, options) {
  const n2 = options.compact ? "" : "\n";
  const _ = options.compact ? "" : " ";
  const dependencyIds = dependencies.map((m) => `'${m.id}'`);
  const importBindings = [];
  let starExcludes;
  const setters = [];
  for (const { imports, reexports } of dependencies) {
    const setter = [];
    if (imports) {
      for (const specifier of imports) {
        importBindings.push(specifier.local);
        if (specifier.imported === "*") {
          setter.push(`${specifier.local}${_}=${_}module;`);
        } else {
          setter.push(`${specifier.local}${_}=${_}module.${specifier.imported};`);
        }
      }
    }
    if (reexports) {
      let createdSetter = false;
      if (reexports.length > 1 || reexports.length === 1 && (reexports[0].reexported === "*" || reexports[0].imported === "*")) {
        for (const specifier of reexports) {
          if (specifier.reexported !== "*")
            continue;
          if (!starExcludes) {
            starExcludes = getStarExcludes({ dependencies, exports });
          }
          createdSetter = true;
          setter.push(`${varOrConst} _setter${_}=${_}{};`);
          setter.push(`for${_}(var _$p${_}in${_}module)${_}{`);
          setter.push(`${t}if${_}(!_starExcludes[_$p])${_}_setter[_$p]${_}=${_}module[_$p];`);
          setter.push("}");
        }
        for (const specifier of reexports) {
          if (specifier.imported !== "*" || specifier.reexported === "*")
            continue;
          setter.push(`exports('${specifier.reexported}',${_}module);`);
        }
        for (const specifier of reexports) {
          if (specifier.reexported === "*" || specifier.imported === "*")
            continue;
          if (!createdSetter) {
            setter.push(`${varOrConst} _setter${_}=${_}{};`);
            createdSetter = true;
          }
          setter.push(`_setter.${specifier.reexported}${_}=${_}module.${specifier.imported};`);
        }
        if (createdSetter) {
          setter.push("exports(_setter);");
        }
      } else {
        for (const specifier of reexports) {
          setter.push(`exports('${specifier.reexported}',${_}module.${specifier.imported});`);
        }
      }
    }
    setters.push(setter.join(`${n2}${t}${t}${t}`));
  }
  const registeredName = options.name ? `'${options.name}',${_}` : "";
  const wrapperParams = accessedGlobals.has("module") ? `exports,${_}module` : hasExports ? "exports" : "";
  let wrapperStart = `System.register(${registeredName}[` + dependencyIds.join(`,${_}`) + `],${_}function${_}(${wrapperParams})${_}{${n2}${t}${options.strict ? "'use strict';" : ""}` + getStarExcludesBlock(starExcludes, varOrConst, _, t, n2) + getImportBindingsBlock(importBindings, _, t, n2) + `${n2}${t}return${_}{${setters.length ? `${n2}${t}${t}setters:${_}[${setters.map((s) => s ? `function${_}(module)${_}{${n2}${t}${t}${t}${s}${n2}${t}${t}}` : options.systemNullSetters ? `null` : `function${_}()${_}{}`).join(`,${_}`)}],` : ""}${n2}`;
  wrapperStart += `${t}${t}execute:${_}${usesTopLevelAwait ? `async${_}` : ""}function${_}()${_}{${n2}${n2}` + getHoistedExportsBlock(exports, _, t, n2);
  const wrapperEnd = `${n2}${n2}` + getSyntheticExportsBlock(exports, _, t, n2) + getMissingExportsBlock(exports, _, t, n2) + `${t}${t}}${n2}${t}}${options.compact ? "" : ";"}${n2}});`;
  if (intro)
    magicString.prepend(intro);
  if (outro)
    magicString.append(outro);
  return magicString.indent(`${t}${t}${t}`).append(wrapperEnd).prepend(wrapperStart);
}
function globalProp(name, globalVar) {
  if (!name)
    return "null";
  return `${globalVar}${keypath(name)}`;
}
function safeAccess(name, globalVar, _) {
  const parts = name.split(".");
  let acc = globalVar;
  return parts.map((part) => acc += property(part)).join(`${_}&&${_}`);
}
function umd(magicString, { accessedGlobals, dependencies, exports, hasExports, id, indentString: t, intro, namedExportsMode, outro, varOrConst, warn }, { amd: amd2, compact, esModule, extend: extend2, externalLiveBindings, freeze, interop, name, namespaceToStringTag, globals, noConflict, strict }) {
  const _ = compact ? "" : " ";
  const n2 = compact ? "" : "\n";
  const s = compact ? "" : ";";
  const factoryVar = compact ? "f" : "factory";
  const globalVar = compact ? "g" : "global";
  if (hasExports && !name) {
    return error({
      code: "MISSING_NAME_OPTION_FOR_IIFE_EXPORT",
      message: 'You must supply "output.name" for UMD bundles that have exports so that the exports are accessible in environments without a module loader.'
    });
  }
  warnOnBuiltins(warn, dependencies);
  const amdDeps = dependencies.map((m) => `'${removeExtensionFromRelativeAmdId(m.id)}'`);
  const cjsDeps = dependencies.map((m) => `require('${m.id}')`);
  const trimmedImports = trimEmptyImports(dependencies);
  const globalDeps = trimmedImports.map((module2) => globalProp(module2.globalName, globalVar));
  const factoryArgs = trimmedImports.map((m) => m.name);
  if (namedExportsMode && (hasExports || noConflict)) {
    amdDeps.unshift(`'exports'`);
    cjsDeps.unshift(`exports`);
    globalDeps.unshift(assignToDeepVariable(name, globalVar, globals, compact, `${extend2 ? `${globalProp(name, globalVar)}${_}||${_}` : ""}{}`));
    factoryArgs.unshift("exports");
  }
  const completeAmdId = getCompleteAmdId(amd2, id);
  const amdParams = (completeAmdId ? `'${completeAmdId}',${_}` : ``) + (amdDeps.length ? `[${amdDeps.join(`,${_}`)}],${_}` : ``);
  const define = amd2.define;
  const cjsExport = !namedExportsMode && hasExports ? `module.exports${_}=${_}` : ``;
  const useStrict = strict ? `${_}'use strict';${n2}` : ``;
  let iifeExport;
  if (noConflict) {
    const noConflictExportsVar = compact ? "e" : "exports";
    let factory;
    if (!namedExportsMode && hasExports) {
      factory = `var ${noConflictExportsVar}${_}=${_}${assignToDeepVariable(name, globalVar, globals, compact, `${factoryVar}(${globalDeps.join(`,${_}`)})`)};`;
    } else {
      const module2 = globalDeps.shift();
      factory = `var ${noConflictExportsVar}${_}=${_}${module2};${n2}${t}${t}${factoryVar}(${[noConflictExportsVar].concat(globalDeps).join(`,${_}`)});`;
    }
    iifeExport = `(function${_}()${_}{${n2}${t}${t}var current${_}=${_}${safeAccess(name, globalVar, _)};${n2}${t}${t}${factory}${n2}${t}${t}${noConflictExportsVar}.noConflict${_}=${_}function${_}()${_}{${_}${globalProp(name, globalVar)}${_}=${_}current;${_}return ${noConflictExportsVar}${compact ? "" : "; "}};${n2}${t}}())`;
  } else {
    iifeExport = `${factoryVar}(${globalDeps.join(`,${_}`)})`;
    if (!namedExportsMode && hasExports) {
      iifeExport = assignToDeepVariable(name, globalVar, globals, compact, iifeExport);
    }
  }
  const iifeNeedsGlobal = hasExports || noConflict && namedExportsMode || globalDeps.length > 0;
  const globalParam = iifeNeedsGlobal ? `${globalVar},${_}` : "";
  const globalArg = iifeNeedsGlobal ? `this,${_}` : "";
  const iifeStart = iifeNeedsGlobal ? `(${globalVar}${_}=${_}typeof globalThis${_}!==${_}'undefined'${_}?${_}globalThis${_}:${_}${globalVar}${_}||${_}self,${_}` : "";
  const iifeEnd = iifeNeedsGlobal ? ")" : "";
  const cjsIntro = iifeNeedsGlobal ? `${t}typeof exports${_}===${_}'object'${_}&&${_}typeof module${_}!==${_}'undefined'${_}?${_}${cjsExport}${factoryVar}(${cjsDeps.join(`,${_}`)})${_}:${n2}` : "";
  const wrapperIntro = `(function${_}(${globalParam}${factoryVar})${_}{${n2}` + cjsIntro + `${t}typeof ${define}${_}===${_}'function'${_}&&${_}${define}.amd${_}?${_}${define}(${amdParams}${factoryVar})${_}:${n2}${t}${iifeStart}${iifeExport}${iifeEnd};${n2}}(${globalArg}(function${_}(${factoryArgs.join(", ")})${_}{${useStrict}${n2}`;
  const wrapperOutro = n2 + n2 + "})));";
  magicString.prepend(`${intro}${getInteropBlock(dependencies, varOrConst, interop, externalLiveBindings, freeze, namespaceToStringTag, accessedGlobals, _, n2, s, t)}`);
  const exportBlock = getExportBlock$1(exports, dependencies, namedExportsMode, interop, compact, t, externalLiveBindings);
  let namespaceMarkers = getNamespaceMarkers(namedExportsMode && hasExports, esModule, namespaceToStringTag, _, n2);
  if (namespaceMarkers) {
    namespaceMarkers = n2 + n2 + namespaceMarkers;
  }
  magicString.append(`${exportBlock}${namespaceMarkers}${outro}`);
  return magicString.trim().indent(t).append(wrapperOutro).prepend(wrapperIntro);
}
function getLinkMap(warn) {
  return function linkMap(source, map) {
    if (map.mappings) {
      return new Link(map, [source]);
    }
    warn({
      code: "SOURCEMAP_BROKEN",
      message: `Sourcemap is likely to be incorrect: a plugin (${map.plugin}) was used to transform files, but didn't generate a sourcemap for the transformation. Consult the plugin documentation for help`,
      plugin: map.plugin,
      url: `https://rollupjs.org/guide/en/#warning-sourcemap-is-likely-to-be-incorrect`
    });
    return new Link({
      mappings: [],
      names: []
    }, [source]);
  };
}
function getCollapsedSourcemap(id, originalCode, originalSourcemap, sourcemapChain, linkMap) {
  let source;
  if (!originalSourcemap) {
    source = new Source(id, originalCode);
  } else {
    const sources = originalSourcemap.sources;
    const sourcesContent = originalSourcemap.sourcesContent || [];
    const directory = (0, import_path.dirname)(id) || ".";
    const sourceRoot = originalSourcemap.sourceRoot || ".";
    const baseSources = sources.map((source2, i) => new Source((0, import_path.resolve)(directory, sourceRoot, source2), sourcesContent[i]));
    source = new Link(originalSourcemap, baseSources);
  }
  return sourcemapChain.reduce(linkMap, source);
}
function collapseSourcemaps(file, map, modules, bundleSourcemapChain, excludeContent, warn) {
  const linkMap = getLinkMap(warn);
  const moduleSources = modules.filter((module2) => !module2.excludeFromSourcemap).map((module2) => getCollapsedSourcemap(module2.id, module2.originalCode, module2.originalSourcemap, module2.sourcemapChain, linkMap));
  let source = new Link(map, moduleSources);
  source = bundleSourcemapChain.reduce(linkMap, source);
  let { sources, sourcesContent, names, mappings } = source.traceMappings();
  if (file) {
    const directory = (0, import_path.dirname)(file);
    sources = sources.map((source2) => (0, import_path.relative)(directory, source2));
    file = (0, import_path.basename)(file);
  }
  sourcesContent = excludeContent ? null : sourcesContent;
  return new SourceMap({ file, mappings, names, sources, sourcesContent });
}
function collapseSourcemap(id, originalCode, originalSourcemap, sourcemapChain, warn) {
  if (!sourcemapChain.length) {
    return originalSourcemap;
  }
  const source = getCollapsedSourcemap(id, originalCode, originalSourcemap, sourcemapChain, getLinkMap(warn));
  const map = source.traceMappings();
  return __spreadValues({ version: 3 }, map);
}
function deconflictChunk(modules, dependenciesToBeDeconflicted, imports, usedNames, format, interop, preserveModules, externalLiveBindings, chunkByModule, syntheticExports, exportNamesByVariable, accessedGlobalsByScope, includedNamespaces) {
  const reversedModules = modules.slice().reverse();
  for (const module2 of reversedModules) {
    module2.scope.addUsedOutsideNames(usedNames, format, exportNamesByVariable, accessedGlobalsByScope);
  }
  deconflictTopLevelVariables(usedNames, reversedModules, includedNamespaces);
  DECONFLICT_IMPORTED_VARIABLES_BY_FORMAT[format](usedNames, imports, dependenciesToBeDeconflicted, interop, preserveModules, externalLiveBindings, chunkByModule, syntheticExports);
  for (const module2 of reversedModules) {
    module2.scope.deconflict(format, exportNamesByVariable, accessedGlobalsByScope);
  }
}
function deconflictImportsEsmOrSystem(usedNames, imports, dependenciesToBeDeconflicted, _interop, preserveModules, _externalLiveBindings, chunkByModule, syntheticExports) {
  for (const dependency of dependenciesToBeDeconflicted.dependencies) {
    if (preserveModules || dependency instanceof ExternalModule) {
      dependency.variableName = getSafeName(dependency.suggestedVariableName, usedNames);
    }
  }
  for (const variable of imports) {
    const module2 = variable.module;
    const name = variable.name;
    if (variable.isNamespace && (preserveModules || module2 instanceof ExternalModule)) {
      variable.setRenderNames(null, (module2 instanceof ExternalModule ? module2 : chunkByModule.get(module2)).variableName);
    } else if (module2 instanceof ExternalModule && name === "default") {
      variable.setRenderNames(null, getSafeName([...module2.exportedVariables].some(([exportedVariable, exportedName]) => exportedName === "*" && exportedVariable.included) ? module2.suggestedVariableName + "__default" : module2.suggestedVariableName, usedNames));
    } else {
      variable.setRenderNames(null, getSafeName(name, usedNames));
    }
  }
  for (const variable of syntheticExports) {
    variable.setRenderNames(null, getSafeName(variable.name, usedNames));
  }
}
function deconflictImportsOther(usedNames, imports, { deconflictedDefault, deconflictedNamespace, dependencies }, interop, preserveModules, externalLiveBindings, chunkByModule) {
  for (const chunkOrExternalModule of dependencies) {
    chunkOrExternalModule.variableName = getSafeName(chunkOrExternalModule.suggestedVariableName, usedNames);
  }
  for (const externalModuleOrChunk of deconflictedNamespace) {
    externalModuleOrChunk.namespaceVariableName = getSafeName(`${externalModuleOrChunk.suggestedVariableName}__namespace`, usedNames);
  }
  for (const externalModule of deconflictedDefault) {
    if (deconflictedNamespace.has(externalModule) && canDefaultBeTakenFromNamespace(String(interop(externalModule.id)), externalLiveBindings)) {
      externalModule.defaultVariableName = externalModule.namespaceVariableName;
    } else {
      externalModule.defaultVariableName = getSafeName(`${externalModule.suggestedVariableName}__default`, usedNames);
    }
  }
  for (const variable of imports) {
    const module2 = variable.module;
    if (module2 instanceof ExternalModule) {
      const name = variable.name;
      if (name === "default") {
        const moduleInterop = String(interop(module2.id));
        const variableName = defaultInteropHelpersByInteropType[moduleInterop] ? module2.defaultVariableName : module2.variableName;
        if (isDefaultAProperty(moduleInterop, externalLiveBindings)) {
          variable.setRenderNames(variableName, "default");
        } else {
          variable.setRenderNames(null, variableName);
        }
      } else if (name === "*") {
        variable.setRenderNames(null, namespaceInteropHelpersByInteropType[String(interop(module2.id))] ? module2.namespaceVariableName : module2.variableName);
      } else {
        variable.setRenderNames(module2.variableName, null);
      }
    } else {
      const chunk = chunkByModule.get(module2);
      if (preserveModules && variable.isNamespace) {
        variable.setRenderNames(null, chunk.exportMode === "default" ? chunk.namespaceVariableName : chunk.variableName);
      } else if (chunk.exportMode === "default") {
        variable.setRenderNames(null, chunk.variableName);
      } else {
        variable.setRenderNames(chunk.variableName, chunk.getVariableExportName(variable));
      }
    }
  }
}
function deconflictTopLevelVariables(usedNames, modules, includedNamespaces) {
  for (const module2 of modules) {
    for (const variable of module2.scope.variables.values()) {
      if (variable.included && !(variable.renderBaseName || variable instanceof ExportDefaultVariable && variable.getOriginalVariable() !== variable)) {
        variable.setRenderNames(null, getSafeName(variable.name, usedNames));
      }
    }
    if (includedNamespaces.has(module2)) {
      const namespace = module2.namespace;
      namespace.setRenderNames(null, getSafeName(namespace.name, usedNames));
    }
  }
}
function escapeId(id) {
  if (!id.match(needsEscapeRegEx))
    return id;
  return id.replace(backSlashRegEx, "\\\\").replace(quoteNewlineRegEx, "\\$1");
}
function assignExportsToMangledNames(exports, exportsByName, exportNamesByVariable) {
  let nameIndex = 0;
  for (const variable of exports) {
    let exportName = variable.name[0];
    if (exportsByName[exportName]) {
      do {
        exportName = toBase64(++nameIndex);
        if (exportName.charCodeAt(0) === 49) {
          nameIndex += 9 * 64 ** (exportName.length - 1);
          exportName = toBase64(nameIndex);
        }
      } while (RESERVED_NAMES[exportName] || exportsByName[exportName]);
    }
    exportsByName[exportName] = variable;
    exportNamesByVariable.set(variable, [exportName]);
  }
}
function assignExportsToNames(exports, exportsByName, exportNamesByVariable) {
  for (const variable of exports) {
    let nameIndex = 0;
    let exportName = variable.name;
    while (exportsByName[exportName]) {
      exportName = variable.name + "$" + ++nameIndex;
    }
    exportsByName[exportName] = variable;
    exportNamesByVariable.set(variable, [exportName]);
  }
}
function getExportMode(chunk, { exports: exportMode, name, format }, unsetOptions, facadeModuleId, warn) {
  const exportKeys = chunk.getExportNames();
  if (exportMode === "default") {
    if (exportKeys.length !== 1 || exportKeys[0] !== "default") {
      return error(errIncompatibleExportOptionValue("default", exportKeys, facadeModuleId));
    }
  } else if (exportMode === "none" && exportKeys.length) {
    return error(errIncompatibleExportOptionValue("none", exportKeys, facadeModuleId));
  }
  if (exportMode === "auto") {
    if (exportKeys.length === 0) {
      exportMode = "none";
    } else if (exportKeys.length === 1 && exportKeys[0] === "default") {
      if (format === "cjs" && unsetOptions.has("exports")) {
        warn(errPreferNamedExports(facadeModuleId));
      }
      exportMode = "default";
    } else {
      if (format !== "es" && exportKeys.indexOf("default") !== -1) {
        warn(errMixedExport(facadeModuleId, name));
      }
      exportMode = "named";
    }
  }
  return exportMode;
}
function guessIndentString(code) {
  const lines = code.split("\n");
  const tabbed = lines.filter((line) => /^\t+/.test(line));
  const spaced = lines.filter((line) => /^ {2,}/.test(line));
  if (tabbed.length === 0 && spaced.length === 0) {
    return null;
  }
  if (tabbed.length >= spaced.length) {
    return "	";
  }
  const min = spaced.reduce((previous, current2) => {
    const numSpaces = /^ +/.exec(current2)[0].length;
    return Math.min(numSpaces, previous);
  }, Infinity);
  return new Array(min + 1).join(" ");
}
function getIndentString3(modules, options) {
  if (options.indent !== true)
    return options.indent;
  for (let i = 0; i < modules.length; i++) {
    const indent3 = guessIndentString(modules[i].originalCode);
    if (indent3 !== null)
      return indent3;
  }
  return "	";
}
function getStaticDependencies(chunk, orderedModules, chunkByModule) {
  const staticDependencyBlocks = [];
  const handledDependencies = new Set();
  for (let modulePos = orderedModules.length - 1; modulePos >= 0; modulePos--) {
    const module2 = orderedModules[modulePos];
    if (!handledDependencies.has(module2)) {
      const staticDependencies = [];
      addStaticDependencies(module2, staticDependencies, handledDependencies, chunk, chunkByModule);
      staticDependencyBlocks.unshift(staticDependencies);
    }
  }
  const dependencies = new Set();
  for (const block of staticDependencyBlocks) {
    for (const dependency of block) {
      dependencies.add(dependency);
    }
  }
  return dependencies;
}
function addStaticDependencies(module2, staticDependencies, handledModules, chunk, chunkByModule) {
  const dependencies = module2.getDependenciesToBeIncluded();
  for (const dependency of dependencies) {
    if (dependency instanceof ExternalModule) {
      staticDependencies.push(dependency);
      continue;
    }
    const dependencyChunk = chunkByModule.get(dependency);
    if (dependencyChunk !== chunk) {
      staticDependencies.push(dependencyChunk);
      continue;
    }
    if (!handledModules.has(dependency)) {
      handledModules.add(dependency);
      addStaticDependencies(dependency, staticDependencies, handledModules, chunk, chunkByModule);
    }
  }
}
function decodedSourcemap(map) {
  if (!map)
    return null;
  if (typeof map === "string") {
    map = JSON.parse(map);
  }
  if (map.mappings === "") {
    return {
      mappings: [],
      names: [],
      sources: [],
      version: 3
    };
  }
  let mappings;
  if (typeof map.mappings === "string") {
    mappings = decode(map.mappings);
  } else {
    mappings = map.mappings;
  }
  return __spreadProps(__spreadValues({}, map), { mappings });
}
function renderChunk({ code, options, outputPluginDriver, renderChunk: renderChunk2, sourcemapChain }) {
  const renderChunkReducer = (code2, result, plugin) => {
    if (result == null)
      return code2;
    if (typeof result === "string")
      result = {
        code: result,
        map: void 0
      };
    if (result.map !== null) {
      const map = decodedSourcemap(result.map);
      sourcemapChain.push(map || { missing: true, plugin: plugin.name });
    }
    return result.code;
  };
  return outputPluginDriver.hookReduceArg0("renderChunk", [code, renderChunk2, options], renderChunkReducer);
}
function renderNamePattern(pattern, patternName, replacements) {
  if (isPathFragment(pattern))
    return error(errFailedValidation(`Invalid pattern "${pattern}" for "${patternName}", patterns can be neither absolute nor relative paths.`));
  return pattern.replace(/\[(\w+)\]/g, (_match, type) => {
    if (!replacements.hasOwnProperty(type)) {
      return error(errFailedValidation(`"[${type}]" is not a valid placeholder in "${patternName}" pattern.`));
    }
    const replacement = replacements[type]();
    if (isPathFragment(replacement))
      return error(errFailedValidation(`Invalid substitution "${replacement}" for placeholder "[${type}]" in "${patternName}" pattern, can be neither absolute nor relative path.`));
    return replacement;
  });
}
function makeUnique(name, existingNames) {
  const existingNamesLowercase = new Set(Object.keys(existingNames).map((key) => key.toLowerCase()));
  if (!existingNamesLowercase.has(name.toLocaleLowerCase()))
    return name;
  const ext = (0, import_path.extname)(name);
  name = name.substr(0, name.length - ext.length);
  let uniqueName, uniqueIndex = 1;
  while (existingNamesLowercase.has((uniqueName = name + ++uniqueIndex + ext).toLowerCase()))
    ;
  return uniqueName;
}
function getGlobalName(module2, globals, hasExports, warn) {
  const globalName = typeof globals === "function" ? globals(module2.id) : globals[module2.id];
  if (globalName) {
    return globalName;
  }
  if (hasExports) {
    warn({
      code: "MISSING_GLOBAL_NAME",
      guess: module2.variableName,
      message: `No name was provided for external module '${module2.id}' in output.globals \u2013 guessing '${module2.variableName}'`,
      source: module2.id
    });
    return module2.variableName;
  }
}
function getChunkNameFromModule(module2) {
  return module2.chunkName || getAliasName(module2.id);
}
function generateAssetFileName(name, source, outputOptions, bundle) {
  const emittedName = outputOptions.sanitizeFileName(name || "asset");
  return makeUnique(renderNamePattern(typeof outputOptions.assetFileNames === "function" ? outputOptions.assetFileNames({ name, source, type: "asset" }) : outputOptions.assetFileNames, "output.assetFileNames", {
    ext: () => (0, import_path.extname)(emittedName).substr(1),
    extname: () => (0, import_path.extname)(emittedName),
    hash() {
      const hash = createHash();
      hash.update(emittedName);
      hash.update(":");
      hash.update(source);
      return hash.digest("hex").substr(0, 8);
    },
    name: () => emittedName.substr(0, emittedName.length - (0, import_path.extname)(emittedName).length)
  }), bundle);
}
function reserveFileNameInBundle(fileName, bundle, warn) {
  if (fileName in bundle) {
    warn(errFileNameConflict(fileName));
  }
  bundle[fileName] = FILE_PLACEHOLDER;
}
function hasValidType(emittedFile) {
  return Boolean(emittedFile && (emittedFile.type === "asset" || emittedFile.type === "chunk"));
}
function hasValidName(emittedFile) {
  const validatedName = emittedFile.fileName || emittedFile.name;
  return !validatedName || typeof validatedName === "string" && !isPathFragment(validatedName);
}
function getValidSource(source, emittedFile, fileReferenceId) {
  if (!(typeof source === "string" || source instanceof Uint8Array)) {
    const assetName = emittedFile.fileName || emittedFile.name || fileReferenceId;
    return error(errFailedValidation(`Could not set source for ${typeof assetName === "string" ? `asset "${assetName}"` : "unnamed asset"}, asset source needs to be a string, Uint8Array or Buffer.`));
  }
  return source;
}
function getAssetFileName(file, referenceId) {
  if (typeof file.fileName !== "string") {
    return error(errAssetNotFinalisedForFileName(file.name || referenceId));
  }
  return file.fileName;
}
function getChunkFileName(file, facadeChunkByModule) {
  var _a;
  const fileName = file.fileName || file.module && ((_a = facadeChunkByModule === null || facadeChunkByModule === void 0 ? void 0 : facadeChunkByModule.get(file.module)) === null || _a === void 0 ? void 0 : _a.id);
  if (!fileName)
    return error(errChunkNotGeneratedForFileName(file.fileName || file.name));
  return fileName;
}
function findExistingAssetFileNameWithSource(bundle, source) {
  for (const [fileName, outputFile] of Object.entries(bundle)) {
    if (outputFile.type === "asset" && areSourcesEqual(source, outputFile.source))
      return fileName;
  }
  return null;
}
function areSourcesEqual(sourceA, sourceB) {
  if (typeof sourceA === "string") {
    return sourceA === sourceB;
  }
  if (typeof sourceB === "string") {
    return false;
  }
  if ("equals" in sourceA) {
    return sourceA.equals(sourceB);
  }
  if (sourceA.length !== sourceB.length) {
    return false;
  }
  for (let index = 0; index < sourceA.length; index++) {
    if (sourceA[index] !== sourceB[index]) {
      return false;
    }
  }
  return true;
}
async function createAddons(options, outputPluginDriver) {
  try {
    let [banner, footer, intro, outro] = await Promise.all([
      outputPluginDriver.hookReduceValue("banner", options.banner(), [], concatSep),
      outputPluginDriver.hookReduceValue("footer", options.footer(), [], concatSep),
      outputPluginDriver.hookReduceValue("intro", options.intro(), [], concatDblSep),
      outputPluginDriver.hookReduceValue("outro", options.outro(), [], concatDblSep)
    ]);
    if (intro)
      intro += "\n\n";
    if (outro)
      outro = `

${outro}`;
    if (banner.length)
      banner += "\n";
    if (footer.length)
      footer = "\n" + footer;
    return { banner, footer, intro, outro };
  } catch (err) {
    return error({
      code: "ADDON_ERROR",
      message: `Could not retrieve ${err.hook}. Check configuration of plugin ${err.plugin}.
	Error Message: ${err.message}`
    });
  }
}
function getChunkAssignments(entryModules, manualChunkAliasByEntry) {
  const chunkDefinitions = [];
  const modulesInManualChunks = new Set(manualChunkAliasByEntry.keys());
  const manualChunkModulesByAlias = Object.create(null);
  for (const [entry, alias] of manualChunkAliasByEntry) {
    const chunkModules = manualChunkModulesByAlias[alias] = manualChunkModulesByAlias[alias] || [];
    addStaticDependenciesToManualChunk(entry, chunkModules, modulesInManualChunks);
  }
  for (const [alias, modules] of Object.entries(manualChunkModulesByAlias)) {
    chunkDefinitions.push({ alias, modules });
  }
  const assignedEntryPointsByModule = new Map();
  const { dependentEntryPointsByModule, dynamicEntryModules } = analyzeModuleGraph(entryModules);
  const dynamicallyDependentEntryPointsByDynamicEntry = getDynamicDependentEntryPoints(dependentEntryPointsByModule, dynamicEntryModules);
  const staticEntries = new Set(entryModules);
  function assignEntryToStaticDependencies(entry, dynamicDependentEntryPoints) {
    const modulesToHandle = new Set([entry]);
    for (const module2 of modulesToHandle) {
      const assignedEntryPoints = getOrCreate(assignedEntryPointsByModule, module2, () => new Set());
      if (dynamicDependentEntryPoints && areEntryPointsContainedOrDynamicallyDependent(dynamicDependentEntryPoints, dependentEntryPointsByModule.get(module2))) {
        continue;
      } else {
        assignedEntryPoints.add(entry);
      }
      for (const dependency of module2.getDependenciesToBeIncluded()) {
        if (!(dependency instanceof ExternalModule || modulesInManualChunks.has(dependency))) {
          modulesToHandle.add(dependency);
        }
      }
    }
  }
  function areEntryPointsContainedOrDynamicallyDependent(entryPoints, containedIn) {
    const entriesToCheck = new Set(entryPoints);
    for (const entry of entriesToCheck) {
      if (!containedIn.has(entry)) {
        if (staticEntries.has(entry))
          return false;
        const dynamicallyDependentEntryPoints = dynamicallyDependentEntryPointsByDynamicEntry.get(entry);
        for (const dependentEntry of dynamicallyDependentEntryPoints) {
          entriesToCheck.add(dependentEntry);
        }
      }
    }
    return true;
  }
  for (const entry of entryModules) {
    if (!modulesInManualChunks.has(entry)) {
      assignEntryToStaticDependencies(entry, null);
    }
  }
  for (const entry of dynamicEntryModules) {
    if (!modulesInManualChunks.has(entry)) {
      assignEntryToStaticDependencies(entry, dynamicallyDependentEntryPointsByDynamicEntry.get(entry));
    }
  }
  chunkDefinitions.push(...createChunks([...entryModules, ...dynamicEntryModules], assignedEntryPointsByModule));
  return chunkDefinitions;
}
function addStaticDependenciesToManualChunk(entry, manualChunkModules, modulesInManualChunks) {
  const modulesToHandle = new Set([entry]);
  for (const module2 of modulesToHandle) {
    modulesInManualChunks.add(module2);
    manualChunkModules.push(module2);
    for (const dependency of module2.dependencies) {
      if (!(dependency instanceof ExternalModule || modulesInManualChunks.has(dependency))) {
        modulesToHandle.add(dependency);
      }
    }
  }
}
function analyzeModuleGraph(entryModules) {
  const dynamicEntryModules = new Set();
  const dependentEntryPointsByModule = new Map();
  const entriesToHandle = new Set(entryModules);
  for (const currentEntry of entriesToHandle) {
    const modulesToHandle = new Set([currentEntry]);
    for (const module2 of modulesToHandle) {
      getOrCreate(dependentEntryPointsByModule, module2, () => new Set()).add(currentEntry);
      for (const dependency of module2.getDependenciesToBeIncluded()) {
        if (!(dependency instanceof ExternalModule)) {
          modulesToHandle.add(dependency);
        }
      }
      for (const { resolution } of module2.dynamicImports) {
        if (resolution instanceof Module && resolution.includedDynamicImporters.length > 0) {
          dynamicEntryModules.add(resolution);
          entriesToHandle.add(resolution);
        }
      }
      for (const dependency of module2.implicitlyLoadedBefore) {
        dynamicEntryModules.add(dependency);
        entriesToHandle.add(dependency);
      }
    }
  }
  return { dependentEntryPointsByModule, dynamicEntryModules };
}
function getDynamicDependentEntryPoints(dependentEntryPointsByModule, dynamicEntryModules) {
  const dynamicallyDependentEntryPointsByDynamicEntry = new Map();
  for (const dynamicEntry of dynamicEntryModules) {
    const dynamicDependentEntryPoints = getOrCreate(dynamicallyDependentEntryPointsByDynamicEntry, dynamicEntry, () => new Set());
    for (const importer of [
      ...dynamicEntry.includedDynamicImporters,
      ...dynamicEntry.implicitlyLoadedAfter
    ]) {
      for (const entryPoint of dependentEntryPointsByModule.get(importer)) {
        dynamicDependentEntryPoints.add(entryPoint);
      }
    }
  }
  return dynamicallyDependentEntryPointsByDynamicEntry;
}
function createChunks(allEntryPoints, assignedEntryPointsByModule) {
  const chunkModules = Object.create(null);
  for (const [module2, assignedEntryPoints] of assignedEntryPointsByModule) {
    let chunkSignature = "";
    for (const entry of allEntryPoints) {
      chunkSignature += assignedEntryPoints.has(entry) ? "X" : "_";
    }
    const chunk = chunkModules[chunkSignature];
    if (chunk) {
      chunk.push(module2);
    } else {
      chunkModules[chunkSignature] = [module2];
    }
  }
  return Object.values(chunkModules).map((modules) => ({
    alias: null,
    modules
  }));
}
function commondir(files) {
  if (files.length === 0)
    return "/";
  if (files.length === 1)
    return (0, import_path.dirname)(files[0]);
  const commonSegments = files.slice(1).reduce((commonSegments2, file) => {
    const pathSegements = file.split(/\/+|\\+/);
    let i;
    for (i = 0; commonSegments2[i] === pathSegements[i] && i < Math.min(commonSegments2.length, pathSegements.length); i++)
      ;
    return commonSegments2.slice(0, i);
  }, files[0].split(/\/+|\\+/));
  return commonSegments.length > 1 ? commonSegments.join("/") : "/";
}
function sortByExecutionOrder(units) {
  units.sort(compareExecIndex);
}
function analyseModuleExecution(entryModules) {
  let nextExecIndex = 0;
  const cyclePaths = [];
  const analysedModules = new Set();
  const dynamicImports = new Set();
  const parents = new Map();
  const orderedModules = [];
  const analyseModule = (module2) => {
    if (module2 instanceof Module) {
      for (const dependency of module2.dependencies) {
        if (parents.has(dependency)) {
          if (!analysedModules.has(dependency)) {
            cyclePaths.push(getCyclePath(dependency, module2, parents));
          }
          continue;
        }
        parents.set(dependency, module2);
        analyseModule(dependency);
      }
      for (const dependency of module2.implicitlyLoadedBefore) {
        dynamicImports.add(dependency);
      }
      for (const { resolution } of module2.dynamicImports) {
        if (resolution instanceof Module) {
          dynamicImports.add(resolution);
        }
      }
      orderedModules.push(module2);
    }
    module2.execIndex = nextExecIndex++;
    analysedModules.add(module2);
  };
  for (const curEntry of entryModules) {
    if (!parents.has(curEntry)) {
      parents.set(curEntry, null);
      analyseModule(curEntry);
    }
  }
  for (const curEntry of dynamicImports) {
    if (!parents.has(curEntry)) {
      parents.set(curEntry, null);
      analyseModule(curEntry);
    }
  }
  return { cyclePaths, orderedModules };
}
function getCyclePath(module2, parent, parents) {
  const cycleSymbol = Symbol(module2.id);
  const path = [relativeId(module2.id)];
  let nextModule = parent;
  module2.cycles.add(cycleSymbol);
  while (nextModule !== module2) {
    nextModule.cycles.add(cycleSymbol);
    path.push(relativeId(nextModule.id));
    nextModule = parents.get(nextModule);
  }
  path.push(path[0]);
  path.reverse();
  return path;
}
function getAbsoluteEntryModulePaths(chunks) {
  const absoluteEntryModulePaths = [];
  for (const chunk of chunks) {
    for (const entryModule of chunk.entryModules) {
      if (isAbsolute(entryModule.id)) {
        absoluteEntryModulePaths.push(entryModule.id);
      }
    }
  }
  return absoluteEntryModulePaths;
}
function validateOptionsForMultiChunkOutput(outputOptions, onWarn) {
  if (outputOptions.format === "umd" || outputOptions.format === "iife")
    return error({
      code: "INVALID_OPTION",
      message: "UMD and IIFE output formats are not supported for code-splitting builds."
    });
  if (typeof outputOptions.file === "string")
    return error({
      code: "INVALID_OPTION",
      message: 'When building multiple chunks, the "output.dir" option must be used, not "output.file". To inline dynamic imports, set the "inlineDynamicImports" option.'
    });
  if (outputOptions.sourcemapFile)
    return error({
      code: "INVALID_OPTION",
      message: '"output.sourcemapFile" is only supported for single-file builds.'
    });
  if (!outputOptions.amd.autoId && outputOptions.amd.id)
    onWarn({
      code: "INVALID_OPTION",
      message: '"output.amd.id" is only properly supported for single-file builds. Use "output.amd.autoId" and "output.amd.basePath".'
    });
}
function getIncludedModules(modulesById) {
  return [...modulesById.values()].filter((module2) => module2 instanceof Module && (module2.isIncluded() || module2.info.isEntry || module2.includedDynamicImporters.length > 0));
}
function addModuleToManualChunk(alias, module2, manualChunkAliasByEntry) {
  const existingAlias = manualChunkAliasByEntry.get(module2);
  if (typeof existingAlias === "string" && existingAlias !== alias) {
    return error(errCannotAssignModuleToChunk(module2.id, alias, existingAlias));
  }
  manualChunkAliasByEntry.set(module2, alias);
}
function isInAstralSet(code, set) {
  var pos = 65536;
  for (var i = 0; i < set.length; i += 2) {
    pos += set[i];
    if (pos > code) {
      return false;
    }
    pos += set[i + 1];
    if (pos >= code) {
      return true;
    }
  }
}
function isIdentifierStart(code, astral) {
  if (code < 65) {
    return code === 36;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes);
}
function isIdentifierChar(code, astral) {
  if (code < 48) {
    return code === 36;
  }
  if (code < 58) {
    return true;
  }
  if (code < 65) {
    return false;
  }
  if (code < 91) {
    return true;
  }
  if (code < 97) {
    return code === 95;
  }
  if (code < 123) {
    return true;
  }
  if (code <= 65535) {
    return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code));
  }
  if (astral === false) {
    return false;
  }
  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
}
function binop(name, prec) {
  return new TokenType(name, { beforeExpr: true, binop: prec });
}
function kw(name, options) {
  if (options === void 0)
    options = {};
  options.keyword = name;
  return keywords$1[name] = new TokenType(name, options);
}
function isNewLine(code, ecma2019String) {
  return code === 10 || code === 13 || !ecma2019String && (code === 8232 || code === 8233);
}
function has2(obj, propName) {
  return hasOwnProperty.call(obj, propName);
}
function wordsRegexp(words) {
  return new RegExp("^(?:" + words.replace(/ /g, "|") + ")$");
}
function getLineInfo(input, offset2) {
  for (var line = 1, cur = 0; ; ) {
    lineBreakG.lastIndex = cur;
    var match = lineBreakG.exec(input);
    if (match && match.index < offset2) {
      ++line;
      cur = match.index + match[0].length;
    } else {
      return new Position(line, offset2 - cur);
    }
  }
}
function getOptions(opts) {
  var options = {};
  for (var opt in defaultOptions) {
    options[opt] = opts && has2(opts, opt) ? opts[opt] : defaultOptions[opt];
  }
  if (options.ecmaVersion === "latest") {
    options.ecmaVersion = 1e8;
  } else if (options.ecmaVersion == null) {
    if (!warnedAboutEcmaVersion && typeof console === "object" && console.warn) {
      warnedAboutEcmaVersion = true;
      console.warn("Since Acorn 8.0.0, options.ecmaVersion is required.\nDefaulting to 2020, but this will stop working in the future.");
    }
    options.ecmaVersion = 11;
  } else if (options.ecmaVersion >= 2015) {
    options.ecmaVersion -= 2009;
  }
  if (options.allowReserved == null) {
    options.allowReserved = options.ecmaVersion < 5;
  }
  if (options.allowAwaitOutsideFunction == null) {
    options.allowAwaitOutsideFunction = options.ecmaVersion >= 13;
  }
  if (isArray(options.onToken)) {
    var tokens = options.onToken;
    options.onToken = function(token) {
      return tokens.push(token);
    };
  }
  if (isArray(options.onComment)) {
    options.onComment = pushComment(options, options.onComment);
  }
  return options;
}
function pushComment(options, array) {
  return function(block, text, start, end, startLoc, endLoc) {
    var comment = {
      type: block ? "Block" : "Line",
      value: text,
      start,
      end
    };
    if (options.locations) {
      comment.loc = new SourceLocation(this, startLoc, endLoc);
    }
    if (options.ranges) {
      comment.range = [start, end];
    }
    array.push(comment);
  };
}
function functionFlags(async, generator) {
  return SCOPE_FUNCTION | (async ? SCOPE_ASYNC : 0) | (generator ? SCOPE_GENERATOR : 0);
}
function DestructuringErrors() {
  this.shorthandAssign = this.trailingComma = this.parenthesizedAssign = this.parenthesizedBind = this.doubleProto = -1;
}
function isPrivateNameConflicted(privateNameMap, element) {
  var name = element.key.name;
  var curr = privateNameMap[name];
  var next = "true";
  if (element.type === "MethodDefinition" && (element.kind === "get" || element.kind === "set")) {
    next = (element.static ? "s" : "i") + element.kind;
  }
  if (curr === "iget" && next === "iset" || curr === "iset" && next === "iget" || curr === "sget" && next === "sset" || curr === "sset" && next === "sget") {
    privateNameMap[name] = "true";
    return false;
  } else if (!curr) {
    privateNameMap[name] = next;
    return false;
  } else {
    return true;
  }
}
function checkKeyName(node, name) {
  var computed = node.computed;
  var key = node.key;
  return !computed && (key.type === "Identifier" && key.name === name || key.type === "Literal" && key.value === name);
}
function isPrivateFieldAccess(node) {
  return node.type === "MemberExpression" && node.property.type === "PrivateIdentifier" || node.type === "ChainExpression" && isPrivateFieldAccess(node.expression);
}
function finishNodeAt(node, type, pos, loc) {
  node.type = type;
  node.end = pos;
  if (this.options.locations) {
    node.loc.end = loc;
  }
  if (this.options.ranges) {
    node.range[1] = pos;
  }
  return node;
}
function buildUnicodeData(ecmaVersion) {
  var d = data[ecmaVersion] = {
    binary: wordsRegexp(unicodeBinaryProperties[ecmaVersion] + " " + unicodeGeneralCategoryValues),
    nonBinary: {
      General_Category: wordsRegexp(unicodeGeneralCategoryValues),
      Script: wordsRegexp(unicodeScriptValues[ecmaVersion])
    }
  };
  d.nonBinary.Script_Extensions = d.nonBinary.Script;
  d.nonBinary.gc = d.nonBinary.General_Category;
  d.nonBinary.sc = d.nonBinary.Script;
  d.nonBinary.scx = d.nonBinary.Script_Extensions;
}
function codePointToString(ch) {
  if (ch <= 65535) {
    return String.fromCharCode(ch);
  }
  ch -= 65536;
  return String.fromCharCode((ch >> 10) + 55296, (ch & 1023) + 56320);
}
function isSyntaxCharacter(ch) {
  return ch === 36 || ch >= 40 && ch <= 43 || ch === 46 || ch === 63 || ch >= 91 && ch <= 94 || ch >= 123 && ch <= 125;
}
function isRegExpIdentifierStart(ch) {
  return isIdentifierStart(ch, true) || ch === 36 || ch === 95;
}
function isRegExpIdentifierPart(ch) {
  return isIdentifierChar(ch, true) || ch === 36 || ch === 95 || ch === 8204 || ch === 8205;
}
function isControlLetter(ch) {
  return ch >= 65 && ch <= 90 || ch >= 97 && ch <= 122;
}
function isValidUnicode(ch) {
  return ch >= 0 && ch <= 1114111;
}
function isCharacterClassEscape(ch) {
  return ch === 100 || ch === 68 || ch === 115 || ch === 83 || ch === 119 || ch === 87;
}
function isUnicodePropertyNameCharacter(ch) {
  return isControlLetter(ch) || ch === 95;
}
function isUnicodePropertyValueCharacter(ch) {
  return isUnicodePropertyNameCharacter(ch) || isDecimalDigit(ch);
}
function isDecimalDigit(ch) {
  return ch >= 48 && ch <= 57;
}
function isHexDigit(ch) {
  return ch >= 48 && ch <= 57 || ch >= 65 && ch <= 70 || ch >= 97 && ch <= 102;
}
function hexToInt(ch) {
  if (ch >= 65 && ch <= 70) {
    return 10 + (ch - 65);
  }
  if (ch >= 97 && ch <= 102) {
    return 10 + (ch - 97);
  }
  return ch - 48;
}
function isOctalDigit(ch) {
  return ch >= 48 && ch <= 55;
}
function stringToNumber(str, isLegacyOctalNumericLiteral) {
  if (isLegacyOctalNumericLiteral) {
    return parseInt(str, 8);
  }
  return parseFloat(str.replace(/_/g, ""));
}
function stringToBigInt(str) {
  if (typeof BigInt !== "function") {
    return null;
  }
  return BigInt(str.replace(/_/g, ""));
}
function codePointToString$1(code) {
  if (code <= 65535) {
    return String.fromCharCode(code);
  }
  code -= 65536;
  return String.fromCharCode((code >> 10) + 55296, (code & 1023) + 56320);
}
function mkdirpath(path) {
  const dir = (0, import_path.dirname)(path);
  try {
    import_fs.default.readdirSync(dir);
  } catch (err) {
    mkdirpath(dir);
    try {
      import_fs.default.mkdirSync(dir);
    } catch (err2) {
      if (err2.code !== "EEXIST") {
        throw err2;
      }
    }
  }
}
function writeFile(dest, data2) {
  return new Promise((fulfil, reject) => {
    mkdirpath(dest);
    import_fs.default.writeFile(dest, data2, (err) => {
      if (err) {
        reject(err);
      } else {
        fulfil();
      }
    });
  });
}
function resolveIdViaPlugins(source, importer, pluginDriver, moduleLoaderResolveId, skip, customOptions) {
  let skipped = null;
  let replaceContext = null;
  if (skip) {
    skipped = new Set();
    for (const skippedCall of skip) {
      if (source === skippedCall.source && importer === skippedCall.importer) {
        skipped.add(skippedCall.plugin);
      }
    }
    replaceContext = (pluginContext, plugin) => __spreadProps(__spreadValues({}, pluginContext), {
      resolve: (source2, importer2, { custom, skipSelf } = BLANK) => {
        return moduleLoaderResolveId(source2, importer2, custom, skipSelf ? [...skip, { importer: importer2, plugin, source: source2 }] : skip);
      }
    });
  }
  return pluginDriver.hookFirst("resolveId", [source, importer, { custom: customOptions }], replaceContext, skipped);
}
async function resolveId(source, importer, preserveSymlinks, pluginDriver, moduleLoaderResolveId, skip, customOptions) {
  const pluginResult = await resolveIdViaPlugins(source, importer, pluginDriver, moduleLoaderResolveId, skip, customOptions);
  if (pluginResult != null)
    return pluginResult;
  if (importer !== void 0 && !isAbsolute(source) && source[0] !== ".")
    return null;
  return addJsExtensionIfNecessary(importer ? (0, import_path.resolve)((0, import_path.dirname)(importer), source) : (0, import_path.resolve)(source), preserveSymlinks);
}
function addJsExtensionIfNecessary(file, preserveSymlinks) {
  let found = findFile(file, preserveSymlinks);
  if (found)
    return found;
  found = findFile(file + ".mjs", preserveSymlinks);
  if (found)
    return found;
  found = findFile(file + ".js", preserveSymlinks);
  return found;
}
function findFile(file, preserveSymlinks) {
  try {
    const stats = (0, import_fs.lstatSync)(file);
    if (!preserveSymlinks && stats.isSymbolicLink())
      return findFile((0, import_fs.realpathSync)(file), preserveSymlinks);
    if (preserveSymlinks && stats.isSymbolicLink() || stats.isFile()) {
      const name = (0, import_path.basename)(file);
      const files = (0, import_fs.readdirSync)((0, import_path.dirname)(file));
      if (files.indexOf(name) !== -1)
        return file;
    }
  } catch (_a) {
  }
}
function throwPluginError(err, plugin, { hook, id } = {}) {
  if (typeof err === "string")
    err = { message: err };
  if (err.code && err.code !== Errors.PLUGIN_ERROR) {
    err.pluginCode = err.code;
  }
  err.code = Errors.PLUGIN_ERROR;
  err.plugin = plugin;
  if (hook) {
    err.hook = hook;
  }
  if (id) {
    err.id = id;
  }
  return error(err);
}
function warnDeprecatedHooks(plugins, options) {
  for (const { active, deprecated, replacement } of deprecatedHooks) {
    for (const plugin of plugins) {
      if (deprecated in plugin) {
        warnDeprecation({
          message: `The "${deprecated}" hook used by plugin ${plugin.name} is deprecated. The "${replacement}" hook should be used instead.`,
          plugin: plugin.name
        }, active, options);
      }
    }
  }
}
function createPluginCache(cache) {
  return {
    delete(id) {
      return delete cache[id];
    },
    get(id) {
      const item = cache[id];
      if (!item)
        return void 0;
      item[0] = 0;
      return item[1];
    },
    has(id) {
      const item = cache[id];
      if (!item)
        return false;
      item[0] = 0;
      return true;
    },
    set(id, value) {
      cache[id] = [0, value];
    }
  };
}
function getTrackedPluginCache(pluginCache, onUse) {
  return {
    delete(id) {
      onUse();
      return pluginCache.delete(id);
    },
    get(id) {
      onUse();
      return pluginCache.get(id);
    },
    has(id) {
      onUse();
      return pluginCache.has(id);
    },
    set(id, value) {
      onUse();
      return pluginCache.set(id, value);
    }
  };
}
function uncacheablePluginError(pluginName) {
  if (pluginName.startsWith(ANONYMOUS_PLUGIN_PREFIX) || pluginName.startsWith(ANONYMOUS_OUTPUT_PLUGIN_PREFIX)) {
    return error({
      code: "ANONYMOUS_PLUGIN_CACHE",
      message: "A plugin is trying to use the Rollup cache but is not declaring a plugin name or cacheKey."
    });
  }
  return error({
    code: "DUPLICATE_PLUGIN_NAME",
    message: `The plugin name ${pluginName} is being used twice in the same build. Plugin names must be distinct or provide a cacheKey (please post an issue to the plugin if you are a plugin user).`
  });
}
function getCacheForUncacheablePlugin(pluginName) {
  return {
    delete() {
      return uncacheablePluginError(pluginName);
    },
    get() {
      return uncacheablePluginError(pluginName);
    },
    has() {
      return uncacheablePluginError(pluginName);
    },
    set() {
      return uncacheablePluginError(pluginName);
    }
  };
}
function transform(source, module2, pluginDriver, warn) {
  const id = module2.id;
  const sourcemapChain = [];
  let originalSourcemap = source.map === null ? null : decodedSourcemap(source.map);
  const originalCode = source.code;
  let ast = source.ast;
  const transformDependencies = [];
  const emittedFiles = [];
  let customTransformCache = false;
  const useCustomTransformCache = () => customTransformCache = true;
  let curPlugin;
  const curSource = source.code;
  function transformReducer(previousCode, result, plugin) {
    let code;
    let map;
    if (typeof result === "string") {
      code = result;
    } else if (result && typeof result === "object") {
      module2.updateOptions(result);
      if (result.code == null) {
        if (result.map || result.ast) {
          warn(errNoTransformMapOrAstWithoutCode(plugin.name));
        }
        return previousCode;
      }
      ({ code, map, ast } = result);
    } else {
      return previousCode;
    }
    if (map !== null) {
      sourcemapChain.push(decodedSourcemap(typeof map === "string" ? JSON.parse(map) : map) || {
        missing: true,
        plugin: plugin.name
      });
    }
    return code;
  }
  return pluginDriver.hookReduceArg0("transform", [curSource, id], transformReducer, (pluginContext, plugin) => {
    curPlugin = plugin;
    return __spreadProps(__spreadValues({}, pluginContext), {
      addWatchFile(id2) {
        transformDependencies.push(id2);
        pluginContext.addWatchFile(id2);
      },
      cache: customTransformCache ? pluginContext.cache : getTrackedPluginCache(pluginContext.cache, useCustomTransformCache),
      emitAsset(name, source2) {
        emittedFiles.push({ name, source: source2, type: "asset" });
        return pluginContext.emitAsset(name, source2);
      },
      emitChunk(id2, options) {
        emittedFiles.push({ id: id2, name: options && options.name, type: "chunk" });
        return pluginContext.emitChunk(id2, options);
      },
      emitFile(emittedFile) {
        emittedFiles.push(emittedFile);
        return pluginDriver.emitFile(emittedFile);
      },
      error(err, pos) {
        if (typeof err === "string")
          err = { message: err };
        if (pos)
          augmentCodeLocation(err, pos, curSource, id);
        err.id = id;
        err.hook = "transform";
        return pluginContext.error(err);
      },
      getCombinedSourcemap() {
        const combinedMap = collapseSourcemap(id, originalCode, originalSourcemap, sourcemapChain, warn);
        if (!combinedMap) {
          const magicString = new MagicString$1(originalCode);
          return magicString.generateMap({ hires: true, includeContent: true, source: id });
        }
        if (originalSourcemap !== combinedMap) {
          originalSourcemap = combinedMap;
          sourcemapChain.length = 0;
        }
        return new SourceMap(__spreadProps(__spreadValues({}, combinedMap), {
          file: null,
          sourcesContent: combinedMap.sourcesContent
        }));
      },
      setAssetSource() {
        return this.error({
          code: "INVALID_SETASSETSOURCE",
          message: `setAssetSource cannot be called in transform for caching reasons. Use emitFile with a source, or call setAssetSource in another hook.`
        });
      },
      warn(warning, pos) {
        if (typeof warning === "string")
          warning = { message: warning };
        if (pos)
          augmentCodeLocation(warning, pos, curSource, id);
        warning.id = id;
        warning.hook = "transform";
        pluginContext.warn(warning);
      }
    });
  }).catch((err) => throwPluginError(err, curPlugin.name, { hook: "transform", id })).then((code) => {
    if (!customTransformCache) {
      if (emittedFiles.length)
        module2.transformFiles = emittedFiles;
    }
    return {
      ast,
      code,
      customTransformCache,
      meta: module2.info.meta,
      originalCode,
      originalSourcemap,
      sourcemapChain,
      transformDependencies
    };
  });
}
function normalizeRelativeExternalId(source, importer) {
  return isRelative(source) ? importer ? (0, import_path.resolve)(importer, "..", source) : (0, import_path.resolve)(source) : source;
}
function addChunkNamesToModule(module2, { fileName, name }, isUserDefined) {
  if (fileName !== null) {
    module2.chunkFileNames.add(fileName);
  } else if (name !== null) {
    if (module2.chunkName === null) {
      module2.chunkName = name;
    }
    if (isUserDefined) {
      module2.userChunkNames.add(name);
    }
  }
}
function isNotAbsoluteExternal(id, source, makeAbsoluteExternalsRelative) {
  return makeAbsoluteExternalsRelative === true || makeAbsoluteExternalsRelative === "ifRelativeSource" && isRelative(source) || !isAbsolute(id);
}
function getDeprecatedContextHandler(handler, handlerName, newHandlerName, pluginName, activeDeprecation, options) {
  let deprecationWarningShown = false;
  return (...args) => {
    if (!deprecationWarningShown) {
      deprecationWarningShown = true;
      warnDeprecation({
        message: `The "this.${handlerName}" plugin context function used by plugin ${pluginName} is deprecated. The "this.${newHandlerName}" plugin context function should be used instead.`,
        plugin: pluginName
      }, activeDeprecation, options);
    }
    return handler(...args);
  };
}
function getPluginContext(plugin, pluginCache, graph, options, fileEmitter, existingPluginNames) {
  let cacheable = true;
  if (typeof plugin.cacheKey !== "string") {
    if (plugin.name.startsWith(ANONYMOUS_PLUGIN_PREFIX) || plugin.name.startsWith(ANONYMOUS_OUTPUT_PLUGIN_PREFIX) || existingPluginNames.has(plugin.name)) {
      cacheable = false;
    } else {
      existingPluginNames.add(plugin.name);
    }
  }
  let cacheInstance;
  if (!pluginCache) {
    cacheInstance = NO_CACHE;
  } else if (cacheable) {
    const cacheKey = plugin.cacheKey || plugin.name;
    cacheInstance = createPluginCache(pluginCache[cacheKey] || (pluginCache[cacheKey] = Object.create(null)));
  } else {
    cacheInstance = getCacheForUncacheablePlugin(plugin.name);
  }
  const context = {
    addWatchFile(id) {
      if (graph.phase >= BuildPhase.GENERATE) {
        return this.error(errInvalidRollupPhaseForAddWatchFile());
      }
      graph.watchFiles[id] = true;
    },
    cache: cacheInstance,
    emitAsset: getDeprecatedContextHandler((name, source) => fileEmitter.emitFile({ name, source, type: "asset" }), "emitAsset", "emitFile", plugin.name, true, options),
    emitChunk: getDeprecatedContextHandler((id, options2) => fileEmitter.emitFile({ id, name: options2 && options2.name, type: "chunk" }), "emitChunk", "emitFile", plugin.name, true, options),
    emitFile: fileEmitter.emitFile.bind(fileEmitter),
    error(err) {
      return throwPluginError(err, plugin.name);
    },
    getAssetFileName: getDeprecatedContextHandler(fileEmitter.getFileName, "getAssetFileName", "getFileName", plugin.name, true, options),
    getChunkFileName: getDeprecatedContextHandler(fileEmitter.getFileName, "getChunkFileName", "getFileName", plugin.name, true, options),
    getFileName: fileEmitter.getFileName,
    getModuleIds: () => graph.modulesById.keys(),
    getModuleInfo: graph.getModuleInfo,
    getWatchFiles: () => Object.keys(graph.watchFiles),
    isExternal: getDeprecatedContextHandler((id, parentId, isResolved = false) => options.external(id, parentId, isResolved), "isExternal", "resolve", plugin.name, true, options),
    meta: {
      rollupVersion: version$1,
      watchMode: graph.watchMode
    },
    get moduleIds() {
      function* wrappedModuleIds() {
        warnDeprecation({
          message: `Accessing "this.moduleIds" on the plugin context by plugin ${plugin.name} is deprecated. The "this.getModuleIds" plugin context function should be used instead.`,
          plugin: plugin.name
        }, false, options);
        yield* moduleIds;
      }
      const moduleIds = graph.modulesById.keys();
      return wrappedModuleIds();
    },
    parse: graph.contextParse.bind(graph),
    resolve(source, importer, { custom, skipSelf } = BLANK) {
      return graph.moduleLoader.resolveId(source, importer, custom, skipSelf ? [{ importer, plugin, source }] : null);
    },
    resolveId: getDeprecatedContextHandler((source, importer) => graph.moduleLoader.resolveId(source, importer, BLANK).then((resolveId2) => resolveId2 && resolveId2.id), "resolveId", "resolve", plugin.name, true, options),
    setAssetSource: fileEmitter.setAssetSource,
    warn(warning) {
      if (typeof warning === "string")
        warning = { message: warning };
      if (warning.code)
        warning.pluginCode = warning.code;
      warning.code = "PLUGIN_WARNING";
      warning.plugin = plugin.name;
      options.onwarn(warning);
    }
  };
  return context;
}
function throwInvalidHookError(hookName, pluginName) {
  return error({
    code: "INVALID_PLUGIN_HOOK",
    message: `Error running plugin hook ${hookName} for ${pluginName}, expected a function hook.`
  });
}
function normalizeEntryModules(entryModules) {
  if (Array.isArray(entryModules)) {
    return entryModules.map((id) => ({
      fileName: null,
      id,
      implicitlyLoadedAfter: [],
      importer: void 0,
      name: null
    }));
  }
  return Object.entries(entryModules).map(([name, id]) => ({
    fileName: null,
    id,
    implicitlyLoadedAfter: [],
    importer: void 0,
    name
  }));
}
function ensureArray(items) {
  if (Array.isArray(items)) {
    return items.filter(Boolean);
  }
  if (items) {
    return [items];
  }
  return [];
}
function warnUnknownOptions(passedOptions, validOptions, optionType, warn, ignoredKeys = /$./) {
  const validOptionSet = new Set(validOptions);
  const unknownOptions = Object.keys(passedOptions).filter((key) => !(validOptionSet.has(key) || ignoredKeys.test(key)));
  if (unknownOptions.length > 0) {
    warn({
      code: "UNKNOWN_OPTION",
      message: `Unknown ${optionType}: ${unknownOptions.join(", ")}. Allowed options: ${[
        ...validOptionSet
      ].sort().join(", ")}`
    });
  }
}
function normalizeInputOptions(config) {
  var _a, _b, _c;
  const unsetOptions = new Set();
  const context = (_a = config.context) !== null && _a !== void 0 ? _a : "undefined";
  const onwarn = getOnwarn(config);
  const strictDeprecations = config.strictDeprecations || false;
  const options = {
    acorn: getAcorn(config),
    acornInjectPlugins: getAcornInjectPlugins(config),
    cache: getCache(config),
    context,
    experimentalCacheExpiry: (_b = config.experimentalCacheExpiry) !== null && _b !== void 0 ? _b : 10,
    external: getIdMatcher(config.external),
    inlineDynamicImports: getInlineDynamicImports$1(config, onwarn, strictDeprecations),
    input: getInput(config),
    makeAbsoluteExternalsRelative: (_c = config.makeAbsoluteExternalsRelative) !== null && _c !== void 0 ? _c : true,
    manualChunks: getManualChunks$1(config, onwarn, strictDeprecations),
    maxParallelFileReads: getMaxParallelFileReads(config),
    moduleContext: getModuleContext(config, context),
    onwarn,
    perf: config.perf || false,
    plugins: ensureArray(config.plugins),
    preserveEntrySignatures: getPreserveEntrySignatures(config, unsetOptions),
    preserveModules: getPreserveModules$1(config, onwarn, strictDeprecations),
    preserveSymlinks: config.preserveSymlinks || false,
    shimMissingExports: config.shimMissingExports || false,
    strictDeprecations,
    treeshake: getTreeshake(config, onwarn, strictDeprecations)
  };
  warnUnknownOptions(config, [...Object.keys(options), "watch"], "input options", options.onwarn, /^(output)$/);
  return { options, unsetOptions };
}
function sanitizeFileName(name) {
  const match = /^[a-z]:/i.exec(name);
  const driveLetter = match ? match[0] : "";
  return driveLetter + name.substr(driveLetter.length).replace(/[\0?*:]/g, "_");
}
function normalizeOutputOptions(config, inputOptions, unsetInputOptions) {
  var _a, _b, _c, _d, _e, _f, _g;
  const unsetOptions = new Set(unsetInputOptions);
  const compact = config.compact || false;
  const format = getFormat(config);
  const inlineDynamicImports = getInlineDynamicImports(config, inputOptions);
  const preserveModules = getPreserveModules(config, inlineDynamicImports, inputOptions);
  const file = getFile(config, preserveModules, inputOptions);
  const outputOptions = {
    amd: getAmd(config),
    assetFileNames: (_a = config.assetFileNames) !== null && _a !== void 0 ? _a : "assets/[name]-[hash][extname]",
    banner: getAddon(config, "banner"),
    chunkFileNames: (_b = config.chunkFileNames) !== null && _b !== void 0 ? _b : "[name]-[hash].js",
    compact,
    dir: getDir(config, file),
    dynamicImportFunction: getDynamicImportFunction(config, inputOptions),
    entryFileNames: getEntryFileNames(config, unsetOptions),
    esModule: (_c = config.esModule) !== null && _c !== void 0 ? _c : true,
    exports: getExports(config, unsetOptions),
    extend: config.extend || false,
    externalLiveBindings: (_d = config.externalLiveBindings) !== null && _d !== void 0 ? _d : true,
    file,
    footer: getAddon(config, "footer"),
    format,
    freeze: (_e = config.freeze) !== null && _e !== void 0 ? _e : true,
    globals: config.globals || {},
    hoistTransitiveImports: (_f = config.hoistTransitiveImports) !== null && _f !== void 0 ? _f : true,
    indent: getIndent(config, compact),
    inlineDynamicImports,
    interop: getInterop(config, inputOptions),
    intro: getAddon(config, "intro"),
    manualChunks: getManualChunks(config, inlineDynamicImports, preserveModules, inputOptions),
    minifyInternalExports: getMinifyInternalExports(config, format, compact),
    name: config.name,
    namespaceToStringTag: config.namespaceToStringTag || false,
    noConflict: config.noConflict || false,
    outro: getAddon(config, "outro"),
    paths: config.paths || {},
    plugins: ensureArray(config.plugins),
    preferConst: config.preferConst || false,
    preserveModules,
    preserveModulesRoot: getPreserveModulesRoot(config),
    sanitizeFileName: typeof config.sanitizeFileName === "function" ? config.sanitizeFileName : config.sanitizeFileName === false ? (id) => id : sanitizeFileName,
    sourcemap: config.sourcemap || false,
    sourcemapExcludeSources: config.sourcemapExcludeSources || false,
    sourcemapFile: config.sourcemapFile,
    sourcemapPathTransform: config.sourcemapPathTransform,
    strict: (_g = config.strict) !== null && _g !== void 0 ? _g : true,
    systemNullSetters: config.systemNullSetters || false,
    validate: config.validate || false
  };
  warnUnknownOptions(config, Object.keys(outputOptions), "output options", inputOptions.onwarn);
  return { options: outputOptions, unsetOptions };
}
function getExports(config, unsetOptions) {
  const configExports = config.exports;
  if (configExports == null) {
    unsetOptions.add("exports");
  } else if (!["default", "named", "none", "auto"].includes(configExports)) {
    return error(errInvalidExportOptionValue(configExports));
  }
  return configExports || "auto";
}
function rollup(rawInputOptions) {
  return rollupInternal(rawInputOptions, null);
}
async function rollupInternal(rawInputOptions, watcher) {
  const { options: inputOptions, unsetOptions: unsetInputOptions } = await getInputOptions(rawInputOptions, watcher !== null);
  initialiseTimers(inputOptions);
  const graph = new Graph(inputOptions, watcher);
  const useCache = rawInputOptions.cache !== false;
  delete inputOptions.cache;
  delete rawInputOptions.cache;
  timeStart("BUILD", 1);
  try {
    await graph.pluginDriver.hookParallel("buildStart", [inputOptions]);
    await graph.build();
  } catch (err) {
    const watchFiles = Object.keys(graph.watchFiles);
    if (watchFiles.length > 0) {
      err.watchFiles = watchFiles;
    }
    await graph.pluginDriver.hookParallel("buildEnd", [err]);
    await graph.pluginDriver.hookParallel("closeBundle", []);
    throw err;
  }
  await graph.pluginDriver.hookParallel("buildEnd", []);
  timeEnd("BUILD", 1);
  const result = {
    cache: useCache ? graph.getCache() : void 0,
    async close() {
      if (result.closed)
        return;
      result.closed = true;
      await graph.pluginDriver.hookParallel("closeBundle", []);
    },
    closed: false,
    async generate(rawOutputOptions) {
      if (result.closed)
        return error(errAlreadyClosed());
      return handleGenerateWrite(false, inputOptions, unsetInputOptions, rawOutputOptions, graph);
    },
    watchFiles: Object.keys(graph.watchFiles),
    async write(rawOutputOptions) {
      if (result.closed)
        return error(errAlreadyClosed());
      return handleGenerateWrite(true, inputOptions, unsetInputOptions, rawOutputOptions, graph);
    }
  };
  if (inputOptions.perf)
    result.getTimings = getTimings;
  return result;
}
async function getInputOptions(rawInputOptions, watchMode) {
  if (!rawInputOptions) {
    throw new Error("You must supply an options object to rollup");
  }
  const rawPlugins = ensureArray(rawInputOptions.plugins);
  const { options, unsetOptions } = normalizeInputOptions(await rawPlugins.reduce(applyOptionHook(watchMode), Promise.resolve(rawInputOptions)));
  normalizePlugins(options.plugins, ANONYMOUS_PLUGIN_PREFIX);
  return { options, unsetOptions };
}
function applyOptionHook(watchMode) {
  return async (inputOptions, plugin) => {
    if (plugin.options) {
      return await plugin.options.call({ meta: { rollupVersion: version$1, watchMode } }, await inputOptions) || inputOptions;
    }
    return inputOptions;
  };
}
function normalizePlugins(plugins, anonymousPrefix) {
  for (let pluginIndex = 0; pluginIndex < plugins.length; pluginIndex++) {
    const plugin = plugins[pluginIndex];
    if (!plugin.name) {
      plugin.name = `${anonymousPrefix}${pluginIndex + 1}`;
    }
  }
}
async function handleGenerateWrite(isWrite, inputOptions, unsetInputOptions, rawOutputOptions, graph) {
  const { options: outputOptions, outputPluginDriver, unsetOptions } = getOutputOptionsAndPluginDriver(rawOutputOptions, graph.pluginDriver, inputOptions, unsetInputOptions);
  const bundle = new Bundle2(outputOptions, unsetOptions, inputOptions, outputPluginDriver, graph);
  const generated = await bundle.generate(isWrite);
  if (isWrite) {
    if (!outputOptions.dir && !outputOptions.file) {
      return error({
        code: "MISSING_OPTION",
        message: 'You must specify "output.file" or "output.dir" for the build.'
      });
    }
    await Promise.all(Object.values(generated).map((chunk) => writeOutputFile(chunk, outputOptions)));
    await outputPluginDriver.hookParallel("writeBundle", [outputOptions, generated]);
  }
  return createOutput(generated);
}
function getOutputOptionsAndPluginDriver(rawOutputOptions, inputPluginDriver, inputOptions, unsetInputOptions) {
  if (!rawOutputOptions) {
    throw new Error("You must supply an options object");
  }
  const rawPlugins = ensureArray(rawOutputOptions.plugins);
  normalizePlugins(rawPlugins, ANONYMOUS_OUTPUT_PLUGIN_PREFIX);
  const outputPluginDriver = inputPluginDriver.createOutputPluginDriver(rawPlugins);
  return __spreadProps(__spreadValues({}, getOutputOptions(inputOptions, unsetInputOptions, rawOutputOptions, outputPluginDriver)), {
    outputPluginDriver
  });
}
function getOutputOptions(inputOptions, unsetInputOptions, rawOutputOptions, outputPluginDriver) {
  return normalizeOutputOptions(outputPluginDriver.hookReduceArg0Sync("outputOptions", [rawOutputOptions.output || rawOutputOptions], (outputOptions, result) => result || outputOptions, (pluginContext) => {
    const emitError = () => pluginContext.error(errCannotEmitFromOptionsHook());
    return __spreadProps(__spreadValues({}, pluginContext), {
      emitFile: emitError,
      setAssetSource: emitError
    });
  }), inputOptions, unsetInputOptions);
}
function createOutput(outputBundle) {
  return {
    output: Object.values(outputBundle).filter((outputFile) => Object.keys(outputFile).length > 0).sort((outputFileA, outputFileB) => {
      const fileTypeA = getSortingFileType(outputFileA);
      const fileTypeB = getSortingFileType(outputFileB);
      if (fileTypeA === fileTypeB)
        return 0;
      return fileTypeA < fileTypeB ? -1 : 1;
    })
  };
}
function getSortingFileType(file) {
  if (file.type === "asset") {
    return SortingFileType.ASSET;
  }
  if (file.isEntry) {
    return SortingFileType.ENTRY_CHUNK;
  }
  return SortingFileType.SECONDARY_CHUNK;
}
function writeOutputFile(outputFile, outputOptions) {
  const fileName = (0, import_path.resolve)(outputOptions.dir || (0, import_path.dirname)(outputOptions.file), outputFile.fileName);
  let writeSourceMapPromise;
  let source;
  if (outputFile.type === "asset") {
    source = outputFile.source;
  } else {
    source = outputFile.code;
    if (outputOptions.sourcemap && outputFile.map) {
      let url;
      if (outputOptions.sourcemap === "inline") {
        url = outputFile.map.toUrl();
      } else {
        url = `${(0, import_path.basename)(outputFile.fileName)}.map`;
        writeSourceMapPromise = writeFile(`${fileName}.map`, outputFile.map.toString());
      }
      if (outputOptions.sourcemap !== "hidden") {
        source += `//# ${SOURCEMAPPING_URL}=${url}
`;
      }
    }
  }
  return Promise.all([writeFile(fileName, source), writeSourceMapPromise]);
}
var import_path, import_crypto, import_fs, import_events, version$1, charToInteger, chars$1, i, BitSet, Chunk$1, btoa, SourceMap, toString$1, Mappings, n, warned, MagicString, hasOwnProp, Bundle$1, MagicString$1, RESERVED_NAMES, UnknownKey, UnknownInteger, EMPTY_PATH, UNKNOWN_PATH, UNKNOWN_INTEGER_PATH, EntitiesKey, PathTracker, SHARED_RECURSION_TRACKER, DiscriminatedPathTracker, UnknownValue, ExpressionEntity, UNKNOWN_EXPRESSION, Variable, ExternalVariable, BLANK, EMPTY_OBJECT, EMPTY_ARRAY, reservedWords$1, builtins$1, blacklisted, illegalCharacters, startsWithDigit, absolutePath, relativePath, ExternalModule, extractors, extractAssignedNames, BROKEN_FLOW_NONE, BROKEN_FLOW_BREAK_CONTINUE, BROKEN_FLOW_ERROR_RETURN_LABEL, base$1, ArrowFunctionExpression$1, BinaryExpression$1, BlockStatement$1, CallExpression$1, ChainExpression$1, ConditionalExpression$1, ExpressionStatement$1, Identifier$1, ImportDefaultSpecifier$1, ImportNamespaceSpecifier$1, LogicalExpression$1, NewExpression$1, Program$1, Property$1, ReturnStatement$1, SequenceExpression$1, SOURCEMAPPING_URL, whiteSpaceNoNewline, SOURCEMAPPING_URL_RE, ANNOTATION_KEY, INVALID_COMMENT_KEY, neitherWithespaceNorBrackets, noWhitespace, pureCommentRegex, keys, INCLUDE_PARAMETERS, NodeBase, ExportAllDeclaration, NO_SEMICOLON, NON_WHITESPACE, chars, base, NO_ARGS, UNDEFINED_EXPRESSION, returnsUnknown, UNKNOWN_LITERAL_BOOLEAN, returnsBoolean, UNKNOWN_LITERAL_NUMBER, returnsNumber, UNKNOWN_LITERAL_STRING, returnsString, objectMembers, literalBooleanMembers, literalNumberMembers, literalStringMembers, LocalVariable, Scope$1, ChildScope, ValueProperties, PURE, IMPURE, O, PF, C, PC, ARRAY_TYPE, INTL_MEMBER, knownGlobals, GlobalVariable, tdzVariableKinds, Identifier, EVENT_ACCESSED, EVENT_ASSIGNED, EVENT_CALLED, MethodBase, MethodDefinition, INTEGER_REG_EXP, ObjectEntity, ObjectMember, Method, METHOD_RETURNS_BOOLEAN, METHOD_RETURNS_STRING, METHOD_RETURNS_NUMBER, METHOD_RETURNS_UNKNOWN, OBJECT_PROTOTYPE, ClassNode, ClassDeclaration, ArgumentsVariable, ThisVariable, SpreadElement, ParameterScope, ReturnValueScope, FunctionScope, RestElement, FunctionNode, FunctionDeclaration, ExportDefaultDeclaration, Literal, Program, TemplateLiteral, VariableDeclaration, NEW_ARRAY_PROPERTIES, METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_BOOLEAN, METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NUMBER, METHOD_MUTATES_SELF_RETURNS_NEW_ARRAY, METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY, METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NEW_ARRAY, METHOD_MUTATES_SELF_RETURNS_NUMBER, METHOD_MUTATES_SELF_RETURNS_UNKNOWN, METHOD_DEOPTS_SELF_RETURNS_UNKNOWN, METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN, METHOD_MUTATES_SELF_RETURNS_SELF, METHOD_CALLS_ARG_MUTATES_SELF_RETURNS_SELF, ARRAY_PROTOTYPE, ArrayExpression, ArrayPattern, BlockScope, ExpressionStatement, BlockStatement, ArrowFunctionExpression, ObjectPattern, AssignmentExpression, AssignmentPattern, AwaitExpression, binaryOperators, BinaryExpression, BreakStatement, MAX_PATH_DEPTH, MemberExpression, CallExpression, CatchScope, CatchClause, ChainExpression, ClassBodyScope, ClassBody, ClassExpression, MultiExpression, ConditionalExpression, ContinueStatement, DoWhileStatement, EmptyStatement, ExportNamedDeclaration, ExportSpecifier, ForInStatement, ForOfStatement, ForStatement, FunctionExpression, TrackingScope, unset, IfStatement, ImportDeclaration, ImportDefaultSpecifier, INTEROP_DEFAULT_VARIABLE, INTEROP_DEFAULT_LEGACY_VARIABLE, INTEROP_NAMESPACE_VARIABLE, INTEROP_NAMESPACE_DEFAULT_VARIABLE, INTEROP_NAMESPACE_DEFAULT_ONLY_VARIABLE, defaultInteropHelpersByInteropType, namespaceInteropHelpersByInteropType, HELPER_GENERATORS, HELPER_NAMES, ImportExpression, accessedImportGlobals, ImportNamespaceSpecifier, ImportSpecifier, LabeledStatement, LogicalExpression, Errors, ASSET_PREFIX, CHUNK_PREFIX, FILE_PREFIX, MetaProperty, accessedMetaUrlGlobals, accessedFileUrlGlobals, getResolveUrl, getRelativeUrlFromDocument, getGenericImportMetaMechanism, getUrlFromDocument, relativeUrlMechanisms, importMetaMechanisms, NewExpression, ObjectExpression, PrivateIdentifier, Property, PropertyDefinition, ReturnStatement, SequenceExpression, Super, SwitchCase, SwitchStatement, TaggedTemplateExpression, TemplateElement, UndefinedVariable, ExportDefaultVariable, ModuleScope, ThisExpression, ThrowStatement, TryStatement, unaryOperators, UnaryExpression, UnknownNode, UpdateExpression, VariableDeclarator, WhileStatement, YieldExpression, nodeConstructors, MISSING_EXPORT_SHIM_VARIABLE, ExportShimVariable, NamespaceVariable, SyntheticNamedExportVariable, getPropertyAccess, NOOP, getStartTime, getElapsedTime, getMemory, timers, normalizeHrTime, timeStart, timeEnd, TIMED_PLUGIN_HOOKS, MISSING_EXPORT_SHIM_DESCRIPTION, Module, builtins, shouldUseDot, thisProp, getStarExcludesBlock, getImportBindingsBlock, getHoistedExportsBlock, getMissingExportsBlock, getSyntheticExportsBlock, finalisers, Source, Link, createHash, DECONFLICT_IMPORTED_VARIABLES_BY_FORMAT, needsEscapeRegEx, quoteNewlineRegEx, backSlashRegEx, NON_ASSET_EXTENSIONS, Chunk2, BuildPhase, FILE_PLACEHOLDER, FileEmitter, concatSep, concatDblSep, compareExecIndex, Bundle2, reservedWords, ecma5AndLessKeywords, keywords, keywordRelationalOperator, nonASCIIidentifierStartChars, nonASCIIidentifierChars, nonASCIIidentifierStart, nonASCIIidentifier, astralIdentifierStartCodes, astralIdentifierCodes, TokenType, beforeExpr, startsExpr, keywords$1, types, lineBreak, lineBreakG, nonASCIIwhitespace, skipWhiteSpace, ref, hasOwnProperty, toString5, isArray, Position, SourceLocation, defaultOptions, warnedAboutEcmaVersion, SCOPE_TOP, SCOPE_FUNCTION, SCOPE_VAR, SCOPE_ASYNC, SCOPE_GENERATOR, SCOPE_ARROW, SCOPE_SIMPLE_CATCH, SCOPE_SUPER, SCOPE_DIRECT_SUPER, BIND_NONE, BIND_VAR, BIND_LEXICAL, BIND_FUNCTION, BIND_SIMPLE_CATCH, BIND_OUTSIDE, Parser, prototypeAccessors, pp, literal, pp$1, loopLabel, switchLabel, empty, FUNC_STATEMENT, FUNC_HANGING_STATEMENT, FUNC_NULLABLE_ID, pp$2, pp$3, empty$1, pp$4, pp$5, Scope, Node, pp$6, TokContext, types$1, pp$7, ecma9BinaryProperties, ecma10BinaryProperties, ecma11BinaryProperties, ecma12BinaryProperties, unicodeBinaryProperties, unicodeGeneralCategoryValues, ecma9ScriptValues, ecma10ScriptValues, ecma11ScriptValues, ecma12ScriptValues, unicodeScriptValues, data, pp$8, RegExpValidationState, Token, pp$9, INVALID_TEMPLATE_ESCAPE_ERROR, version, readFile, Queue, ANONYMOUS_PLUGIN_PREFIX, ANONYMOUS_OUTPUT_PLUGIN_PREFIX, deprecatedHooks, NO_CACHE, ModuleLoader, GlobalScope, inputHookNames, inputHooks, PluginDriver, Graph, defaultOnWarn, treeshakePresets, getOnwarn, getAcorn, getAcornInjectPlugins, getCache, getIdMatcher, getInlineDynamicImports$1, getInput, getManualChunks$1, getMaxParallelFileReads, getModuleContext, getPreserveEntrySignatures, getPreserveModules$1, getTreeshake, getHasModuleSideEffects, getFile, getFormat, getInlineDynamicImports, getPreserveModules, getPreserveModulesRoot, getAmd, getAddon, getDir, getDynamicImportFunction, getEntryFileNames, getIndent, ALLOWED_INTEROP_TYPES, getInterop, getManualChunks, getMinifyInternalExports, SortingFileType;
var init_rollup = __esm({
  "node_modules/rollup/dist/es/shared/rollup.js"() {
    init_cjs_shims();
    import_path = __toModule(require("path"));
    import_crypto = __toModule(require("crypto"));
    import_fs = __toModule(require("fs"));
    import_events = __toModule(require("events"));
    version$1 = "2.56.3";
    charToInteger = {};
    chars$1 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    for (i = 0; i < chars$1.length; i++) {
      charToInteger[chars$1.charCodeAt(i)] = i;
    }
    BitSet = function BitSet2(arg) {
      this.bits = arg instanceof BitSet2 ? arg.bits.slice() : [];
    };
    BitSet.prototype.add = function add(n2) {
      this.bits[n2 >> 5] |= 1 << (n2 & 31);
    };
    BitSet.prototype.has = function has(n2) {
      return !!(this.bits[n2 >> 5] & 1 << (n2 & 31));
    };
    Chunk$1 = function Chunk(start, end, content) {
      this.start = start;
      this.end = end;
      this.original = content;
      this.intro = "";
      this.outro = "";
      this.content = content;
      this.storeName = false;
      this.edited = false;
      Object.defineProperties(this, {
        previous: { writable: true, value: null },
        next: { writable: true, value: null }
      });
    };
    Chunk$1.prototype.appendLeft = function appendLeft(content) {
      this.outro += content;
    };
    Chunk$1.prototype.appendRight = function appendRight(content) {
      this.intro = this.intro + content;
    };
    Chunk$1.prototype.clone = function clone() {
      var chunk = new Chunk$1(this.start, this.end, this.original);
      chunk.intro = this.intro;
      chunk.outro = this.outro;
      chunk.content = this.content;
      chunk.storeName = this.storeName;
      chunk.edited = this.edited;
      return chunk;
    };
    Chunk$1.prototype.contains = function contains(index) {
      return this.start < index && index < this.end;
    };
    Chunk$1.prototype.eachNext = function eachNext(fn) {
      var chunk = this;
      while (chunk) {
        fn(chunk);
        chunk = chunk.next;
      }
    };
    Chunk$1.prototype.eachPrevious = function eachPrevious(fn) {
      var chunk = this;
      while (chunk) {
        fn(chunk);
        chunk = chunk.previous;
      }
    };
    Chunk$1.prototype.edit = function edit(content, storeName, contentOnly) {
      this.content = content;
      if (!contentOnly) {
        this.intro = "";
        this.outro = "";
      }
      this.storeName = storeName;
      this.edited = true;
      return this;
    };
    Chunk$1.prototype.prependLeft = function prependLeft(content) {
      this.outro = content + this.outro;
    };
    Chunk$1.prototype.prependRight = function prependRight(content) {
      this.intro = content + this.intro;
    };
    Chunk$1.prototype.split = function split(index) {
      var sliceIndex = index - this.start;
      var originalBefore = this.original.slice(0, sliceIndex);
      var originalAfter = this.original.slice(sliceIndex);
      this.original = originalBefore;
      var newChunk = new Chunk$1(index, this.end, originalAfter);
      newChunk.outro = this.outro;
      this.outro = "";
      this.end = index;
      if (this.edited) {
        newChunk.edit("", false);
        this.content = "";
      } else {
        this.content = originalBefore;
      }
      newChunk.next = this.next;
      if (newChunk.next) {
        newChunk.next.previous = newChunk;
      }
      newChunk.previous = this;
      this.next = newChunk;
      return newChunk;
    };
    Chunk$1.prototype.toString = function toString() {
      return this.intro + this.content + this.outro;
    };
    Chunk$1.prototype.trimEnd = function trimEnd(rx) {
      this.outro = this.outro.replace(rx, "");
      if (this.outro.length) {
        return true;
      }
      var trimmed = this.content.replace(rx, "");
      if (trimmed.length) {
        if (trimmed !== this.content) {
          this.split(this.start + trimmed.length).edit("", void 0, true);
        }
        return true;
      } else {
        this.edit("", void 0, true);
        this.intro = this.intro.replace(rx, "");
        if (this.intro.length) {
          return true;
        }
      }
    };
    Chunk$1.prototype.trimStart = function trimStart(rx) {
      this.intro = this.intro.replace(rx, "");
      if (this.intro.length) {
        return true;
      }
      var trimmed = this.content.replace(rx, "");
      if (trimmed.length) {
        if (trimmed !== this.content) {
          this.split(this.end - trimmed.length);
          this.edit("", void 0, true);
        }
        return true;
      } else {
        this.edit("", void 0, true);
        this.outro = this.outro.replace(rx, "");
        if (this.outro.length) {
          return true;
        }
      }
    };
    btoa = function() {
      throw new Error("Unsupported environment: `window.btoa` or `Buffer` should be supported.");
    };
    if (typeof window !== "undefined" && typeof window.btoa === "function") {
      btoa = function(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
      };
    } else if (typeof Buffer === "function") {
      btoa = function(str) {
        return Buffer.from(str, "utf-8").toString("base64");
      };
    }
    SourceMap = function SourceMap2(properties) {
      this.version = 3;
      this.file = properties.file;
      this.sources = properties.sources;
      this.sourcesContent = properties.sourcesContent;
      this.names = properties.names;
      this.mappings = encode(properties.mappings);
    };
    SourceMap.prototype.toString = function toString2() {
      return JSON.stringify(this);
    };
    SourceMap.prototype.toUrl = function toUrl() {
      return "data:application/json;charset=utf-8;base64," + btoa(this.toString());
    };
    toString$1 = Object.prototype.toString;
    Mappings = function Mappings2(hires) {
      this.hires = hires;
      this.generatedCodeLine = 0;
      this.generatedCodeColumn = 0;
      this.raw = [];
      this.rawSegments = this.raw[this.generatedCodeLine] = [];
      this.pending = null;
    };
    Mappings.prototype.addEdit = function addEdit(sourceIndex, content, loc, nameIndex) {
      if (content.length) {
        var segment = [this.generatedCodeColumn, sourceIndex, loc.line, loc.column];
        if (nameIndex >= 0) {
          segment.push(nameIndex);
        }
        this.rawSegments.push(segment);
      } else if (this.pending) {
        this.rawSegments.push(this.pending);
      }
      this.advance(content);
      this.pending = null;
    };
    Mappings.prototype.addUneditedChunk = function addUneditedChunk(sourceIndex, chunk, original, loc, sourcemapLocations) {
      var originalCharIndex = chunk.start;
      var first = true;
      while (originalCharIndex < chunk.end) {
        if (this.hires || first || sourcemapLocations.has(originalCharIndex)) {
          this.rawSegments.push([this.generatedCodeColumn, sourceIndex, loc.line, loc.column]);
        }
        if (original[originalCharIndex] === "\n") {
          loc.line += 1;
          loc.column = 0;
          this.generatedCodeLine += 1;
          this.raw[this.generatedCodeLine] = this.rawSegments = [];
          this.generatedCodeColumn = 0;
          first = true;
        } else {
          loc.column += 1;
          this.generatedCodeColumn += 1;
          first = false;
        }
        originalCharIndex += 1;
      }
      this.pending = null;
    };
    Mappings.prototype.advance = function advance(str) {
      if (!str) {
        return;
      }
      var lines = str.split("\n");
      if (lines.length > 1) {
        for (var i = 0; i < lines.length - 1; i++) {
          this.generatedCodeLine++;
          this.raw[this.generatedCodeLine] = this.rawSegments = [];
        }
        this.generatedCodeColumn = 0;
      }
      this.generatedCodeColumn += lines[lines.length - 1].length;
    };
    n = "\n";
    warned = {
      insertLeft: false,
      insertRight: false,
      storeName: false
    };
    MagicString = function MagicString2(string, options) {
      if (options === void 0)
        options = {};
      var chunk = new Chunk$1(0, string.length, string);
      Object.defineProperties(this, {
        original: { writable: true, value: string },
        outro: { writable: true, value: "" },
        intro: { writable: true, value: "" },
        firstChunk: { writable: true, value: chunk },
        lastChunk: { writable: true, value: chunk },
        lastSearchedChunk: { writable: true, value: chunk },
        byStart: { writable: true, value: {} },
        byEnd: { writable: true, value: {} },
        filename: { writable: true, value: options.filename },
        indentExclusionRanges: { writable: true, value: options.indentExclusionRanges },
        sourcemapLocations: { writable: true, value: new BitSet() },
        storedNames: { writable: true, value: {} },
        indentStr: { writable: true, value: guessIndent(string) }
      });
      this.byStart[0] = chunk;
      this.byEnd[string.length] = chunk;
    };
    MagicString.prototype.addSourcemapLocation = function addSourcemapLocation(char) {
      this.sourcemapLocations.add(char);
    };
    MagicString.prototype.append = function append(content) {
      if (typeof content !== "string") {
        throw new TypeError("outro content must be a string");
      }
      this.outro += content;
      return this;
    };
    MagicString.prototype.appendLeft = function appendLeft2(index, content) {
      if (typeof content !== "string") {
        throw new TypeError("inserted content must be a string");
      }
      this._split(index);
      var chunk = this.byEnd[index];
      if (chunk) {
        chunk.appendLeft(content);
      } else {
        this.intro += content;
      }
      return this;
    };
    MagicString.prototype.appendRight = function appendRight2(index, content) {
      if (typeof content !== "string") {
        throw new TypeError("inserted content must be a string");
      }
      this._split(index);
      var chunk = this.byStart[index];
      if (chunk) {
        chunk.appendRight(content);
      } else {
        this.outro += content;
      }
      return this;
    };
    MagicString.prototype.clone = function clone2() {
      var cloned = new MagicString(this.original, { filename: this.filename });
      var originalChunk = this.firstChunk;
      var clonedChunk = cloned.firstChunk = cloned.lastSearchedChunk = originalChunk.clone();
      while (originalChunk) {
        cloned.byStart[clonedChunk.start] = clonedChunk;
        cloned.byEnd[clonedChunk.end] = clonedChunk;
        var nextOriginalChunk = originalChunk.next;
        var nextClonedChunk = nextOriginalChunk && nextOriginalChunk.clone();
        if (nextClonedChunk) {
          clonedChunk.next = nextClonedChunk;
          nextClonedChunk.previous = clonedChunk;
          clonedChunk = nextClonedChunk;
        }
        originalChunk = nextOriginalChunk;
      }
      cloned.lastChunk = clonedChunk;
      if (this.indentExclusionRanges) {
        cloned.indentExclusionRanges = this.indentExclusionRanges.slice();
      }
      cloned.sourcemapLocations = new BitSet(this.sourcemapLocations);
      cloned.intro = this.intro;
      cloned.outro = this.outro;
      return cloned;
    };
    MagicString.prototype.generateDecodedMap = function generateDecodedMap(options) {
      var this$1$1 = this;
      options = options || {};
      var sourceIndex = 0;
      var names = Object.keys(this.storedNames);
      var mappings = new Mappings(options.hires);
      var locate2 = getLocator$1(this.original);
      if (this.intro) {
        mappings.advance(this.intro);
      }
      this.firstChunk.eachNext(function(chunk) {
        var loc = locate2(chunk.start);
        if (chunk.intro.length) {
          mappings.advance(chunk.intro);
        }
        if (chunk.edited) {
          mappings.addEdit(sourceIndex, chunk.content, loc, chunk.storeName ? names.indexOf(chunk.original) : -1);
        } else {
          mappings.addUneditedChunk(sourceIndex, chunk, this$1$1.original, loc, this$1$1.sourcemapLocations);
        }
        if (chunk.outro.length) {
          mappings.advance(chunk.outro);
        }
      });
      return {
        file: options.file ? options.file.split(/[/\\]/).pop() : null,
        sources: [options.source ? getRelativePath(options.file || "", options.source) : null],
        sourcesContent: options.includeContent ? [this.original] : [null],
        names,
        mappings: mappings.raw
      };
    };
    MagicString.prototype.generateMap = function generateMap(options) {
      return new SourceMap(this.generateDecodedMap(options));
    };
    MagicString.prototype.getIndentString = function getIndentString() {
      return this.indentStr === null ? "	" : this.indentStr;
    };
    MagicString.prototype.indent = function indent(indentStr, options) {
      var pattern = /^[^\r\n]/gm;
      if (isObject(indentStr)) {
        options = indentStr;
        indentStr = void 0;
      }
      indentStr = indentStr !== void 0 ? indentStr : this.indentStr || "	";
      if (indentStr === "") {
        return this;
      }
      options = options || {};
      var isExcluded = {};
      if (options.exclude) {
        var exclusions = typeof options.exclude[0] === "number" ? [options.exclude] : options.exclude;
        exclusions.forEach(function(exclusion) {
          for (var i = exclusion[0]; i < exclusion[1]; i += 1) {
            isExcluded[i] = true;
          }
        });
      }
      var shouldIndentNextCharacter = options.indentStart !== false;
      var replacer = function(match) {
        if (shouldIndentNextCharacter) {
          return "" + indentStr + match;
        }
        shouldIndentNextCharacter = true;
        return match;
      };
      this.intro = this.intro.replace(pattern, replacer);
      var charIndex = 0;
      var chunk = this.firstChunk;
      while (chunk) {
        var end = chunk.end;
        if (chunk.edited) {
          if (!isExcluded[charIndex]) {
            chunk.content = chunk.content.replace(pattern, replacer);
            if (chunk.content.length) {
              shouldIndentNextCharacter = chunk.content[chunk.content.length - 1] === "\n";
            }
          }
        } else {
          charIndex = chunk.start;
          while (charIndex < end) {
            if (!isExcluded[charIndex]) {
              var char = this.original[charIndex];
              if (char === "\n") {
                shouldIndentNextCharacter = true;
              } else if (char !== "\r" && shouldIndentNextCharacter) {
                shouldIndentNextCharacter = false;
                if (charIndex === chunk.start) {
                  chunk.prependRight(indentStr);
                } else {
                  this._splitChunk(chunk, charIndex);
                  chunk = chunk.next;
                  chunk.prependRight(indentStr);
                }
              }
            }
            charIndex += 1;
          }
        }
        charIndex = chunk.end;
        chunk = chunk.next;
      }
      this.outro = this.outro.replace(pattern, replacer);
      return this;
    };
    MagicString.prototype.insert = function insert() {
      throw new Error("magicString.insert(...) is deprecated. Use prependRight(...) or appendLeft(...)");
    };
    MagicString.prototype.insertLeft = function insertLeft(index, content) {
      if (!warned.insertLeft) {
        console.warn("magicString.insertLeft(...) is deprecated. Use magicString.appendLeft(...) instead");
        warned.insertLeft = true;
      }
      return this.appendLeft(index, content);
    };
    MagicString.prototype.insertRight = function insertRight(index, content) {
      if (!warned.insertRight) {
        console.warn("magicString.insertRight(...) is deprecated. Use magicString.prependRight(...) instead");
        warned.insertRight = true;
      }
      return this.prependRight(index, content);
    };
    MagicString.prototype.move = function move(start, end, index) {
      if (index >= start && index <= end) {
        throw new Error("Cannot move a selection inside itself");
      }
      this._split(start);
      this._split(end);
      this._split(index);
      var first = this.byStart[start];
      var last = this.byEnd[end];
      var oldLeft = first.previous;
      var oldRight = last.next;
      var newRight = this.byStart[index];
      if (!newRight && last === this.lastChunk) {
        return this;
      }
      var newLeft = newRight ? newRight.previous : this.lastChunk;
      if (oldLeft) {
        oldLeft.next = oldRight;
      }
      if (oldRight) {
        oldRight.previous = oldLeft;
      }
      if (newLeft) {
        newLeft.next = first;
      }
      if (newRight) {
        newRight.previous = last;
      }
      if (!first.previous) {
        this.firstChunk = last.next;
      }
      if (!last.next) {
        this.lastChunk = first.previous;
        this.lastChunk.next = null;
      }
      first.previous = newLeft;
      last.next = newRight || null;
      if (!newLeft) {
        this.firstChunk = first;
      }
      if (!newRight) {
        this.lastChunk = last;
      }
      return this;
    };
    MagicString.prototype.overwrite = function overwrite(start, end, content, options) {
      if (typeof content !== "string") {
        throw new TypeError("replacement content must be a string");
      }
      while (start < 0) {
        start += this.original.length;
      }
      while (end < 0) {
        end += this.original.length;
      }
      if (end > this.original.length) {
        throw new Error("end is out of bounds");
      }
      if (start === end) {
        throw new Error("Cannot overwrite a zero-length range \u2013 use appendLeft or prependRight instead");
      }
      this._split(start);
      this._split(end);
      if (options === true) {
        if (!warned.storeName) {
          console.warn("The final argument to magicString.overwrite(...) should be an options object. See https://github.com/rich-harris/magic-string");
          warned.storeName = true;
        }
        options = { storeName: true };
      }
      var storeName = options !== void 0 ? options.storeName : false;
      var contentOnly = options !== void 0 ? options.contentOnly : false;
      if (storeName) {
        var original = this.original.slice(start, end);
        this.storedNames[original] = true;
      }
      var first = this.byStart[start];
      var last = this.byEnd[end];
      if (first) {
        if (end > first.end && first.next !== this.byStart[first.end]) {
          throw new Error("Cannot overwrite across a split point");
        }
        first.edit(content, storeName, contentOnly);
        if (first !== last) {
          var chunk = first.next;
          while (chunk !== last) {
            chunk.edit("", false);
            chunk = chunk.next;
          }
          chunk.edit("", false);
        }
      } else {
        var newChunk = new Chunk$1(start, end, "").edit(content, storeName);
        last.next = newChunk;
        newChunk.previous = last;
      }
      return this;
    };
    MagicString.prototype.prepend = function prepend(content) {
      if (typeof content !== "string") {
        throw new TypeError("outro content must be a string");
      }
      this.intro = content + this.intro;
      return this;
    };
    MagicString.prototype.prependLeft = function prependLeft2(index, content) {
      if (typeof content !== "string") {
        throw new TypeError("inserted content must be a string");
      }
      this._split(index);
      var chunk = this.byEnd[index];
      if (chunk) {
        chunk.prependLeft(content);
      } else {
        this.intro = content + this.intro;
      }
      return this;
    };
    MagicString.prototype.prependRight = function prependRight2(index, content) {
      if (typeof content !== "string") {
        throw new TypeError("inserted content must be a string");
      }
      this._split(index);
      var chunk = this.byStart[index];
      if (chunk) {
        chunk.prependRight(content);
      } else {
        this.outro = content + this.outro;
      }
      return this;
    };
    MagicString.prototype.remove = function remove(start, end) {
      while (start < 0) {
        start += this.original.length;
      }
      while (end < 0) {
        end += this.original.length;
      }
      if (start === end) {
        return this;
      }
      if (start < 0 || end > this.original.length) {
        throw new Error("Character is out of bounds");
      }
      if (start > end) {
        throw new Error("end must be greater than start");
      }
      this._split(start);
      this._split(end);
      var chunk = this.byStart[start];
      while (chunk) {
        chunk.intro = "";
        chunk.outro = "";
        chunk.edit("");
        chunk = end > chunk.end ? this.byStart[chunk.end] : null;
      }
      return this;
    };
    MagicString.prototype.lastChar = function lastChar() {
      if (this.outro.length) {
        return this.outro[this.outro.length - 1];
      }
      var chunk = this.lastChunk;
      do {
        if (chunk.outro.length) {
          return chunk.outro[chunk.outro.length - 1];
        }
        if (chunk.content.length) {
          return chunk.content[chunk.content.length - 1];
        }
        if (chunk.intro.length) {
          return chunk.intro[chunk.intro.length - 1];
        }
      } while (chunk = chunk.previous);
      if (this.intro.length) {
        return this.intro[this.intro.length - 1];
      }
      return "";
    };
    MagicString.prototype.lastLine = function lastLine() {
      var lineIndex = this.outro.lastIndexOf(n);
      if (lineIndex !== -1) {
        return this.outro.substr(lineIndex + 1);
      }
      var lineStr = this.outro;
      var chunk = this.lastChunk;
      do {
        if (chunk.outro.length > 0) {
          lineIndex = chunk.outro.lastIndexOf(n);
          if (lineIndex !== -1) {
            return chunk.outro.substr(lineIndex + 1) + lineStr;
          }
          lineStr = chunk.outro + lineStr;
        }
        if (chunk.content.length > 0) {
          lineIndex = chunk.content.lastIndexOf(n);
          if (lineIndex !== -1) {
            return chunk.content.substr(lineIndex + 1) + lineStr;
          }
          lineStr = chunk.content + lineStr;
        }
        if (chunk.intro.length > 0) {
          lineIndex = chunk.intro.lastIndexOf(n);
          if (lineIndex !== -1) {
            return chunk.intro.substr(lineIndex + 1) + lineStr;
          }
          lineStr = chunk.intro + lineStr;
        }
      } while (chunk = chunk.previous);
      lineIndex = this.intro.lastIndexOf(n);
      if (lineIndex !== -1) {
        return this.intro.substr(lineIndex + 1) + lineStr;
      }
      return this.intro + lineStr;
    };
    MagicString.prototype.slice = function slice(start, end) {
      if (start === void 0)
        start = 0;
      if (end === void 0)
        end = this.original.length;
      while (start < 0) {
        start += this.original.length;
      }
      while (end < 0) {
        end += this.original.length;
      }
      var result = "";
      var chunk = this.firstChunk;
      while (chunk && (chunk.start > start || chunk.end <= start)) {
        if (chunk.start < end && chunk.end >= end) {
          return result;
        }
        chunk = chunk.next;
      }
      if (chunk && chunk.edited && chunk.start !== start) {
        throw new Error("Cannot use replaced character " + start + " as slice start anchor.");
      }
      var startChunk = chunk;
      while (chunk) {
        if (chunk.intro && (startChunk !== chunk || chunk.start === start)) {
          result += chunk.intro;
        }
        var containsEnd = chunk.start < end && chunk.end >= end;
        if (containsEnd && chunk.edited && chunk.end !== end) {
          throw new Error("Cannot use replaced character " + end + " as slice end anchor.");
        }
        var sliceStart = startChunk === chunk ? start - chunk.start : 0;
        var sliceEnd = containsEnd ? chunk.content.length + end - chunk.end : chunk.content.length;
        result += chunk.content.slice(sliceStart, sliceEnd);
        if (chunk.outro && (!containsEnd || chunk.end === end)) {
          result += chunk.outro;
        }
        if (containsEnd) {
          break;
        }
        chunk = chunk.next;
      }
      return result;
    };
    MagicString.prototype.snip = function snip(start, end) {
      var clone4 = this.clone();
      clone4.remove(0, start);
      clone4.remove(end, clone4.original.length);
      return clone4;
    };
    MagicString.prototype._split = function _split(index) {
      if (this.byStart[index] || this.byEnd[index]) {
        return;
      }
      var chunk = this.lastSearchedChunk;
      var searchForward = index > chunk.end;
      while (chunk) {
        if (chunk.contains(index)) {
          return this._splitChunk(chunk, index);
        }
        chunk = searchForward ? this.byStart[chunk.end] : this.byEnd[chunk.start];
      }
    };
    MagicString.prototype._splitChunk = function _splitChunk(chunk, index) {
      if (chunk.edited && chunk.content.length) {
        var loc = getLocator$1(this.original)(index);
        throw new Error("Cannot split a chunk that has already been edited (" + loc.line + ":" + loc.column + ' \u2013 "' + chunk.original + '")');
      }
      var newChunk = chunk.split(index);
      this.byEnd[index] = chunk;
      this.byStart[index] = newChunk;
      this.byEnd[newChunk.end] = newChunk;
      if (chunk === this.lastChunk) {
        this.lastChunk = newChunk;
      }
      this.lastSearchedChunk = chunk;
      return true;
    };
    MagicString.prototype.toString = function toString3() {
      var str = this.intro;
      var chunk = this.firstChunk;
      while (chunk) {
        str += chunk.toString();
        chunk = chunk.next;
      }
      return str + this.outro;
    };
    MagicString.prototype.isEmpty = function isEmpty() {
      var chunk = this.firstChunk;
      do {
        if (chunk.intro.length && chunk.intro.trim() || chunk.content.length && chunk.content.trim() || chunk.outro.length && chunk.outro.trim()) {
          return false;
        }
      } while (chunk = chunk.next);
      return true;
    };
    MagicString.prototype.length = function length() {
      var chunk = this.firstChunk;
      var length3 = 0;
      do {
        length3 += chunk.intro.length + chunk.content.length + chunk.outro.length;
      } while (chunk = chunk.next);
      return length3;
    };
    MagicString.prototype.trimLines = function trimLines() {
      return this.trim("[\\r\\n]");
    };
    MagicString.prototype.trim = function trim(charType) {
      return this.trimStart(charType).trimEnd(charType);
    };
    MagicString.prototype.trimEndAborted = function trimEndAborted(charType) {
      var rx = new RegExp((charType || "\\s") + "+$");
      this.outro = this.outro.replace(rx, "");
      if (this.outro.length) {
        return true;
      }
      var chunk = this.lastChunk;
      do {
        var end = chunk.end;
        var aborted = chunk.trimEnd(rx);
        if (chunk.end !== end) {
          if (this.lastChunk === chunk) {
            this.lastChunk = chunk.next;
          }
          this.byEnd[chunk.end] = chunk;
          this.byStart[chunk.next.start] = chunk.next;
          this.byEnd[chunk.next.end] = chunk.next;
        }
        if (aborted) {
          return true;
        }
        chunk = chunk.previous;
      } while (chunk);
      return false;
    };
    MagicString.prototype.trimEnd = function trimEnd2(charType) {
      this.trimEndAborted(charType);
      return this;
    };
    MagicString.prototype.trimStartAborted = function trimStartAborted(charType) {
      var rx = new RegExp("^" + (charType || "\\s") + "+");
      this.intro = this.intro.replace(rx, "");
      if (this.intro.length) {
        return true;
      }
      var chunk = this.firstChunk;
      do {
        var end = chunk.end;
        var aborted = chunk.trimStart(rx);
        if (chunk.end !== end) {
          if (chunk === this.lastChunk) {
            this.lastChunk = chunk.next;
          }
          this.byEnd[chunk.end] = chunk;
          this.byStart[chunk.next.start] = chunk.next;
          this.byEnd[chunk.next.end] = chunk.next;
        }
        if (aborted) {
          return true;
        }
        chunk = chunk.next;
      } while (chunk);
      return false;
    };
    MagicString.prototype.trimStart = function trimStart2(charType) {
      this.trimStartAborted(charType);
      return this;
    };
    hasOwnProp = Object.prototype.hasOwnProperty;
    Bundle$1 = function Bundle(options) {
      if (options === void 0)
        options = {};
      this.intro = options.intro || "";
      this.separator = options.separator !== void 0 ? options.separator : "\n";
      this.sources = [];
      this.uniqueSources = [];
      this.uniqueSourceIndexByFilename = {};
    };
    Bundle$1.prototype.addSource = function addSource(source) {
      if (source instanceof MagicString) {
        return this.addSource({
          content: source,
          filename: source.filename,
          separator: this.separator
        });
      }
      if (!isObject(source) || !source.content) {
        throw new Error("bundle.addSource() takes an object with a `content` property, which should be an instance of MagicString, and an optional `filename`");
      }
      ["filename", "indentExclusionRanges", "separator"].forEach(function(option) {
        if (!hasOwnProp.call(source, option)) {
          source[option] = source.content[option];
        }
      });
      if (source.separator === void 0) {
        source.separator = this.separator;
      }
      if (source.filename) {
        if (!hasOwnProp.call(this.uniqueSourceIndexByFilename, source.filename)) {
          this.uniqueSourceIndexByFilename[source.filename] = this.uniqueSources.length;
          this.uniqueSources.push({ filename: source.filename, content: source.content.original });
        } else {
          var uniqueSource = this.uniqueSources[this.uniqueSourceIndexByFilename[source.filename]];
          if (source.content.original !== uniqueSource.content) {
            throw new Error("Illegal source: same filename (" + source.filename + "), different contents");
          }
        }
      }
      this.sources.push(source);
      return this;
    };
    Bundle$1.prototype.append = function append2(str, options) {
      this.addSource({
        content: new MagicString(str),
        separator: options && options.separator || ""
      });
      return this;
    };
    Bundle$1.prototype.clone = function clone3() {
      var bundle = new Bundle$1({
        intro: this.intro,
        separator: this.separator
      });
      this.sources.forEach(function(source) {
        bundle.addSource({
          filename: source.filename,
          content: source.content.clone(),
          separator: source.separator
        });
      });
      return bundle;
    };
    Bundle$1.prototype.generateDecodedMap = function generateDecodedMap2(options) {
      var this$1$1 = this;
      if (options === void 0)
        options = {};
      var names = [];
      this.sources.forEach(function(source) {
        Object.keys(source.content.storedNames).forEach(function(name) {
          if (!~names.indexOf(name)) {
            names.push(name);
          }
        });
      });
      var mappings = new Mappings(options.hires);
      if (this.intro) {
        mappings.advance(this.intro);
      }
      this.sources.forEach(function(source, i) {
        if (i > 0) {
          mappings.advance(this$1$1.separator);
        }
        var sourceIndex = source.filename ? this$1$1.uniqueSourceIndexByFilename[source.filename] : -1;
        var magicString = source.content;
        var locate2 = getLocator$1(magicString.original);
        if (magicString.intro) {
          mappings.advance(magicString.intro);
        }
        magicString.firstChunk.eachNext(function(chunk) {
          var loc = locate2(chunk.start);
          if (chunk.intro.length) {
            mappings.advance(chunk.intro);
          }
          if (source.filename) {
            if (chunk.edited) {
              mappings.addEdit(sourceIndex, chunk.content, loc, chunk.storeName ? names.indexOf(chunk.original) : -1);
            } else {
              mappings.addUneditedChunk(sourceIndex, chunk, magicString.original, loc, magicString.sourcemapLocations);
            }
          } else {
            mappings.advance(chunk.content);
          }
          if (chunk.outro.length) {
            mappings.advance(chunk.outro);
          }
        });
        if (magicString.outro) {
          mappings.advance(magicString.outro);
        }
      });
      return {
        file: options.file ? options.file.split(/[/\\]/).pop() : null,
        sources: this.uniqueSources.map(function(source) {
          return options.file ? getRelativePath(options.file, source.filename) : source.filename;
        }),
        sourcesContent: this.uniqueSources.map(function(source) {
          return options.includeContent ? source.content : null;
        }),
        names,
        mappings: mappings.raw
      };
    };
    Bundle$1.prototype.generateMap = function generateMap2(options) {
      return new SourceMap(this.generateDecodedMap(options));
    };
    Bundle$1.prototype.getIndentString = function getIndentString2() {
      var indentStringCounts = {};
      this.sources.forEach(function(source) {
        var indentStr = source.content.indentStr;
        if (indentStr === null) {
          return;
        }
        if (!indentStringCounts[indentStr]) {
          indentStringCounts[indentStr] = 0;
        }
        indentStringCounts[indentStr] += 1;
      });
      return Object.keys(indentStringCounts).sort(function(a, b) {
        return indentStringCounts[a] - indentStringCounts[b];
      })[0] || "	";
    };
    Bundle$1.prototype.indent = function indent2(indentStr) {
      var this$1$1 = this;
      if (!arguments.length) {
        indentStr = this.getIndentString();
      }
      if (indentStr === "") {
        return this;
      }
      var trailingNewline = !this.intro || this.intro.slice(-1) === "\n";
      this.sources.forEach(function(source, i) {
        var separator = source.separator !== void 0 ? source.separator : this$1$1.separator;
        var indentStart = trailingNewline || i > 0 && /\r?\n$/.test(separator);
        source.content.indent(indentStr, {
          exclude: source.indentExclusionRanges,
          indentStart
        });
        trailingNewline = source.content.lastChar() === "\n";
      });
      if (this.intro) {
        this.intro = indentStr + this.intro.replace(/^[^\n]/gm, function(match, index) {
          return index > 0 ? indentStr + match : match;
        });
      }
      return this;
    };
    Bundle$1.prototype.prepend = function prepend2(str) {
      this.intro = str + this.intro;
      return this;
    };
    Bundle$1.prototype.toString = function toString4() {
      var this$1$1 = this;
      var body = this.sources.map(function(source, i) {
        var separator = source.separator !== void 0 ? source.separator : this$1$1.separator;
        var str = (i > 0 ? separator : "") + source.content.toString();
        return str;
      }).join("");
      return this.intro + body;
    };
    Bundle$1.prototype.isEmpty = function isEmpty2() {
      if (this.intro.length && this.intro.trim()) {
        return false;
      }
      if (this.sources.some(function(source) {
        return !source.content.isEmpty();
      })) {
        return false;
      }
      return true;
    };
    Bundle$1.prototype.length = function length2() {
      return this.sources.reduce(function(length3, source) {
        return length3 + source.content.length();
      }, this.intro.length);
    };
    Bundle$1.prototype.trimLines = function trimLines2() {
      return this.trim("[\\r\\n]");
    };
    Bundle$1.prototype.trim = function trim2(charType) {
      return this.trimStart(charType).trimEnd(charType);
    };
    Bundle$1.prototype.trimStart = function trimStart3(charType) {
      var rx = new RegExp("^" + (charType || "\\s") + "+");
      this.intro = this.intro.replace(rx, "");
      if (!this.intro) {
        var source;
        var i = 0;
        do {
          source = this.sources[i++];
          if (!source) {
            break;
          }
        } while (!source.content.trimStartAborted(charType));
      }
      return this;
    };
    Bundle$1.prototype.trimEnd = function trimEnd3(charType) {
      var rx = new RegExp((charType || "\\s") + "+$");
      var source;
      var i = this.sources.length - 1;
      do {
        source = this.sources[i--];
        if (!source) {
          this.intro = this.intro.replace(rx, "");
          break;
        }
      } while (!source.content.trimEndAborted(charType));
      return this;
    };
    MagicString$1 = MagicString;
    RESERVED_NAMES = {
      __proto__: null,
      await: true,
      break: true,
      case: true,
      catch: true,
      class: true,
      const: true,
      continue: true,
      debugger: true,
      default: true,
      delete: true,
      do: true,
      else: true,
      enum: true,
      eval: true,
      export: true,
      extends: true,
      false: true,
      finally: true,
      for: true,
      function: true,
      if: true,
      implements: true,
      import: true,
      in: true,
      instanceof: true,
      interface: true,
      let: true,
      new: true,
      null: true,
      package: true,
      private: true,
      protected: true,
      public: true,
      return: true,
      static: true,
      super: true,
      switch: true,
      this: true,
      throw: true,
      true: true,
      try: true,
      typeof: true,
      undefined: true,
      var: true,
      void: true,
      while: true,
      with: true,
      yield: true
    };
    UnknownKey = Symbol("Unknown Key");
    UnknownInteger = Symbol("Unknown Integer");
    EMPTY_PATH = [];
    UNKNOWN_PATH = [UnknownKey];
    UNKNOWN_INTEGER_PATH = [UnknownInteger];
    EntitiesKey = Symbol("Entities");
    PathTracker = class {
      constructor() {
        this.entityPaths = Object.create(null, {
          [EntitiesKey]: { value: new Set() }
        });
      }
      trackEntityAtPathAndGetIfTracked(path, entity) {
        const trackedEntities = this.getEntities(path);
        if (trackedEntities.has(entity))
          return true;
        trackedEntities.add(entity);
        return false;
      }
      withTrackedEntityAtPath(path, entity, onUntracked, returnIfTracked) {
        const trackedEntities = this.getEntities(path);
        if (trackedEntities.has(entity))
          return returnIfTracked;
        trackedEntities.add(entity);
        const result = onUntracked();
        trackedEntities.delete(entity);
        return result;
      }
      getEntities(path) {
        let currentPaths = this.entityPaths;
        for (const pathSegment of path) {
          currentPaths = currentPaths[pathSegment] = currentPaths[pathSegment] || Object.create(null, { [EntitiesKey]: { value: new Set() } });
        }
        return currentPaths[EntitiesKey];
      }
    };
    SHARED_RECURSION_TRACKER = new PathTracker();
    DiscriminatedPathTracker = class {
      constructor() {
        this.entityPaths = Object.create(null, {
          [EntitiesKey]: { value: new Map() }
        });
      }
      trackEntityAtPathAndGetIfTracked(path, discriminator, entity) {
        let currentPaths = this.entityPaths;
        for (const pathSegment of path) {
          currentPaths = currentPaths[pathSegment] = currentPaths[pathSegment] || Object.create(null, { [EntitiesKey]: { value: new Map() } });
        }
        const trackedEntities = getOrCreate(currentPaths[EntitiesKey], discriminator, () => new Set());
        if (trackedEntities.has(entity))
          return true;
        trackedEntities.add(entity);
        return false;
      }
    };
    UnknownValue = Symbol("Unknown Value");
    ExpressionEntity = class {
      constructor() {
        this.included = false;
      }
      deoptimizePath(_path) {
      }
      deoptimizeThisOnEventAtPath(_event, _path, thisParameter, _recursionTracker) {
        thisParameter.deoptimizePath(UNKNOWN_PATH);
      }
      getLiteralValueAtPath(_path, _recursionTracker, _origin) {
        return UnknownValue;
      }
      getReturnExpressionWhenCalledAtPath(_path, _callOptions, _recursionTracker, _origin) {
        return UNKNOWN_EXPRESSION;
      }
      hasEffectsWhenAccessedAtPath(_path, _context) {
        return true;
      }
      hasEffectsWhenAssignedAtPath(_path, _context) {
        return true;
      }
      hasEffectsWhenCalledAtPath(_path, _callOptions, _context) {
        return true;
      }
      include(_context, _includeChildrenRecursively) {
        this.included = true;
      }
      includeCallArguments(context, args) {
        for (const arg of args) {
          arg.include(context, false);
        }
      }
    };
    UNKNOWN_EXPRESSION = new class UnknownExpression extends ExpressionEntity {
    }();
    Variable = class extends ExpressionEntity {
      constructor(name) {
        super();
        this.name = name;
        this.alwaysRendered = false;
        this.initReached = false;
        this.isId = false;
        this.isReassigned = false;
        this.kind = null;
        this.renderBaseName = null;
        this.renderName = null;
      }
      addReference(_identifier) {
      }
      getBaseVariableName() {
        return this.renderBaseName || this.renderName || this.name;
      }
      getName() {
        const name = this.renderName || this.name;
        return this.renderBaseName ? `${this.renderBaseName}${RESERVED_NAMES[name] ? `['${name}']` : `.${name}`}` : name;
      }
      hasEffectsWhenAccessedAtPath(path, _context) {
        return path.length > 0;
      }
      include() {
        this.included = true;
      }
      markCalledFromTryStatement() {
      }
      setRenderNames(baseName, name) {
        this.renderBaseName = baseName;
        this.renderName = name;
      }
    };
    ExternalVariable = class extends Variable {
      constructor(module2, name) {
        super(name);
        this.module = module2;
        this.isNamespace = name === "*";
        this.referenced = false;
      }
      addReference(identifier) {
        this.referenced = true;
        if (this.name === "default" || this.name === "*") {
          this.module.suggestName(identifier.name);
        }
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > (this.isNamespace ? 1 : 0);
      }
      include() {
        if (!this.included) {
          this.included = true;
          this.module.used = true;
        }
      }
    };
    BLANK = Object.freeze(Object.create(null));
    EMPTY_OBJECT = Object.freeze({});
    EMPTY_ARRAY = Object.freeze([]);
    reservedWords$1 = "break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public".split(" ");
    builtins$1 = "Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl".split(" ");
    blacklisted = new Set(reservedWords$1.concat(builtins$1));
    illegalCharacters = /[^$_a-zA-Z0-9]/g;
    startsWithDigit = (str) => /\d/.test(str[0]);
    absolutePath = /^(?:\/|(?:[A-Za-z]:)?[\\|/])/;
    relativePath = /^\.?\.\//;
    ExternalModule = class {
      constructor(options, id, hasModuleSideEffects, meta, renormalizeRenderPath) {
        this.options = options;
        this.id = id;
        this.renormalizeRenderPath = renormalizeRenderPath;
        this.defaultVariableName = "";
        this.dynamicImporters = [];
        this.importers = [];
        this.mostCommonSuggestion = 0;
        this.namespaceVariableName = "";
        this.reexported = false;
        this.renderPath = void 0;
        this.used = false;
        this.variableName = "";
        this.execIndex = Infinity;
        this.suggestedVariableName = makeLegal(id.split(/[\\/]/).pop());
        this.nameSuggestions = Object.create(null);
        this.declarations = Object.create(null);
        this.exportedVariables = new Map();
        const { importers, dynamicImporters } = this;
        this.info = {
          ast: null,
          code: null,
          dynamicallyImportedIds: EMPTY_ARRAY,
          get dynamicImporters() {
            return dynamicImporters.sort();
          },
          hasModuleSideEffects,
          id,
          implicitlyLoadedAfterOneOf: EMPTY_ARRAY,
          implicitlyLoadedBefore: EMPTY_ARRAY,
          importedIds: EMPTY_ARRAY,
          get importers() {
            return importers.sort();
          },
          isEntry: false,
          isExternal: true,
          meta,
          syntheticNamedExports: false
        };
      }
      getVariableForExportName(name) {
        let declaration = this.declarations[name];
        if (declaration)
          return declaration;
        this.declarations[name] = declaration = new ExternalVariable(this, name);
        this.exportedVariables.set(declaration, name);
        return declaration;
      }
      setRenderPath(options, inputBase) {
        this.renderPath = typeof options.paths === "function" ? options.paths(this.id) : options.paths[this.id];
        if (!this.renderPath) {
          this.renderPath = this.renormalizeRenderPath ? normalize((0, import_path.relative)(inputBase, this.id)) : this.id;
        }
        return this.renderPath;
      }
      suggestName(name) {
        if (!this.nameSuggestions[name])
          this.nameSuggestions[name] = 0;
        this.nameSuggestions[name] += 1;
        if (this.nameSuggestions[name] > this.mostCommonSuggestion) {
          this.mostCommonSuggestion = this.nameSuggestions[name];
          this.suggestedVariableName = name;
        }
      }
      warnUnusedImports() {
        const unused = Object.keys(this.declarations).filter((name) => {
          if (name === "*")
            return false;
          const declaration = this.declarations[name];
          return !declaration.included && !this.reexported && !declaration.referenced;
        });
        if (unused.length === 0)
          return;
        const importersSet = new Set();
        for (const name of unused) {
          const { importers } = this.declarations[name].module;
          for (const importer of importers) {
            importersSet.add(importer);
          }
        }
        const importersArray = [...importersSet];
        this.options.onwarn({
          code: "UNUSED_EXTERNAL_IMPORT",
          message: `${printQuotedStringList(unused, ["is", "are"])} imported from external module "${this.id}" but never used in ${printQuotedStringList(importersArray.map((importer) => relativeId(importer)))}.`,
          names: unused,
          source: this.id,
          sources: importersArray
        });
      }
    };
    extractors = {
      ArrayPattern(names, param) {
        for (const element of param.elements) {
          if (element)
            extractors[element.type](names, element);
        }
      },
      AssignmentPattern(names, param) {
        extractors[param.left.type](names, param.left);
      },
      Identifier(names, param) {
        names.push(param.name);
      },
      MemberExpression() {
      },
      ObjectPattern(names, param) {
        for (const prop of param.properties) {
          if (prop.type === "RestElement") {
            extractors.RestElement(names, prop);
          } else {
            extractors[prop.value.type](names, prop.value);
          }
        }
      },
      RestElement(names, param) {
        extractors[param.argument.type](names, param.argument);
      }
    };
    extractAssignedNames = function extractAssignedNames2(param) {
      const names = [];
      extractors[param.type](names, param);
      return names;
    };
    BROKEN_FLOW_NONE = 0;
    BROKEN_FLOW_BREAK_CONTINUE = 1;
    BROKEN_FLOW_ERROR_RETURN_LABEL = 2;
    base$1 = {};
    base$1.Program = base$1.BlockStatement = function(node, st, c) {
      for (var i = 0, list = node.body; i < list.length; i += 1) {
        var stmt = list[i];
        c(stmt, st, "Statement");
      }
    };
    base$1.Statement = skipThrough;
    base$1.EmptyStatement = ignore;
    base$1.ExpressionStatement = base$1.ParenthesizedExpression = base$1.ChainExpression = function(node, st, c) {
      return c(node.expression, st, "Expression");
    };
    base$1.IfStatement = function(node, st, c) {
      c(node.test, st, "Expression");
      c(node.consequent, st, "Statement");
      if (node.alternate) {
        c(node.alternate, st, "Statement");
      }
    };
    base$1.LabeledStatement = function(node, st, c) {
      return c(node.body, st, "Statement");
    };
    base$1.BreakStatement = base$1.ContinueStatement = ignore;
    base$1.WithStatement = function(node, st, c) {
      c(node.object, st, "Expression");
      c(node.body, st, "Statement");
    };
    base$1.SwitchStatement = function(node, st, c) {
      c(node.discriminant, st, "Expression");
      for (var i$1 = 0, list$1 = node.cases; i$1 < list$1.length; i$1 += 1) {
        var cs = list$1[i$1];
        if (cs.test) {
          c(cs.test, st, "Expression");
        }
        for (var i = 0, list = cs.consequent; i < list.length; i += 1) {
          var cons = list[i];
          c(cons, st, "Statement");
        }
      }
    };
    base$1.SwitchCase = function(node, st, c) {
      if (node.test) {
        c(node.test, st, "Expression");
      }
      for (var i = 0, list = node.consequent; i < list.length; i += 1) {
        var cons = list[i];
        c(cons, st, "Statement");
      }
    };
    base$1.ReturnStatement = base$1.YieldExpression = base$1.AwaitExpression = function(node, st, c) {
      if (node.argument) {
        c(node.argument, st, "Expression");
      }
    };
    base$1.ThrowStatement = base$1.SpreadElement = function(node, st, c) {
      return c(node.argument, st, "Expression");
    };
    base$1.TryStatement = function(node, st, c) {
      c(node.block, st, "Statement");
      if (node.handler) {
        c(node.handler, st);
      }
      if (node.finalizer) {
        c(node.finalizer, st, "Statement");
      }
    };
    base$1.CatchClause = function(node, st, c) {
      if (node.param) {
        c(node.param, st, "Pattern");
      }
      c(node.body, st, "Statement");
    };
    base$1.WhileStatement = base$1.DoWhileStatement = function(node, st, c) {
      c(node.test, st, "Expression");
      c(node.body, st, "Statement");
    };
    base$1.ForStatement = function(node, st, c) {
      if (node.init) {
        c(node.init, st, "ForInit");
      }
      if (node.test) {
        c(node.test, st, "Expression");
      }
      if (node.update) {
        c(node.update, st, "Expression");
      }
      c(node.body, st, "Statement");
    };
    base$1.ForInStatement = base$1.ForOfStatement = function(node, st, c) {
      c(node.left, st, "ForInit");
      c(node.right, st, "Expression");
      c(node.body, st, "Statement");
    };
    base$1.ForInit = function(node, st, c) {
      if (node.type === "VariableDeclaration") {
        c(node, st);
      } else {
        c(node, st, "Expression");
      }
    };
    base$1.DebuggerStatement = ignore;
    base$1.FunctionDeclaration = function(node, st, c) {
      return c(node, st, "Function");
    };
    base$1.VariableDeclaration = function(node, st, c) {
      for (var i = 0, list = node.declarations; i < list.length; i += 1) {
        var decl = list[i];
        c(decl, st);
      }
    };
    base$1.VariableDeclarator = function(node, st, c) {
      c(node.id, st, "Pattern");
      if (node.init) {
        c(node.init, st, "Expression");
      }
    };
    base$1.Function = function(node, st, c) {
      if (node.id) {
        c(node.id, st, "Pattern");
      }
      for (var i = 0, list = node.params; i < list.length; i += 1) {
        var param = list[i];
        c(param, st, "Pattern");
      }
      c(node.body, st, node.expression ? "Expression" : "Statement");
    };
    base$1.Pattern = function(node, st, c) {
      if (node.type === "Identifier") {
        c(node, st, "VariablePattern");
      } else if (node.type === "MemberExpression") {
        c(node, st, "MemberPattern");
      } else {
        c(node, st);
      }
    };
    base$1.VariablePattern = ignore;
    base$1.MemberPattern = skipThrough;
    base$1.RestElement = function(node, st, c) {
      return c(node.argument, st, "Pattern");
    };
    base$1.ArrayPattern = function(node, st, c) {
      for (var i = 0, list = node.elements; i < list.length; i += 1) {
        var elt = list[i];
        if (elt) {
          c(elt, st, "Pattern");
        }
      }
    };
    base$1.ObjectPattern = function(node, st, c) {
      for (var i = 0, list = node.properties; i < list.length; i += 1) {
        var prop = list[i];
        if (prop.type === "Property") {
          if (prop.computed) {
            c(prop.key, st, "Expression");
          }
          c(prop.value, st, "Pattern");
        } else if (prop.type === "RestElement") {
          c(prop.argument, st, "Pattern");
        }
      }
    };
    base$1.Expression = skipThrough;
    base$1.ThisExpression = base$1.Super = base$1.MetaProperty = ignore;
    base$1.ArrayExpression = function(node, st, c) {
      for (var i = 0, list = node.elements; i < list.length; i += 1) {
        var elt = list[i];
        if (elt) {
          c(elt, st, "Expression");
        }
      }
    };
    base$1.ObjectExpression = function(node, st, c) {
      for (var i = 0, list = node.properties; i < list.length; i += 1) {
        var prop = list[i];
        c(prop, st);
      }
    };
    base$1.FunctionExpression = base$1.ArrowFunctionExpression = base$1.FunctionDeclaration;
    base$1.SequenceExpression = function(node, st, c) {
      for (var i = 0, list = node.expressions; i < list.length; i += 1) {
        var expr = list[i];
        c(expr, st, "Expression");
      }
    };
    base$1.TemplateLiteral = function(node, st, c) {
      for (var i = 0, list = node.quasis; i < list.length; i += 1) {
        var quasi = list[i];
        c(quasi, st);
      }
      for (var i$1 = 0, list$1 = node.expressions; i$1 < list$1.length; i$1 += 1) {
        var expr = list$1[i$1];
        c(expr, st, "Expression");
      }
    };
    base$1.TemplateElement = ignore;
    base$1.UnaryExpression = base$1.UpdateExpression = function(node, st, c) {
      c(node.argument, st, "Expression");
    };
    base$1.BinaryExpression = base$1.LogicalExpression = function(node, st, c) {
      c(node.left, st, "Expression");
      c(node.right, st, "Expression");
    };
    base$1.AssignmentExpression = base$1.AssignmentPattern = function(node, st, c) {
      c(node.left, st, "Pattern");
      c(node.right, st, "Expression");
    };
    base$1.ConditionalExpression = function(node, st, c) {
      c(node.test, st, "Expression");
      c(node.consequent, st, "Expression");
      c(node.alternate, st, "Expression");
    };
    base$1.NewExpression = base$1.CallExpression = function(node, st, c) {
      c(node.callee, st, "Expression");
      if (node.arguments) {
        for (var i = 0, list = node.arguments; i < list.length; i += 1) {
          var arg = list[i];
          c(arg, st, "Expression");
        }
      }
    };
    base$1.MemberExpression = function(node, st, c) {
      c(node.object, st, "Expression");
      if (node.computed) {
        c(node.property, st, "Expression");
      }
    };
    base$1.ExportNamedDeclaration = base$1.ExportDefaultDeclaration = function(node, st, c) {
      if (node.declaration) {
        c(node.declaration, st, node.type === "ExportNamedDeclaration" || node.declaration.id ? "Statement" : "Expression");
      }
      if (node.source) {
        c(node.source, st, "Expression");
      }
    };
    base$1.ExportAllDeclaration = function(node, st, c) {
      if (node.exported) {
        c(node.exported, st);
      }
      c(node.source, st, "Expression");
    };
    base$1.ImportDeclaration = function(node, st, c) {
      for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
        var spec = list[i];
        c(spec, st);
      }
      c(node.source, st, "Expression");
    };
    base$1.ImportExpression = function(node, st, c) {
      c(node.source, st, "Expression");
    };
    base$1.ImportSpecifier = base$1.ImportDefaultSpecifier = base$1.ImportNamespaceSpecifier = base$1.Identifier = base$1.PrivateIdentifier = base$1.Literal = ignore;
    base$1.TaggedTemplateExpression = function(node, st, c) {
      c(node.tag, st, "Expression");
      c(node.quasi, st, "Expression");
    };
    base$1.ClassDeclaration = base$1.ClassExpression = function(node, st, c) {
      return c(node, st, "Class");
    };
    base$1.Class = function(node, st, c) {
      if (node.id) {
        c(node.id, st, "Pattern");
      }
      if (node.superClass) {
        c(node.superClass, st, "Expression");
      }
      c(node.body, st);
    };
    base$1.ClassBody = function(node, st, c) {
      for (var i = 0, list = node.body; i < list.length; i += 1) {
        var elt = list[i];
        c(elt, st);
      }
    };
    base$1.MethodDefinition = base$1.PropertyDefinition = base$1.Property = function(node, st, c) {
      if (node.computed) {
        c(node.key, st, "Expression");
      }
      if (node.value) {
        c(node.value, st, "Expression");
      }
    };
    ArrowFunctionExpression$1 = "ArrowFunctionExpression";
    BinaryExpression$1 = "BinaryExpression";
    BlockStatement$1 = "BlockStatement";
    CallExpression$1 = "CallExpression";
    ChainExpression$1 = "ChainExpression";
    ConditionalExpression$1 = "ConditionalExpression";
    ExpressionStatement$1 = "ExpressionStatement";
    Identifier$1 = "Identifier";
    ImportDefaultSpecifier$1 = "ImportDefaultSpecifier";
    ImportNamespaceSpecifier$1 = "ImportNamespaceSpecifier";
    LogicalExpression$1 = "LogicalExpression";
    NewExpression$1 = "NewExpression";
    Program$1 = "Program";
    Property$1 = "Property";
    ReturnStatement$1 = "ReturnStatement";
    SequenceExpression$1 = "SequenceExpression";
    SOURCEMAPPING_URL = "sourceMa";
    SOURCEMAPPING_URL += "ppingURL";
    whiteSpaceNoNewline = "[ \\f\\r\\t\\v\\u00a0\\u1680\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff]";
    SOURCEMAPPING_URL_RE = new RegExp(`^#${whiteSpaceNoNewline}+${SOURCEMAPPING_URL}=.+`);
    base$1.PropertyDefinition = function(node, st, c) {
      if (node.computed) {
        c(node.key, st, "Expression");
      }
      if (node.value) {
        c(node.value, st, "Expression");
      }
    };
    ANNOTATION_KEY = "_rollupAnnotations";
    INVALID_COMMENT_KEY = "_rollupRemoved";
    neitherWithespaceNorBrackets = /[^\s(]/g;
    noWhitespace = /\S/g;
    pureCommentRegex = /[@#]__PURE__/;
    keys = {
      Literal: [],
      Program: ["body"]
    };
    INCLUDE_PARAMETERS = "variables";
    NodeBase = class extends ExpressionEntity {
      constructor(esTreeNode, parent, parentScope) {
        super();
        this.esTreeNode = esTreeNode;
        this.keys = keys[esTreeNode.type] || getAndCreateKeys(esTreeNode);
        this.parent = parent;
        this.context = parent.context;
        this.createScope(parentScope);
        this.parseNode(esTreeNode);
        this.initialise();
        this.context.magicString.addSourcemapLocation(this.start);
        this.context.magicString.addSourcemapLocation(this.end);
      }
      addExportedVariables(_variables, _exportNamesByVariable) {
      }
      bind() {
        for (const key of this.keys) {
          const value = this[key];
          if (value === null)
            continue;
          if (Array.isArray(value)) {
            for (const child of value) {
              if (child !== null)
                child.bind();
            }
          } else {
            value.bind();
          }
        }
      }
      createScope(parentScope) {
        this.scope = parentScope;
      }
      hasEffects(context) {
        if (this.deoptimized === false)
          this.applyDeoptimizations();
        for (const key of this.keys) {
          const value = this[key];
          if (value === null)
            continue;
          if (Array.isArray(value)) {
            for (const child of value) {
              if (child !== null && child.hasEffects(context))
                return true;
            }
          } else if (value.hasEffects(context))
            return true;
        }
        return false;
      }
      include(context, includeChildrenRecursively) {
        if (this.deoptimized === false)
          this.applyDeoptimizations();
        this.included = true;
        for (const key of this.keys) {
          const value = this[key];
          if (value === null)
            continue;
          if (Array.isArray(value)) {
            for (const child of value) {
              if (child !== null)
                child.include(context, includeChildrenRecursively);
            }
          } else {
            value.include(context, includeChildrenRecursively);
          }
        }
      }
      includeAsSingleStatement(context, includeChildrenRecursively) {
        this.include(context, includeChildrenRecursively);
      }
      initialise() {
      }
      insertSemicolon(code) {
        if (code.original[this.end - 1] !== ";") {
          code.appendLeft(this.end, ";");
        }
      }
      parseNode(esTreeNode) {
        for (const [key, value] of Object.entries(esTreeNode)) {
          if (this.hasOwnProperty(key))
            continue;
          if (key.charCodeAt(0) === 95) {
            if (key === ANNOTATION_KEY) {
              this.annotations = value;
            } else if (key === INVALID_COMMENT_KEY) {
              for (const { start, end } of value)
                this.context.magicString.remove(start, end);
            }
          } else if (typeof value !== "object" || value === null) {
            this[key] = value;
          } else if (Array.isArray(value)) {
            this[key] = [];
            for (const child of value) {
              this[key].push(child === null ? null : new (this.context.nodeConstructors[child.type] || this.context.nodeConstructors.UnknownNode)(child, this, this.scope));
            }
          } else {
            this[key] = new (this.context.nodeConstructors[value.type] || this.context.nodeConstructors.UnknownNode)(value, this, this.scope);
          }
        }
      }
      render(code, options) {
        for (const key of this.keys) {
          const value = this[key];
          if (value === null)
            continue;
          if (Array.isArray(value)) {
            for (const child of value) {
              if (child !== null)
                child.render(code, options);
            }
          } else {
            value.render(code, options);
          }
        }
      }
      shouldBeIncluded(context) {
        return this.included || !context.brokenFlow && this.hasEffects(createHasEffectsContext());
      }
      applyDeoptimizations() {
      }
    };
    ExportAllDeclaration = class extends NodeBase {
      hasEffects() {
        return false;
      }
      initialise() {
        this.context.addExport(this);
      }
      render(code, _options, nodeRenderOptions) {
        code.remove(nodeRenderOptions.start, nodeRenderOptions.end);
      }
    };
    ExportAllDeclaration.prototype.needsBoundaries = true;
    NO_SEMICOLON = { isNoStatement: true };
    NON_WHITESPACE = /\S/g;
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$";
    base = 64;
    NO_ARGS = [];
    UNDEFINED_EXPRESSION = new class UndefinedExpression extends ExpressionEntity {
      getLiteralValueAtPath() {
        return void 0;
      }
    }();
    returnsUnknown = {
      value: {
        callsArgs: null,
        returns: UNKNOWN_EXPRESSION
      }
    };
    UNKNOWN_LITERAL_BOOLEAN = new class UnknownBoolean extends ExpressionEntity {
      getReturnExpressionWhenCalledAtPath(path) {
        if (path.length === 1) {
          return getMemberReturnExpressionWhenCalled(literalBooleanMembers, path[0]);
        }
        return UNKNOWN_EXPRESSION;
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 1;
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (path.length === 1) {
          return hasMemberEffectWhenCalled(literalBooleanMembers, path[0], callOptions, context);
        }
        return true;
      }
    }();
    returnsBoolean = {
      value: {
        callsArgs: null,
        returns: UNKNOWN_LITERAL_BOOLEAN
      }
    };
    UNKNOWN_LITERAL_NUMBER = new class UnknownNumber extends ExpressionEntity {
      getReturnExpressionWhenCalledAtPath(path) {
        if (path.length === 1) {
          return getMemberReturnExpressionWhenCalled(literalNumberMembers, path[0]);
        }
        return UNKNOWN_EXPRESSION;
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 1;
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (path.length === 1) {
          return hasMemberEffectWhenCalled(literalNumberMembers, path[0], callOptions, context);
        }
        return true;
      }
    }();
    returnsNumber = {
      value: {
        callsArgs: null,
        returns: UNKNOWN_LITERAL_NUMBER
      }
    };
    UNKNOWN_LITERAL_STRING = new class UnknownString extends ExpressionEntity {
      getReturnExpressionWhenCalledAtPath(path) {
        if (path.length === 1) {
          return getMemberReturnExpressionWhenCalled(literalStringMembers, path[0]);
        }
        return UNKNOWN_EXPRESSION;
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 1;
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (path.length === 1) {
          return hasMemberEffectWhenCalled(literalStringMembers, path[0], callOptions, context);
        }
        return true;
      }
    }();
    returnsString = {
      value: {
        callsArgs: null,
        returns: UNKNOWN_LITERAL_STRING
      }
    };
    objectMembers = assembleMemberDescriptions({
      hasOwnProperty: returnsBoolean,
      isPrototypeOf: returnsBoolean,
      propertyIsEnumerable: returnsBoolean,
      toLocaleString: returnsString,
      toString: returnsString,
      valueOf: returnsUnknown
    });
    literalBooleanMembers = assembleMemberDescriptions({
      valueOf: returnsBoolean
    }, objectMembers);
    literalNumberMembers = assembleMemberDescriptions({
      toExponential: returnsString,
      toFixed: returnsString,
      toLocaleString: returnsString,
      toPrecision: returnsString,
      valueOf: returnsNumber
    }, objectMembers);
    literalStringMembers = assembleMemberDescriptions({
      charAt: returnsString,
      charCodeAt: returnsNumber,
      codePointAt: returnsNumber,
      concat: returnsString,
      endsWith: returnsBoolean,
      includes: returnsBoolean,
      indexOf: returnsNumber,
      lastIndexOf: returnsNumber,
      localeCompare: returnsNumber,
      match: returnsBoolean,
      normalize: returnsString,
      padEnd: returnsString,
      padStart: returnsString,
      repeat: returnsString,
      replace: {
        value: {
          callsArgs: [1],
          returns: UNKNOWN_LITERAL_STRING
        }
      },
      search: returnsNumber,
      slice: returnsString,
      split: returnsUnknown,
      startsWith: returnsBoolean,
      substr: returnsString,
      substring: returnsString,
      toLocaleLowerCase: returnsString,
      toLocaleUpperCase: returnsString,
      toLowerCase: returnsString,
      toUpperCase: returnsString,
      trim: returnsString,
      valueOf: returnsString
    }, objectMembers);
    LocalVariable = class extends Variable {
      constructor(name, declarator, init, context) {
        super(name);
        this.calledFromTryStatement = false;
        this.additionalInitializers = null;
        this.expressionsToBeDeoptimized = [];
        this.declarations = declarator ? [declarator] : [];
        this.init = init;
        this.deoptimizationTracker = context.deoptimizationTracker;
        this.module = context.module;
      }
      addDeclaration(identifier, init) {
        this.declarations.push(identifier);
        const additionalInitializers = this.markInitializersForDeoptimization();
        if (init !== null) {
          additionalInitializers.push(init);
        }
      }
      consolidateInitializers() {
        if (this.additionalInitializers !== null) {
          for (const initializer of this.additionalInitializers) {
            initializer.deoptimizePath(UNKNOWN_PATH);
          }
          this.additionalInitializers = null;
        }
      }
      deoptimizePath(path) {
        var _a, _b;
        if (this.isReassigned || this.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(path, this)) {
          return;
        }
        if (path.length === 0) {
          if (!this.isReassigned) {
            this.isReassigned = true;
            const expressionsToBeDeoptimized = this.expressionsToBeDeoptimized;
            this.expressionsToBeDeoptimized = [];
            for (const expression of expressionsToBeDeoptimized) {
              expression.deoptimizeCache();
            }
            (_a = this.init) === null || _a === void 0 ? void 0 : _a.deoptimizePath(UNKNOWN_PATH);
          }
        } else {
          (_b = this.init) === null || _b === void 0 ? void 0 : _b.deoptimizePath(path);
        }
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        if (this.isReassigned || !this.init) {
          return thisParameter.deoptimizePath(UNKNOWN_PATH);
        }
        recursionTracker.withTrackedEntityAtPath(path, this.init, () => this.init.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker), void 0);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        if (this.isReassigned || !this.init) {
          return UnknownValue;
        }
        return recursionTracker.withTrackedEntityAtPath(path, this.init, () => {
          this.expressionsToBeDeoptimized.push(origin);
          return this.init.getLiteralValueAtPath(path, recursionTracker, origin);
        }, UnknownValue);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        if (this.isReassigned || !this.init) {
          return UNKNOWN_EXPRESSION;
        }
        return recursionTracker.withTrackedEntityAtPath(path, this.init, () => {
          this.expressionsToBeDeoptimized.push(origin);
          return this.init.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
        }, UNKNOWN_EXPRESSION);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        if (this.isReassigned)
          return true;
        return this.init && !context.accessed.trackEntityAtPathAndGetIfTracked(path, this) && this.init.hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        if (this.included)
          return true;
        if (path.length === 0)
          return false;
        if (this.isReassigned)
          return true;
        return this.init && !context.accessed.trackEntityAtPathAndGetIfTracked(path, this) && this.init.hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (this.isReassigned)
          return true;
        return this.init && !(callOptions.withNew ? context.instantiated : context.called).trackEntityAtPathAndGetIfTracked(path, callOptions, this) && this.init.hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
      include() {
        if (!this.included) {
          this.included = true;
          for (const declaration of this.declarations) {
            if (!declaration.included)
              declaration.include(createInclusionContext(), false);
            let node = declaration.parent;
            while (!node.included) {
              node.included = true;
              if (node.type === Program$1)
                break;
              node = node.parent;
            }
          }
        }
      }
      includeCallArguments(context, args) {
        if (this.isReassigned || this.init && context.includedCallArguments.has(this.init)) {
          for (const arg of args) {
            arg.include(context, false);
          }
        } else if (this.init) {
          context.includedCallArguments.add(this.init);
          this.init.includeCallArguments(context, args);
          context.includedCallArguments.delete(this.init);
        }
      }
      markCalledFromTryStatement() {
        this.calledFromTryStatement = true;
      }
      markInitializersForDeoptimization() {
        if (this.additionalInitializers === null) {
          this.additionalInitializers = this.init === null ? [] : [this.init];
          this.init = UNKNOWN_EXPRESSION;
          this.isReassigned = true;
        }
        return this.additionalInitializers;
      }
    };
    Scope$1 = class {
      constructor() {
        this.children = [];
        this.variables = new Map();
      }
      addDeclaration(identifier, context, init, _isHoisted) {
        const name = identifier.name;
        let variable = this.variables.get(name);
        if (variable) {
          variable.addDeclaration(identifier, init);
        } else {
          variable = new LocalVariable(identifier.name, identifier, init || UNDEFINED_EXPRESSION, context);
          this.variables.set(name, variable);
        }
        return variable;
      }
      contains(name) {
        return this.variables.has(name);
      }
      findVariable(_name) {
        throw new Error("Internal Error: findVariable needs to be implemented by a subclass");
      }
    };
    ChildScope = class extends Scope$1 {
      constructor(parent) {
        super();
        this.accessedOutsideVariables = new Map();
        this.parent = parent;
        parent.children.push(this);
      }
      addAccessedDynamicImport(importExpression) {
        (this.accessedDynamicImports || (this.accessedDynamicImports = new Set())).add(importExpression);
        if (this.parent instanceof ChildScope) {
          this.parent.addAccessedDynamicImport(importExpression);
        }
      }
      addAccessedGlobals(globals, accessedGlobalsByScope) {
        const accessedGlobals = accessedGlobalsByScope.get(this) || new Set();
        for (const name of globals) {
          accessedGlobals.add(name);
        }
        accessedGlobalsByScope.set(this, accessedGlobals);
        if (this.parent instanceof ChildScope) {
          this.parent.addAccessedGlobals(globals, accessedGlobalsByScope);
        }
      }
      addNamespaceMemberAccess(name, variable) {
        this.accessedOutsideVariables.set(name, variable);
        this.parent.addNamespaceMemberAccess(name, variable);
      }
      addReturnExpression(expression) {
        this.parent instanceof ChildScope && this.parent.addReturnExpression(expression);
      }
      addUsedOutsideNames(usedNames, format, exportNamesByVariable, accessedGlobalsByScope) {
        for (const variable of this.accessedOutsideVariables.values()) {
          if (variable.included) {
            usedNames.add(variable.getBaseVariableName());
            if (format === "system" && exportNamesByVariable.has(variable)) {
              usedNames.add("exports");
            }
          }
        }
        const accessedGlobals = accessedGlobalsByScope.get(this);
        if (accessedGlobals) {
          for (const name of accessedGlobals) {
            usedNames.add(name);
          }
        }
      }
      contains(name) {
        return this.variables.has(name) || this.parent.contains(name);
      }
      deconflict(format, exportNamesByVariable, accessedGlobalsByScope) {
        const usedNames = new Set();
        this.addUsedOutsideNames(usedNames, format, exportNamesByVariable, accessedGlobalsByScope);
        if (this.accessedDynamicImports) {
          for (const importExpression of this.accessedDynamicImports) {
            if (importExpression.inlineNamespace) {
              usedNames.add(importExpression.inlineNamespace.getBaseVariableName());
            }
          }
        }
        for (const [name, variable] of this.variables) {
          if (variable.included || variable.alwaysRendered) {
            variable.setRenderNames(null, getSafeName(name, usedNames));
          }
        }
        for (const scope of this.children) {
          scope.deconflict(format, exportNamesByVariable, accessedGlobalsByScope);
        }
      }
      findLexicalBoundary() {
        return this.parent.findLexicalBoundary();
      }
      findVariable(name) {
        const knownVariable = this.variables.get(name) || this.accessedOutsideVariables.get(name);
        if (knownVariable) {
          return knownVariable;
        }
        const variable = this.parent.findVariable(name);
        this.accessedOutsideVariables.set(name, variable);
        return variable;
      }
    };
    ValueProperties = Symbol("Value Properties");
    PURE = { pure: true };
    IMPURE = { pure: false };
    O = {
      __proto__: null,
      [ValueProperties]: IMPURE
    };
    PF = {
      __proto__: null,
      [ValueProperties]: PURE
    };
    C = {
      __proto__: null,
      [ValueProperties]: IMPURE,
      prototype: O
    };
    PC = {
      __proto__: null,
      [ValueProperties]: PURE,
      prototype: O
    };
    ARRAY_TYPE = {
      __proto__: null,
      [ValueProperties]: PURE,
      from: PF,
      of: PF,
      prototype: O
    };
    INTL_MEMBER = {
      __proto__: null,
      [ValueProperties]: PURE,
      supportedLocalesOf: PC
    };
    knownGlobals = {
      global: O,
      globalThis: O,
      self: O,
      window: O,
      __proto__: null,
      [ValueProperties]: IMPURE,
      Array: {
        __proto__: null,
        [ValueProperties]: IMPURE,
        from: O,
        isArray: PF,
        of: PF,
        prototype: O
      },
      ArrayBuffer: {
        __proto__: null,
        [ValueProperties]: PURE,
        isView: PF,
        prototype: O
      },
      Atomics: O,
      BigInt: C,
      BigInt64Array: C,
      BigUint64Array: C,
      Boolean: PC,
      constructor: C,
      DataView: PC,
      Date: {
        __proto__: null,
        [ValueProperties]: PURE,
        now: PF,
        parse: PF,
        prototype: O,
        UTC: PF
      },
      decodeURI: PF,
      decodeURIComponent: PF,
      encodeURI: PF,
      encodeURIComponent: PF,
      Error: PC,
      escape: PF,
      eval: O,
      EvalError: PC,
      Float32Array: ARRAY_TYPE,
      Float64Array: ARRAY_TYPE,
      Function: C,
      hasOwnProperty: O,
      Infinity: O,
      Int16Array: ARRAY_TYPE,
      Int32Array: ARRAY_TYPE,
      Int8Array: ARRAY_TYPE,
      isFinite: PF,
      isNaN: PF,
      isPrototypeOf: O,
      JSON: O,
      Map: PC,
      Math: {
        __proto__: null,
        [ValueProperties]: IMPURE,
        abs: PF,
        acos: PF,
        acosh: PF,
        asin: PF,
        asinh: PF,
        atan: PF,
        atan2: PF,
        atanh: PF,
        cbrt: PF,
        ceil: PF,
        clz32: PF,
        cos: PF,
        cosh: PF,
        exp: PF,
        expm1: PF,
        floor: PF,
        fround: PF,
        hypot: PF,
        imul: PF,
        log: PF,
        log10: PF,
        log1p: PF,
        log2: PF,
        max: PF,
        min: PF,
        pow: PF,
        random: PF,
        round: PF,
        sign: PF,
        sin: PF,
        sinh: PF,
        sqrt: PF,
        tan: PF,
        tanh: PF,
        trunc: PF
      },
      NaN: O,
      Number: {
        __proto__: null,
        [ValueProperties]: PURE,
        isFinite: PF,
        isInteger: PF,
        isNaN: PF,
        isSafeInteger: PF,
        parseFloat: PF,
        parseInt: PF,
        prototype: O
      },
      Object: {
        __proto__: null,
        [ValueProperties]: PURE,
        create: PF,
        getNotifier: PF,
        getOwn: PF,
        getOwnPropertyDescriptor: PF,
        getOwnPropertyNames: PF,
        getOwnPropertySymbols: PF,
        getPrototypeOf: PF,
        is: PF,
        isExtensible: PF,
        isFrozen: PF,
        isSealed: PF,
        keys: PF,
        prototype: O
      },
      parseFloat: PF,
      parseInt: PF,
      Promise: {
        __proto__: null,
        [ValueProperties]: IMPURE,
        all: O,
        prototype: O,
        race: O,
        reject: O,
        resolve: O
      },
      propertyIsEnumerable: O,
      Proxy: O,
      RangeError: PC,
      ReferenceError: PC,
      Reflect: O,
      RegExp: PC,
      Set: PC,
      SharedArrayBuffer: C,
      String: {
        __proto__: null,
        [ValueProperties]: PURE,
        fromCharCode: PF,
        fromCodePoint: PF,
        prototype: O,
        raw: PF
      },
      Symbol: {
        __proto__: null,
        [ValueProperties]: PURE,
        for: PF,
        keyFor: PF,
        prototype: O
      },
      SyntaxError: PC,
      toLocaleString: O,
      toString: O,
      TypeError: PC,
      Uint16Array: ARRAY_TYPE,
      Uint32Array: ARRAY_TYPE,
      Uint8Array: ARRAY_TYPE,
      Uint8ClampedArray: ARRAY_TYPE,
      unescape: PF,
      URIError: PC,
      valueOf: O,
      WeakMap: PC,
      WeakSet: PC,
      clearInterval: C,
      clearTimeout: C,
      console: O,
      Intl: {
        __proto__: null,
        [ValueProperties]: IMPURE,
        Collator: INTL_MEMBER,
        DateTimeFormat: INTL_MEMBER,
        ListFormat: INTL_MEMBER,
        NumberFormat: INTL_MEMBER,
        PluralRules: INTL_MEMBER,
        RelativeTimeFormat: INTL_MEMBER
      },
      setInterval: C,
      setTimeout: C,
      TextDecoder: C,
      TextEncoder: C,
      URL: C,
      URLSearchParams: C,
      AbortController: C,
      AbortSignal: C,
      addEventListener: O,
      alert: O,
      AnalyserNode: C,
      Animation: C,
      AnimationEvent: C,
      applicationCache: O,
      ApplicationCache: C,
      ApplicationCacheErrorEvent: C,
      atob: O,
      Attr: C,
      Audio: C,
      AudioBuffer: C,
      AudioBufferSourceNode: C,
      AudioContext: C,
      AudioDestinationNode: C,
      AudioListener: C,
      AudioNode: C,
      AudioParam: C,
      AudioProcessingEvent: C,
      AudioScheduledSourceNode: C,
      AudioWorkletNode: C,
      BarProp: C,
      BaseAudioContext: C,
      BatteryManager: C,
      BeforeUnloadEvent: C,
      BiquadFilterNode: C,
      Blob: C,
      BlobEvent: C,
      blur: O,
      BroadcastChannel: C,
      btoa: O,
      ByteLengthQueuingStrategy: C,
      Cache: C,
      caches: O,
      CacheStorage: C,
      cancelAnimationFrame: O,
      cancelIdleCallback: O,
      CanvasCaptureMediaStreamTrack: C,
      CanvasGradient: C,
      CanvasPattern: C,
      CanvasRenderingContext2D: C,
      ChannelMergerNode: C,
      ChannelSplitterNode: C,
      CharacterData: C,
      clientInformation: O,
      ClipboardEvent: C,
      close: O,
      closed: O,
      CloseEvent: C,
      Comment: C,
      CompositionEvent: C,
      confirm: O,
      ConstantSourceNode: C,
      ConvolverNode: C,
      CountQueuingStrategy: C,
      createImageBitmap: O,
      Credential: C,
      CredentialsContainer: C,
      crypto: O,
      Crypto: C,
      CryptoKey: C,
      CSS: C,
      CSSConditionRule: C,
      CSSFontFaceRule: C,
      CSSGroupingRule: C,
      CSSImportRule: C,
      CSSKeyframeRule: C,
      CSSKeyframesRule: C,
      CSSMediaRule: C,
      CSSNamespaceRule: C,
      CSSPageRule: C,
      CSSRule: C,
      CSSRuleList: C,
      CSSStyleDeclaration: C,
      CSSStyleRule: C,
      CSSStyleSheet: C,
      CSSSupportsRule: C,
      CustomElementRegistry: C,
      customElements: O,
      CustomEvent: C,
      DataTransfer: C,
      DataTransferItem: C,
      DataTransferItemList: C,
      defaultstatus: O,
      defaultStatus: O,
      DelayNode: C,
      DeviceMotionEvent: C,
      DeviceOrientationEvent: C,
      devicePixelRatio: O,
      dispatchEvent: O,
      document: O,
      Document: C,
      DocumentFragment: C,
      DocumentType: C,
      DOMError: C,
      DOMException: C,
      DOMImplementation: C,
      DOMMatrix: C,
      DOMMatrixReadOnly: C,
      DOMParser: C,
      DOMPoint: C,
      DOMPointReadOnly: C,
      DOMQuad: C,
      DOMRect: C,
      DOMRectReadOnly: C,
      DOMStringList: C,
      DOMStringMap: C,
      DOMTokenList: C,
      DragEvent: C,
      DynamicsCompressorNode: C,
      Element: C,
      ErrorEvent: C,
      Event: C,
      EventSource: C,
      EventTarget: C,
      external: O,
      fetch: O,
      File: C,
      FileList: C,
      FileReader: C,
      find: O,
      focus: O,
      FocusEvent: C,
      FontFace: C,
      FontFaceSetLoadEvent: C,
      FormData: C,
      frames: O,
      GainNode: C,
      Gamepad: C,
      GamepadButton: C,
      GamepadEvent: C,
      getComputedStyle: O,
      getSelection: O,
      HashChangeEvent: C,
      Headers: C,
      history: O,
      History: C,
      HTMLAllCollection: C,
      HTMLAnchorElement: C,
      HTMLAreaElement: C,
      HTMLAudioElement: C,
      HTMLBaseElement: C,
      HTMLBodyElement: C,
      HTMLBRElement: C,
      HTMLButtonElement: C,
      HTMLCanvasElement: C,
      HTMLCollection: C,
      HTMLContentElement: C,
      HTMLDataElement: C,
      HTMLDataListElement: C,
      HTMLDetailsElement: C,
      HTMLDialogElement: C,
      HTMLDirectoryElement: C,
      HTMLDivElement: C,
      HTMLDListElement: C,
      HTMLDocument: C,
      HTMLElement: C,
      HTMLEmbedElement: C,
      HTMLFieldSetElement: C,
      HTMLFontElement: C,
      HTMLFormControlsCollection: C,
      HTMLFormElement: C,
      HTMLFrameElement: C,
      HTMLFrameSetElement: C,
      HTMLHeadElement: C,
      HTMLHeadingElement: C,
      HTMLHRElement: C,
      HTMLHtmlElement: C,
      HTMLIFrameElement: C,
      HTMLImageElement: C,
      HTMLInputElement: C,
      HTMLLabelElement: C,
      HTMLLegendElement: C,
      HTMLLIElement: C,
      HTMLLinkElement: C,
      HTMLMapElement: C,
      HTMLMarqueeElement: C,
      HTMLMediaElement: C,
      HTMLMenuElement: C,
      HTMLMetaElement: C,
      HTMLMeterElement: C,
      HTMLModElement: C,
      HTMLObjectElement: C,
      HTMLOListElement: C,
      HTMLOptGroupElement: C,
      HTMLOptionElement: C,
      HTMLOptionsCollection: C,
      HTMLOutputElement: C,
      HTMLParagraphElement: C,
      HTMLParamElement: C,
      HTMLPictureElement: C,
      HTMLPreElement: C,
      HTMLProgressElement: C,
      HTMLQuoteElement: C,
      HTMLScriptElement: C,
      HTMLSelectElement: C,
      HTMLShadowElement: C,
      HTMLSlotElement: C,
      HTMLSourceElement: C,
      HTMLSpanElement: C,
      HTMLStyleElement: C,
      HTMLTableCaptionElement: C,
      HTMLTableCellElement: C,
      HTMLTableColElement: C,
      HTMLTableElement: C,
      HTMLTableRowElement: C,
      HTMLTableSectionElement: C,
      HTMLTemplateElement: C,
      HTMLTextAreaElement: C,
      HTMLTimeElement: C,
      HTMLTitleElement: C,
      HTMLTrackElement: C,
      HTMLUListElement: C,
      HTMLUnknownElement: C,
      HTMLVideoElement: C,
      IDBCursor: C,
      IDBCursorWithValue: C,
      IDBDatabase: C,
      IDBFactory: C,
      IDBIndex: C,
      IDBKeyRange: C,
      IDBObjectStore: C,
      IDBOpenDBRequest: C,
      IDBRequest: C,
      IDBTransaction: C,
      IDBVersionChangeEvent: C,
      IdleDeadline: C,
      IIRFilterNode: C,
      Image: C,
      ImageBitmap: C,
      ImageBitmapRenderingContext: C,
      ImageCapture: C,
      ImageData: C,
      indexedDB: O,
      innerHeight: O,
      innerWidth: O,
      InputEvent: C,
      IntersectionObserver: C,
      IntersectionObserverEntry: C,
      isSecureContext: O,
      KeyboardEvent: C,
      KeyframeEffect: C,
      length: O,
      localStorage: O,
      location: O,
      Location: C,
      locationbar: O,
      matchMedia: O,
      MediaDeviceInfo: C,
      MediaDevices: C,
      MediaElementAudioSourceNode: C,
      MediaEncryptedEvent: C,
      MediaError: C,
      MediaKeyMessageEvent: C,
      MediaKeySession: C,
      MediaKeyStatusMap: C,
      MediaKeySystemAccess: C,
      MediaList: C,
      MediaQueryList: C,
      MediaQueryListEvent: C,
      MediaRecorder: C,
      MediaSettingsRange: C,
      MediaSource: C,
      MediaStream: C,
      MediaStreamAudioDestinationNode: C,
      MediaStreamAudioSourceNode: C,
      MediaStreamEvent: C,
      MediaStreamTrack: C,
      MediaStreamTrackEvent: C,
      menubar: O,
      MessageChannel: C,
      MessageEvent: C,
      MessagePort: C,
      MIDIAccess: C,
      MIDIConnectionEvent: C,
      MIDIInput: C,
      MIDIInputMap: C,
      MIDIMessageEvent: C,
      MIDIOutput: C,
      MIDIOutputMap: C,
      MIDIPort: C,
      MimeType: C,
      MimeTypeArray: C,
      MouseEvent: C,
      moveBy: O,
      moveTo: O,
      MutationEvent: C,
      MutationObserver: C,
      MutationRecord: C,
      name: O,
      NamedNodeMap: C,
      NavigationPreloadManager: C,
      navigator: O,
      Navigator: C,
      NetworkInformation: C,
      Node: C,
      NodeFilter: O,
      NodeIterator: C,
      NodeList: C,
      Notification: C,
      OfflineAudioCompletionEvent: C,
      OfflineAudioContext: C,
      offscreenBuffering: O,
      OffscreenCanvas: C,
      open: O,
      openDatabase: O,
      Option: C,
      origin: O,
      OscillatorNode: C,
      outerHeight: O,
      outerWidth: O,
      PageTransitionEvent: C,
      pageXOffset: O,
      pageYOffset: O,
      PannerNode: C,
      parent: O,
      Path2D: C,
      PaymentAddress: C,
      PaymentRequest: C,
      PaymentRequestUpdateEvent: C,
      PaymentResponse: C,
      performance: O,
      Performance: C,
      PerformanceEntry: C,
      PerformanceLongTaskTiming: C,
      PerformanceMark: C,
      PerformanceMeasure: C,
      PerformanceNavigation: C,
      PerformanceNavigationTiming: C,
      PerformanceObserver: C,
      PerformanceObserverEntryList: C,
      PerformancePaintTiming: C,
      PerformanceResourceTiming: C,
      PerformanceTiming: C,
      PeriodicWave: C,
      Permissions: C,
      PermissionStatus: C,
      personalbar: O,
      PhotoCapabilities: C,
      Plugin: C,
      PluginArray: C,
      PointerEvent: C,
      PopStateEvent: C,
      postMessage: O,
      Presentation: C,
      PresentationAvailability: C,
      PresentationConnection: C,
      PresentationConnectionAvailableEvent: C,
      PresentationConnectionCloseEvent: C,
      PresentationConnectionList: C,
      PresentationReceiver: C,
      PresentationRequest: C,
      print: O,
      ProcessingInstruction: C,
      ProgressEvent: C,
      PromiseRejectionEvent: C,
      prompt: O,
      PushManager: C,
      PushSubscription: C,
      PushSubscriptionOptions: C,
      queueMicrotask: O,
      RadioNodeList: C,
      Range: C,
      ReadableStream: C,
      RemotePlayback: C,
      removeEventListener: O,
      Request: C,
      requestAnimationFrame: O,
      requestIdleCallback: O,
      resizeBy: O,
      ResizeObserver: C,
      ResizeObserverEntry: C,
      resizeTo: O,
      Response: C,
      RTCCertificate: C,
      RTCDataChannel: C,
      RTCDataChannelEvent: C,
      RTCDtlsTransport: C,
      RTCIceCandidate: C,
      RTCIceTransport: C,
      RTCPeerConnection: C,
      RTCPeerConnectionIceEvent: C,
      RTCRtpReceiver: C,
      RTCRtpSender: C,
      RTCSctpTransport: C,
      RTCSessionDescription: C,
      RTCStatsReport: C,
      RTCTrackEvent: C,
      screen: O,
      Screen: C,
      screenLeft: O,
      ScreenOrientation: C,
      screenTop: O,
      screenX: O,
      screenY: O,
      ScriptProcessorNode: C,
      scroll: O,
      scrollbars: O,
      scrollBy: O,
      scrollTo: O,
      scrollX: O,
      scrollY: O,
      SecurityPolicyViolationEvent: C,
      Selection: C,
      ServiceWorker: C,
      ServiceWorkerContainer: C,
      ServiceWorkerRegistration: C,
      sessionStorage: O,
      ShadowRoot: C,
      SharedWorker: C,
      SourceBuffer: C,
      SourceBufferList: C,
      speechSynthesis: O,
      SpeechSynthesisEvent: C,
      SpeechSynthesisUtterance: C,
      StaticRange: C,
      status: O,
      statusbar: O,
      StereoPannerNode: C,
      stop: O,
      Storage: C,
      StorageEvent: C,
      StorageManager: C,
      styleMedia: O,
      StyleSheet: C,
      StyleSheetList: C,
      SubtleCrypto: C,
      SVGAElement: C,
      SVGAngle: C,
      SVGAnimatedAngle: C,
      SVGAnimatedBoolean: C,
      SVGAnimatedEnumeration: C,
      SVGAnimatedInteger: C,
      SVGAnimatedLength: C,
      SVGAnimatedLengthList: C,
      SVGAnimatedNumber: C,
      SVGAnimatedNumberList: C,
      SVGAnimatedPreserveAspectRatio: C,
      SVGAnimatedRect: C,
      SVGAnimatedString: C,
      SVGAnimatedTransformList: C,
      SVGAnimateElement: C,
      SVGAnimateMotionElement: C,
      SVGAnimateTransformElement: C,
      SVGAnimationElement: C,
      SVGCircleElement: C,
      SVGClipPathElement: C,
      SVGComponentTransferFunctionElement: C,
      SVGDefsElement: C,
      SVGDescElement: C,
      SVGDiscardElement: C,
      SVGElement: C,
      SVGEllipseElement: C,
      SVGFEBlendElement: C,
      SVGFEColorMatrixElement: C,
      SVGFEComponentTransferElement: C,
      SVGFECompositeElement: C,
      SVGFEConvolveMatrixElement: C,
      SVGFEDiffuseLightingElement: C,
      SVGFEDisplacementMapElement: C,
      SVGFEDistantLightElement: C,
      SVGFEDropShadowElement: C,
      SVGFEFloodElement: C,
      SVGFEFuncAElement: C,
      SVGFEFuncBElement: C,
      SVGFEFuncGElement: C,
      SVGFEFuncRElement: C,
      SVGFEGaussianBlurElement: C,
      SVGFEImageElement: C,
      SVGFEMergeElement: C,
      SVGFEMergeNodeElement: C,
      SVGFEMorphologyElement: C,
      SVGFEOffsetElement: C,
      SVGFEPointLightElement: C,
      SVGFESpecularLightingElement: C,
      SVGFESpotLightElement: C,
      SVGFETileElement: C,
      SVGFETurbulenceElement: C,
      SVGFilterElement: C,
      SVGForeignObjectElement: C,
      SVGGElement: C,
      SVGGeometryElement: C,
      SVGGradientElement: C,
      SVGGraphicsElement: C,
      SVGImageElement: C,
      SVGLength: C,
      SVGLengthList: C,
      SVGLinearGradientElement: C,
      SVGLineElement: C,
      SVGMarkerElement: C,
      SVGMaskElement: C,
      SVGMatrix: C,
      SVGMetadataElement: C,
      SVGMPathElement: C,
      SVGNumber: C,
      SVGNumberList: C,
      SVGPathElement: C,
      SVGPatternElement: C,
      SVGPoint: C,
      SVGPointList: C,
      SVGPolygonElement: C,
      SVGPolylineElement: C,
      SVGPreserveAspectRatio: C,
      SVGRadialGradientElement: C,
      SVGRect: C,
      SVGRectElement: C,
      SVGScriptElement: C,
      SVGSetElement: C,
      SVGStopElement: C,
      SVGStringList: C,
      SVGStyleElement: C,
      SVGSVGElement: C,
      SVGSwitchElement: C,
      SVGSymbolElement: C,
      SVGTextContentElement: C,
      SVGTextElement: C,
      SVGTextPathElement: C,
      SVGTextPositioningElement: C,
      SVGTitleElement: C,
      SVGTransform: C,
      SVGTransformList: C,
      SVGTSpanElement: C,
      SVGUnitTypes: C,
      SVGUseElement: C,
      SVGViewElement: C,
      TaskAttributionTiming: C,
      Text: C,
      TextEvent: C,
      TextMetrics: C,
      TextTrack: C,
      TextTrackCue: C,
      TextTrackCueList: C,
      TextTrackList: C,
      TimeRanges: C,
      toolbar: O,
      top: O,
      Touch: C,
      TouchEvent: C,
      TouchList: C,
      TrackEvent: C,
      TransitionEvent: C,
      TreeWalker: C,
      UIEvent: C,
      ValidityState: C,
      visualViewport: O,
      VisualViewport: C,
      VTTCue: C,
      WaveShaperNode: C,
      WebAssembly: O,
      WebGL2RenderingContext: C,
      WebGLActiveInfo: C,
      WebGLBuffer: C,
      WebGLContextEvent: C,
      WebGLFramebuffer: C,
      WebGLProgram: C,
      WebGLQuery: C,
      WebGLRenderbuffer: C,
      WebGLRenderingContext: C,
      WebGLSampler: C,
      WebGLShader: C,
      WebGLShaderPrecisionFormat: C,
      WebGLSync: C,
      WebGLTexture: C,
      WebGLTransformFeedback: C,
      WebGLUniformLocation: C,
      WebGLVertexArrayObject: C,
      WebSocket: C,
      WheelEvent: C,
      Window: C,
      Worker: C,
      WritableStream: C,
      XMLDocument: C,
      XMLHttpRequest: C,
      XMLHttpRequestEventTarget: C,
      XMLHttpRequestUpload: C,
      XMLSerializer: C,
      XPathEvaluator: C,
      XPathExpression: C,
      XPathResult: C,
      XSLTProcessor: C
    };
    for (const global of ["window", "global", "self", "globalThis"]) {
      knownGlobals[global] = knownGlobals;
    }
    GlobalVariable = class extends Variable {
      constructor() {
        super(...arguments);
        this.isReassigned = true;
      }
      hasEffectsWhenAccessedAtPath(path) {
        return !isGlobalMember([this.name, ...path]);
      }
      hasEffectsWhenCalledAtPath(path) {
        return !isPureGlobal([this.name, ...path]);
      }
    };
    tdzVariableKinds = {
      __proto__: null,
      class: true,
      const: true,
      let: true,
      var: true
    };
    Identifier = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.variable = null;
        this.deoptimized = false;
        this.isTDZAccess = null;
      }
      addExportedVariables(variables, exportNamesByVariable) {
        if (this.variable !== null && exportNamesByVariable.has(this.variable)) {
          variables.push(this.variable);
        }
      }
      bind() {
        if (this.variable === null && is_reference(this, this.parent)) {
          this.variable = this.scope.findVariable(this.name);
          this.variable.addReference(this);
        }
      }
      declare(kind, init) {
        let variable;
        const { treeshake } = this.context.options;
        switch (kind) {
          case "var":
            variable = this.scope.addDeclaration(this, this.context, init, true);
            if (treeshake && treeshake.correctVarValueBeforeDeclaration) {
              variable.markInitializersForDeoptimization();
            }
            break;
          case "function":
            variable = this.scope.addDeclaration(this, this.context, init, false);
            break;
          case "let":
          case "const":
          case "class":
            variable = this.scope.addDeclaration(this, this.context, init, false);
            break;
          case "parameter":
            variable = this.scope.addParameterDeclaration(this);
            break;
          default:
            throw new Error(`Internal Error: Unexpected identifier kind ${kind}.`);
        }
        variable.kind = kind;
        return [this.variable = variable];
      }
      deoptimizePath(path) {
        if (path.length === 0 && !this.scope.contains(this.name)) {
          this.disallowImportReassignment();
        }
        this.variable.deoptimizePath(path);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        this.variable.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        return this.getVariableRespectingTDZ().getLiteralValueAtPath(path, recursionTracker, origin);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        return this.getVariableRespectingTDZ().getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
      }
      hasEffects() {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        if (this.isPossibleTDZ() && this.variable.kind !== "var") {
          return true;
        }
        return this.context.options.treeshake.unknownGlobalSideEffects && this.variable instanceof GlobalVariable && this.variable.hasEffectsWhenAccessedAtPath(EMPTY_PATH);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return this.variable !== null && this.getVariableRespectingTDZ().hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return !this.variable || (path.length > 0 ? this.getVariableRespectingTDZ() : this.variable).hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        return !this.variable || this.getVariableRespectingTDZ().hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
      include() {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        if (!this.included) {
          this.included = true;
          if (this.variable !== null) {
            this.context.includeVariableInModule(this.variable);
          }
        }
      }
      includeCallArguments(context, args) {
        this.getVariableRespectingTDZ().includeCallArguments(context, args);
      }
      isPossibleTDZ() {
        if (this.isTDZAccess !== null)
          return this.isTDZAccess;
        if (!(this.variable instanceof LocalVariable) || !this.variable.kind || !(this.variable.kind in tdzVariableKinds)) {
          return this.isTDZAccess = false;
        }
        let decl_id;
        if (this.variable.declarations && this.variable.declarations.length === 1 && (decl_id = this.variable.declarations[0]) && this.start < decl_id.start && closestParentFunctionOrProgram(this) === closestParentFunctionOrProgram(decl_id)) {
          return this.isTDZAccess = true;
        }
        if (!this.variable.initReached) {
          return this.isTDZAccess = true;
        }
        return this.isTDZAccess = false;
      }
      markDeclarationReached() {
        this.variable.initReached = true;
      }
      render(code, _options, { renderedParentType, isCalleeOfRenderedParent, isShorthandProperty } = BLANK) {
        if (this.variable) {
          const name = this.variable.getName();
          if (name !== this.name) {
            code.overwrite(this.start, this.end, name, {
              contentOnly: true,
              storeName: true
            });
            if (isShorthandProperty) {
              code.prependRight(this.start, `${this.name}: `);
            }
          }
          if (name === "eval" && renderedParentType === CallExpression$1 && isCalleeOfRenderedParent) {
            code.appendRight(this.start, "0, ");
          }
        }
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        if (this.variable !== null && this.variable instanceof LocalVariable) {
          this.variable.consolidateInitializers();
          this.context.requestTreeshakingPass();
        }
      }
      disallowImportReassignment() {
        return this.context.error({
          code: "ILLEGAL_REASSIGNMENT",
          message: `Illegal reassignment to import '${this.name}'`
        }, this.start);
      }
      getVariableRespectingTDZ() {
        if (this.isPossibleTDZ()) {
          return UNKNOWN_EXPRESSION;
        }
        return this.variable;
      }
    };
    EVENT_ACCESSED = 0;
    EVENT_ASSIGNED = 1;
    EVENT_CALLED = 2;
    MethodBase = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.accessedValue = null;
        this.accessorCallOptions = {
          args: NO_ARGS,
          thisParam: null,
          withNew: false
        };
      }
      deoptimizeCache() {
      }
      deoptimizePath(path) {
        this.getAccessedValue().deoptimizePath(path);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        if (event === EVENT_ACCESSED && this.kind === "get" && path.length === 0) {
          return this.value.deoptimizeThisOnEventAtPath(EVENT_CALLED, EMPTY_PATH, thisParameter, recursionTracker);
        }
        if (event === EVENT_ASSIGNED && this.kind === "set" && path.length === 0) {
          return this.value.deoptimizeThisOnEventAtPath(EVENT_CALLED, EMPTY_PATH, thisParameter, recursionTracker);
        }
        this.getAccessedValue().deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        return this.getAccessedValue().getLiteralValueAtPath(path, recursionTracker, origin);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        return this.getAccessedValue().getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
      }
      hasEffects(context) {
        return this.key.hasEffects(context);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        if (this.kind === "get" && path.length === 0) {
          return this.value.hasEffectsWhenCalledAtPath(EMPTY_PATH, this.accessorCallOptions, context);
        }
        return this.getAccessedValue().hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        if (this.kind === "set") {
          return this.value.hasEffectsWhenCalledAtPath(EMPTY_PATH, this.accessorCallOptions, context);
        }
        return this.getAccessedValue().hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        return this.getAccessedValue().hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
      getAccessedValue() {
        if (this.accessedValue === null) {
          if (this.kind === "get") {
            this.accessedValue = UNKNOWN_EXPRESSION;
            return this.accessedValue = this.value.getReturnExpressionWhenCalledAtPath(EMPTY_PATH, this.accessorCallOptions, SHARED_RECURSION_TRACKER, this);
          } else {
            return this.accessedValue = this.value;
          }
        }
        return this.accessedValue;
      }
    };
    MethodDefinition = class extends MethodBase {
    };
    INTEGER_REG_EXP = /^\d+$/;
    ObjectEntity = class extends ExpressionEntity {
      constructor(properties, prototypeExpression, immutable = false) {
        super();
        this.prototypeExpression = prototypeExpression;
        this.immutable = immutable;
        this.allProperties = [];
        this.deoptimizedPaths = Object.create(null);
        this.expressionsToBeDeoptimizedByKey = Object.create(null);
        this.gettersByKey = Object.create(null);
        this.hasUnknownDeoptimizedInteger = false;
        this.hasUnknownDeoptimizedProperty = false;
        this.propertiesAndGettersByKey = Object.create(null);
        this.propertiesAndSettersByKey = Object.create(null);
        this.settersByKey = Object.create(null);
        this.thisParametersToBeDeoptimized = new Set();
        this.unknownIntegerProps = [];
        this.unmatchableGetters = [];
        this.unmatchablePropertiesAndGetters = [];
        this.unmatchableSetters = [];
        if (Array.isArray(properties)) {
          this.buildPropertyMaps(properties);
        } else {
          this.propertiesAndGettersByKey = this.propertiesAndSettersByKey = properties;
          for (const propertiesForKey of Object.values(properties)) {
            this.allProperties.push(...propertiesForKey);
          }
        }
      }
      deoptimizeAllProperties() {
        var _a;
        if (this.hasUnknownDeoptimizedProperty) {
          return;
        }
        this.hasUnknownDeoptimizedProperty = true;
        for (const properties of Object.values(this.propertiesAndGettersByKey).concat(Object.values(this.settersByKey))) {
          for (const property2 of properties) {
            property2.deoptimizePath(UNKNOWN_PATH);
          }
        }
        (_a = this.prototypeExpression) === null || _a === void 0 ? void 0 : _a.deoptimizePath([UnknownKey, UnknownKey]);
        this.deoptimizeCachedEntities();
      }
      deoptimizeIntegerProperties() {
        if (this.hasUnknownDeoptimizedProperty || this.hasUnknownDeoptimizedInteger) {
          return;
        }
        this.hasUnknownDeoptimizedInteger = true;
        for (const [key, propertiesAndGetters] of Object.entries(this.propertiesAndGettersByKey)) {
          if (INTEGER_REG_EXP.test(key)) {
            for (const property2 of propertiesAndGetters) {
              property2.deoptimizePath(UNKNOWN_PATH);
            }
          }
        }
        this.deoptimizeCachedIntegerEntities();
      }
      deoptimizePath(path) {
        var _a;
        if (this.hasUnknownDeoptimizedProperty || this.immutable)
          return;
        const key = path[0];
        if (path.length === 1) {
          if (typeof key !== "string") {
            if (key === UnknownInteger) {
              return this.deoptimizeIntegerProperties();
            }
            return this.deoptimizeAllProperties();
          }
          if (!this.deoptimizedPaths[key]) {
            this.deoptimizedPaths[key] = true;
            const expressionsToBeDeoptimized = this.expressionsToBeDeoptimizedByKey[key];
            if (expressionsToBeDeoptimized) {
              for (const expression of expressionsToBeDeoptimized) {
                expression.deoptimizeCache();
              }
            }
          }
        }
        const subPath = path.length === 1 ? UNKNOWN_PATH : path.slice(1);
        for (const property2 of typeof key === "string" ? (this.propertiesAndGettersByKey[key] || this.unmatchablePropertiesAndGetters).concat(this.settersByKey[key] || this.unmatchableSetters) : this.allProperties) {
          property2.deoptimizePath(subPath);
        }
        (_a = this.prototypeExpression) === null || _a === void 0 ? void 0 : _a.deoptimizePath(path.length === 1 ? [UnknownKey, UnknownKey] : path);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        var _a;
        const [key, ...subPath] = path;
        if (this.hasUnknownDeoptimizedProperty || (event === EVENT_CALLED || path.length > 1) && typeof key === "string" && this.deoptimizedPaths[key]) {
          thisParameter.deoptimizePath(UNKNOWN_PATH);
          return;
        }
        const [propertiesForExactMatchByKey, relevantPropertiesByKey, relevantUnmatchableProperties] = event === EVENT_CALLED || path.length > 1 ? [
          this.propertiesAndGettersByKey,
          this.propertiesAndGettersByKey,
          this.unmatchablePropertiesAndGetters
        ] : event === EVENT_ACCESSED ? [this.propertiesAndGettersByKey, this.gettersByKey, this.unmatchableGetters] : [this.propertiesAndSettersByKey, this.settersByKey, this.unmatchableSetters];
        if (typeof key === "string") {
          if (propertiesForExactMatchByKey[key]) {
            const properties = relevantPropertiesByKey[key];
            if (properties) {
              for (const property2 of properties) {
                property2.deoptimizeThisOnEventAtPath(event, subPath, thisParameter, recursionTracker);
              }
            }
            if (!this.immutable) {
              this.thisParametersToBeDeoptimized.add(thisParameter);
            }
            return;
          }
          for (const property2 of relevantUnmatchableProperties) {
            property2.deoptimizeThisOnEventAtPath(event, subPath, thisParameter, recursionTracker);
          }
          if (INTEGER_REG_EXP.test(key)) {
            for (const property2 of this.unknownIntegerProps) {
              property2.deoptimizeThisOnEventAtPath(event, subPath, thisParameter, recursionTracker);
            }
          }
        } else {
          for (const properties of Object.values(relevantPropertiesByKey).concat([
            relevantUnmatchableProperties
          ])) {
            for (const property2 of properties) {
              property2.deoptimizeThisOnEventAtPath(event, subPath, thisParameter, recursionTracker);
            }
          }
          for (const property2 of this.unknownIntegerProps) {
            property2.deoptimizeThisOnEventAtPath(event, subPath, thisParameter, recursionTracker);
          }
        }
        if (!this.immutable) {
          this.thisParametersToBeDeoptimized.add(thisParameter);
        }
        (_a = this.prototypeExpression) === null || _a === void 0 ? void 0 : _a.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        if (path.length === 0) {
          return UnknownValue;
        }
        const key = path[0];
        const expressionAtPath = this.getMemberExpressionAndTrackDeopt(key, origin);
        if (expressionAtPath) {
          return expressionAtPath.getLiteralValueAtPath(path.slice(1), recursionTracker, origin);
        }
        if (this.prototypeExpression) {
          return this.prototypeExpression.getLiteralValueAtPath(path, recursionTracker, origin);
        }
        if (path.length === 1) {
          return void 0;
        }
        return UnknownValue;
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        if (path.length === 0) {
          return UNKNOWN_EXPRESSION;
        }
        const key = path[0];
        const expressionAtPath = this.getMemberExpressionAndTrackDeopt(key, origin);
        if (expressionAtPath) {
          return expressionAtPath.getReturnExpressionWhenCalledAtPath(path.slice(1), callOptions, recursionTracker, origin);
        }
        if (this.prototypeExpression) {
          return this.prototypeExpression.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
        }
        return UNKNOWN_EXPRESSION;
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        const [key, ...subPath] = path;
        if (path.length > 1) {
          if (typeof key !== "string") {
            return true;
          }
          const expressionAtPath = this.getMemberExpression(key);
          if (expressionAtPath) {
            return expressionAtPath.hasEffectsWhenAccessedAtPath(subPath, context);
          }
          if (this.prototypeExpression) {
            return this.prototypeExpression.hasEffectsWhenAccessedAtPath(path, context);
          }
          return true;
        }
        if (this.hasUnknownDeoptimizedProperty)
          return true;
        if (typeof key === "string") {
          if (this.propertiesAndGettersByKey[key]) {
            const getters = this.gettersByKey[key];
            if (getters) {
              for (const getter of getters) {
                if (getter.hasEffectsWhenAccessedAtPath(subPath, context))
                  return true;
              }
            }
            return false;
          }
          for (const getter of this.unmatchableGetters) {
            if (getter.hasEffectsWhenAccessedAtPath(subPath, context)) {
              return true;
            }
          }
        } else {
          for (const getters of Object.values(this.gettersByKey).concat([this.unmatchableGetters])) {
            for (const getter of getters) {
              if (getter.hasEffectsWhenAccessedAtPath(subPath, context))
                return true;
            }
          }
        }
        if (this.prototypeExpression) {
          return this.prototypeExpression.hasEffectsWhenAccessedAtPath(path, context);
        }
        return false;
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        const [key, ...subPath] = path;
        if (path.length > 1) {
          if (typeof key !== "string") {
            return true;
          }
          const expressionAtPath = this.getMemberExpression(key);
          if (expressionAtPath) {
            return expressionAtPath.hasEffectsWhenAssignedAtPath(subPath, context);
          }
          if (this.prototypeExpression) {
            return this.prototypeExpression.hasEffectsWhenAssignedAtPath(path, context);
          }
          return true;
        }
        if (this.hasUnknownDeoptimizedProperty)
          return true;
        if (typeof key === "string") {
          if (this.propertiesAndSettersByKey[key]) {
            const setters = this.settersByKey[key];
            if (setters) {
              for (const setter of setters) {
                if (setter.hasEffectsWhenAssignedAtPath(subPath, context))
                  return true;
              }
            }
            return false;
          }
          for (const property2 of this.unmatchableSetters) {
            if (property2.hasEffectsWhenAssignedAtPath(subPath, context)) {
              return true;
            }
          }
        }
        if (this.prototypeExpression) {
          return this.prototypeExpression.hasEffectsWhenAssignedAtPath(path, context);
        }
        return false;
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        const key = path[0];
        const expressionAtPath = this.getMemberExpression(key);
        if (expressionAtPath) {
          return expressionAtPath.hasEffectsWhenCalledAtPath(path.slice(1), callOptions, context);
        }
        if (this.prototypeExpression) {
          return this.prototypeExpression.hasEffectsWhenCalledAtPath(path, callOptions, context);
        }
        return true;
      }
      buildPropertyMaps(properties) {
        const { allProperties, propertiesAndGettersByKey, propertiesAndSettersByKey, settersByKey, gettersByKey, unknownIntegerProps, unmatchablePropertiesAndGetters, unmatchableGetters, unmatchableSetters } = this;
        const unmatchablePropertiesAndSetters = [];
        for (let index = properties.length - 1; index >= 0; index--) {
          const { key, kind, property: property2 } = properties[index];
          allProperties.push(property2);
          if (typeof key !== "string") {
            if (key === UnknownInteger) {
              unknownIntegerProps.push(property2);
              continue;
            }
            if (kind === "set")
              unmatchableSetters.push(property2);
            if (kind === "get")
              unmatchableGetters.push(property2);
            if (kind !== "get")
              unmatchablePropertiesAndSetters.push(property2);
            if (kind !== "set")
              unmatchablePropertiesAndGetters.push(property2);
          } else {
            if (kind === "set") {
              if (!propertiesAndSettersByKey[key]) {
                propertiesAndSettersByKey[key] = [property2, ...unmatchablePropertiesAndSetters];
                settersByKey[key] = [property2, ...unmatchableSetters];
              }
            } else if (kind === "get") {
              if (!propertiesAndGettersByKey[key]) {
                propertiesAndGettersByKey[key] = [property2, ...unmatchablePropertiesAndGetters];
                gettersByKey[key] = [property2, ...unmatchableGetters];
              }
            } else {
              if (!propertiesAndSettersByKey[key]) {
                propertiesAndSettersByKey[key] = [property2, ...unmatchablePropertiesAndSetters];
              }
              if (!propertiesAndGettersByKey[key]) {
                propertiesAndGettersByKey[key] = [property2, ...unmatchablePropertiesAndGetters];
              }
            }
          }
        }
      }
      deoptimizeCachedEntities() {
        for (const expressionsToBeDeoptimized of Object.values(this.expressionsToBeDeoptimizedByKey)) {
          for (const expression of expressionsToBeDeoptimized) {
            expression.deoptimizeCache();
          }
        }
        for (const expression of this.thisParametersToBeDeoptimized) {
          expression.deoptimizePath(UNKNOWN_PATH);
        }
      }
      deoptimizeCachedIntegerEntities() {
        for (const [key, expressionsToBeDeoptimized] of Object.entries(this.expressionsToBeDeoptimizedByKey)) {
          if (INTEGER_REG_EXP.test(key)) {
            for (const expression of expressionsToBeDeoptimized) {
              expression.deoptimizeCache();
            }
          }
        }
        for (const expression of this.thisParametersToBeDeoptimized) {
          expression.deoptimizePath(UNKNOWN_INTEGER_PATH);
        }
      }
      getMemberExpression(key) {
        if (this.hasUnknownDeoptimizedProperty || typeof key !== "string" || this.hasUnknownDeoptimizedInteger && INTEGER_REG_EXP.test(key) || this.deoptimizedPaths[key]) {
          return UNKNOWN_EXPRESSION;
        }
        const properties = this.propertiesAndGettersByKey[key];
        if ((properties === null || properties === void 0 ? void 0 : properties.length) === 1) {
          return properties[0];
        }
        if (properties || this.unmatchablePropertiesAndGetters.length > 0 || this.unknownIntegerProps.length && INTEGER_REG_EXP.test(key)) {
          return UNKNOWN_EXPRESSION;
        }
        return null;
      }
      getMemberExpressionAndTrackDeopt(key, origin) {
        if (typeof key !== "string") {
          return UNKNOWN_EXPRESSION;
        }
        const expression = this.getMemberExpression(key);
        if (!(expression === UNKNOWN_EXPRESSION || this.immutable)) {
          const expressionsToBeDeoptimized = this.expressionsToBeDeoptimizedByKey[key] = this.expressionsToBeDeoptimizedByKey[key] || [];
          expressionsToBeDeoptimized.push(origin);
        }
        return expression;
      }
    };
    ObjectMember = class extends ExpressionEntity {
      constructor(object, key) {
        super();
        this.object = object;
        this.key = key;
      }
      deoptimizePath(path) {
        this.object.deoptimizePath([this.key, ...path]);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        this.object.deoptimizeThisOnEventAtPath(event, [this.key, ...path], thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        return this.object.getLiteralValueAtPath([this.key, ...path], recursionTracker, origin);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        return this.object.getReturnExpressionWhenCalledAtPath([this.key, ...path], callOptions, recursionTracker, origin);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        if (path.length === 0)
          return false;
        return this.object.hasEffectsWhenAccessedAtPath([this.key, ...path], context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return this.object.hasEffectsWhenAssignedAtPath([this.key, ...path], context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        return this.object.hasEffectsWhenCalledAtPath([this.key, ...path], callOptions, context);
      }
    };
    Method = class extends ExpressionEntity {
      constructor(description) {
        super();
        this.description = description;
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter) {
        if (event === EVENT_CALLED && path.length === 0 && this.description.mutatesSelfAsArray) {
          thisParameter.deoptimizePath(UNKNOWN_INTEGER_PATH);
        }
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions) {
        if (path.length > 0) {
          return UNKNOWN_EXPRESSION;
        }
        return this.description.returnsPrimitive || (this.description.returns === "self" ? callOptions.thisParam || UNKNOWN_EXPRESSION : this.description.returns());
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 1;
      }
      hasEffectsWhenAssignedAtPath(path) {
        return path.length > 0;
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        var _a, _b;
        if (path.length > 0 || this.description.mutatesSelfAsArray === true && ((_a = callOptions.thisParam) === null || _a === void 0 ? void 0 : _a.hasEffectsWhenAssignedAtPath(UNKNOWN_INTEGER_PATH, context))) {
          return true;
        }
        if (!this.description.callsArgs) {
          return false;
        }
        for (const argIndex of this.description.callsArgs) {
          if ((_b = callOptions.args[argIndex]) === null || _b === void 0 ? void 0 : _b.hasEffectsWhenCalledAtPath(EMPTY_PATH, {
            args: NO_ARGS,
            thisParam: null,
            withNew: false
          }, context)) {
            return true;
          }
        }
        return false;
      }
      includeCallArguments(context, args) {
        for (const arg of args) {
          arg.include(context, false);
        }
      }
    };
    METHOD_RETURNS_BOOLEAN = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: false,
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_BOOLEAN
      })
    ];
    METHOD_RETURNS_STRING = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: false,
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_STRING
      })
    ];
    METHOD_RETURNS_NUMBER = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: false,
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_NUMBER
      })
    ];
    METHOD_RETURNS_UNKNOWN = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: false,
        returns: null,
        returnsPrimitive: UNKNOWN_EXPRESSION
      })
    ];
    OBJECT_PROTOTYPE = new ObjectEntity({
      __proto__: null,
      hasOwnProperty: METHOD_RETURNS_BOOLEAN,
      isPrototypeOf: METHOD_RETURNS_BOOLEAN,
      propertyIsEnumerable: METHOD_RETURNS_BOOLEAN,
      toLocaleString: METHOD_RETURNS_STRING,
      toString: METHOD_RETURNS_STRING,
      valueOf: METHOD_RETURNS_UNKNOWN
    }, null, true);
    ClassNode = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.objectEntity = null;
      }
      createScope(parentScope) {
        this.scope = new ChildScope(parentScope);
      }
      deoptimizeCache() {
        this.getObjectEntity().deoptimizeAllProperties();
      }
      deoptimizePath(path) {
        this.getObjectEntity().deoptimizePath(path);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        this.getObjectEntity().deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        return this.getObjectEntity().getLiteralValueAtPath(path, recursionTracker, origin);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
      }
      hasEffects(context) {
        var _a, _b;
        const initEffect = ((_a = this.superClass) === null || _a === void 0 ? void 0 : _a.hasEffects(context)) || this.body.hasEffects(context);
        (_b = this.id) === null || _b === void 0 ? void 0 : _b.markDeclarationReached();
        return initEffect || super.hasEffects(context);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return this.getObjectEntity().hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return this.getObjectEntity().hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (path.length === 0) {
          return !callOptions.withNew || (this.classConstructor !== null ? this.classConstructor.hasEffectsWhenCalledAtPath(EMPTY_PATH, callOptions, context) : this.superClass !== null && this.superClass.hasEffectsWhenCalledAtPath(path, callOptions, context));
        } else {
          return this.getObjectEntity().hasEffectsWhenCalledAtPath(path, callOptions, context);
        }
      }
      include(context, includeChildrenRecursively) {
        var _a;
        this.included = true;
        (_a = this.superClass) === null || _a === void 0 ? void 0 : _a.include(context, includeChildrenRecursively);
        this.body.include(context, includeChildrenRecursively);
        if (this.id) {
          this.id.markDeclarationReached();
          this.id.include();
        }
      }
      initialise() {
        var _a;
        (_a = this.id) === null || _a === void 0 ? void 0 : _a.declare("class", this);
        for (const method of this.body.body) {
          if (method instanceof MethodDefinition && method.kind === "constructor") {
            this.classConstructor = method;
            return;
          }
        }
        this.classConstructor = null;
      }
      getObjectEntity() {
        if (this.objectEntity !== null) {
          return this.objectEntity;
        }
        const staticProperties = [];
        const dynamicMethods = [];
        for (const definition of this.body.body) {
          const properties = definition.static ? staticProperties : dynamicMethods;
          const definitionKind = definition.kind;
          if (properties === dynamicMethods && !definitionKind)
            continue;
          const kind = definitionKind === "set" || definitionKind === "get" ? definitionKind : "init";
          let key;
          if (definition.computed) {
            const keyValue = definition.key.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, this);
            if (keyValue === UnknownValue) {
              properties.push({ key: UnknownKey, kind, property: definition });
              continue;
            } else {
              key = String(keyValue);
            }
          } else {
            key = definition.key instanceof Identifier ? definition.key.name : String(definition.key.value);
          }
          properties.push({ key, kind, property: definition });
        }
        staticProperties.unshift({
          key: "prototype",
          kind: "init",
          property: new ObjectEntity(dynamicMethods, this.superClass ? new ObjectMember(this.superClass, "prototype") : OBJECT_PROTOTYPE)
        });
        return this.objectEntity = new ObjectEntity(staticProperties, this.superClass || OBJECT_PROTOTYPE);
      }
    };
    ClassDeclaration = class extends ClassNode {
      initialise() {
        super.initialise();
        if (this.id !== null) {
          this.id.variable.isId = true;
        }
      }
      parseNode(esTreeNode) {
        if (esTreeNode.id !== null) {
          this.id = new this.context.nodeConstructors.Identifier(esTreeNode.id, this, this.scope.parent);
        }
        super.parseNode(esTreeNode);
      }
      render(code, options) {
        if (options.format === "system" && this.id && options.exportNamesByVariable.has(this.id.variable)) {
          code.appendLeft(this.end, `${options.compact ? "" : " "}${getSystemExportStatement([this.id.variable], options)};`);
        }
        super.render(code, options);
      }
    };
    ArgumentsVariable = class extends LocalVariable {
      constructor(context) {
        super("arguments", null, UNKNOWN_EXPRESSION, context);
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 1;
      }
      hasEffectsWhenAssignedAtPath() {
        return true;
      }
      hasEffectsWhenCalledAtPath() {
        return true;
      }
    };
    ThisVariable = class extends LocalVariable {
      constructor(context) {
        super("this", null, null, context);
        this.deoptimizedPaths = [];
        this.entitiesToBeDeoptimized = new Set();
        this.thisDeoptimizationList = [];
        this.thisDeoptimizations = new DiscriminatedPathTracker();
      }
      addEntityToBeDeoptimized(entity) {
        for (const path of this.deoptimizedPaths) {
          entity.deoptimizePath(path);
        }
        for (const thisDeoptimization of this.thisDeoptimizationList) {
          this.applyThisDeoptimizationEvent(entity, thisDeoptimization);
        }
        this.entitiesToBeDeoptimized.add(entity);
      }
      deoptimizePath(path) {
        if (path.length === 0 || this.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(path, this)) {
          return;
        }
        this.deoptimizedPaths.push(path);
        for (const entity of this.entitiesToBeDeoptimized) {
          entity.deoptimizePath(path);
        }
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter) {
        const thisDeoptimization = {
          event,
          path,
          thisParameter
        };
        if (!this.thisDeoptimizations.trackEntityAtPathAndGetIfTracked(path, event, thisParameter)) {
          for (const entity of this.entitiesToBeDeoptimized) {
            this.applyThisDeoptimizationEvent(entity, thisDeoptimization);
          }
          this.thisDeoptimizationList.push(thisDeoptimization);
        }
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return this.getInit(context).hasEffectsWhenAccessedAtPath(path, context) || super.hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return this.getInit(context).hasEffectsWhenAssignedAtPath(path, context) || super.hasEffectsWhenAssignedAtPath(path, context);
      }
      applyThisDeoptimizationEvent(entity, { event, path, thisParameter }) {
        entity.deoptimizeThisOnEventAtPath(event, path, thisParameter === this ? entity : thisParameter, SHARED_RECURSION_TRACKER);
      }
      getInit(context) {
        return context.replacedVariableInits.get(this) || UNKNOWN_EXPRESSION;
      }
    };
    SpreadElement = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        if (path.length > 0) {
          this.argument.deoptimizeThisOnEventAtPath(event, [UnknownKey, ...path], thisParameter, recursionTracker);
        }
      }
      hasEffects(context) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        const { propertyReadSideEffects } = this.context.options.treeshake;
        return this.argument.hasEffects(context) || propertyReadSideEffects && (propertyReadSideEffects === "always" || this.argument.hasEffectsWhenAccessedAtPath(UNKNOWN_PATH, context));
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        this.argument.deoptimizePath([UnknownKey, UnknownKey]);
        this.context.requestTreeshakingPass();
      }
    };
    ParameterScope = class extends ChildScope {
      constructor(parent, context) {
        super(parent);
        this.parameters = [];
        this.hasRest = false;
        this.context = context;
        this.hoistedBodyVarScope = new ChildScope(this);
      }
      addParameterDeclaration(identifier) {
        const name = identifier.name;
        let variable = this.hoistedBodyVarScope.variables.get(name);
        if (variable) {
          variable.addDeclaration(identifier, null);
        } else {
          variable = new LocalVariable(name, identifier, UNKNOWN_EXPRESSION, this.context);
        }
        this.variables.set(name, variable);
        return variable;
      }
      addParameterVariables(parameters, hasRest) {
        this.parameters = parameters;
        for (const parameterList of parameters) {
          for (const parameter of parameterList) {
            parameter.alwaysRendered = true;
          }
        }
        this.hasRest = hasRest;
      }
      includeCallArguments(context, args) {
        let calledFromTryStatement = false;
        let argIncluded = false;
        const restParam = this.hasRest && this.parameters[this.parameters.length - 1];
        for (const checkedArg of args) {
          if (checkedArg instanceof SpreadElement) {
            for (const arg of args) {
              arg.include(context, false);
            }
            break;
          }
        }
        for (let index = args.length - 1; index >= 0; index--) {
          const paramVars = this.parameters[index] || restParam;
          const arg = args[index];
          if (paramVars) {
            calledFromTryStatement = false;
            if (paramVars.length === 0) {
              argIncluded = true;
            } else {
              for (const variable of paramVars) {
                if (variable.included) {
                  argIncluded = true;
                }
                if (variable.calledFromTryStatement) {
                  calledFromTryStatement = true;
                }
              }
            }
          }
          if (!argIncluded && arg.shouldBeIncluded(context)) {
            argIncluded = true;
          }
          if (argIncluded) {
            arg.include(context, calledFromTryStatement);
          }
        }
      }
    };
    ReturnValueScope = class extends ParameterScope {
      constructor() {
        super(...arguments);
        this.returnExpression = null;
        this.returnExpressions = [];
      }
      addReturnExpression(expression) {
        this.returnExpressions.push(expression);
      }
      getReturnExpression() {
        if (this.returnExpression === null)
          this.updateReturnExpression();
        return this.returnExpression;
      }
      updateReturnExpression() {
        if (this.returnExpressions.length === 1) {
          this.returnExpression = this.returnExpressions[0];
        } else {
          this.returnExpression = UNKNOWN_EXPRESSION;
          for (const expression of this.returnExpressions) {
            expression.deoptimizePath(UNKNOWN_PATH);
          }
        }
      }
    };
    FunctionScope = class extends ReturnValueScope {
      constructor(parent, context) {
        super(parent, context);
        this.variables.set("arguments", this.argumentsVariable = new ArgumentsVariable(context));
        this.variables.set("this", this.thisVariable = new ThisVariable(context));
      }
      findLexicalBoundary() {
        return this;
      }
      includeCallArguments(context, args) {
        super.includeCallArguments(context, args);
        if (this.argumentsVariable.included) {
          for (const arg of args) {
            if (!arg.included) {
              arg.include(context, false);
            }
          }
        }
      }
    };
    RestElement = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
        this.declarationInit = null;
      }
      addExportedVariables(variables, exportNamesByVariable) {
        this.argument.addExportedVariables(variables, exportNamesByVariable);
      }
      declare(kind, init) {
        this.declarationInit = init;
        return this.argument.declare(kind, UNKNOWN_EXPRESSION);
      }
      deoptimizePath(path) {
        path.length === 0 && this.argument.deoptimizePath(EMPTY_PATH);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return path.length > 0 || this.argument.hasEffectsWhenAssignedAtPath(EMPTY_PATH, context);
      }
      markDeclarationReached() {
        this.argument.markDeclarationReached();
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        if (this.declarationInit !== null) {
          this.declarationInit.deoptimizePath([UnknownKey, UnknownKey]);
          this.context.requestTreeshakingPass();
        }
      }
    };
    FunctionNode = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimizedReturn = false;
        this.isPrototypeDeoptimized = false;
      }
      createScope(parentScope) {
        this.scope = new FunctionScope(parentScope, this.context);
      }
      deoptimizePath(path) {
        if (path.length === 1) {
          if (path[0] === "prototype") {
            this.isPrototypeDeoptimized = true;
          } else if (path[0] === UnknownKey) {
            this.isPrototypeDeoptimized = true;
            this.scope.getReturnExpression().deoptimizePath(UNKNOWN_PATH);
          }
        }
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter) {
        if (event === EVENT_CALLED) {
          if (path.length > 0) {
            thisParameter.deoptimizePath(UNKNOWN_PATH);
          } else {
            this.scope.thisVariable.addEntityToBeDeoptimized(thisParameter);
          }
        }
      }
      getReturnExpressionWhenCalledAtPath(path) {
        if (path.length !== 0) {
          return UNKNOWN_EXPRESSION;
        }
        if (this.async) {
          if (!this.deoptimizedReturn) {
            this.deoptimizedReturn = true;
            this.scope.getReturnExpression().deoptimizePath(UNKNOWN_PATH);
            this.context.requestTreeshakingPass();
          }
          return UNKNOWN_EXPRESSION;
        }
        return this.scope.getReturnExpression();
      }
      hasEffects() {
        return this.id !== null && this.id.hasEffects();
      }
      hasEffectsWhenAccessedAtPath(path) {
        if (path.length <= 1)
          return false;
        return path.length > 2 || path[0] !== "prototype" || this.isPrototypeDeoptimized;
      }
      hasEffectsWhenAssignedAtPath(path) {
        if (path.length <= 1) {
          return false;
        }
        return path.length > 2 || path[0] !== "prototype" || this.isPrototypeDeoptimized;
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (path.length > 0)
          return true;
        if (this.async) {
          const { propertyReadSideEffects } = this.context.options.treeshake;
          const returnExpression = this.scope.getReturnExpression();
          if (returnExpression.hasEffectsWhenCalledAtPath(["then"], { args: NO_ARGS, thisParam: null, withNew: false }, context) || propertyReadSideEffects && (propertyReadSideEffects === "always" || returnExpression.hasEffectsWhenAccessedAtPath(["then"], context))) {
            return true;
          }
        }
        for (const param of this.params) {
          if (param.hasEffects(context))
            return true;
        }
        const thisInit = context.replacedVariableInits.get(this.scope.thisVariable);
        context.replacedVariableInits.set(this.scope.thisVariable, callOptions.withNew ? new ObjectEntity(Object.create(null), OBJECT_PROTOTYPE) : UNKNOWN_EXPRESSION);
        const { brokenFlow, ignore: ignore2 } = context;
        context.ignore = {
          breaks: false,
          continues: false,
          labels: new Set(),
          returnYield: true
        };
        if (this.body.hasEffects(context))
          return true;
        context.brokenFlow = brokenFlow;
        if (thisInit) {
          context.replacedVariableInits.set(this.scope.thisVariable, thisInit);
        } else {
          context.replacedVariableInits.delete(this.scope.thisVariable);
        }
        context.ignore = ignore2;
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        if (this.id)
          this.id.include();
        const hasArguments = this.scope.argumentsVariable.included;
        for (const param of this.params) {
          if (!(param instanceof Identifier) || hasArguments) {
            param.include(context, includeChildrenRecursively);
          }
        }
        const { brokenFlow } = context;
        context.brokenFlow = BROKEN_FLOW_NONE;
        this.body.include(context, includeChildrenRecursively);
        context.brokenFlow = brokenFlow;
      }
      includeCallArguments(context, args) {
        this.scope.includeCallArguments(context, args);
      }
      initialise() {
        if (this.id !== null) {
          this.id.declare("function", this);
        }
        this.scope.addParameterVariables(this.params.map((param) => param.declare("parameter", UNKNOWN_EXPRESSION)), this.params[this.params.length - 1] instanceof RestElement);
        this.body.addImplicitReturnExpressionToScope();
      }
      parseNode(esTreeNode) {
        this.body = new this.context.nodeConstructors.BlockStatement(esTreeNode.body, this, this.scope.hoistedBodyVarScope);
        super.parseNode(esTreeNode);
      }
    };
    FunctionNode.prototype.preventChildBlockScope = true;
    FunctionDeclaration = class extends FunctionNode {
      initialise() {
        super.initialise();
        if (this.id !== null) {
          this.id.variable.isId = true;
        }
      }
      parseNode(esTreeNode) {
        if (esTreeNode.id !== null) {
          this.id = new this.context.nodeConstructors.Identifier(esTreeNode.id, this, this.scope.parent);
        }
        super.parseNode(esTreeNode);
      }
    };
    ExportDefaultDeclaration = class extends NodeBase {
      include(context, includeChildrenRecursively) {
        super.include(context, includeChildrenRecursively);
        if (includeChildrenRecursively) {
          this.context.includeVariableInModule(this.variable);
        }
      }
      initialise() {
        const declaration = this.declaration;
        this.declarationName = declaration.id && declaration.id.name || this.declaration.name;
        this.variable = this.scope.addExportDefaultDeclaration(this.declarationName || this.context.getModuleName(), this, this.context);
        this.context.addExport(this);
      }
      render(code, options, nodeRenderOptions) {
        const { start, end } = nodeRenderOptions;
        const declarationStart = getDeclarationStart(code.original, this.start);
        if (this.declaration instanceof FunctionDeclaration) {
          this.renderNamedDeclaration(code, declarationStart, "function", "(", this.declaration.id === null, options);
        } else if (this.declaration instanceof ClassDeclaration) {
          this.renderNamedDeclaration(code, declarationStart, "class", "{", this.declaration.id === null, options);
        } else if (this.variable.getOriginalVariable() !== this.variable) {
          treeshakeNode(this, code, start, end);
          return;
        } else if (this.variable.included) {
          this.renderVariableDeclaration(code, declarationStart, options);
        } else {
          code.remove(this.start, declarationStart);
          this.declaration.render(code, options, {
            renderedSurroundingElement: ExpressionStatement$1
          });
          if (code.original[this.end - 1] !== ";") {
            code.appendLeft(this.end, ";");
          }
          return;
        }
        this.declaration.render(code, options);
      }
      renderNamedDeclaration(code, declarationStart, declarationKeyword, endMarker, needsId, options) {
        const name = this.variable.getName();
        code.remove(this.start, declarationStart);
        if (needsId) {
          code.appendLeft(getIdInsertPosition(code.original, declarationKeyword, endMarker, declarationStart), ` ${name}`);
        }
        if (options.format === "system" && this.declaration instanceof ClassDeclaration && options.exportNamesByVariable.has(this.variable)) {
          code.appendLeft(this.end, ` ${getSystemExportStatement([this.variable], options)};`);
        }
      }
      renderVariableDeclaration(code, declarationStart, options) {
        const hasTrailingSemicolon = code.original.charCodeAt(this.end - 1) === 59;
        const systemExportNames = options.format === "system" && options.exportNamesByVariable.get(this.variable);
        if (systemExportNames) {
          code.overwrite(this.start, declarationStart, `${options.varOrConst} ${this.variable.getName()} = exports('${systemExportNames[0]}', `);
          code.appendRight(hasTrailingSemicolon ? this.end - 1 : this.end, ")" + (hasTrailingSemicolon ? "" : ";"));
        } else {
          code.overwrite(this.start, declarationStart, `${options.varOrConst} ${this.variable.getName()} = `);
          if (!hasTrailingSemicolon) {
            code.appendLeft(this.end, ";");
          }
        }
      }
    };
    ExportDefaultDeclaration.prototype.needsBoundaries = true;
    Literal = class extends NodeBase {
      deoptimizeThisOnEventAtPath() {
      }
      getLiteralValueAtPath(path) {
        if (path.length > 0 || this.value === null && this.context.code.charCodeAt(this.start) !== 110 || typeof this.value === "bigint" || this.context.code.charCodeAt(this.start) === 47) {
          return UnknownValue;
        }
        return this.value;
      }
      getReturnExpressionWhenCalledAtPath(path) {
        if (path.length !== 1)
          return UNKNOWN_EXPRESSION;
        return getMemberReturnExpressionWhenCalled(this.members, path[0]);
      }
      hasEffectsWhenAccessedAtPath(path) {
        if (this.value === null) {
          return path.length > 0;
        }
        return path.length > 1;
      }
      hasEffectsWhenAssignedAtPath(path) {
        return path.length > 0;
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (path.length === 1) {
          return hasMemberEffectWhenCalled(this.members, path[0], callOptions, context);
        }
        return true;
      }
      initialise() {
        this.members = getLiteralMembersForValue(this.value);
      }
      parseNode(esTreeNode) {
        this.value = esTreeNode.value;
        this.regex = esTreeNode.regex;
        super.parseNode(esTreeNode);
      }
      render(code) {
        if (typeof this.value === "string") {
          code.indentExclusionRanges.push([this.start + 1, this.end - 1]);
        }
      }
    };
    Program = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.hasCachedEffect = false;
      }
      hasEffects(context) {
        if (this.hasCachedEffect)
          return true;
        for (const node of this.body) {
          if (node.hasEffects(context)) {
            return this.hasCachedEffect = true;
          }
        }
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        for (const node of this.body) {
          if (includeChildrenRecursively || node.shouldBeIncluded(context)) {
            node.include(context, includeChildrenRecursively);
          }
        }
      }
      render(code, options) {
        if (this.body.length) {
          renderStatementList(this.body, code, this.start, this.end, options);
        } else {
          super.render(code, options);
        }
      }
    };
    TemplateLiteral = class extends NodeBase {
      getLiteralValueAtPath(path) {
        if (path.length > 0 || this.quasis.length !== 1) {
          return UnknownValue;
        }
        return this.quasis[0].value.cooked;
      }
      render(code, options) {
        code.indentExclusionRanges.push([this.start, this.end]);
        super.render(code, options);
      }
    };
    VariableDeclaration = class extends NodeBase {
      deoptimizePath() {
        for (const declarator of this.declarations) {
          declarator.deoptimizePath(EMPTY_PATH);
        }
      }
      hasEffectsWhenAssignedAtPath() {
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        for (const declarator of this.declarations) {
          if (includeChildrenRecursively || declarator.shouldBeIncluded(context))
            declarator.include(context, includeChildrenRecursively);
        }
      }
      includeAsSingleStatement(context, includeChildrenRecursively) {
        this.included = true;
        for (const declarator of this.declarations) {
          if (includeChildrenRecursively || declarator.shouldBeIncluded(context)) {
            declarator.include(context, includeChildrenRecursively);
            declarator.id.include(context, includeChildrenRecursively);
          }
        }
      }
      initialise() {
        for (const declarator of this.declarations) {
          declarator.declareDeclarator(this.kind);
        }
      }
      render(code, options, nodeRenderOptions = BLANK) {
        if (areAllDeclarationsIncludedAndNotExported(this.declarations, options.exportNamesByVariable)) {
          for (const declarator of this.declarations) {
            declarator.render(code, options);
          }
          if (!nodeRenderOptions.isNoStatement && code.original.charCodeAt(this.end - 1) !== 59) {
            code.appendLeft(this.end, ";");
          }
        } else {
          this.renderReplacedDeclarations(code, options, nodeRenderOptions);
        }
      }
      renderDeclarationEnd(code, separatorString, lastSeparatorPos, actualContentEnd, renderedContentEnd, systemPatternExports, options, isNoStatement) {
        if (code.original.charCodeAt(this.end - 1) === 59) {
          code.remove(this.end - 1, this.end);
        }
        if (!isNoStatement) {
          separatorString += ";";
        }
        if (lastSeparatorPos !== null) {
          if (code.original.charCodeAt(actualContentEnd - 1) === 10 && (code.original.charCodeAt(this.end) === 10 || code.original.charCodeAt(this.end) === 13)) {
            actualContentEnd--;
            if (code.original.charCodeAt(actualContentEnd) === 13) {
              actualContentEnd--;
            }
          }
          if (actualContentEnd === lastSeparatorPos + 1) {
            code.overwrite(lastSeparatorPos, renderedContentEnd, separatorString);
          } else {
            code.overwrite(lastSeparatorPos, lastSeparatorPos + 1, separatorString);
            code.remove(actualContentEnd, renderedContentEnd);
          }
        } else {
          code.appendLeft(renderedContentEnd, separatorString);
        }
        if (systemPatternExports.length > 0) {
          code.appendLeft(renderedContentEnd, ` ${getSystemExportStatement(systemPatternExports, options)};`);
        }
      }
      renderReplacedDeclarations(code, options, { isNoStatement }) {
        const separatedNodes = getCommaSeparatedNodesWithBoundaries(this.declarations, code, this.start + this.kind.length, this.end - (code.original.charCodeAt(this.end - 1) === 59 ? 1 : 0));
        let actualContentEnd, renderedContentEnd;
        renderedContentEnd = findNonWhiteSpace(code.original, this.start + this.kind.length);
        let lastSeparatorPos = renderedContentEnd - 1;
        code.remove(this.start, lastSeparatorPos);
        let isInDeclaration = false;
        let hasRenderedContent = false;
        let separatorString = "", leadingString, nextSeparatorString;
        const aggregatedSystemExports = [];
        const singleSystemExport = gatherSystemExportsAndGetSingleExport(separatedNodes, options, aggregatedSystemExports);
        for (const { node, start, separator, contentEnd, end } of separatedNodes) {
          if (!node.included) {
            code.remove(start, end);
            continue;
          }
          node.render(code, options);
          leadingString = "";
          nextSeparatorString = "";
          if (!node.id.included || node.id instanceof Identifier && isReassignedExportsMember(node.id.variable, options.exportNamesByVariable)) {
            if (hasRenderedContent) {
              separatorString += ";";
            }
            isInDeclaration = false;
          } else {
            if (singleSystemExport && singleSystemExport === node.id.variable) {
              const operatorPos = findFirstOccurrenceOutsideComment(code.original, "=", node.id.end);
              renderSystemExportExpression(singleSystemExport, findNonWhiteSpace(code.original, operatorPos + 1), separator === null ? contentEnd : separator, code, options);
            }
            if (isInDeclaration) {
              separatorString += ",";
            } else {
              if (hasRenderedContent) {
                separatorString += ";";
              }
              leadingString += `${this.kind} `;
              isInDeclaration = true;
            }
          }
          if (renderedContentEnd === lastSeparatorPos + 1) {
            code.overwrite(lastSeparatorPos, renderedContentEnd, separatorString + leadingString);
          } else {
            code.overwrite(lastSeparatorPos, lastSeparatorPos + 1, separatorString);
            code.appendLeft(renderedContentEnd, leadingString);
          }
          actualContentEnd = contentEnd;
          renderedContentEnd = end;
          hasRenderedContent = true;
          lastSeparatorPos = separator;
          separatorString = nextSeparatorString;
        }
        this.renderDeclarationEnd(code, separatorString, lastSeparatorPos, actualContentEnd, renderedContentEnd, aggregatedSystemExports, options, isNoStatement);
      }
    };
    NEW_ARRAY_PROPERTIES = [
      { key: UnknownInteger, kind: "init", property: UNKNOWN_EXPRESSION },
      { key: "length", kind: "init", property: UNKNOWN_LITERAL_NUMBER }
    ];
    METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_BOOLEAN = [
      new Method({
        callsArgs: [0],
        mutatesSelfAsArray: "deopt-only",
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_BOOLEAN
      })
    ];
    METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NUMBER = [
      new Method({
        callsArgs: [0],
        mutatesSelfAsArray: "deopt-only",
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_NUMBER
      })
    ];
    METHOD_MUTATES_SELF_RETURNS_NEW_ARRAY = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: true,
        returns: () => new ObjectEntity(NEW_ARRAY_PROPERTIES, ARRAY_PROTOTYPE),
        returnsPrimitive: null
      })
    ];
    METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: "deopt-only",
        returns: () => new ObjectEntity(NEW_ARRAY_PROPERTIES, ARRAY_PROTOTYPE),
        returnsPrimitive: null
      })
    ];
    METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NEW_ARRAY = [
      new Method({
        callsArgs: [0],
        mutatesSelfAsArray: "deopt-only",
        returns: () => new ObjectEntity(NEW_ARRAY_PROPERTIES, ARRAY_PROTOTYPE),
        returnsPrimitive: null
      })
    ];
    METHOD_MUTATES_SELF_RETURNS_NUMBER = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: true,
        returns: null,
        returnsPrimitive: UNKNOWN_LITERAL_NUMBER
      })
    ];
    METHOD_MUTATES_SELF_RETURNS_UNKNOWN = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: true,
        returns: null,
        returnsPrimitive: UNKNOWN_EXPRESSION
      })
    ];
    METHOD_DEOPTS_SELF_RETURNS_UNKNOWN = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: "deopt-only",
        returns: null,
        returnsPrimitive: UNKNOWN_EXPRESSION
      })
    ];
    METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN = [
      new Method({
        callsArgs: [0],
        mutatesSelfAsArray: "deopt-only",
        returns: null,
        returnsPrimitive: UNKNOWN_EXPRESSION
      })
    ];
    METHOD_MUTATES_SELF_RETURNS_SELF = [
      new Method({
        callsArgs: null,
        mutatesSelfAsArray: true,
        returns: "self",
        returnsPrimitive: null
      })
    ];
    METHOD_CALLS_ARG_MUTATES_SELF_RETURNS_SELF = [
      new Method({
        callsArgs: [0],
        mutatesSelfAsArray: true,
        returns: "self",
        returnsPrimitive: null
      })
    ];
    ARRAY_PROTOTYPE = new ObjectEntity({
      __proto__: null,
      at: METHOD_DEOPTS_SELF_RETURNS_UNKNOWN,
      concat: METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY,
      copyWithin: METHOD_MUTATES_SELF_RETURNS_SELF,
      entries: METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY,
      every: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_BOOLEAN,
      fill: METHOD_MUTATES_SELF_RETURNS_SELF,
      filter: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NEW_ARRAY,
      find: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
      findIndex: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NUMBER,
      forEach: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
      includes: METHOD_RETURNS_BOOLEAN,
      indexOf: METHOD_RETURNS_NUMBER,
      join: METHOD_RETURNS_STRING,
      keys: METHOD_RETURNS_UNKNOWN,
      lastIndexOf: METHOD_RETURNS_NUMBER,
      map: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_NEW_ARRAY,
      pop: METHOD_MUTATES_SELF_RETURNS_UNKNOWN,
      push: METHOD_MUTATES_SELF_RETURNS_NUMBER,
      reduce: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
      reduceRight: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_UNKNOWN,
      reverse: METHOD_MUTATES_SELF_RETURNS_SELF,
      shift: METHOD_MUTATES_SELF_RETURNS_UNKNOWN,
      slice: METHOD_DEOPTS_SELF_RETURNS_NEW_ARRAY,
      some: METHOD_CALLS_ARG_DEOPTS_SELF_RETURNS_BOOLEAN,
      sort: METHOD_CALLS_ARG_MUTATES_SELF_RETURNS_SELF,
      splice: METHOD_MUTATES_SELF_RETURNS_NEW_ARRAY,
      unshift: METHOD_MUTATES_SELF_RETURNS_NUMBER,
      values: METHOD_DEOPTS_SELF_RETURNS_UNKNOWN
    }, OBJECT_PROTOTYPE, true);
    ArrayExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.objectEntity = null;
      }
      deoptimizePath(path) {
        this.getObjectEntity().deoptimizePath(path);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        this.getObjectEntity().deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        return this.getObjectEntity().getLiteralValueAtPath(path, recursionTracker, origin);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return this.getObjectEntity().hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return this.getObjectEntity().hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        return this.getObjectEntity().hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
      getObjectEntity() {
        if (this.objectEntity !== null) {
          return this.objectEntity;
        }
        const properties = [
          { key: "length", kind: "init", property: UNKNOWN_LITERAL_NUMBER }
        ];
        let hasSpread = false;
        for (let index = 0; index < this.elements.length; index++) {
          const element = this.elements[index];
          if (element instanceof SpreadElement || hasSpread) {
            if (element) {
              hasSpread = true;
              properties.unshift({ key: UnknownInteger, kind: "init", property: element });
            }
          } else if (!element) {
            properties.push({ key: String(index), kind: "init", property: UNDEFINED_EXPRESSION });
          } else {
            properties.push({ key: String(index), kind: "init", property: element });
          }
        }
        return this.objectEntity = new ObjectEntity(properties, ARRAY_PROTOTYPE);
      }
    };
    ArrayPattern = class extends NodeBase {
      addExportedVariables(variables, exportNamesByVariable) {
        for (const element of this.elements) {
          if (element !== null) {
            element.addExportedVariables(variables, exportNamesByVariable);
          }
        }
      }
      declare(kind) {
        const variables = [];
        for (const element of this.elements) {
          if (element !== null) {
            variables.push(...element.declare(kind, UNKNOWN_EXPRESSION));
          }
        }
        return variables;
      }
      deoptimizePath(path) {
        if (path.length === 0) {
          for (const element of this.elements) {
            if (element !== null) {
              element.deoptimizePath(path);
            }
          }
        }
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        if (path.length > 0)
          return true;
        for (const element of this.elements) {
          if (element !== null && element.hasEffectsWhenAssignedAtPath(EMPTY_PATH, context))
            return true;
        }
        return false;
      }
      markDeclarationReached() {
        for (const element of this.elements) {
          if (element !== null) {
            element.markDeclarationReached();
          }
        }
      }
    };
    BlockScope = class extends ChildScope {
      addDeclaration(identifier, context, init, isHoisted) {
        if (isHoisted) {
          const variable = this.parent.addDeclaration(identifier, context, init, isHoisted);
          variable.markInitializersForDeoptimization();
          return variable;
        } else {
          return super.addDeclaration(identifier, context, init, false);
        }
      }
    };
    ExpressionStatement = class extends NodeBase {
      initialise() {
        if (this.directive && this.directive !== "use strict" && this.parent.type === Program$1) {
          this.context.warn({
            code: "MODULE_LEVEL_DIRECTIVE",
            message: `Module level directives cause errors when bundled, '${this.directive}' was ignored.`
          }, this.start);
        }
      }
      render(code, options) {
        super.render(code, options);
        if (this.included)
          this.insertSemicolon(code);
      }
      shouldBeIncluded(context) {
        if (this.directive && this.directive !== "use strict")
          return this.parent.type !== Program$1;
        return super.shouldBeIncluded(context);
      }
    };
    BlockStatement = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.directlyIncluded = false;
      }
      addImplicitReturnExpressionToScope() {
        const lastStatement = this.body[this.body.length - 1];
        if (!lastStatement || lastStatement.type !== ReturnStatement$1) {
          this.scope.addReturnExpression(UNKNOWN_EXPRESSION);
        }
      }
      createScope(parentScope) {
        this.scope = this.parent.preventChildBlockScope ? parentScope : new BlockScope(parentScope);
      }
      hasEffects(context) {
        if (this.deoptimizeBody)
          return true;
        for (const node of this.body) {
          if (node.hasEffects(context))
            return true;
          if (context.brokenFlow)
            break;
        }
        return false;
      }
      include(context, includeChildrenRecursively) {
        if (!this.deoptimizeBody || !this.directlyIncluded) {
          this.included = true;
          this.directlyIncluded = true;
          if (this.deoptimizeBody)
            includeChildrenRecursively = true;
          for (const node of this.body) {
            if (includeChildrenRecursively || node.shouldBeIncluded(context))
              node.include(context, includeChildrenRecursively);
          }
        }
      }
      initialise() {
        const firstBodyStatement = this.body[0];
        this.deoptimizeBody = firstBodyStatement instanceof ExpressionStatement && firstBodyStatement.directive === "use asm";
      }
      render(code, options) {
        if (this.body.length) {
          renderStatementList(this.body, code, this.start + 1, this.end - 1, options);
        } else {
          super.render(code, options);
        }
      }
    };
    ArrowFunctionExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimizedReturn = false;
      }
      createScope(parentScope) {
        this.scope = new ReturnValueScope(parentScope, this.context);
      }
      deoptimizePath(path) {
        if (path.length === 1 && path[0] === UnknownKey) {
          this.scope.getReturnExpression().deoptimizePath(UNKNOWN_PATH);
        }
      }
      deoptimizeThisOnEventAtPath() {
      }
      getReturnExpressionWhenCalledAtPath(path) {
        if (path.length !== 0) {
          return UNKNOWN_EXPRESSION;
        }
        if (this.async) {
          if (!this.deoptimizedReturn) {
            this.deoptimizedReturn = true;
            this.scope.getReturnExpression().deoptimizePath(UNKNOWN_PATH);
            this.context.requestTreeshakingPass();
          }
          return UNKNOWN_EXPRESSION;
        }
        return this.scope.getReturnExpression();
      }
      hasEffects() {
        return false;
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 1;
      }
      hasEffectsWhenAssignedAtPath(path) {
        return path.length > 1;
      }
      hasEffectsWhenCalledAtPath(path, _callOptions, context) {
        if (path.length > 0)
          return true;
        if (this.async) {
          const { propertyReadSideEffects } = this.context.options.treeshake;
          const returnExpression = this.scope.getReturnExpression();
          if (returnExpression.hasEffectsWhenCalledAtPath(["then"], { args: NO_ARGS, thisParam: null, withNew: false }, context) || propertyReadSideEffects && (propertyReadSideEffects === "always" || returnExpression.hasEffectsWhenAccessedAtPath(["then"], context))) {
            return true;
          }
        }
        for (const param of this.params) {
          if (param.hasEffects(context))
            return true;
        }
        const { ignore: ignore2, brokenFlow } = context;
        context.ignore = {
          breaks: false,
          continues: false,
          labels: new Set(),
          returnYield: true
        };
        if (this.body.hasEffects(context))
          return true;
        context.ignore = ignore2;
        context.brokenFlow = brokenFlow;
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        for (const param of this.params) {
          if (!(param instanceof Identifier)) {
            param.include(context, includeChildrenRecursively);
          }
        }
        const { brokenFlow } = context;
        context.brokenFlow = BROKEN_FLOW_NONE;
        this.body.include(context, includeChildrenRecursively);
        context.brokenFlow = brokenFlow;
      }
      includeCallArguments(context, args) {
        this.scope.includeCallArguments(context, args);
      }
      initialise() {
        this.scope.addParameterVariables(this.params.map((param) => param.declare("parameter", UNKNOWN_EXPRESSION)), this.params[this.params.length - 1] instanceof RestElement);
        if (this.body instanceof BlockStatement) {
          this.body.addImplicitReturnExpressionToScope();
        } else {
          this.scope.addReturnExpression(this.body);
        }
      }
      parseNode(esTreeNode) {
        if (esTreeNode.body.type === BlockStatement$1) {
          this.body = new this.context.nodeConstructors.BlockStatement(esTreeNode.body, this, this.scope.hoistedBodyVarScope);
        }
        super.parseNode(esTreeNode);
      }
    };
    ArrowFunctionExpression.prototype.preventChildBlockScope = true;
    ObjectPattern = class extends NodeBase {
      addExportedVariables(variables, exportNamesByVariable) {
        for (const property2 of this.properties) {
          if (property2.type === Property$1) {
            property2.value.addExportedVariables(variables, exportNamesByVariable);
          } else {
            property2.argument.addExportedVariables(variables, exportNamesByVariable);
          }
        }
      }
      declare(kind, init) {
        const variables = [];
        for (const property2 of this.properties) {
          variables.push(...property2.declare(kind, init));
        }
        return variables;
      }
      deoptimizePath(path) {
        if (path.length === 0) {
          for (const property2 of this.properties) {
            property2.deoptimizePath(path);
          }
        }
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        if (path.length > 0)
          return true;
        for (const property2 of this.properties) {
          if (property2.hasEffectsWhenAssignedAtPath(EMPTY_PATH, context))
            return true;
        }
        return false;
      }
      markDeclarationReached() {
        for (const property2 of this.properties) {
          property2.markDeclarationReached();
        }
      }
    };
    AssignmentExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      hasEffects(context) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        return this.right.hasEffects(context) || this.left.hasEffects(context) || this.left.hasEffectsWhenAssignedAtPath(EMPTY_PATH, context);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return path.length > 0 && this.right.hasEffectsWhenAccessedAtPath(path, context);
      }
      include(context, includeChildrenRecursively) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        this.included = true;
        let hasEffectsContext;
        if (includeChildrenRecursively || this.operator !== "=" || this.left.included || (hasEffectsContext = createHasEffectsContext(), this.left.hasEffects(hasEffectsContext) || this.left.hasEffectsWhenAssignedAtPath(EMPTY_PATH, hasEffectsContext))) {
          this.left.include(context, includeChildrenRecursively);
        }
        this.right.include(context, includeChildrenRecursively);
      }
      render(code, options, { preventASI, renderedParentType, renderedSurroundingElement } = BLANK) {
        if (this.left.included) {
          this.left.render(code, options);
          this.right.render(code, options);
        } else {
          const inclusionStart = findNonWhiteSpace(code.original, findFirstOccurrenceOutsideComment(code.original, "=", this.left.end) + 1);
          code.remove(this.start, inclusionStart);
          if (preventASI) {
            removeLineBreaks(code, inclusionStart, this.right.start);
          }
          this.right.render(code, options, {
            renderedParentType: renderedParentType || this.parent.type,
            renderedSurroundingElement: renderedSurroundingElement || this.parent.type
          });
        }
        if (options.format === "system") {
          if (this.left instanceof Identifier) {
            const variable = this.left.variable;
            const exportNames = options.exportNamesByVariable.get(variable);
            if (exportNames) {
              if (exportNames.length === 1) {
                renderSystemExportExpression(variable, this.start, this.end, code, options);
              } else {
                renderSystemExportSequenceAfterExpression(variable, this.start, this.end, this.parent.type !== ExpressionStatement$1, code, options);
              }
              return;
            }
          } else {
            const systemPatternExports = [];
            this.left.addExportedVariables(systemPatternExports, options.exportNamesByVariable);
            if (systemPatternExports.length > 0) {
              renderSystemExportFunction(systemPatternExports, this.start, this.end, renderedSurroundingElement === ExpressionStatement$1, code, options);
              return;
            }
          }
        }
        if (this.left.included && this.left instanceof ObjectPattern && (renderedSurroundingElement === ExpressionStatement$1 || renderedSurroundingElement === ArrowFunctionExpression$1)) {
          code.appendRight(this.start, "(");
          code.prependLeft(this.end, ")");
        }
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        this.left.deoptimizePath(EMPTY_PATH);
        this.right.deoptimizePath(UNKNOWN_PATH);
        this.context.requestTreeshakingPass();
      }
    };
    AssignmentPattern = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      addExportedVariables(variables, exportNamesByVariable) {
        this.left.addExportedVariables(variables, exportNamesByVariable);
      }
      declare(kind, init) {
        return this.left.declare(kind, init);
      }
      deoptimizePath(path) {
        path.length === 0 && this.left.deoptimizePath(path);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return path.length > 0 || this.left.hasEffectsWhenAssignedAtPath(EMPTY_PATH, context);
      }
      markDeclarationReached() {
        this.left.markDeclarationReached();
      }
      render(code, options, { isShorthandProperty } = BLANK) {
        this.left.render(code, options, { isShorthandProperty });
        this.right.render(code, options);
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        this.left.deoptimizePath(EMPTY_PATH);
        this.right.deoptimizePath(UNKNOWN_PATH);
        this.context.requestTreeshakingPass();
      }
    };
    AwaitExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      hasEffects() {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        return true;
      }
      include(context, includeChildrenRecursively) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        if (!this.included) {
          this.included = true;
          checkTopLevelAwait:
            if (!this.context.usesTopLevelAwait) {
              let parent = this.parent;
              do {
                if (parent instanceof FunctionNode || parent instanceof ArrowFunctionExpression)
                  break checkTopLevelAwait;
              } while (parent = parent.parent);
              this.context.usesTopLevelAwait = true;
            }
        }
        this.argument.include(context, includeChildrenRecursively);
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        this.argument.deoptimizePath(UNKNOWN_PATH);
        this.context.requestTreeshakingPass();
      }
    };
    binaryOperators = {
      "!=": (left, right) => left != right,
      "!==": (left, right) => left !== right,
      "%": (left, right) => left % right,
      "&": (left, right) => left & right,
      "*": (left, right) => left * right,
      "**": (left, right) => left ** right,
      "+": (left, right) => left + right,
      "-": (left, right) => left - right,
      "/": (left, right) => left / right,
      "<": (left, right) => left < right,
      "<<": (left, right) => left << right,
      "<=": (left, right) => left <= right,
      "==": (left, right) => left == right,
      "===": (left, right) => left === right,
      ">": (left, right) => left > right,
      ">=": (left, right) => left >= right,
      ">>": (left, right) => left >> right,
      ">>>": (left, right) => left >>> right,
      "^": (left, right) => left ^ right,
      in: () => UnknownValue,
      instanceof: () => UnknownValue,
      "|": (left, right) => left | right
    };
    BinaryExpression = class extends NodeBase {
      deoptimizeCache() {
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        if (path.length > 0)
          return UnknownValue;
        const leftValue = this.left.getLiteralValueAtPath(EMPTY_PATH, recursionTracker, origin);
        if (leftValue === UnknownValue)
          return UnknownValue;
        const rightValue = this.right.getLiteralValueAtPath(EMPTY_PATH, recursionTracker, origin);
        if (rightValue === UnknownValue)
          return UnknownValue;
        const operatorFn = binaryOperators[this.operator];
        if (!operatorFn)
          return UnknownValue;
        return operatorFn(leftValue, rightValue);
      }
      hasEffects(context) {
        if (this.operator === "+" && this.parent instanceof ExpressionStatement && this.left.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, this) === "")
          return true;
        return super.hasEffects(context);
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 1;
      }
      render(code, options, { renderedSurroundingElement } = BLANK) {
        this.left.render(code, options, { renderedSurroundingElement });
        this.right.render(code, options);
      }
    };
    BreakStatement = class extends NodeBase {
      hasEffects(context) {
        if (this.label) {
          if (!context.ignore.labels.has(this.label.name))
            return true;
          context.includedLabels.add(this.label.name);
          context.brokenFlow = BROKEN_FLOW_ERROR_RETURN_LABEL;
        } else {
          if (!context.ignore.breaks)
            return true;
          context.brokenFlow = BROKEN_FLOW_BREAK_CONTINUE;
        }
        return false;
      }
      include(context) {
        this.included = true;
        if (this.label) {
          this.label.include();
          context.includedLabels.add(this.label.name);
        }
        context.brokenFlow = this.label ? BROKEN_FLOW_ERROR_RETURN_LABEL : BROKEN_FLOW_BREAK_CONTINUE;
      }
    };
    MAX_PATH_DEPTH = 7;
    MemberExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.variable = null;
        this.deoptimized = false;
        this.bound = false;
        this.expressionsToBeDeoptimized = [];
        this.replacement = null;
      }
      bind() {
        this.bound = true;
        const path = getPathIfNotComputed(this);
        const baseVariable = path && this.scope.findVariable(path[0].key);
        if (baseVariable && baseVariable.isNamespace) {
          const resolvedVariable = this.resolveNamespaceVariables(baseVariable, path.slice(1));
          if (!resolvedVariable) {
            super.bind();
          } else if (typeof resolvedVariable === "string") {
            this.replacement = resolvedVariable;
          } else {
            this.variable = resolvedVariable;
            this.scope.addNamespaceMemberAccess(getStringFromPath(path), resolvedVariable);
          }
        } else {
          super.bind();
        }
      }
      deoptimizeCache() {
        const expressionsToBeDeoptimized = this.expressionsToBeDeoptimized;
        this.expressionsToBeDeoptimized = [];
        this.propertyKey = UnknownKey;
        this.object.deoptimizePath(UNKNOWN_PATH);
        for (const expression of expressionsToBeDeoptimized) {
          expression.deoptimizeCache();
        }
      }
      deoptimizePath(path) {
        if (path.length === 0)
          this.disallowNamespaceReassignment();
        if (this.variable) {
          this.variable.deoptimizePath(path);
        } else if (!this.replacement) {
          if (path.length < MAX_PATH_DEPTH) {
            this.object.deoptimizePath([this.getPropertyKey(), ...path]);
          }
        }
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        if (this.variable) {
          this.variable.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
        } else if (!this.replacement) {
          if (path.length < MAX_PATH_DEPTH) {
            this.object.deoptimizeThisOnEventAtPath(event, [this.getPropertyKey(), ...path], thisParameter, recursionTracker);
          } else {
            thisParameter.deoptimizePath(UNKNOWN_PATH);
          }
        }
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        if (this.variable !== null) {
          return this.variable.getLiteralValueAtPath(path, recursionTracker, origin);
        }
        if (this.replacement) {
          return UnknownValue;
        }
        this.expressionsToBeDeoptimized.push(origin);
        if (path.length < MAX_PATH_DEPTH) {
          return this.object.getLiteralValueAtPath([this.getPropertyKey(), ...path], recursionTracker, origin);
        }
        return UnknownValue;
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        if (this.variable !== null) {
          return this.variable.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
        }
        if (this.replacement) {
          return UNKNOWN_EXPRESSION;
        }
        this.expressionsToBeDeoptimized.push(origin);
        if (path.length < MAX_PATH_DEPTH) {
          return this.object.getReturnExpressionWhenCalledAtPath([this.getPropertyKey(), ...path], callOptions, recursionTracker, origin);
        }
        return UNKNOWN_EXPRESSION;
      }
      hasEffects(context) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        const { propertyReadSideEffects } = this.context.options.treeshake;
        return this.property.hasEffects(context) || this.object.hasEffects(context) || !(this.variable || this.replacement || this.parent instanceof AssignmentExpression && this.parent.operator === "=") && propertyReadSideEffects && (propertyReadSideEffects === "always" || this.object.hasEffectsWhenAccessedAtPath([this.getPropertyKey()], context));
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        if (this.variable !== null) {
          return this.variable.hasEffectsWhenAccessedAtPath(path, context);
        }
        if (this.replacement) {
          return true;
        }
        if (path.length < MAX_PATH_DEPTH) {
          return this.object.hasEffectsWhenAccessedAtPath([this.getPropertyKey(), ...path], context);
        }
        return true;
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        if (this.variable !== null) {
          return this.variable.hasEffectsWhenAssignedAtPath(path, context);
        }
        if (this.replacement) {
          return true;
        }
        if (path.length < MAX_PATH_DEPTH) {
          return this.object.hasEffectsWhenAssignedAtPath([this.getPropertyKey(), ...path], context);
        }
        return true;
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        if (this.variable !== null) {
          return this.variable.hasEffectsWhenCalledAtPath(path, callOptions, context);
        }
        if (this.replacement) {
          return true;
        }
        if (path.length < MAX_PATH_DEPTH) {
          return this.object.hasEffectsWhenCalledAtPath([this.getPropertyKey(), ...path], callOptions, context);
        }
        return true;
      }
      include(context, includeChildrenRecursively) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        if (!this.included) {
          this.included = true;
          if (this.variable !== null) {
            this.context.includeVariableInModule(this.variable);
          }
        }
        this.object.include(context, includeChildrenRecursively);
        this.property.include(context, includeChildrenRecursively);
      }
      includeCallArguments(context, args) {
        if (this.variable) {
          this.variable.includeCallArguments(context, args);
        } else {
          super.includeCallArguments(context, args);
        }
      }
      initialise() {
        this.propertyKey = getResolvablePropertyKey(this);
      }
      render(code, options, { renderedParentType, isCalleeOfRenderedParent, renderedSurroundingElement } = BLANK) {
        if (this.variable || this.replacement) {
          let replacement = this.variable ? this.variable.getName() : this.replacement;
          if (renderedParentType && isCalleeOfRenderedParent)
            replacement = "0, " + replacement;
          code.overwrite(this.start, this.end, replacement, {
            contentOnly: true,
            storeName: true
          });
        } else {
          if (renderedParentType && isCalleeOfRenderedParent) {
            code.appendRight(this.start, "0, ");
          }
          this.object.render(code, options, { renderedSurroundingElement });
          this.property.render(code, options);
        }
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        const { propertyReadSideEffects } = this.context.options.treeshake;
        if (this.bound && propertyReadSideEffects && !(this.variable || this.replacement)) {
          if (!(this.parent instanceof AssignmentExpression && this.parent.operator === "=")) {
            this.object.deoptimizeThisOnEventAtPath(EVENT_ACCESSED, [this.propertyKey], this.object, SHARED_RECURSION_TRACKER);
          }
          if (this.parent instanceof AssignmentExpression) {
            this.object.deoptimizeThisOnEventAtPath(EVENT_ASSIGNED, [this.propertyKey], this.object, SHARED_RECURSION_TRACKER);
          }
          this.context.requestTreeshakingPass();
        }
      }
      disallowNamespaceReassignment() {
        if (this.object instanceof Identifier) {
          const variable = this.scope.findVariable(this.object.name);
          if (variable.isNamespace) {
            if (this.variable) {
              this.context.includeVariableInModule(this.variable);
            }
            this.context.warn({
              code: "ILLEGAL_NAMESPACE_REASSIGNMENT",
              message: `Illegal reassignment to import '${this.object.name}'`
            }, this.start);
          }
        }
      }
      getPropertyKey() {
        if (this.propertyKey === null) {
          this.propertyKey = UnknownKey;
          const value = this.property.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, this);
          return this.propertyKey = value === UnknownValue ? UnknownKey : String(value);
        }
        return this.propertyKey;
      }
      resolveNamespaceVariables(baseVariable, path) {
        if (path.length === 0)
          return baseVariable;
        if (!baseVariable.isNamespace || baseVariable instanceof ExternalVariable)
          return null;
        const exportName = path[0].key;
        const variable = baseVariable.context.traceExport(exportName);
        if (!variable) {
          const fileName = baseVariable.context.fileName;
          this.context.warn({
            code: "MISSING_EXPORT",
            exporter: relativeId(fileName),
            importer: relativeId(this.context.fileName),
            message: `'${exportName}' is not exported by '${relativeId(fileName)}'`,
            missing: exportName,
            url: `https://rollupjs.org/guide/en/#error-name-is-not-exported-by-module`
          }, path[0].pos);
          return "undefined";
        }
        return this.resolveNamespaceVariables(variable, path.slice(1));
      }
    };
    CallExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
        this.deoptimizableDependentExpressions = [];
        this.expressionsToBeDeoptimized = new Set();
        this.returnExpression = null;
      }
      bind() {
        super.bind();
        if (this.callee instanceof Identifier) {
          const variable = this.scope.findVariable(this.callee.name);
          if (variable.isNamespace) {
            this.context.warn({
              code: "CANNOT_CALL_NAMESPACE",
              message: `Cannot call a namespace ('${this.callee.name}')`
            }, this.start);
          }
          if (this.callee.name === "eval") {
            this.context.warn({
              code: "EVAL",
              message: `Use of eval is strongly discouraged, as it poses security risks and may cause issues with minification`,
              url: "https://rollupjs.org/guide/en/#avoiding-eval"
            }, this.start);
          }
        }
        this.callOptions = {
          args: this.arguments,
          thisParam: this.callee instanceof MemberExpression && !this.callee.variable ? this.callee.object : null,
          withNew: false
        };
      }
      deoptimizeCache() {
        if (this.returnExpression !== UNKNOWN_EXPRESSION) {
          this.returnExpression = UNKNOWN_EXPRESSION;
          for (const expression of this.deoptimizableDependentExpressions) {
            expression.deoptimizeCache();
          }
          for (const expression of this.expressionsToBeDeoptimized) {
            expression.deoptimizePath(UNKNOWN_PATH);
          }
        }
      }
      deoptimizePath(path) {
        if (path.length === 0 || this.context.deoptimizationTracker.trackEntityAtPathAndGetIfTracked(path, this)) {
          return;
        }
        const returnExpression = this.getReturnExpression();
        if (returnExpression !== UNKNOWN_EXPRESSION) {
          returnExpression.deoptimizePath(path);
        }
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        const returnExpression = this.getReturnExpression(recursionTracker);
        if (returnExpression === UNKNOWN_EXPRESSION) {
          thisParameter.deoptimizePath(UNKNOWN_PATH);
        } else {
          recursionTracker.withTrackedEntityAtPath(path, returnExpression, () => {
            this.expressionsToBeDeoptimized.add(thisParameter);
            returnExpression.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
          }, void 0);
        }
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        const returnExpression = this.getReturnExpression(recursionTracker);
        if (returnExpression === UNKNOWN_EXPRESSION) {
          return UnknownValue;
        }
        return recursionTracker.withTrackedEntityAtPath(path, returnExpression, () => {
          this.deoptimizableDependentExpressions.push(origin);
          return returnExpression.getLiteralValueAtPath(path, recursionTracker, origin);
        }, UnknownValue);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        const returnExpression = this.getReturnExpression(recursionTracker);
        if (this.returnExpression === UNKNOWN_EXPRESSION) {
          return UNKNOWN_EXPRESSION;
        }
        return recursionTracker.withTrackedEntityAtPath(path, returnExpression, () => {
          this.deoptimizableDependentExpressions.push(origin);
          return returnExpression.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
        }, UNKNOWN_EXPRESSION);
      }
      hasEffects(context) {
        try {
          for (const argument of this.arguments) {
            if (argument.hasEffects(context))
              return true;
          }
          if (this.context.options.treeshake.annotations && this.annotations)
            return false;
          return this.callee.hasEffects(context) || this.callee.hasEffectsWhenCalledAtPath(EMPTY_PATH, this.callOptions, context);
        } finally {
          if (!this.deoptimized)
            this.applyDeoptimizations();
        }
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return !context.accessed.trackEntityAtPathAndGetIfTracked(path, this) && this.getReturnExpression().hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return !context.assigned.trackEntityAtPathAndGetIfTracked(path, this) && this.getReturnExpression().hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        return !(callOptions.withNew ? context.instantiated : context.called).trackEntityAtPathAndGetIfTracked(path, callOptions, this) && this.getReturnExpression().hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
      include(context, includeChildrenRecursively) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        if (includeChildrenRecursively) {
          super.include(context, includeChildrenRecursively);
          if (includeChildrenRecursively === INCLUDE_PARAMETERS && this.callee instanceof Identifier && this.callee.variable) {
            this.callee.variable.markCalledFromTryStatement();
          }
        } else {
          this.included = true;
          this.callee.include(context, false);
        }
        this.callee.includeCallArguments(context, this.arguments);
        const returnExpression = this.getReturnExpression();
        if (!returnExpression.included) {
          returnExpression.include(context, false);
        }
      }
      render(code, options, { renderedSurroundingElement } = BLANK) {
        this.callee.render(code, options, {
          isCalleeOfRenderedParent: true,
          renderedSurroundingElement
        });
        if (this.arguments.length > 0) {
          if (this.arguments[this.arguments.length - 1].included) {
            for (const arg of this.arguments) {
              arg.render(code, options);
            }
          } else {
            let lastIncludedIndex = this.arguments.length - 2;
            while (lastIncludedIndex >= 0 && !this.arguments[lastIncludedIndex].included) {
              lastIncludedIndex--;
            }
            if (lastIncludedIndex >= 0) {
              for (let index = 0; index <= lastIncludedIndex; index++) {
                this.arguments[index].render(code, options);
              }
              code.remove(findFirstOccurrenceOutsideComment(code.original, ",", this.arguments[lastIncludedIndex].end), this.end - 1);
            } else {
              code.remove(findFirstOccurrenceOutsideComment(code.original, "(", this.callee.end) + 1, this.end - 1);
            }
          }
        }
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        const { thisParam } = this.callOptions;
        if (thisParam) {
          this.callee.deoptimizeThisOnEventAtPath(EVENT_CALLED, EMPTY_PATH, thisParam, SHARED_RECURSION_TRACKER);
        }
        for (const argument of this.arguments) {
          argument.deoptimizePath(UNKNOWN_PATH);
        }
        this.context.requestTreeshakingPass();
      }
      getReturnExpression(recursionTracker = SHARED_RECURSION_TRACKER) {
        if (this.returnExpression === null) {
          this.returnExpression = UNKNOWN_EXPRESSION;
          return this.returnExpression = this.callee.getReturnExpressionWhenCalledAtPath(EMPTY_PATH, this.callOptions, recursionTracker, this);
        }
        return this.returnExpression;
      }
    };
    CatchScope = class extends ParameterScope {
      addDeclaration(identifier, context, init, isHoisted) {
        const existingParameter = this.variables.get(identifier.name);
        if (existingParameter) {
          this.parent.addDeclaration(identifier, context, UNDEFINED_EXPRESSION, isHoisted);
          existingParameter.addDeclaration(identifier, init);
          return existingParameter;
        }
        return this.parent.addDeclaration(identifier, context, init, isHoisted);
      }
    };
    CatchClause = class extends NodeBase {
      createScope(parentScope) {
        this.scope = new CatchScope(parentScope, this.context);
      }
      parseNode(esTreeNode) {
        const { param } = esTreeNode;
        if (param) {
          this.param = new (this.context.nodeConstructors[param.type] || this.context.nodeConstructors.UnknownNode)(param, this, this.scope);
          this.param.declare("parameter", UNKNOWN_EXPRESSION);
        }
        super.parseNode(esTreeNode);
      }
    };
    ChainExpression = class extends NodeBase {
    };
    ClassBodyScope = class extends ChildScope {
      constructor(parent, classNode, context) {
        super(parent);
        this.variables.set("this", this.thisVariable = new LocalVariable("this", null, classNode, context));
        this.instanceScope = new ChildScope(this);
        this.instanceScope.variables.set("this", new ThisVariable(context));
      }
      findLexicalBoundary() {
        return this;
      }
    };
    ClassBody = class extends NodeBase {
      createScope(parentScope) {
        this.scope = new ClassBodyScope(parentScope, this.parent, this.context);
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        this.context.includeVariableInModule(this.scope.thisVariable);
        for (const definition of this.body) {
          definition.include(context, includeChildrenRecursively);
        }
      }
      parseNode(esTreeNode) {
        const body = this.body = [];
        for (const definition of esTreeNode.body) {
          body.push(new this.context.nodeConstructors[definition.type](definition, this, definition.static ? this.scope : this.scope.instanceScope));
        }
        super.parseNode(esTreeNode);
      }
    };
    ClassExpression = class extends ClassNode {
      render(code, options, { renderedSurroundingElement } = BLANK) {
        super.render(code, options);
        if (renderedSurroundingElement === ExpressionStatement$1) {
          code.appendRight(this.start, "(");
          code.prependLeft(this.end, ")");
        }
      }
    };
    MultiExpression = class extends ExpressionEntity {
      constructor(expressions) {
        super();
        this.expressions = expressions;
        this.included = false;
      }
      deoptimizePath(path) {
        for (const expression of this.expressions) {
          expression.deoptimizePath(path);
        }
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        return new MultiExpression(this.expressions.map((expression) => expression.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin)));
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        for (const expression of this.expressions) {
          if (expression.hasEffectsWhenAccessedAtPath(path, context))
            return true;
        }
        return false;
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        for (const expression of this.expressions) {
          if (expression.hasEffectsWhenAssignedAtPath(path, context))
            return true;
        }
        return false;
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        for (const expression of this.expressions) {
          if (expression.hasEffectsWhenCalledAtPath(path, callOptions, context))
            return true;
        }
        return false;
      }
      include(context, includeChildrenRecursively) {
        for (const expression of this.expressions) {
          if (!expression.included) {
            expression.include(context, includeChildrenRecursively);
          }
        }
      }
    };
    ConditionalExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.expressionsToBeDeoptimized = [];
        this.isBranchResolutionAnalysed = false;
        this.usedBranch = null;
      }
      deoptimizeCache() {
        if (this.usedBranch !== null) {
          const unusedBranch = this.usedBranch === this.consequent ? this.alternate : this.consequent;
          this.usedBranch = null;
          unusedBranch.deoptimizePath(UNKNOWN_PATH);
          for (const expression of this.expressionsToBeDeoptimized) {
            expression.deoptimizeCache();
          }
        }
      }
      deoptimizePath(path) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          this.consequent.deoptimizePath(path);
          this.alternate.deoptimizePath(path);
        } else {
          usedBranch.deoptimizePath(path);
        }
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        this.consequent.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
        this.alternate.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null)
          return UnknownValue;
        this.expressionsToBeDeoptimized.push(origin);
        return usedBranch.getLiteralValueAtPath(path, recursionTracker, origin);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null)
          return new MultiExpression([
            this.consequent.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin),
            this.alternate.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin)
          ]);
        this.expressionsToBeDeoptimized.push(origin);
        return usedBranch.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
      }
      hasEffects(context) {
        if (this.test.hasEffects(context))
          return true;
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          return this.consequent.hasEffects(context) || this.alternate.hasEffects(context);
        }
        return usedBranch.hasEffects(context);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          return this.consequent.hasEffectsWhenAccessedAtPath(path, context) || this.alternate.hasEffectsWhenAccessedAtPath(path, context);
        }
        return usedBranch.hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          return this.consequent.hasEffectsWhenAssignedAtPath(path, context) || this.alternate.hasEffectsWhenAssignedAtPath(path, context);
        }
        return usedBranch.hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          return this.consequent.hasEffectsWhenCalledAtPath(path, callOptions, context) || this.alternate.hasEffectsWhenCalledAtPath(path, callOptions, context);
        }
        return usedBranch.hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        const usedBranch = this.getUsedBranch();
        if (includeChildrenRecursively || this.test.shouldBeIncluded(context) || usedBranch === null) {
          this.test.include(context, includeChildrenRecursively);
          this.consequent.include(context, includeChildrenRecursively);
          this.alternate.include(context, includeChildrenRecursively);
        } else {
          usedBranch.include(context, includeChildrenRecursively);
        }
      }
      includeCallArguments(context, args) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          this.consequent.includeCallArguments(context, args);
          this.alternate.includeCallArguments(context, args);
        } else {
          usedBranch.includeCallArguments(context, args);
        }
      }
      render(code, options, { isCalleeOfRenderedParent, preventASI, renderedParentType, renderedSurroundingElement } = BLANK) {
        const usedBranch = this.getUsedBranch();
        if (!this.test.included) {
          const colonPos = findFirstOccurrenceOutsideComment(code.original, ":", this.consequent.end);
          const inclusionStart = findNonWhiteSpace(code.original, (this.consequent.included ? findFirstOccurrenceOutsideComment(code.original, "?", this.test.end) : colonPos) + 1);
          if (preventASI) {
            removeLineBreaks(code, inclusionStart, usedBranch.start);
          }
          code.remove(this.start, inclusionStart);
          if (this.consequent.included) {
            code.remove(colonPos, this.end);
          }
          removeAnnotations(this, code);
          usedBranch.render(code, options, {
            isCalleeOfRenderedParent,
            preventASI: true,
            renderedParentType: renderedParentType || this.parent.type,
            renderedSurroundingElement: renderedSurroundingElement || this.parent.type
          });
        } else {
          this.test.render(code, options, { renderedSurroundingElement });
          this.consequent.render(code, options);
          this.alternate.render(code, options);
        }
      }
      getUsedBranch() {
        if (this.isBranchResolutionAnalysed) {
          return this.usedBranch;
        }
        this.isBranchResolutionAnalysed = true;
        const testValue = this.test.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, this);
        return testValue === UnknownValue ? null : this.usedBranch = testValue ? this.consequent : this.alternate;
      }
    };
    ContinueStatement = class extends NodeBase {
      hasEffects(context) {
        if (this.label) {
          if (!context.ignore.labels.has(this.label.name))
            return true;
          context.includedLabels.add(this.label.name);
          context.brokenFlow = BROKEN_FLOW_ERROR_RETURN_LABEL;
        } else {
          if (!context.ignore.continues)
            return true;
          context.brokenFlow = BROKEN_FLOW_BREAK_CONTINUE;
        }
        return false;
      }
      include(context) {
        this.included = true;
        if (this.label) {
          this.label.include();
          context.includedLabels.add(this.label.name);
        }
        context.brokenFlow = this.label ? BROKEN_FLOW_ERROR_RETURN_LABEL : BROKEN_FLOW_BREAK_CONTINUE;
      }
    };
    DoWhileStatement = class extends NodeBase {
      hasEffects(context) {
        if (this.test.hasEffects(context))
          return true;
        const { brokenFlow, ignore: { breaks, continues } } = context;
        context.ignore.breaks = true;
        context.ignore.continues = true;
        if (this.body.hasEffects(context))
          return true;
        context.ignore.breaks = breaks;
        context.ignore.continues = continues;
        context.brokenFlow = brokenFlow;
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        this.test.include(context, includeChildrenRecursively);
        const { brokenFlow } = context;
        this.body.includeAsSingleStatement(context, includeChildrenRecursively);
        context.brokenFlow = brokenFlow;
      }
    };
    EmptyStatement = class extends NodeBase {
      hasEffects() {
        return false;
      }
    };
    ExportNamedDeclaration = class extends NodeBase {
      bind() {
        if (this.declaration !== null)
          this.declaration.bind();
      }
      hasEffects(context) {
        return this.declaration !== null && this.declaration.hasEffects(context);
      }
      initialise() {
        this.context.addExport(this);
      }
      render(code, options, nodeRenderOptions) {
        const { start, end } = nodeRenderOptions;
        if (this.declaration === null) {
          code.remove(start, end);
        } else {
          code.remove(this.start, this.declaration.start);
          this.declaration.render(code, options, { end, start });
        }
      }
    };
    ExportNamedDeclaration.prototype.needsBoundaries = true;
    ExportSpecifier = class extends NodeBase {
    };
    ForInStatement = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      createScope(parentScope) {
        this.scope = new BlockScope(parentScope);
      }
      hasEffects(context) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        if (this.left && (this.left.hasEffects(context) || this.left.hasEffectsWhenAssignedAtPath(EMPTY_PATH, context)) || this.right && this.right.hasEffects(context))
          return true;
        const { brokenFlow, ignore: { breaks, continues } } = context;
        context.ignore.breaks = true;
        context.ignore.continues = true;
        if (this.body.hasEffects(context))
          return true;
        context.ignore.breaks = breaks;
        context.ignore.continues = continues;
        context.brokenFlow = brokenFlow;
        return false;
      }
      include(context, includeChildrenRecursively) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        this.included = true;
        this.left.include(context, includeChildrenRecursively || true);
        this.right.include(context, includeChildrenRecursively);
        const { brokenFlow } = context;
        this.body.includeAsSingleStatement(context, includeChildrenRecursively);
        context.brokenFlow = brokenFlow;
      }
      render(code, options) {
        this.left.render(code, options, NO_SEMICOLON);
        this.right.render(code, options, NO_SEMICOLON);
        if (code.original.charCodeAt(this.right.start - 1) === 110) {
          code.prependLeft(this.right.start, " ");
        }
        this.body.render(code, options);
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        this.left.deoptimizePath(EMPTY_PATH);
        this.context.requestTreeshakingPass();
      }
    };
    ForOfStatement = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      createScope(parentScope) {
        this.scope = new BlockScope(parentScope);
      }
      hasEffects() {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        return true;
      }
      include(context, includeChildrenRecursively) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        this.included = true;
        this.left.include(context, includeChildrenRecursively || true);
        this.right.include(context, includeChildrenRecursively);
        const { brokenFlow } = context;
        this.body.includeAsSingleStatement(context, includeChildrenRecursively);
        context.brokenFlow = brokenFlow;
      }
      render(code, options) {
        this.left.render(code, options, NO_SEMICOLON);
        this.right.render(code, options, NO_SEMICOLON);
        if (code.original.charCodeAt(this.right.start - 1) === 102) {
          code.prependLeft(this.right.start, " ");
        }
        this.body.render(code, options);
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        this.left.deoptimizePath(EMPTY_PATH);
        this.context.requestTreeshakingPass();
      }
    };
    ForStatement = class extends NodeBase {
      createScope(parentScope) {
        this.scope = new BlockScope(parentScope);
      }
      hasEffects(context) {
        if (this.init && this.init.hasEffects(context) || this.test && this.test.hasEffects(context) || this.update && this.update.hasEffects(context))
          return true;
        const { brokenFlow, ignore: { breaks, continues } } = context;
        context.ignore.breaks = true;
        context.ignore.continues = true;
        if (this.body.hasEffects(context))
          return true;
        context.ignore.breaks = breaks;
        context.ignore.continues = continues;
        context.brokenFlow = brokenFlow;
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        if (this.init)
          this.init.includeAsSingleStatement(context, includeChildrenRecursively);
        if (this.test)
          this.test.include(context, includeChildrenRecursively);
        const { brokenFlow } = context;
        if (this.update)
          this.update.include(context, includeChildrenRecursively);
        this.body.includeAsSingleStatement(context, includeChildrenRecursively);
        context.brokenFlow = brokenFlow;
      }
      render(code, options) {
        if (this.init)
          this.init.render(code, options, NO_SEMICOLON);
        if (this.test)
          this.test.render(code, options, NO_SEMICOLON);
        if (this.update)
          this.update.render(code, options, NO_SEMICOLON);
        this.body.render(code, options);
      }
    };
    FunctionExpression = class extends FunctionNode {
      render(code, options, { renderedSurroundingElement } = BLANK) {
        super.render(code, options);
        if (renderedSurroundingElement === ExpressionStatement$1) {
          code.appendRight(this.start, "(");
          code.prependLeft(this.end, ")");
        }
      }
    };
    TrackingScope = class extends BlockScope {
      constructor() {
        super(...arguments);
        this.hoistedDeclarations = [];
      }
      addDeclaration(identifier, context, init, isHoisted) {
        this.hoistedDeclarations.push(identifier);
        return super.addDeclaration(identifier, context, init, isHoisted);
      }
    };
    unset = Symbol("unset");
    IfStatement = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.testValue = unset;
      }
      deoptimizeCache() {
        this.testValue = UnknownValue;
      }
      hasEffects(context) {
        if (this.test.hasEffects(context)) {
          return true;
        }
        const testValue = this.getTestValue();
        if (testValue === UnknownValue) {
          const { brokenFlow } = context;
          if (this.consequent.hasEffects(context))
            return true;
          const consequentBrokenFlow = context.brokenFlow;
          context.brokenFlow = brokenFlow;
          if (this.alternate === null)
            return false;
          if (this.alternate.hasEffects(context))
            return true;
          context.brokenFlow = context.brokenFlow < consequentBrokenFlow ? context.brokenFlow : consequentBrokenFlow;
          return false;
        }
        return testValue ? this.consequent.hasEffects(context) : this.alternate !== null && this.alternate.hasEffects(context);
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        if (includeChildrenRecursively) {
          this.includeRecursively(includeChildrenRecursively, context);
        } else {
          const testValue = this.getTestValue();
          if (testValue === UnknownValue) {
            this.includeUnknownTest(context);
          } else {
            this.includeKnownTest(context, testValue);
          }
        }
      }
      parseNode(esTreeNode) {
        this.consequentScope = new TrackingScope(this.scope);
        this.consequent = new (this.context.nodeConstructors[esTreeNode.consequent.type] || this.context.nodeConstructors.UnknownNode)(esTreeNode.consequent, this, this.consequentScope);
        if (esTreeNode.alternate) {
          this.alternateScope = new TrackingScope(this.scope);
          this.alternate = new (this.context.nodeConstructors[esTreeNode.alternate.type] || this.context.nodeConstructors.UnknownNode)(esTreeNode.alternate, this, this.alternateScope);
        }
        super.parseNode(esTreeNode);
      }
      render(code, options) {
        const testValue = this.getTestValue();
        const hoistedDeclarations = [];
        const includesIfElse = this.test.included;
        const noTreeshake = !this.context.options.treeshake;
        if (includesIfElse) {
          this.test.render(code, options);
        } else {
          code.remove(this.start, this.consequent.start);
        }
        if (this.consequent.included && (noTreeshake || testValue === UnknownValue || testValue)) {
          this.consequent.render(code, options);
        } else {
          code.overwrite(this.consequent.start, this.consequent.end, includesIfElse ? ";" : "");
          hoistedDeclarations.push(...this.consequentScope.hoistedDeclarations);
        }
        if (this.alternate) {
          if (this.alternate.included && (noTreeshake || testValue === UnknownValue || !testValue)) {
            if (includesIfElse) {
              if (code.original.charCodeAt(this.alternate.start - 1) === 101) {
                code.prependLeft(this.alternate.start, " ");
              }
            } else {
              code.remove(this.consequent.end, this.alternate.start);
            }
            this.alternate.render(code, options);
          } else {
            if (includesIfElse && this.shouldKeepAlternateBranch()) {
              code.overwrite(this.alternate.start, this.end, ";");
            } else {
              code.remove(this.consequent.end, this.end);
            }
            hoistedDeclarations.push(...this.alternateScope.hoistedDeclarations);
          }
        }
        this.renderHoistedDeclarations(hoistedDeclarations, code);
      }
      getTestValue() {
        if (this.testValue === unset) {
          return this.testValue = this.test.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, this);
        }
        return this.testValue;
      }
      includeKnownTest(context, testValue) {
        if (this.test.shouldBeIncluded(context)) {
          this.test.include(context, false);
        }
        if (testValue && this.consequent.shouldBeIncluded(context)) {
          this.consequent.includeAsSingleStatement(context, false);
        }
        if (this.alternate !== null && !testValue && this.alternate.shouldBeIncluded(context)) {
          this.alternate.includeAsSingleStatement(context, false);
        }
      }
      includeRecursively(includeChildrenRecursively, context) {
        this.test.include(context, includeChildrenRecursively);
        this.consequent.include(context, includeChildrenRecursively);
        if (this.alternate !== null) {
          this.alternate.include(context, includeChildrenRecursively);
        }
      }
      includeUnknownTest(context) {
        this.test.include(context, false);
        const { brokenFlow } = context;
        let consequentBrokenFlow = BROKEN_FLOW_NONE;
        if (this.consequent.shouldBeIncluded(context)) {
          this.consequent.includeAsSingleStatement(context, false);
          consequentBrokenFlow = context.brokenFlow;
          context.brokenFlow = brokenFlow;
        }
        if (this.alternate !== null && this.alternate.shouldBeIncluded(context)) {
          this.alternate.includeAsSingleStatement(context, false);
          context.brokenFlow = context.brokenFlow < consequentBrokenFlow ? context.brokenFlow : consequentBrokenFlow;
        }
      }
      renderHoistedDeclarations(hoistedDeclarations, code) {
        const hoistedVars = [
          ...new Set(hoistedDeclarations.map((identifier) => {
            const variable = identifier.variable;
            return variable.included ? variable.getName() : "";
          }))
        ].filter(Boolean).join(", ");
        if (hoistedVars) {
          const parentType = this.parent.type;
          const needsBraces = parentType !== Program$1 && parentType !== BlockStatement$1;
          code.prependRight(this.start, `${needsBraces ? "{ " : ""}var ${hoistedVars}; `);
          if (needsBraces) {
            code.appendLeft(this.end, ` }`);
          }
        }
      }
      shouldKeepAlternateBranch() {
        let currentParent = this.parent;
        do {
          if (currentParent instanceof IfStatement && currentParent.alternate) {
            return true;
          }
          if (currentParent instanceof BlockStatement) {
            return false;
          }
          currentParent = currentParent.parent;
        } while (currentParent);
        return false;
      }
    };
    ImportDeclaration = class extends NodeBase {
      bind() {
      }
      hasEffects() {
        return false;
      }
      initialise() {
        this.context.addImport(this);
      }
      render(code, _options, nodeRenderOptions) {
        code.remove(nodeRenderOptions.start, nodeRenderOptions.end);
      }
    };
    ImportDeclaration.prototype.needsBoundaries = true;
    ImportDefaultSpecifier = class extends NodeBase {
    };
    INTEROP_DEFAULT_VARIABLE = "_interopDefault";
    INTEROP_DEFAULT_LEGACY_VARIABLE = "_interopDefaultLegacy";
    INTEROP_NAMESPACE_VARIABLE = "_interopNamespace";
    INTEROP_NAMESPACE_DEFAULT_VARIABLE = "_interopNamespaceDefault";
    INTEROP_NAMESPACE_DEFAULT_ONLY_VARIABLE = "_interopNamespaceDefaultOnly";
    defaultInteropHelpersByInteropType = {
      auto: INTEROP_DEFAULT_VARIABLE,
      default: null,
      defaultOnly: null,
      esModule: null,
      false: null,
      true: INTEROP_DEFAULT_LEGACY_VARIABLE
    };
    namespaceInteropHelpersByInteropType = {
      auto: INTEROP_NAMESPACE_VARIABLE,
      default: INTEROP_NAMESPACE_DEFAULT_VARIABLE,
      defaultOnly: INTEROP_NAMESPACE_DEFAULT_ONLY_VARIABLE,
      esModule: null,
      false: null,
      true: INTEROP_NAMESPACE_VARIABLE
    };
    HELPER_GENERATORS = {
      [INTEROP_DEFAULT_LEGACY_VARIABLE]: (_, n2, s, _t, liveBindings) => `function ${INTEROP_DEFAULT_LEGACY_VARIABLE}${_}(e)${_}{${_}return e${_}&&${_}typeof e${_}===${_}'object'${_}&&${_}'default'${_}in e${_}?${_}${liveBindings ? getDefaultLiveBinding(_) : getDefaultStatic(_)}${s}${_}}${n2}${n2}`,
      [INTEROP_DEFAULT_VARIABLE]: (_, n2, s, _t, liveBindings) => `function ${INTEROP_DEFAULT_VARIABLE}${_}(e)${_}{${_}return e${_}&&${_}e.__esModule${_}?${_}${liveBindings ? getDefaultLiveBinding(_) : getDefaultStatic(_)}${s}${_}}${n2}${n2}`,
      [INTEROP_NAMESPACE_DEFAULT_ONLY_VARIABLE]: (_, n2, _s, t, _liveBindings, freeze, namespaceToStringTag) => `function ${INTEROP_NAMESPACE_DEFAULT_ONLY_VARIABLE}(e)${_}{${n2}${t}return ${getFrozen(`{__proto__: null,${namespaceToStringTag ? `${_}[Symbol.toStringTag]:${_}'Module',` : ""}${_}'default':${_}e}`, freeze)};${n2}}${n2}${n2}`,
      [INTEROP_NAMESPACE_DEFAULT_VARIABLE]: (_, n2, _s, t, liveBindings, freeze, namespaceToStringTag) => `function ${INTEROP_NAMESPACE_DEFAULT_VARIABLE}(e)${_}{${n2}` + createNamespaceObject(_, n2, t, t, liveBindings, freeze, namespaceToStringTag) + `}${n2}${n2}`,
      [INTEROP_NAMESPACE_VARIABLE]: (_, n2, s, t, liveBindings, freeze, namespaceToStringTag, usedHelpers) => `function ${INTEROP_NAMESPACE_VARIABLE}(e)${_}{${n2}` + (usedHelpers.has(INTEROP_NAMESPACE_DEFAULT_VARIABLE) ? `${t}return e${_}&&${_}e.__esModule${_}?${_}e${_}:${_}${INTEROP_NAMESPACE_DEFAULT_VARIABLE}(e)${s}${n2}` : `${t}if${_}(e${_}&&${_}e.__esModule)${_}return e;${n2}` + createNamespaceObject(_, n2, t, t, liveBindings, freeze, namespaceToStringTag)) + `}${n2}${n2}`
    };
    HELPER_NAMES = Object.keys(HELPER_GENERATORS);
    ImportExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.inlineNamespace = null;
        this.mechanism = null;
        this.resolution = null;
      }
      hasEffects() {
        return true;
      }
      include(context, includeChildrenRecursively) {
        if (!this.included) {
          this.included = true;
          this.context.includeDynamicImport(this);
          this.scope.addAccessedDynamicImport(this);
        }
        this.source.include(context, includeChildrenRecursively);
      }
      initialise() {
        this.context.addDynamicImport(this);
      }
      render(code, options) {
        if (this.inlineNamespace) {
          const _ = options.compact ? "" : " ";
          const s = options.compact ? "" : ";";
          code.overwrite(this.start, this.end, `Promise.resolve().then(function${_}()${_}{${_}return ${this.inlineNamespace.getName()}${s}${_}})`, { contentOnly: true });
          return;
        }
        if (this.mechanism) {
          code.overwrite(this.start, findFirstOccurrenceOutsideComment(code.original, "(", this.start + 6) + 1, this.mechanism.left, { contentOnly: true });
          code.overwrite(this.end - 1, this.end, this.mechanism.right, { contentOnly: true });
        }
        this.source.render(code, options);
      }
      renderFinalResolution(code, resolution, namespaceExportName, options) {
        code.overwrite(this.source.start, this.source.end, resolution);
        if (namespaceExportName) {
          const _ = options.compact ? "" : " ";
          const s = options.compact ? "" : ";";
          code.prependLeft(this.end, `.then(function${_}(n)${_}{${_}return n.${namespaceExportName}${s}${_}})`);
        }
      }
      setExternalResolution(exportMode, resolution, options, pluginDriver, accessedGlobalsByScope) {
        this.resolution = resolution;
        const accessedGlobals = [...accessedImportGlobals[options.format] || []];
        let helper;
        ({ helper, mechanism: this.mechanism } = this.getDynamicImportMechanismAndHelper(resolution, exportMode, options, pluginDriver));
        if (helper) {
          accessedGlobals.push(helper);
        }
        if (accessedGlobals.length > 0) {
          this.scope.addAccessedGlobals(accessedGlobals, accessedGlobalsByScope);
        }
      }
      setInternalResolution(inlineNamespace) {
        this.inlineNamespace = inlineNamespace;
      }
      getDynamicImportMechanismAndHelper(resolution, exportMode, options, pluginDriver) {
        const mechanism = pluginDriver.hookFirstSync("renderDynamicImport", [
          {
            customResolution: typeof this.resolution === "string" ? this.resolution : null,
            format: options.format,
            moduleId: this.context.module.id,
            targetModuleId: this.resolution && typeof this.resolution !== "string" ? this.resolution.id : null
          }
        ]);
        if (mechanism) {
          return { helper: null, mechanism };
        }
        switch (options.format) {
          case "cjs": {
            const _ = options.compact ? "" : " ";
            const s = options.compact ? "" : ";";
            const leftStart = `Promise.resolve().then(function${_}()${_}{${_}return`;
            const helper = getInteropHelper(resolution, exportMode, options.interop);
            return {
              helper,
              mechanism: helper ? {
                left: `${leftStart} /*#__PURE__*/${helper}(require(`,
                right: `))${s}${_}})`
              } : {
                left: `${leftStart} require(`,
                right: `)${s}${_}})`
              }
            };
          }
          case "amd": {
            const _ = options.compact ? "" : " ";
            const resolve2 = options.compact ? "c" : "resolve";
            const reject = options.compact ? "e" : "reject";
            const helper = getInteropHelper(resolution, exportMode, options.interop);
            const resolveNamespace = helper ? `function${_}(m)${_}{${_}${resolve2}(/*#__PURE__*/${helper}(m));${_}}` : resolve2;
            return {
              helper,
              mechanism: {
                left: `new Promise(function${_}(${resolve2},${_}${reject})${_}{${_}require([`,
                right: `],${_}${resolveNamespace},${_}${reject})${_}})`
              }
            };
          }
          case "system":
            return {
              helper: null,
              mechanism: {
                left: "module.import(",
                right: ")"
              }
            };
          case "es":
            if (options.dynamicImportFunction) {
              return {
                helper: null,
                mechanism: {
                  left: `${options.dynamicImportFunction}(`,
                  right: ")"
                }
              };
            }
        }
        return { helper: null, mechanism: null };
      }
    };
    accessedImportGlobals = {
      amd: ["require"],
      cjs: ["require"],
      system: ["module"]
    };
    ImportNamespaceSpecifier = class extends NodeBase {
    };
    ImportSpecifier = class extends NodeBase {
    };
    LabeledStatement = class extends NodeBase {
      hasEffects(context) {
        const brokenFlow = context.brokenFlow;
        context.ignore.labels.add(this.label.name);
        if (this.body.hasEffects(context))
          return true;
        context.ignore.labels.delete(this.label.name);
        if (context.includedLabels.has(this.label.name)) {
          context.includedLabels.delete(this.label.name);
          context.brokenFlow = brokenFlow;
        }
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        const brokenFlow = context.brokenFlow;
        this.body.include(context, includeChildrenRecursively);
        if (includeChildrenRecursively || context.includedLabels.has(this.label.name)) {
          this.label.include();
          context.includedLabels.delete(this.label.name);
          context.brokenFlow = brokenFlow;
        }
      }
      render(code, options) {
        if (this.label.included) {
          this.label.render(code, options);
        } else {
          code.remove(this.start, findNonWhiteSpace(code.original, findFirstOccurrenceOutsideComment(code.original, ":", this.label.end) + 1));
        }
        this.body.render(code, options);
      }
    };
    LogicalExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.expressionsToBeDeoptimized = [];
        this.isBranchResolutionAnalysed = false;
        this.usedBranch = null;
      }
      deoptimizeCache() {
        if (this.usedBranch !== null) {
          const unusedBranch = this.usedBranch === this.left ? this.right : this.left;
          this.usedBranch = null;
          unusedBranch.deoptimizePath(UNKNOWN_PATH);
          for (const expression of this.expressionsToBeDeoptimized) {
            expression.deoptimizeCache();
          }
        }
      }
      deoptimizePath(path) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          this.left.deoptimizePath(path);
          this.right.deoptimizePath(path);
        } else {
          usedBranch.deoptimizePath(path);
        }
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        this.left.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
        this.right.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null)
          return UnknownValue;
        this.expressionsToBeDeoptimized.push(origin);
        return usedBranch.getLiteralValueAtPath(path, recursionTracker, origin);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null)
          return new MultiExpression([
            this.left.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin),
            this.right.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin)
          ]);
        this.expressionsToBeDeoptimized.push(origin);
        return usedBranch.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
      }
      hasEffects(context) {
        if (this.left.hasEffects(context)) {
          return true;
        }
        if (this.getUsedBranch() !== this.left) {
          return this.right.hasEffects(context);
        }
        return false;
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          return this.left.hasEffectsWhenAccessedAtPath(path, context) || this.right.hasEffectsWhenAccessedAtPath(path, context);
        }
        return usedBranch.hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          return this.left.hasEffectsWhenAssignedAtPath(path, context) || this.right.hasEffectsWhenAssignedAtPath(path, context);
        }
        return usedBranch.hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        const usedBranch = this.getUsedBranch();
        if (usedBranch === null) {
          return this.left.hasEffectsWhenCalledAtPath(path, callOptions, context) || this.right.hasEffectsWhenCalledAtPath(path, callOptions, context);
        }
        return usedBranch.hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        const usedBranch = this.getUsedBranch();
        if (includeChildrenRecursively || usedBranch === this.right && this.left.shouldBeIncluded(context) || usedBranch === null) {
          this.left.include(context, includeChildrenRecursively);
          this.right.include(context, includeChildrenRecursively);
        } else {
          usedBranch.include(context, includeChildrenRecursively);
        }
      }
      render(code, options, { isCalleeOfRenderedParent, preventASI, renderedParentType, renderedSurroundingElement } = BLANK) {
        if (!this.left.included || !this.right.included) {
          const operatorPos = findFirstOccurrenceOutsideComment(code.original, this.operator, this.left.end);
          if (this.right.included) {
            const removePos = findNonWhiteSpace(code.original, operatorPos + 2);
            code.remove(this.start, removePos);
            if (preventASI) {
              removeLineBreaks(code, removePos, this.right.start);
            }
          } else {
            code.remove(operatorPos, this.end);
          }
          removeAnnotations(this, code);
          this.getUsedBranch().render(code, options, {
            isCalleeOfRenderedParent,
            preventASI,
            renderedParentType: renderedParentType || this.parent.type,
            renderedSurroundingElement: renderedSurroundingElement || this.parent.type
          });
        } else {
          this.left.render(code, options, {
            preventASI,
            renderedSurroundingElement
          });
          this.right.render(code, options);
        }
      }
      getUsedBranch() {
        if (!this.isBranchResolutionAnalysed) {
          this.isBranchResolutionAnalysed = true;
          const leftValue = this.left.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, this);
          if (leftValue === UnknownValue) {
            return null;
          } else {
            this.usedBranch = this.operator === "||" && leftValue || this.operator === "&&" && !leftValue || this.operator === "??" && leftValue != null ? this.left : this.right;
          }
        }
        return this.usedBranch;
      }
    };
    (function(Errors2) {
      Errors2["ALREADY_CLOSED"] = "ALREADY_CLOSED";
      Errors2["ASSET_NOT_FINALISED"] = "ASSET_NOT_FINALISED";
      Errors2["ASSET_NOT_FOUND"] = "ASSET_NOT_FOUND";
      Errors2["ASSET_SOURCE_ALREADY_SET"] = "ASSET_SOURCE_ALREADY_SET";
      Errors2["ASSET_SOURCE_MISSING"] = "ASSET_SOURCE_MISSING";
      Errors2["BAD_LOADER"] = "BAD_LOADER";
      Errors2["CANNOT_EMIT_FROM_OPTIONS_HOOK"] = "CANNOT_EMIT_FROM_OPTIONS_HOOK";
      Errors2["CHUNK_NOT_GENERATED"] = "CHUNK_NOT_GENERATED";
      Errors2["CHUNK_INVALID"] = "CHUNK_INVALID";
      Errors2["CIRCULAR_REEXPORT"] = "CIRCULAR_REEXPORT";
      Errors2["CYCLIC_CROSS_CHUNK_REEXPORT"] = "CYCLIC_CROSS_CHUNK_REEXPORT";
      Errors2["DEPRECATED_FEATURE"] = "DEPRECATED_FEATURE";
      Errors2["EXTERNAL_SYNTHETIC_EXPORTS"] = "EXTERNAL_SYNTHETIC_EXPORTS";
      Errors2["FILE_NAME_CONFLICT"] = "FILE_NAME_CONFLICT";
      Errors2["FILE_NOT_FOUND"] = "FILE_NOT_FOUND";
      Errors2["INPUT_HOOK_IN_OUTPUT_PLUGIN"] = "INPUT_HOOK_IN_OUTPUT_PLUGIN";
      Errors2["INVALID_CHUNK"] = "INVALID_CHUNK";
      Errors2["INVALID_EXPORT_OPTION"] = "INVALID_EXPORT_OPTION";
      Errors2["INVALID_EXTERNAL_ID"] = "INVALID_EXTERNAL_ID";
      Errors2["INVALID_OPTION"] = "INVALID_OPTION";
      Errors2["INVALID_PLUGIN_HOOK"] = "INVALID_PLUGIN_HOOK";
      Errors2["INVALID_ROLLUP_PHASE"] = "INVALID_ROLLUP_PHASE";
      Errors2["MISSING_EXPORT"] = "MISSING_EXPORT";
      Errors2["MISSING_IMPLICIT_DEPENDANT"] = "MISSING_IMPLICIT_DEPENDANT";
      Errors2["MIXED_EXPORTS"] = "MIXED_EXPORTS";
      Errors2["NAMESPACE_CONFLICT"] = "NAMESPACE_CONFLICT";
      Errors2["AMBIGUOUS_EXTERNAL_NAMESPACES"] = "AMBIGUOUS_EXTERNAL_NAMESPACES";
      Errors2["NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE"] = "NO_TRANSFORM_MAP_OR_AST_WITHOUT_CODE";
      Errors2["PLUGIN_ERROR"] = "PLUGIN_ERROR";
      Errors2["PREFER_NAMED_EXPORTS"] = "PREFER_NAMED_EXPORTS";
      Errors2["SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT"] = "SYNTHETIC_NAMED_EXPORTS_NEED_NAMESPACE_EXPORT";
      Errors2["UNEXPECTED_NAMED_IMPORT"] = "UNEXPECTED_NAMED_IMPORT";
      Errors2["UNRESOLVED_ENTRY"] = "UNRESOLVED_ENTRY";
      Errors2["UNRESOLVED_IMPORT"] = "UNRESOLVED_IMPORT";
      Errors2["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    })(Errors || (Errors = {}));
    ASSET_PREFIX = "ROLLUP_ASSET_URL_";
    CHUNK_PREFIX = "ROLLUP_CHUNK_URL_";
    FILE_PREFIX = "ROLLUP_FILE_URL_";
    MetaProperty = class extends NodeBase {
      addAccessedGlobals(format, accessedGlobalsByScope) {
        const metaProperty = this.metaProperty;
        const accessedGlobals = (metaProperty && (metaProperty.startsWith(FILE_PREFIX) || metaProperty.startsWith(ASSET_PREFIX) || metaProperty.startsWith(CHUNK_PREFIX)) ? accessedFileUrlGlobals : accessedMetaUrlGlobals)[format];
        if (accessedGlobals.length > 0) {
          this.scope.addAccessedGlobals(accessedGlobals, accessedGlobalsByScope);
        }
      }
      getReferencedFileName(outputPluginDriver) {
        const metaProperty = this.metaProperty;
        if (metaProperty && metaProperty.startsWith(FILE_PREFIX)) {
          return outputPluginDriver.getFileName(metaProperty.substr(FILE_PREFIX.length));
        }
        return null;
      }
      hasEffects() {
        return false;
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 1;
      }
      include() {
        if (!this.included) {
          this.included = true;
          if (this.meta.name === "import") {
            this.context.addImportMeta(this);
            const parent = this.parent;
            this.metaProperty = parent instanceof MemberExpression && typeof parent.propertyKey === "string" ? parent.propertyKey : null;
          }
        }
      }
      renderFinalMechanism(code, chunkId, format, outputPluginDriver) {
        var _a;
        const parent = this.parent;
        const metaProperty = this.metaProperty;
        if (metaProperty && (metaProperty.startsWith(FILE_PREFIX) || metaProperty.startsWith(ASSET_PREFIX) || metaProperty.startsWith(CHUNK_PREFIX))) {
          let referenceId = null;
          let assetReferenceId = null;
          let chunkReferenceId = null;
          let fileName;
          if (metaProperty.startsWith(FILE_PREFIX)) {
            referenceId = metaProperty.substr(FILE_PREFIX.length);
            fileName = outputPluginDriver.getFileName(referenceId);
          } else if (metaProperty.startsWith(ASSET_PREFIX)) {
            warnDeprecation(`Using the "${ASSET_PREFIX}" prefix to reference files is deprecated. Use the "${FILE_PREFIX}" prefix instead.`, true, this.context.options);
            assetReferenceId = metaProperty.substr(ASSET_PREFIX.length);
            fileName = outputPluginDriver.getFileName(assetReferenceId);
          } else {
            warnDeprecation(`Using the "${CHUNK_PREFIX}" prefix to reference files is deprecated. Use the "${FILE_PREFIX}" prefix instead.`, true, this.context.options);
            chunkReferenceId = metaProperty.substr(CHUNK_PREFIX.length);
            fileName = outputPluginDriver.getFileName(chunkReferenceId);
          }
          const relativePath2 = normalize((0, import_path.relative)((0, import_path.dirname)(chunkId), fileName));
          let replacement2;
          if (assetReferenceId !== null) {
            replacement2 = outputPluginDriver.hookFirstSync("resolveAssetUrl", [
              {
                assetFileName: fileName,
                chunkId,
                format,
                moduleId: this.context.module.id,
                relativeAssetPath: relativePath2
              }
            ]);
          }
          if (!replacement2) {
            replacement2 = outputPluginDriver.hookFirstSync("resolveFileUrl", [
              {
                assetReferenceId,
                chunkId,
                chunkReferenceId,
                fileName,
                format,
                moduleId: this.context.module.id,
                referenceId: referenceId || assetReferenceId || chunkReferenceId,
                relativePath: relativePath2
              }
            ]) || relativeUrlMechanisms[format](relativePath2);
          }
          code.overwrite(parent.start, parent.end, replacement2, { contentOnly: true });
          return;
        }
        const replacement = outputPluginDriver.hookFirstSync("resolveImportMeta", [
          metaProperty,
          {
            chunkId,
            format,
            moduleId: this.context.module.id
          }
        ]) || ((_a = importMetaMechanisms[format]) === null || _a === void 0 ? void 0 : _a.call(importMetaMechanisms, metaProperty, chunkId));
        if (typeof replacement === "string") {
          if (parent instanceof MemberExpression) {
            code.overwrite(parent.start, parent.end, replacement, { contentOnly: true });
          } else {
            code.overwrite(this.start, this.end, replacement, { contentOnly: true });
          }
        }
      }
    };
    accessedMetaUrlGlobals = {
      amd: ["document", "module", "URL"],
      cjs: ["document", "require", "URL"],
      es: [],
      iife: ["document", "URL"],
      system: ["module"],
      umd: ["document", "require", "URL"]
    };
    accessedFileUrlGlobals = {
      amd: ["document", "require", "URL"],
      cjs: ["document", "require", "URL"],
      es: [],
      iife: ["document", "URL"],
      system: ["module", "URL"],
      umd: ["document", "require", "URL"]
    };
    getResolveUrl = (path, URL2 = "URL") => `new ${URL2}(${path}).href`;
    getRelativeUrlFromDocument = (relativePath2, umd2 = false) => getResolveUrl(`'${relativePath2}', ${umd2 ? `typeof document === 'undefined' ? location.href : ` : ""}document.currentScript && document.currentScript.src || document.baseURI`);
    getGenericImportMetaMechanism = (getUrl) => (prop, chunkId) => {
      const urlMechanism = getUrl(chunkId);
      return prop === null ? `({ url: ${urlMechanism} })` : prop === "url" ? urlMechanism : "undefined";
    };
    getUrlFromDocument = (chunkId, umd2 = false) => `${umd2 ? `typeof document === 'undefined' ? location.href : ` : ""}(document.currentScript && document.currentScript.src || new URL('${chunkId}', document.baseURI).href)`;
    relativeUrlMechanisms = {
      amd: (relativePath2) => {
        if (relativePath2[0] !== ".")
          relativePath2 = "./" + relativePath2;
        return getResolveUrl(`require.toUrl('${relativePath2}'), document.baseURI`);
      },
      cjs: (relativePath2) => `(typeof document === 'undefined' ? ${getResolveUrl(`'file:' + __dirname + '/${relativePath2}'`, `(require('u' + 'rl').URL)`)} : ${getRelativeUrlFromDocument(relativePath2)})`,
      es: (relativePath2) => getResolveUrl(`'${relativePath2}', import.meta.url`),
      iife: (relativePath2) => getRelativeUrlFromDocument(relativePath2),
      system: (relativePath2) => getResolveUrl(`'${relativePath2}', module.meta.url`),
      umd: (relativePath2) => `(typeof document === 'undefined' && typeof location === 'undefined' ? ${getResolveUrl(`'file:' + __dirname + '/${relativePath2}'`, `(require('u' + 'rl').URL)`)} : ${getRelativeUrlFromDocument(relativePath2, true)})`
    };
    importMetaMechanisms = {
      amd: getGenericImportMetaMechanism(() => getResolveUrl(`module.uri, document.baseURI`)),
      cjs: getGenericImportMetaMechanism((chunkId) => `(typeof document === 'undefined' ? ${getResolveUrl(`'file:' + __filename`, `(require('u' + 'rl').URL)`)} : ${getUrlFromDocument(chunkId)})`),
      iife: getGenericImportMetaMechanism((chunkId) => getUrlFromDocument(chunkId)),
      system: (prop) => prop === null ? `module.meta` : `module.meta.${prop}`,
      umd: getGenericImportMetaMechanism((chunkId) => `(typeof document === 'undefined' && typeof location === 'undefined' ? ${getResolveUrl(`'file:' + __filename`, `(require('u' + 'rl').URL)`)} : ${getUrlFromDocument(chunkId, true)})`)
    };
    NewExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      hasEffects(context) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        for (const argument of this.arguments) {
          if (argument.hasEffects(context))
            return true;
        }
        if (this.context.options.treeshake.annotations && this.annotations)
          return false;
        return this.callee.hasEffects(context) || this.callee.hasEffectsWhenCalledAtPath(EMPTY_PATH, this.callOptions, context);
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 0;
      }
      initialise() {
        this.callOptions = {
          args: this.arguments,
          thisParam: null,
          withNew: true
        };
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        for (const argument of this.arguments) {
          argument.deoptimizePath(UNKNOWN_PATH);
        }
        this.context.requestTreeshakingPass();
      }
    };
    ObjectExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.objectEntity = null;
      }
      deoptimizeCache() {
        this.getObjectEntity().deoptimizeAllProperties();
      }
      deoptimizePath(path) {
        this.getObjectEntity().deoptimizePath(path);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        this.getObjectEntity().deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        return this.getObjectEntity().getLiteralValueAtPath(path, recursionTracker, origin);
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        return this.getObjectEntity().getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return this.getObjectEntity().hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return this.getObjectEntity().hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        return this.getObjectEntity().hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
      render(code, options, { renderedSurroundingElement } = BLANK) {
        super.render(code, options);
        if (renderedSurroundingElement === ExpressionStatement$1 || renderedSurroundingElement === ArrowFunctionExpression$1) {
          code.appendRight(this.start, "(");
          code.prependLeft(this.end, ")");
        }
      }
      getObjectEntity() {
        if (this.objectEntity !== null) {
          return this.objectEntity;
        }
        let prototype = OBJECT_PROTOTYPE;
        const properties = [];
        for (const property2 of this.properties) {
          if (property2 instanceof SpreadElement) {
            properties.push({ key: UnknownKey, kind: "init", property: property2 });
            continue;
          }
          let key;
          if (property2.computed) {
            const keyValue = property2.key.getLiteralValueAtPath(EMPTY_PATH, SHARED_RECURSION_TRACKER, this);
            if (keyValue === UnknownValue) {
              properties.push({ key: UnknownKey, kind: property2.kind, property: property2 });
              continue;
            } else {
              key = String(keyValue);
            }
          } else {
            key = property2.key instanceof Identifier ? property2.key.name : String(property2.key.value);
            if (key === "__proto__" && property2.kind === "init") {
              prototype = property2.value instanceof Literal && property2.value.value === null ? null : property2.value;
              continue;
            }
          }
          properties.push({ key, kind: property2.kind, property: property2 });
        }
        return this.objectEntity = new ObjectEntity(properties, prototype);
      }
    };
    PrivateIdentifier = class extends NodeBase {
    };
    Property = class extends MethodBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
        this.declarationInit = null;
      }
      declare(kind, init) {
        this.declarationInit = init;
        return this.value.declare(kind, UNKNOWN_EXPRESSION);
      }
      hasEffects(context) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        const propertyReadSideEffects = this.context.options.treeshake.propertyReadSideEffects;
        return this.parent.type === "ObjectPattern" && propertyReadSideEffects === "always" || this.key.hasEffects(context) || this.value.hasEffects(context);
      }
      markDeclarationReached() {
        this.value.markDeclarationReached();
      }
      render(code, options) {
        if (!this.shorthand) {
          this.key.render(code, options);
        }
        this.value.render(code, options, { isShorthandProperty: this.shorthand });
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        if (this.declarationInit !== null) {
          this.declarationInit.deoptimizePath([UnknownKey, UnknownKey]);
          this.context.requestTreeshakingPass();
        }
      }
    };
    PropertyDefinition = class extends NodeBase {
      deoptimizePath(path) {
        var _a;
        (_a = this.value) === null || _a === void 0 ? void 0 : _a.deoptimizePath(path);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        var _a;
        (_a = this.value) === null || _a === void 0 ? void 0 : _a.deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        return this.value ? this.value.getLiteralValueAtPath(path, recursionTracker, origin) : UnknownValue;
      }
      getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) {
        return this.value ? this.value.getReturnExpressionWhenCalledAtPath(path, callOptions, recursionTracker, origin) : UNKNOWN_EXPRESSION;
      }
      hasEffects(context) {
        return this.key.hasEffects(context) || this.static && this.value !== null && this.value.hasEffects(context);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return !this.value || this.value.hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return !this.value || this.value.hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        return !this.value || this.value.hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
    };
    ReturnStatement = class extends NodeBase {
      hasEffects(context) {
        if (!context.ignore.returnYield || this.argument !== null && this.argument.hasEffects(context))
          return true;
        context.brokenFlow = BROKEN_FLOW_ERROR_RETURN_LABEL;
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        if (this.argument) {
          this.argument.include(context, includeChildrenRecursively);
        }
        context.brokenFlow = BROKEN_FLOW_ERROR_RETURN_LABEL;
      }
      initialise() {
        this.scope.addReturnExpression(this.argument || UNKNOWN_EXPRESSION);
      }
      render(code, options) {
        if (this.argument) {
          this.argument.render(code, options, { preventASI: true });
          if (this.argument.start === this.start + 6) {
            code.prependLeft(this.start + 6, " ");
          }
        }
      }
    };
    SequenceExpression = class extends NodeBase {
      deoptimizePath(path) {
        this.expressions[this.expressions.length - 1].deoptimizePath(path);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        this.expressions[this.expressions.length - 1].deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker);
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        return this.expressions[this.expressions.length - 1].getLiteralValueAtPath(path, recursionTracker, origin);
      }
      hasEffects(context) {
        for (const expression of this.expressions) {
          if (expression.hasEffects(context))
            return true;
        }
        return false;
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return path.length > 0 && this.expressions[this.expressions.length - 1].hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return this.expressions[this.expressions.length - 1].hasEffectsWhenAssignedAtPath(path, context);
      }
      hasEffectsWhenCalledAtPath(path, callOptions, context) {
        return this.expressions[this.expressions.length - 1].hasEffectsWhenCalledAtPath(path, callOptions, context);
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        const lastExpression = this.expressions[this.expressions.length - 1];
        for (const expression of this.expressions) {
          if (includeChildrenRecursively || expression === lastExpression && !(this.parent instanceof ExpressionStatement) || expression.shouldBeIncluded(context))
            expression.include(context, includeChildrenRecursively);
        }
      }
      render(code, options, { renderedParentType, isCalleeOfRenderedParent, preventASI } = BLANK) {
        let includedNodes = 0;
        let lastSeparatorPos = null;
        const lastNode = this.expressions[this.expressions.length - 1];
        for (const { node, separator, start, end } of getCommaSeparatedNodesWithBoundaries(this.expressions, code, this.start, this.end)) {
          if (!node.included) {
            treeshakeNode(node, code, start, end);
            continue;
          }
          includedNodes++;
          lastSeparatorPos = separator;
          if (includedNodes === 1 && preventASI) {
            removeLineBreaks(code, start, node.start);
          }
          if (includedNodes === 1) {
            const parentType = renderedParentType || this.parent.type;
            node.render(code, options, {
              isCalleeOfRenderedParent: isCalleeOfRenderedParent && node === lastNode,
              renderedParentType: parentType,
              renderedSurroundingElement: parentType
            });
          } else {
            node.render(code, options);
          }
        }
        if (lastSeparatorPos) {
          code.remove(lastSeparatorPos, this.end);
        }
      }
    };
    Super = class extends NodeBase {
      bind() {
        this.variable = this.scope.findVariable("this");
      }
      deoptimizePath(path) {
        this.variable.deoptimizePath(path);
      }
      include() {
        if (!this.included) {
          this.included = true;
          this.context.includeVariableInModule(this.variable);
        }
      }
    };
    SwitchCase = class extends NodeBase {
      hasEffects(context) {
        if (this.test && this.test.hasEffects(context))
          return true;
        for (const node of this.consequent) {
          if (context.brokenFlow)
            break;
          if (node.hasEffects(context))
            return true;
        }
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        if (this.test)
          this.test.include(context, includeChildrenRecursively);
        for (const node of this.consequent) {
          if (includeChildrenRecursively || node.shouldBeIncluded(context))
            node.include(context, includeChildrenRecursively);
        }
      }
      render(code, options, nodeRenderOptions) {
        if (this.consequent.length) {
          this.test && this.test.render(code, options);
          const testEnd = this.test ? this.test.end : findFirstOccurrenceOutsideComment(code.original, "default", this.start) + 7;
          const consequentStart = findFirstOccurrenceOutsideComment(code.original, ":", testEnd) + 1;
          renderStatementList(this.consequent, code, consequentStart, nodeRenderOptions.end, options);
        } else {
          super.render(code, options);
        }
      }
    };
    SwitchCase.prototype.needsBoundaries = true;
    SwitchStatement = class extends NodeBase {
      createScope(parentScope) {
        this.scope = new BlockScope(parentScope);
      }
      hasEffects(context) {
        if (this.discriminant.hasEffects(context))
          return true;
        const { brokenFlow, ignore: { breaks } } = context;
        let minBrokenFlow = Infinity;
        context.ignore.breaks = true;
        for (const switchCase of this.cases) {
          if (switchCase.hasEffects(context))
            return true;
          minBrokenFlow = context.brokenFlow < minBrokenFlow ? context.brokenFlow : minBrokenFlow;
          context.brokenFlow = brokenFlow;
        }
        if (this.defaultCase !== null && !(minBrokenFlow === BROKEN_FLOW_BREAK_CONTINUE)) {
          context.brokenFlow = minBrokenFlow;
        }
        context.ignore.breaks = breaks;
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        this.discriminant.include(context, includeChildrenRecursively);
        const { brokenFlow } = context;
        let minBrokenFlow = Infinity;
        let isCaseIncluded = includeChildrenRecursively || this.defaultCase !== null && this.defaultCase < this.cases.length - 1;
        for (let caseIndex = this.cases.length - 1; caseIndex >= 0; caseIndex--) {
          const switchCase = this.cases[caseIndex];
          if (switchCase.included) {
            isCaseIncluded = true;
          }
          if (!isCaseIncluded) {
            const hasEffectsContext = createHasEffectsContext();
            hasEffectsContext.ignore.breaks = true;
            isCaseIncluded = switchCase.hasEffects(hasEffectsContext);
          }
          if (isCaseIncluded) {
            switchCase.include(context, includeChildrenRecursively);
            minBrokenFlow = minBrokenFlow < context.brokenFlow ? minBrokenFlow : context.brokenFlow;
            context.brokenFlow = brokenFlow;
          } else {
            minBrokenFlow = brokenFlow;
          }
        }
        if (isCaseIncluded && this.defaultCase !== null && !(minBrokenFlow === BROKEN_FLOW_BREAK_CONTINUE)) {
          context.brokenFlow = minBrokenFlow;
        }
      }
      initialise() {
        for (let caseIndex = 0; caseIndex < this.cases.length; caseIndex++) {
          if (this.cases[caseIndex].test === null) {
            this.defaultCase = caseIndex;
            return;
          }
        }
        this.defaultCase = null;
      }
      render(code, options) {
        this.discriminant.render(code, options);
        if (this.cases.length > 0) {
          renderStatementList(this.cases, code, this.cases[0].start, this.end - 1, options);
        }
      }
    };
    TaggedTemplateExpression = class extends NodeBase {
      bind() {
        super.bind();
        if (this.tag.type === Identifier$1) {
          const name = this.tag.name;
          const variable = this.scope.findVariable(name);
          if (variable.isNamespace) {
            this.context.warn({
              code: "CANNOT_CALL_NAMESPACE",
              message: `Cannot call a namespace ('${name}')`
            }, this.start);
          }
        }
      }
      hasEffects(context) {
        return super.hasEffects(context) || this.tag.hasEffectsWhenCalledAtPath(EMPTY_PATH, this.callOptions, context);
      }
      initialise() {
        this.callOptions = {
          args: NO_ARGS,
          thisParam: null,
          withNew: false
        };
      }
      render(code, options) {
        this.tag.render(code, options, { isCalleeOfRenderedParent: true });
        this.quasi.render(code, options);
      }
    };
    TemplateElement = class extends NodeBase {
      bind() {
      }
      hasEffects() {
        return false;
      }
      include() {
        this.included = true;
      }
      parseNode(esTreeNode) {
        this.value = esTreeNode.value;
        super.parseNode(esTreeNode);
      }
      render() {
      }
    };
    UndefinedVariable = class extends Variable {
      constructor() {
        super("undefined");
      }
      getLiteralValueAtPath() {
        return void 0;
      }
    };
    ExportDefaultVariable = class extends LocalVariable {
      constructor(name, exportDefaultDeclaration, context) {
        super(name, exportDefaultDeclaration, exportDefaultDeclaration.declaration, context);
        this.hasId = false;
        this.originalId = null;
        this.originalVariable = null;
        const declaration = exportDefaultDeclaration.declaration;
        if ((declaration instanceof FunctionDeclaration || declaration instanceof ClassDeclaration) && declaration.id) {
          this.hasId = true;
          this.originalId = declaration.id;
        } else if (declaration instanceof Identifier) {
          this.originalId = declaration;
        }
      }
      addReference(identifier) {
        if (!this.hasId) {
          this.name = identifier.name;
        }
      }
      getAssignedVariableName() {
        return this.originalId && this.originalId.name || null;
      }
      getBaseVariableName() {
        const original = this.getOriginalVariable();
        if (original === this) {
          return super.getBaseVariableName();
        } else {
          return original.getBaseVariableName();
        }
      }
      getDirectOriginalVariable() {
        return this.originalId && (this.hasId || !(this.originalId.isPossibleTDZ() || this.originalId.variable.isReassigned || this.originalId.variable instanceof UndefinedVariable || "syntheticNamespace" in this.originalId.variable)) ? this.originalId.variable : null;
      }
      getName() {
        const original = this.getOriginalVariable();
        if (original === this) {
          return super.getName();
        } else {
          return original.getName();
        }
      }
      getOriginalVariable() {
        if (this.originalVariable)
          return this.originalVariable;
        let original = this;
        let currentVariable;
        const checkedVariables = new Set();
        do {
          checkedVariables.add(original);
          currentVariable = original;
          original = currentVariable.getDirectOriginalVariable();
        } while (original instanceof ExportDefaultVariable && !checkedVariables.has(original));
        return this.originalVariable = original || currentVariable;
      }
    };
    ModuleScope = class extends ChildScope {
      constructor(parent, context) {
        super(parent);
        this.context = context;
        this.variables.set("this", new LocalVariable("this", null, UNDEFINED_EXPRESSION, context));
      }
      addExportDefaultDeclaration(name, exportDefaultDeclaration, context) {
        const variable = new ExportDefaultVariable(name, exportDefaultDeclaration, context);
        this.variables.set("default", variable);
        return variable;
      }
      addNamespaceMemberAccess() {
      }
      deconflict(format, exportNamesByVariable, accessedGlobalsByScope) {
        for (const scope of this.children)
          scope.deconflict(format, exportNamesByVariable, accessedGlobalsByScope);
      }
      findLexicalBoundary() {
        return this;
      }
      findVariable(name) {
        const knownVariable = this.variables.get(name) || this.accessedOutsideVariables.get(name);
        if (knownVariable) {
          return knownVariable;
        }
        const variable = this.context.traceVariable(name) || this.parent.findVariable(name);
        if (variable instanceof GlobalVariable) {
          this.accessedOutsideVariables.set(name, variable);
        }
        return variable;
      }
    };
    ThisExpression = class extends NodeBase {
      bind() {
        this.variable = this.scope.findVariable("this");
      }
      deoptimizePath(path) {
        this.variable.deoptimizePath(path);
      }
      deoptimizeThisOnEventAtPath(event, path, thisParameter, recursionTracker) {
        this.variable.deoptimizeThisOnEventAtPath(event, path, thisParameter === this ? this.variable : thisParameter, recursionTracker);
      }
      hasEffectsWhenAccessedAtPath(path, context) {
        return path.length > 0 && this.variable.hasEffectsWhenAccessedAtPath(path, context);
      }
      hasEffectsWhenAssignedAtPath(path, context) {
        return this.variable.hasEffectsWhenAssignedAtPath(path, context);
      }
      include() {
        if (!this.included) {
          this.included = true;
          this.context.includeVariableInModule(this.variable);
        }
      }
      initialise() {
        this.alias = this.scope.findLexicalBoundary() instanceof ModuleScope ? this.context.moduleContext : null;
        if (this.alias === "undefined") {
          this.context.warn({
            code: "THIS_IS_UNDEFINED",
            message: `The 'this' keyword is equivalent to 'undefined' at the top level of an ES module, and has been rewritten`,
            url: `https://rollupjs.org/guide/en/#error-this-is-undefined`
          }, this.start);
        }
      }
      render(code) {
        if (this.alias !== null) {
          code.overwrite(this.start, this.end, this.alias, {
            contentOnly: false,
            storeName: true
          });
        }
      }
    };
    ThrowStatement = class extends NodeBase {
      hasEffects() {
        return true;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        this.argument.include(context, includeChildrenRecursively);
        context.brokenFlow = BROKEN_FLOW_ERROR_RETURN_LABEL;
      }
      render(code, options) {
        this.argument.render(code, options, { preventASI: true });
        if (this.argument.start === this.start + 5) {
          code.prependLeft(this.start + 5, " ");
        }
      }
    };
    TryStatement = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.directlyIncluded = false;
        this.includedLabelsAfterBlock = null;
      }
      hasEffects(context) {
        return (this.context.options.treeshake.tryCatchDeoptimization ? this.block.body.length > 0 : this.block.hasEffects(context)) || this.finalizer !== null && this.finalizer.hasEffects(context);
      }
      include(context, includeChildrenRecursively) {
        var _a;
        const tryCatchDeoptimization = (_a = this.context.options.treeshake) === null || _a === void 0 ? void 0 : _a.tryCatchDeoptimization;
        const { brokenFlow } = context;
        if (!this.directlyIncluded || !tryCatchDeoptimization) {
          this.included = true;
          this.directlyIncluded = true;
          this.block.include(context, tryCatchDeoptimization ? INCLUDE_PARAMETERS : includeChildrenRecursively);
          if (context.includedLabels.size > 0) {
            this.includedLabelsAfterBlock = [...context.includedLabels];
          }
          context.brokenFlow = brokenFlow;
        } else if (this.includedLabelsAfterBlock) {
          for (const label of this.includedLabelsAfterBlock) {
            context.includedLabels.add(label);
          }
        }
        if (this.handler !== null) {
          this.handler.include(context, includeChildrenRecursively);
          context.brokenFlow = brokenFlow;
        }
        if (this.finalizer !== null) {
          this.finalizer.include(context, includeChildrenRecursively);
        }
      }
    };
    unaryOperators = {
      "!": (value) => !value,
      "+": (value) => +value,
      "-": (value) => -value,
      delete: () => UnknownValue,
      typeof: (value) => typeof value,
      void: () => void 0,
      "~": (value) => ~value
    };
    UnaryExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      getLiteralValueAtPath(path, recursionTracker, origin) {
        if (path.length > 0)
          return UnknownValue;
        const argumentValue = this.argument.getLiteralValueAtPath(EMPTY_PATH, recursionTracker, origin);
        if (argumentValue === UnknownValue)
          return UnknownValue;
        return unaryOperators[this.operator](argumentValue);
      }
      hasEffects(context) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        if (this.operator === "typeof" && this.argument instanceof Identifier)
          return false;
        return this.argument.hasEffects(context) || this.operator === "delete" && this.argument.hasEffectsWhenAssignedAtPath(EMPTY_PATH, context);
      }
      hasEffectsWhenAccessedAtPath(path) {
        if (this.operator === "void") {
          return path.length > 0;
        }
        return path.length > 1;
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        if (this.operator === "delete") {
          this.argument.deoptimizePath(EMPTY_PATH);
          this.context.requestTreeshakingPass();
        }
      }
    };
    UnknownNode = class extends NodeBase {
      hasEffects() {
        return true;
      }
      include(context) {
        super.include(context, true);
      }
    };
    UpdateExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      hasEffects(context) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        return this.argument.hasEffects(context) || this.argument.hasEffectsWhenAssignedAtPath(EMPTY_PATH, context);
      }
      hasEffectsWhenAccessedAtPath(path) {
        return path.length > 1;
      }
      render(code, options) {
        this.argument.render(code, options);
        if (options.format === "system") {
          const variable = this.argument.variable;
          const exportNames = options.exportNamesByVariable.get(variable);
          if (exportNames) {
            const _ = options.compact ? "" : " ";
            if (this.prefix) {
              if (exportNames.length === 1) {
                renderSystemExportExpression(variable, this.start, this.end, code, options);
              } else {
                renderSystemExportSequenceAfterExpression(variable, this.start, this.end, this.parent.type !== ExpressionStatement$1, code, options);
              }
            } else {
              const operator = this.operator[0];
              renderSystemExportSequenceBeforeExpression(variable, this.start, this.end, this.parent.type !== ExpressionStatement$1, code, options, `${_}${operator}${_}1`);
            }
          }
        }
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        this.argument.deoptimizePath(EMPTY_PATH);
        if (this.argument instanceof Identifier) {
          const variable = this.scope.findVariable(this.argument.name);
          variable.isReassigned = true;
        }
        this.context.requestTreeshakingPass();
      }
    };
    VariableDeclarator = class extends NodeBase {
      declareDeclarator(kind) {
        this.id.declare(kind, this.init || UNDEFINED_EXPRESSION);
      }
      deoptimizePath(path) {
        this.id.deoptimizePath(path);
      }
      hasEffects(context) {
        const initEffect = this.init !== null && this.init.hasEffects(context);
        this.id.markDeclarationReached();
        return initEffect || this.id.hasEffects(context);
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        if (this.init) {
          this.init.include(context, includeChildrenRecursively);
        }
        this.id.markDeclarationReached();
        if (includeChildrenRecursively || this.id.shouldBeIncluded(context)) {
          this.id.include(context, includeChildrenRecursively);
        }
      }
      render(code, options) {
        const renderId = this.id.included;
        if (renderId) {
          this.id.render(code, options);
        } else {
          const operatorPos = findFirstOccurrenceOutsideComment(code.original, "=", this.id.end);
          code.remove(this.start, findNonWhiteSpace(code.original, operatorPos + 1));
        }
        if (this.init) {
          this.init.render(code, options, renderId ? BLANK : { renderedSurroundingElement: ExpressionStatement$1 });
        } else if (this.id instanceof Identifier && isReassignedExportsMember(this.id.variable, options.exportNamesByVariable)) {
          const _ = options.compact ? "" : " ";
          code.appendLeft(this.end, `${_}=${_}void 0`);
        }
      }
    };
    WhileStatement = class extends NodeBase {
      hasEffects(context) {
        if (this.test.hasEffects(context))
          return true;
        const { brokenFlow, ignore: { breaks, continues } } = context;
        context.ignore.breaks = true;
        context.ignore.continues = true;
        if (this.body.hasEffects(context))
          return true;
        context.ignore.breaks = breaks;
        context.ignore.continues = continues;
        context.brokenFlow = brokenFlow;
        return false;
      }
      include(context, includeChildrenRecursively) {
        this.included = true;
        this.test.include(context, includeChildrenRecursively);
        const { brokenFlow } = context;
        this.body.includeAsSingleStatement(context, includeChildrenRecursively);
        context.brokenFlow = brokenFlow;
      }
    };
    YieldExpression = class extends NodeBase {
      constructor() {
        super(...arguments);
        this.deoptimized = false;
      }
      hasEffects(context) {
        if (!this.deoptimized)
          this.applyDeoptimizations();
        return !context.ignore.returnYield || this.argument !== null && this.argument.hasEffects(context);
      }
      render(code, options) {
        if (this.argument) {
          this.argument.render(code, options, { preventASI: true });
          if (this.argument.start === this.start + 5) {
            code.prependLeft(this.start + 5, " ");
          }
        }
      }
      applyDeoptimizations() {
        this.deoptimized = true;
        const { argument } = this;
        if (argument) {
          argument.deoptimizePath(UNKNOWN_PATH);
          this.context.requestTreeshakingPass();
        }
      }
    };
    nodeConstructors = {
      ArrayExpression,
      ArrayPattern,
      ArrowFunctionExpression,
      AssignmentExpression,
      AssignmentPattern,
      AwaitExpression,
      BinaryExpression,
      BlockStatement,
      BreakStatement,
      CallExpression,
      CatchClause,
      ChainExpression,
      ClassBody,
      ClassDeclaration,
      ClassExpression,
      ConditionalExpression,
      ContinueStatement,
      DoWhileStatement,
      EmptyStatement,
      ExportAllDeclaration,
      ExportDefaultDeclaration,
      ExportNamedDeclaration,
      ExportSpecifier,
      ExpressionStatement,
      ForInStatement,
      ForOfStatement,
      ForStatement,
      FunctionDeclaration,
      FunctionExpression,
      Identifier,
      IfStatement,
      ImportDeclaration,
      ImportDefaultSpecifier,
      ImportExpression,
      ImportNamespaceSpecifier,
      ImportSpecifier,
      LabeledStatement,
      Literal,
      LogicalExpression,
      MemberExpression,
      MetaProperty,
      MethodDefinition,
      NewExpression,
      ObjectExpression,
      ObjectPattern,
      PrivateIdentifier,
      Program,
      Property,
      PropertyDefinition,
      RestElement,
      ReturnStatement,
      SequenceExpression,
      SpreadElement,
      Super,
      SwitchCase,
      SwitchStatement,
      TaggedTemplateExpression,
      TemplateElement,
      TemplateLiteral,
      ThisExpression,
      ThrowStatement,
      TryStatement,
      UnaryExpression,
      UnknownNode,
      UpdateExpression,
      VariableDeclaration,
      VariableDeclarator,
      WhileStatement,
      YieldExpression
    };
    MISSING_EXPORT_SHIM_VARIABLE = "_missingExportShim";
    ExportShimVariable = class extends Variable {
      constructor(module2) {
        super(MISSING_EXPORT_SHIM_VARIABLE);
        this.module = module2;
      }
    };
    NamespaceVariable = class extends Variable {
      constructor(context, syntheticNamedExports) {
        super(context.getModuleName());
        this.memberVariables = null;
        this.mergedNamespaces = [];
        this.referencedEarly = false;
        this.references = [];
        this.context = context;
        this.module = context.module;
        this.syntheticNamedExports = syntheticNamedExports;
      }
      addReference(identifier) {
        this.references.push(identifier);
        this.name = identifier.name;
      }
      getMemberVariables() {
        if (this.memberVariables) {
          return this.memberVariables;
        }
        const memberVariables = Object.create(null);
        for (const name of this.context.getExports().concat(this.context.getReexports())) {
          if (name[0] !== "*" && name !== this.module.info.syntheticNamedExports) {
            const exportedVariable = this.context.traceExport(name);
            if (exportedVariable) {
              memberVariables[name] = exportedVariable;
            }
          }
        }
        return this.memberVariables = memberVariables;
      }
      include() {
        this.included = true;
        this.context.includeAllExports();
      }
      prepareNamespace(mergedNamespaces) {
        this.mergedNamespaces = mergedNamespaces;
        const moduleExecIndex = this.context.getModuleExecIndex();
        for (const identifier of this.references) {
          if (identifier.context.getModuleExecIndex() <= moduleExecIndex) {
            this.referencedEarly = true;
            break;
          }
        }
      }
      renderBlock(options) {
        const _ = options.compact ? "" : " ";
        const n2 = options.compact ? "" : "\n";
        const t = options.indent;
        const memberVariables = this.getMemberVariables();
        const members = Object.entries(memberVariables).map(([name2, original]) => {
          if (this.referencedEarly || original.isReassigned) {
            return `${t}get ${name2}${_}()${_}{${_}return ${original.getName()}${options.compact ? "" : ";"}${_}}`;
          }
          const safeName = RESERVED_NAMES[name2] ? `'${name2}'` : name2;
          return `${t}${safeName}: ${original.getName()}`;
        });
        if (options.namespaceToStringTag) {
          members.unshift(`${t}[Symbol.toStringTag]:${_}'Module'`);
        }
        const needsObjectAssign = this.mergedNamespaces.length > 0 || this.syntheticNamedExports;
        if (!needsObjectAssign)
          members.unshift(`${t}__proto__:${_}null`);
        let output = `{${n2}${members.join(`,${n2}`)}${n2}}`;
        if (needsObjectAssign) {
          const assignmentArgs = ["/*#__PURE__*/Object.create(null)"];
          if (this.mergedNamespaces.length > 0) {
            assignmentArgs.push(...this.mergedNamespaces.map((variable) => variable.getName()));
          }
          if (this.syntheticNamedExports) {
            assignmentArgs.push(this.module.getSyntheticNamespace().getName());
          }
          if (members.length > 0) {
            assignmentArgs.push(output);
          }
          output = `/*#__PURE__*/Object.assign(${assignmentArgs.join(`,${_}`)})`;
        }
        if (options.freeze) {
          output = `/*#__PURE__*/Object.freeze(${output})`;
        }
        const name = this.getName();
        output = `${options.varOrConst} ${name}${_}=${_}${output};`;
        if (options.format === "system" && options.exportNamesByVariable.has(this)) {
          output += `${n2}${getSystemExportStatement([this], options)};`;
        }
        return output;
      }
      renderFirst() {
        return this.referencedEarly;
      }
    };
    NamespaceVariable.prototype.isNamespace = true;
    SyntheticNamedExportVariable = class extends Variable {
      constructor(context, name, syntheticNamespace) {
        super(name);
        this.baseVariable = null;
        this.context = context;
        this.module = context.module;
        this.syntheticNamespace = syntheticNamespace;
      }
      getBaseVariable() {
        if (this.baseVariable)
          return this.baseVariable;
        let baseVariable = this.syntheticNamespace;
        while (baseVariable instanceof ExportDefaultVariable || baseVariable instanceof SyntheticNamedExportVariable) {
          if (baseVariable instanceof ExportDefaultVariable) {
            const original = baseVariable.getOriginalVariable();
            if (original === baseVariable)
              break;
            baseVariable = original;
          }
          if (baseVariable instanceof SyntheticNamedExportVariable) {
            baseVariable = baseVariable.syntheticNamespace;
          }
        }
        return this.baseVariable = baseVariable;
      }
      getBaseVariableName() {
        return this.syntheticNamespace.getBaseVariableName();
      }
      getName() {
        const name = this.name;
        return `${this.syntheticNamespace.getName()}${getPropertyAccess(name)}`;
      }
      include() {
        if (!this.included) {
          this.included = true;
          this.context.includeVariableInModule(this.syntheticNamespace);
        }
      }
      setRenderNames(baseName, name) {
        super.setRenderNames(baseName, name);
      }
    };
    getPropertyAccess = (name) => {
      return !RESERVED_NAMES[name] && /^(?!\d)[\w$]+$/.test(name) ? `.${name}` : `[${JSON.stringify(name)}]`;
    };
    NOOP = () => {
    };
    getStartTime = () => [0, 0];
    getElapsedTime = () => 0;
    getMemory = () => 0;
    timers = {};
    normalizeHrTime = (time) => time[0] * 1e3 + time[1] / 1e6;
    timeStart = NOOP;
    timeEnd = NOOP;
    TIMED_PLUGIN_HOOKS = {
      load: true,
      resolveDynamicImport: true,
      resolveId: true,
      transform: true
    };
    MISSING_EXPORT_SHIM_DESCRIPTION = {
      identifier: null,
      localName: MISSING_EXPORT_SHIM_VARIABLE
    };
    Module = class {
      constructor(graph, id, options, isEntry, hasModuleSideEffects, syntheticNamedExports, meta) {
        this.graph = graph;
        this.id = id;
        this.options = options;
        this.alternativeReexportModules = new Map();
        this.ast = null;
        this.chunkFileNames = new Set();
        this.chunkName = null;
        this.cycles = new Set();
        this.dependencies = new Set();
        this.dynamicDependencies = new Set();
        this.dynamicImporters = [];
        this.dynamicImports = [];
        this.execIndex = Infinity;
        this.exportAllSources = new Set();
        this.exports = Object.create(null);
        this.exportsAll = Object.create(null);
        this.implicitlyLoadedAfter = new Set();
        this.implicitlyLoadedBefore = new Set();
        this.importDescriptions = Object.create(null);
        this.importMetas = [];
        this.importedFromNotTreeshaken = false;
        this.importers = [];
        this.imports = new Set();
        this.includedDynamicImporters = [];
        this.isExecuted = false;
        this.isUserDefinedEntryPoint = false;
        this.preserveSignature = this.options.preserveEntrySignatures;
        this.reexportDescriptions = Object.create(null);
        this.sideEffectDependenciesByVariable = new Map();
        this.sources = new Set();
        this.userChunkNames = new Set();
        this.usesTopLevelAwait = false;
        this.allExportNames = null;
        this.exportAllModules = [];
        this.exportNamesByVariable = null;
        this.exportShimVariable = new ExportShimVariable(this);
        this.namespaceReexportsByName = Object.create(null);
        this.relevantDependencies = null;
        this.syntheticExports = new Map();
        this.syntheticNamespace = null;
        this.transformDependencies = [];
        this.transitiveReexports = null;
        this.excludeFromSourcemap = /\0/.test(id);
        this.context = options.moduleContext(id);
        const module2 = this;
        this.info = {
          ast: null,
          code: null,
          get dynamicallyImportedIds() {
            const dynamicallyImportedIds = [];
            for (const { id: id2 } of module2.dynamicImports) {
              if (id2) {
                dynamicallyImportedIds.push(id2);
              }
            }
            return dynamicallyImportedIds;
          },
          get dynamicImporters() {
            return module2.dynamicImporters.sort();
          },
          hasModuleSideEffects,
          id,
          get implicitlyLoadedAfterOneOf() {
            return Array.from(module2.implicitlyLoadedAfter, getId);
          },
          get implicitlyLoadedBefore() {
            return Array.from(module2.implicitlyLoadedBefore, getId);
          },
          get importedIds() {
            return Array.from(module2.sources, (source) => module2.resolvedIds[source].id);
          },
          get importers() {
            return module2.importers.sort();
          },
          isEntry,
          isExternal: false,
          meta,
          syntheticNamedExports
        };
      }
      basename() {
        const base2 = (0, import_path.basename)(this.id);
        const ext = (0, import_path.extname)(this.id);
        return makeLegal(ext ? base2.slice(0, -ext.length) : base2);
      }
      bindReferences() {
        this.ast.bind();
      }
      error(props, pos) {
        this.addLocationToLogProps(props, pos);
        return error(props);
      }
      getAllExportNames() {
        if (this.allExportNames) {
          return this.allExportNames;
        }
        const allExportNames = this.allExportNames = new Set();
        for (const name of Object.keys(this.exports)) {
          allExportNames.add(name);
        }
        for (const name of Object.keys(this.reexportDescriptions)) {
          allExportNames.add(name);
        }
        for (const module2 of this.exportAllModules) {
          if (module2 instanceof ExternalModule) {
            allExportNames.add(`*${module2.id}`);
            continue;
          }
          for (const name of module2.getAllExportNames()) {
            if (name !== "default")
              allExportNames.add(name);
          }
        }
        return allExportNames;
      }
      getDependenciesToBeIncluded() {
        if (this.relevantDependencies)
          return this.relevantDependencies;
        const relevantDependencies = new Set();
        const necessaryDependencies = new Set();
        const alwaysCheckedDependencies = new Set();
        let dependencyVariables = this.imports.keys();
        if (this.info.isEntry || this.includedDynamicImporters.length > 0 || this.namespace.included || this.implicitlyLoadedAfter.size > 0) {
          dependencyVariables = new Set(dependencyVariables);
          for (const exportName of [...this.getReexports(), ...this.getExports()]) {
            const exportedVariable = this.getVariableForExportName(exportName);
            if (exportedVariable) {
              dependencyVariables.add(exportedVariable);
            }
          }
        }
        for (let variable of dependencyVariables) {
          const sideEffectDependencies = this.sideEffectDependenciesByVariable.get(variable);
          if (sideEffectDependencies) {
            for (const module2 of sideEffectDependencies) {
              alwaysCheckedDependencies.add(module2);
            }
          }
          if (variable instanceof SyntheticNamedExportVariable) {
            variable = variable.getBaseVariable();
          } else if (variable instanceof ExportDefaultVariable) {
            variable = variable.getOriginalVariable();
          }
          necessaryDependencies.add(variable.module);
        }
        if (!this.options.treeshake || this.info.hasModuleSideEffects === "no-treeshake") {
          for (const dependency of this.dependencies) {
            relevantDependencies.add(dependency);
          }
        } else {
          this.addRelevantSideEffectDependencies(relevantDependencies, necessaryDependencies, alwaysCheckedDependencies);
        }
        for (const dependency of necessaryDependencies) {
          relevantDependencies.add(dependency);
        }
        return this.relevantDependencies = relevantDependencies;
      }
      getExportNamesByVariable() {
        if (this.exportNamesByVariable) {
          return this.exportNamesByVariable;
        }
        const exportNamesByVariable = new Map();
        for (const exportName of this.getAllExportNames()) {
          if (exportName === this.info.syntheticNamedExports)
            continue;
          let tracedVariable = this.getVariableForExportName(exportName);
          if (tracedVariable instanceof ExportDefaultVariable) {
            tracedVariable = tracedVariable.getOriginalVariable();
          }
          if (!tracedVariable || !(tracedVariable.included || tracedVariable instanceof ExternalVariable)) {
            continue;
          }
          const existingExportNames = exportNamesByVariable.get(tracedVariable);
          if (existingExportNames) {
            existingExportNames.push(exportName);
          } else {
            exportNamesByVariable.set(tracedVariable, [exportName]);
          }
        }
        return this.exportNamesByVariable = exportNamesByVariable;
      }
      getExports() {
        return Object.keys(this.exports);
      }
      getReexports() {
        if (this.transitiveReexports) {
          return this.transitiveReexports;
        }
        this.transitiveReexports = [];
        const reexports = new Set();
        for (const name in this.reexportDescriptions) {
          reexports.add(name);
        }
        for (const module2 of this.exportAllModules) {
          if (module2 instanceof ExternalModule) {
            reexports.add(`*${module2.id}`);
          } else {
            for (const name of [...module2.getReexports(), ...module2.getExports()]) {
              if (name !== "default")
                reexports.add(name);
            }
          }
        }
        return this.transitiveReexports = [...reexports];
      }
      getRenderedExports() {
        const renderedExports = [];
        const removedExports = [];
        for (const exportName in this.exports) {
          const variable = this.getVariableForExportName(exportName);
          (variable && variable.included ? renderedExports : removedExports).push(exportName);
        }
        return { removedExports, renderedExports };
      }
      getSyntheticNamespace() {
        if (this.syntheticNamespace === null) {
          this.syntheticNamespace = void 0;
          this.syntheticNamespace = this.getVariableForExportName(typeof this.info.syntheticNamedExports === "string" ? this.info.syntheticNamedExports : "default");
        }
        if (!this.syntheticNamespace) {
          return error(errSyntheticNamedExportsNeedNamespaceExport(this.id, this.info.syntheticNamedExports));
        }
        return this.syntheticNamespace;
      }
      getVariableForExportName(name, { importerForSideEffects, isExportAllSearch, searchedNamesAndModules, skipExternalNamespaceReexports } = EMPTY_OBJECT) {
        if (name[0] === "*") {
          if (name.length === 1) {
            return this.namespace;
          } else {
            const module2 = this.graph.modulesById.get(name.slice(1));
            return module2.getVariableForExportName("*");
          }
        }
        const reexportDeclaration = this.reexportDescriptions[name];
        if (reexportDeclaration) {
          const variable = getVariableForExportNameRecursive(reexportDeclaration.module, reexportDeclaration.localName, importerForSideEffects, false, searchedNamesAndModules, false);
          if (!variable) {
            return this.error(errMissingExport(reexportDeclaration.localName, this.id, reexportDeclaration.module.id), reexportDeclaration.start);
          }
          if (importerForSideEffects) {
            setAlternativeExporterIfCyclic(variable, importerForSideEffects, this);
          }
          return variable;
        }
        const exportDeclaration = this.exports[name];
        if (exportDeclaration) {
          if (exportDeclaration === MISSING_EXPORT_SHIM_DESCRIPTION) {
            return this.exportShimVariable;
          }
          const name2 = exportDeclaration.localName;
          const variable = this.traceVariable(name2, importerForSideEffects);
          if (importerForSideEffects) {
            getOrCreate(importerForSideEffects.sideEffectDependenciesByVariable, variable, () => new Set()).add(this);
            setAlternativeExporterIfCyclic(variable, importerForSideEffects, this);
          }
          return variable;
        }
        if (name !== "default") {
          const foundNamespaceReexport = name in this.namespaceReexportsByName ? this.namespaceReexportsByName[name] : this.getVariableFromNamespaceReexports(name, importerForSideEffects, searchedNamesAndModules, skipExternalNamespaceReexports);
          if (!skipExternalNamespaceReexports) {
            this.namespaceReexportsByName[name] = foundNamespaceReexport;
          }
          if (foundNamespaceReexport) {
            return foundNamespaceReexport;
          }
        }
        if (this.info.syntheticNamedExports) {
          let syntheticExport = this.syntheticExports.get(name);
          if (!syntheticExport) {
            const syntheticNamespace = this.getSyntheticNamespace();
            syntheticExport = new SyntheticNamedExportVariable(this.astContext, name, syntheticNamespace);
            this.syntheticExports.set(name, syntheticExport);
            return syntheticExport;
          }
          return syntheticExport;
        }
        if (!isExportAllSearch) {
          if (this.options.shimMissingExports) {
            this.shimMissingExport(name);
            return this.exportShimVariable;
          }
        }
        return null;
      }
      hasEffects() {
        return this.info.hasModuleSideEffects === "no-treeshake" || this.ast.included && this.ast.hasEffects(createHasEffectsContext());
      }
      include() {
        const context = createInclusionContext();
        if (this.ast.shouldBeIncluded(context))
          this.ast.include(context, false);
      }
      includeAllExports(includeNamespaceMembers) {
        if (!this.isExecuted) {
          markModuleAndImpureDependenciesAsExecuted(this);
          this.graph.needsTreeshakingPass = true;
        }
        for (const exportName of this.getExports()) {
          if (includeNamespaceMembers || exportName !== this.info.syntheticNamedExports) {
            const variable = this.getVariableForExportName(exportName);
            variable.deoptimizePath(UNKNOWN_PATH);
            if (!variable.included) {
              this.includeVariable(variable);
            }
          }
        }
        for (const name of this.getReexports()) {
          const variable = this.getVariableForExportName(name);
          if (variable) {
            variable.deoptimizePath(UNKNOWN_PATH);
            if (!variable.included) {
              this.includeVariable(variable);
            }
            if (variable instanceof ExternalVariable) {
              variable.module.reexported = true;
            }
          }
        }
        if (includeNamespaceMembers) {
          this.namespace.prepareNamespace(this.includeAndGetAdditionalMergedNamespaces());
        }
      }
      includeAllInBundle() {
        this.ast.include(createInclusionContext(), true);
        this.includeAllExports(false);
      }
      isIncluded() {
        return this.ast.included || this.namespace.included || this.importedFromNotTreeshaken;
      }
      linkImports() {
        this.addModulesToImportDescriptions(this.importDescriptions);
        this.addModulesToImportDescriptions(this.reexportDescriptions);
        for (const name in this.exports) {
          if (name !== "default" && name !== this.info.syntheticNamedExports) {
            this.exportsAll[name] = this.id;
          }
        }
        const externalExportAllModules = [];
        for (const source of this.exportAllSources) {
          const module2 = this.graph.modulesById.get(this.resolvedIds[source].id);
          if (module2 instanceof ExternalModule) {
            externalExportAllModules.push(module2);
            continue;
          }
          this.exportAllModules.push(module2);
          for (const name in module2.exportsAll) {
            if (name in this.exportsAll) {
              this.options.onwarn(errNamespaceConflict(name, this, module2));
            } else {
              this.exportsAll[name] = module2.exportsAll[name];
            }
          }
        }
        this.exportAllModules.push(...externalExportAllModules);
      }
      render(options) {
        const magicString = this.magicString.clone();
        this.ast.render(magicString, options);
        this.usesTopLevelAwait = this.astContext.usesTopLevelAwait;
        return magicString;
      }
      setSource(_a) {
        var _b = _a, { ast, code, customTransformCache, originalCode, originalSourcemap, resolvedIds, sourcemapChain, transformDependencies, transformFiles } = _b, moduleOptions = __objRest(_b, ["ast", "code", "customTransformCache", "originalCode", "originalSourcemap", "resolvedIds", "sourcemapChain", "transformDependencies", "transformFiles"]);
        this.info.code = code;
        this.originalCode = originalCode;
        this.originalSourcemap = originalSourcemap;
        this.sourcemapChain = sourcemapChain;
        if (transformFiles) {
          this.transformFiles = transformFiles;
        }
        this.transformDependencies = transformDependencies;
        this.customTransformCache = customTransformCache;
        this.updateOptions(moduleOptions);
        timeStart("generate ast", 3);
        if (!ast) {
          ast = this.tryParse();
        }
        timeEnd("generate ast", 3);
        this.resolvedIds = resolvedIds || Object.create(null);
        const fileName = this.id;
        this.magicString = new MagicString$1(code, {
          filename: this.excludeFromSourcemap ? null : fileName,
          indentExclusionRanges: []
        });
        timeStart("analyse ast", 3);
        this.astContext = {
          addDynamicImport: this.addDynamicImport.bind(this),
          addExport: this.addExport.bind(this),
          addImport: this.addImport.bind(this),
          addImportMeta: this.addImportMeta.bind(this),
          code,
          deoptimizationTracker: this.graph.deoptimizationTracker,
          error: this.error.bind(this),
          fileName,
          getExports: this.getExports.bind(this),
          getModuleExecIndex: () => this.execIndex,
          getModuleName: this.basename.bind(this),
          getReexports: this.getReexports.bind(this),
          importDescriptions: this.importDescriptions,
          includeAllExports: () => this.includeAllExports(true),
          includeDynamicImport: this.includeDynamicImport.bind(this),
          includeVariableInModule: this.includeVariableInModule.bind(this),
          magicString: this.magicString,
          module: this,
          moduleContext: this.context,
          nodeConstructors,
          options: this.options,
          requestTreeshakingPass: () => this.graph.needsTreeshakingPass = true,
          traceExport: this.getVariableForExportName.bind(this),
          traceVariable: this.traceVariable.bind(this),
          usesTopLevelAwait: false,
          warn: this.warn.bind(this)
        };
        this.scope = new ModuleScope(this.graph.scope, this.astContext);
        this.namespace = new NamespaceVariable(this.astContext, this.info.syntheticNamedExports);
        this.ast = new Program(ast, { context: this.astContext, type: "Module" }, this.scope);
        this.info.ast = ast;
        timeEnd("analyse ast", 3);
      }
      toJSON() {
        return {
          ast: this.ast.esTreeNode,
          code: this.info.code,
          customTransformCache: this.customTransformCache,
          dependencies: Array.from(this.dependencies, getId),
          id: this.id,
          meta: this.info.meta,
          moduleSideEffects: this.info.hasModuleSideEffects,
          originalCode: this.originalCode,
          originalSourcemap: this.originalSourcemap,
          resolvedIds: this.resolvedIds,
          sourcemapChain: this.sourcemapChain,
          syntheticNamedExports: this.info.syntheticNamedExports,
          transformDependencies: this.transformDependencies,
          transformFiles: this.transformFiles
        };
      }
      traceVariable(name, importerForSideEffects) {
        const localVariable = this.scope.variables.get(name);
        if (localVariable) {
          return localVariable;
        }
        if (name in this.importDescriptions) {
          const importDeclaration = this.importDescriptions[name];
          const otherModule = importDeclaration.module;
          if (otherModule instanceof Module && importDeclaration.name === "*") {
            return otherModule.namespace;
          }
          const declaration = otherModule.getVariableForExportName(importDeclaration.name, {
            importerForSideEffects: importerForSideEffects || this
          });
          if (!declaration) {
            return this.error(errMissingExport(importDeclaration.name, this.id, otherModule.id), importDeclaration.start);
          }
          return declaration;
        }
        return null;
      }
      tryParse() {
        try {
          return this.graph.contextParse(this.info.code);
        } catch (err) {
          let message = err.message.replace(/ \(\d+:\d+\)$/, "");
          if (this.id.endsWith(".json")) {
            message += " (Note that you need @rollup/plugin-json to import JSON files)";
          } else if (!this.id.endsWith(".js")) {
            message += " (Note that you need plugins to import files that are not JavaScript)";
          }
          return this.error({
            code: "PARSE_ERROR",
            message,
            parserError: err
          }, err.pos);
        }
      }
      updateOptions({ meta, moduleSideEffects, syntheticNamedExports }) {
        if (moduleSideEffects != null) {
          this.info.hasModuleSideEffects = moduleSideEffects;
        }
        if (syntheticNamedExports != null) {
          this.info.syntheticNamedExports = syntheticNamedExports;
        }
        if (meta != null) {
          this.info.meta = __spreadValues(__spreadValues({}, this.info.meta), meta);
        }
      }
      warn(props, pos) {
        this.addLocationToLogProps(props, pos);
        this.options.onwarn(props);
      }
      addDynamicImport(node) {
        let argument = node.source;
        if (argument instanceof TemplateLiteral) {
          if (argument.quasis.length === 1 && argument.quasis[0].value.cooked) {
            argument = argument.quasis[0].value.cooked;
          }
        } else if (argument instanceof Literal && typeof argument.value === "string") {
          argument = argument.value;
        }
        this.dynamicImports.push({ argument, id: null, node, resolution: null });
      }
      addExport(node) {
        if (node instanceof ExportDefaultDeclaration) {
          this.exports.default = {
            identifier: node.variable.getAssignedVariableName(),
            localName: "default"
          };
        } else if (node instanceof ExportAllDeclaration) {
          const source = node.source.value;
          this.sources.add(source);
          if (node.exported) {
            const name = node.exported.name;
            this.reexportDescriptions[name] = {
              localName: "*",
              module: null,
              source,
              start: node.start
            };
          } else {
            this.exportAllSources.add(source);
          }
        } else if (node.source instanceof Literal) {
          const source = node.source.value;
          this.sources.add(source);
          for (const specifier of node.specifiers) {
            const name = specifier.exported.name;
            this.reexportDescriptions[name] = {
              localName: specifier.local.name,
              module: null,
              source,
              start: specifier.start
            };
          }
        } else if (node.declaration) {
          const declaration = node.declaration;
          if (declaration instanceof VariableDeclaration) {
            for (const declarator of declaration.declarations) {
              for (const localName of extractAssignedNames(declarator.id)) {
                this.exports[localName] = { identifier: null, localName };
              }
            }
          } else {
            const localName = declaration.id.name;
            this.exports[localName] = { identifier: null, localName };
          }
        } else {
          for (const specifier of node.specifiers) {
            const localName = specifier.local.name;
            const exportedName = specifier.exported.name;
            this.exports[exportedName] = { identifier: null, localName };
          }
        }
      }
      addImport(node) {
        const source = node.source.value;
        this.sources.add(source);
        for (const specifier of node.specifiers) {
          const isDefault = specifier.type === ImportDefaultSpecifier$1;
          const isNamespace = specifier.type === ImportNamespaceSpecifier$1;
          const name = isDefault ? "default" : isNamespace ? "*" : specifier.imported.name;
          this.importDescriptions[specifier.local.name] = {
            module: null,
            name,
            source,
            start: specifier.start
          };
        }
      }
      addImportMeta(node) {
        this.importMetas.push(node);
      }
      addLocationToLogProps(props, pos) {
        props.id = this.id;
        props.pos = pos;
        let code = this.info.code;
        const location = locate(code, pos, { offsetLine: 1 });
        if (location) {
          let { column, line } = location;
          try {
            ({ column, line } = getOriginalLocation(this.sourcemapChain, { column, line }));
            code = this.originalCode;
          } catch (e) {
            this.options.onwarn({
              code: "SOURCEMAP_ERROR",
              id: this.id,
              loc: {
                column,
                file: this.id,
                line
              },
              message: `Error when using sourcemap for reporting an error: ${e.message}`,
              pos
            });
          }
          augmentCodeLocation(props, { column, line }, code, this.id);
        }
      }
      addModulesToImportDescriptions(importDescription) {
        for (const specifier of Object.values(importDescription)) {
          const id = this.resolvedIds[specifier.source].id;
          specifier.module = this.graph.modulesById.get(id);
        }
      }
      addRelevantSideEffectDependencies(relevantDependencies, necessaryDependencies, alwaysCheckedDependencies) {
        const handledDependencies = new Set();
        const addSideEffectDependencies = (possibleDependencies) => {
          for (const dependency of possibleDependencies) {
            if (handledDependencies.has(dependency)) {
              continue;
            }
            handledDependencies.add(dependency);
            if (necessaryDependencies.has(dependency)) {
              relevantDependencies.add(dependency);
              continue;
            }
            if (!(dependency.info.hasModuleSideEffects || alwaysCheckedDependencies.has(dependency))) {
              continue;
            }
            if (dependency instanceof ExternalModule || dependency.hasEffects()) {
              relevantDependencies.add(dependency);
              continue;
            }
            addSideEffectDependencies(dependency.dependencies);
          }
        };
        addSideEffectDependencies(this.dependencies);
        addSideEffectDependencies(alwaysCheckedDependencies);
      }
      getVariableFromNamespaceReexports(name, importerForSideEffects, searchedNamesAndModules, skipExternalNamespaceReexports = false) {
        let foundSyntheticDeclaration = null;
        const skipExternalNamespaceValues = [{ searchedNamesAndModules, skipExternalNamespaces: true }];
        if (!skipExternalNamespaceReexports) {
          const clonedSearchedNamesAndModules = new Map();
          for (const [name2, modules] of searchedNamesAndModules || []) {
            clonedSearchedNamesAndModules.set(name2, new Set(modules));
          }
          skipExternalNamespaceValues.push({
            searchedNamesAndModules: clonedSearchedNamesAndModules,
            skipExternalNamespaces: false
          });
        }
        for (const { skipExternalNamespaces, searchedNamesAndModules: searchedNamesAndModules2 } of skipExternalNamespaceValues) {
          const foundDeclarations = new Set();
          for (const module2 of this.exportAllModules) {
            if (module2 instanceof Module || !skipExternalNamespaces) {
              const declaration = getVariableForExportNameRecursive(module2, name, importerForSideEffects, true, searchedNamesAndModules2, skipExternalNamespaces);
              if (declaration) {
                if (!(declaration instanceof SyntheticNamedExportVariable)) {
                  foundDeclarations.add(declaration);
                } else if (!foundSyntheticDeclaration) {
                  foundSyntheticDeclaration = declaration;
                }
              }
            }
          }
          if (foundDeclarations.size === 1) {
            return [...foundDeclarations][0];
          }
          if (foundDeclarations.size > 1) {
            if (skipExternalNamespaces) {
              return null;
            }
            const foundDeclarationList = [...foundDeclarations];
            const usedDeclaration = foundDeclarationList[0];
            this.options.onwarn(errAmbiguousExternalNamespaces(name, this.id, usedDeclaration.module.id, foundDeclarationList.map((declaration) => declaration.module.id)));
            return usedDeclaration;
          }
        }
        if (foundSyntheticDeclaration) {
          return foundSyntheticDeclaration;
        }
        return null;
      }
      includeAndGetAdditionalMergedNamespaces() {
        const mergedNamespaces = [];
        for (const module2 of this.exportAllModules) {
          if (module2 instanceof ExternalModule) {
            const externalVariable = module2.getVariableForExportName("*");
            externalVariable.include();
            this.imports.add(externalVariable);
            mergedNamespaces.push(externalVariable);
          } else if (module2.info.syntheticNamedExports) {
            const syntheticNamespace = module2.getSyntheticNamespace();
            syntheticNamespace.include();
            this.imports.add(syntheticNamespace);
            mergedNamespaces.push(syntheticNamespace);
          }
        }
        return mergedNamespaces;
      }
      includeDynamicImport(node) {
        const resolution = this.dynamicImports.find((dynamicImport) => dynamicImport.node === node).resolution;
        if (resolution instanceof Module) {
          resolution.includedDynamicImporters.push(this);
          resolution.includeAllExports(true);
        }
      }
      includeVariable(variable) {
        if (!variable.included) {
          variable.include();
          this.graph.needsTreeshakingPass = true;
          const variableModule = variable.module;
          if (variableModule && variableModule instanceof Module) {
            if (!variableModule.isExecuted) {
              markModuleAndImpureDependenciesAsExecuted(variableModule);
            }
            if (variableModule !== this) {
              const sideEffectModules = getAndExtendSideEffectModules(variable, this);
              for (const module2 of sideEffectModules) {
                if (!module2.isExecuted) {
                  markModuleAndImpureDependenciesAsExecuted(module2);
                }
              }
            }
          }
        }
      }
      includeVariableInModule(variable) {
        this.includeVariable(variable);
        const variableModule = variable.module;
        if (variableModule && variableModule !== this) {
          this.imports.add(variable);
        }
      }
      shimMissingExport(name) {
        this.options.onwarn({
          code: "SHIMMED_EXPORT",
          exporter: relativeId(this.id),
          exportName: name,
          message: `Missing export "${name}" has been shimmed in module ${relativeId(this.id)}.`
        });
        this.exports[name] = MISSING_EXPORT_SHIM_DESCRIPTION;
      }
    };
    builtins = {
      assert: true,
      buffer: true,
      console: true,
      constants: true,
      domain: true,
      events: true,
      http: true,
      https: true,
      os: true,
      path: true,
      process: true,
      punycode: true,
      querystring: true,
      stream: true,
      string_decoder: true,
      timers: true,
      tty: true,
      url: true,
      util: true,
      vm: true,
      zlib: true
    };
    shouldUseDot = /^[a-zA-Z$_][a-zA-Z0-9$_]*$/;
    thisProp = (name) => `this${keypath(name)}`;
    getStarExcludesBlock = (starExcludes, varOrConst, _, t, n2) => starExcludes ? `${n2}${t}${varOrConst} _starExcludes${_}=${_}{${_}${[...starExcludes].map((prop) => `${prop}:${_}1`).join(`,${_}`)}${_}};` : "";
    getImportBindingsBlock = (importBindings, _, t, n2) => importBindings.length ? `${n2}${t}var ${importBindings.join(`,${_}`)};` : "";
    getHoistedExportsBlock = (exports, _, t, n2) => getExportsBlock(exports.filter((expt) => expt.hoisted).map((expt) => ({ name: expt.exported, value: expt.local })), _, t, n2);
    getMissingExportsBlock = (exports, _, t, n2) => getExportsBlock(exports.filter((expt) => expt.local === MISSING_EXPORT_SHIM_VARIABLE).map((expt) => ({ name: expt.exported, value: MISSING_EXPORT_SHIM_VARIABLE })), _, t, n2);
    getSyntheticExportsBlock = (exports, _, t, n2) => getExportsBlock(exports.filter((expt) => expt.expression).map((expt) => ({ name: expt.exported, value: expt.local })), _, t, n2);
    finalisers = { amd, cjs, es, iife, system, umd };
    Source = class {
      constructor(filename, content) {
        this.isOriginal = true;
        this.filename = filename;
        this.content = content;
      }
      traceSegment(line, column, name) {
        return { column, line, name, source: this };
      }
    };
    Link = class {
      constructor(map, sources) {
        this.sources = sources;
        this.names = map.names;
        this.mappings = map.mappings;
      }
      traceMappings() {
        const sources = [];
        const sourcesContent = [];
        const names = [];
        const nameIndexMap = new Map();
        const mappings = [];
        for (const line of this.mappings) {
          const tracedLine = [];
          for (const segment of line) {
            if (segment.length == 1)
              continue;
            const source = this.sources[segment[1]];
            if (!source)
              continue;
            const traced = source.traceSegment(segment[2], segment[3], segment.length === 5 ? this.names[segment[4]] : "");
            if (traced) {
              let sourceIndex = sources.lastIndexOf(traced.source.filename);
              if (sourceIndex === -1) {
                sourceIndex = sources.length;
                sources.push(traced.source.filename);
                sourcesContent[sourceIndex] = traced.source.content;
              } else if (sourcesContent[sourceIndex] == null) {
                sourcesContent[sourceIndex] = traced.source.content;
              } else if (traced.source.content != null && sourcesContent[sourceIndex] !== traced.source.content) {
                return error({
                  message: `Multiple conflicting contents for sourcemap source ${traced.source.filename}`
                });
              }
              const tracedSegment = [
                segment[0],
                sourceIndex,
                traced.line,
                traced.column
              ];
              if (traced.name) {
                let nameIndex = nameIndexMap.get(traced.name);
                if (nameIndex === void 0) {
                  nameIndex = names.length;
                  names.push(traced.name);
                  nameIndexMap.set(traced.name, nameIndex);
                }
                tracedSegment[4] = nameIndex;
              }
              tracedLine.push(tracedSegment);
            }
          }
          mappings.push(tracedLine);
        }
        return { mappings, names, sources, sourcesContent };
      }
      traceSegment(line, column, name) {
        const segments = this.mappings[line];
        if (!segments)
          return null;
        let i = 0;
        let j = segments.length - 1;
        while (i <= j) {
          const m = i + j >> 1;
          const segment = segments[m];
          if (segment[0] === column) {
            if (segment.length == 1)
              return null;
            const source = this.sources[segment[1]];
            if (!source)
              return null;
            return source.traceSegment(segment[2], segment[3], segment.length === 5 ? this.names[segment[4]] : name);
          }
          if (segment[0] > column) {
            j = m - 1;
          } else {
            i = m + 1;
          }
        }
        return null;
      }
    };
    createHash = () => (0, import_crypto.createHash)("sha256");
    DECONFLICT_IMPORTED_VARIABLES_BY_FORMAT = {
      amd: deconflictImportsOther,
      cjs: deconflictImportsOther,
      es: deconflictImportsEsmOrSystem,
      iife: deconflictImportsOther,
      system: deconflictImportsEsmOrSystem,
      umd: deconflictImportsOther
    };
    needsEscapeRegEx = /[\\'\r\n\u2028\u2029]/;
    quoteNewlineRegEx = /(['\r\n\u2028\u2029])/g;
    backSlashRegEx = /\\/g;
    NON_ASSET_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];
    Chunk2 = class {
      constructor(orderedModules, inputOptions, outputOptions, unsetOptions, pluginDriver, modulesById, chunkByModule, facadeChunkByModule, includedNamespaces, manualChunkAlias) {
        this.orderedModules = orderedModules;
        this.inputOptions = inputOptions;
        this.outputOptions = outputOptions;
        this.unsetOptions = unsetOptions;
        this.pluginDriver = pluginDriver;
        this.modulesById = modulesById;
        this.chunkByModule = chunkByModule;
        this.facadeChunkByModule = facadeChunkByModule;
        this.includedNamespaces = includedNamespaces;
        this.manualChunkAlias = manualChunkAlias;
        this.entryModules = [];
        this.exportMode = "named";
        this.facadeModule = null;
        this.id = null;
        this.namespaceVariableName = "";
        this.variableName = "";
        this.accessedGlobalsByScope = new Map();
        this.dependencies = new Set();
        this.dynamicDependencies = new Set();
        this.dynamicEntryModules = [];
        this.dynamicName = null;
        this.exportNamesByVariable = new Map();
        this.exports = new Set();
        this.exportsByName = Object.create(null);
        this.fileName = null;
        this.implicitEntryModules = [];
        this.implicitlyLoadedBefore = new Set();
        this.imports = new Set();
        this.indentString = void 0;
        this.isEmpty = true;
        this.name = null;
        this.needsExportsShim = false;
        this.renderedDependencies = null;
        this.renderedExports = null;
        this.renderedHash = void 0;
        this.renderedModuleSources = new Map();
        this.renderedModules = Object.create(null);
        this.renderedSource = null;
        this.sortedExportNames = null;
        this.strictFacade = false;
        this.usedModules = void 0;
        this.execIndex = orderedModules.length > 0 ? orderedModules[0].execIndex : Infinity;
        const chunkModules = new Set(orderedModules);
        for (const module2 of orderedModules) {
          if (module2.namespace.included) {
            includedNamespaces.add(module2);
          }
          if (this.isEmpty && module2.isIncluded()) {
            this.isEmpty = false;
          }
          if (module2.info.isEntry || outputOptions.preserveModules) {
            this.entryModules.push(module2);
          }
          for (const importer of module2.includedDynamicImporters) {
            if (!chunkModules.has(importer)) {
              this.dynamicEntryModules.push(module2);
              if (module2.info.syntheticNamedExports && !outputOptions.preserveModules) {
                includedNamespaces.add(module2);
                this.exports.add(module2.namespace);
              }
            }
          }
          if (module2.implicitlyLoadedAfter.size > 0) {
            this.implicitEntryModules.push(module2);
          }
        }
        this.suggestedVariableName = makeLegal(this.generateVariableName());
      }
      static generateFacade(inputOptions, outputOptions, unsetOptions, pluginDriver, modulesById, chunkByModule, facadeChunkByModule, includedNamespaces, facadedModule, facadeName) {
        const chunk = new Chunk2([], inputOptions, outputOptions, unsetOptions, pluginDriver, modulesById, chunkByModule, facadeChunkByModule, includedNamespaces, null);
        chunk.assignFacadeName(facadeName, facadedModule);
        if (!facadeChunkByModule.has(facadedModule)) {
          facadeChunkByModule.set(facadedModule, chunk);
        }
        for (const dependency of facadedModule.getDependenciesToBeIncluded()) {
          chunk.dependencies.add(dependency instanceof Module ? chunkByModule.get(dependency) : dependency);
        }
        if (!chunk.dependencies.has(chunkByModule.get(facadedModule)) && facadedModule.info.hasModuleSideEffects && facadedModule.hasEffects()) {
          chunk.dependencies.add(chunkByModule.get(facadedModule));
        }
        chunk.ensureReexportsAreAvailableForModule(facadedModule);
        chunk.facadeModule = facadedModule;
        chunk.strictFacade = true;
        return chunk;
      }
      canModuleBeFacade(module2, exposedVariables) {
        const moduleExportNamesByVariable = module2.getExportNamesByVariable();
        for (const exposedVariable of this.exports) {
          if (!moduleExportNamesByVariable.has(exposedVariable)) {
            if (moduleExportNamesByVariable.size === 0 && module2.isUserDefinedEntryPoint && module2.preserveSignature === "strict" && this.unsetOptions.has("preserveEntrySignatures")) {
              this.inputOptions.onwarn({
                code: "EMPTY_FACADE",
                id: module2.id,
                message: `To preserve the export signature of the entry module "${relativeId(module2.id)}", an empty facade chunk was created. This often happens when creating a bundle for a web app where chunks are placed in script tags and exports are ignored. In this case it is recommended to set "preserveEntrySignatures: false" to avoid this and reduce the number of chunks. Otherwise if this is intentional, set "preserveEntrySignatures: 'strict'" explicitly to silence this warning.`,
                url: "https://rollupjs.org/guide/en/#preserveentrysignatures"
              });
            }
            return false;
          }
        }
        for (const exposedVariable of exposedVariables) {
          if (!(moduleExportNamesByVariable.has(exposedVariable) || exposedVariable.module === module2)) {
            return false;
          }
        }
        return true;
      }
      generateExports() {
        this.sortedExportNames = null;
        const remainingExports = new Set(this.exports);
        if (this.facadeModule !== null && (this.facadeModule.preserveSignature !== false || this.strictFacade)) {
          const exportNamesByVariable = this.facadeModule.getExportNamesByVariable();
          for (const [variable, exportNames] of exportNamesByVariable) {
            this.exportNamesByVariable.set(variable, [...exportNames]);
            for (const exportName of exportNames) {
              this.exportsByName[exportName] = variable;
            }
            remainingExports.delete(variable);
          }
        }
        if (this.outputOptions.minifyInternalExports) {
          assignExportsToMangledNames(remainingExports, this.exportsByName, this.exportNamesByVariable);
        } else {
          assignExportsToNames(remainingExports, this.exportsByName, this.exportNamesByVariable);
        }
        if (this.outputOptions.preserveModules || this.facadeModule && this.facadeModule.info.isEntry)
          this.exportMode = getExportMode(this, this.outputOptions, this.unsetOptions, this.facadeModule.id, this.inputOptions.onwarn);
      }
      generateFacades() {
        var _a;
        const facades = [];
        const entryModules = new Set([...this.entryModules, ...this.implicitEntryModules]);
        const exposedVariables = new Set(this.dynamicEntryModules.map((module2) => module2.namespace));
        for (const module2 of entryModules) {
          if (module2.preserveSignature) {
            for (const exportedVariable of module2.getExportNamesByVariable().keys()) {
              exposedVariables.add(exportedVariable);
            }
          }
        }
        for (const module2 of entryModules) {
          const requiredFacades = Array.from(module2.userChunkNames, (name) => ({
            name
          }));
          if (requiredFacades.length === 0 && module2.isUserDefinedEntryPoint) {
            requiredFacades.push({});
          }
          requiredFacades.push(...Array.from(module2.chunkFileNames, (fileName) => ({ fileName })));
          if (requiredFacades.length === 0) {
            requiredFacades.push({});
          }
          if (!this.facadeModule) {
            const needsStrictFacade = module2.preserveSignature === "strict" || module2.preserveSignature === "exports-only" && module2.getExportNamesByVariable().size !== 0;
            if (!needsStrictFacade || this.outputOptions.preserveModules || this.canModuleBeFacade(module2, exposedVariables)) {
              this.facadeModule = module2;
              this.facadeChunkByModule.set(module2, this);
              if (module2.preserveSignature) {
                this.strictFacade = needsStrictFacade;
              }
              this.assignFacadeName(requiredFacades.shift(), module2);
            }
          }
          for (const facadeName of requiredFacades) {
            facades.push(Chunk2.generateFacade(this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.modulesById, this.chunkByModule, this.facadeChunkByModule, this.includedNamespaces, module2, facadeName));
          }
        }
        for (const module2 of this.dynamicEntryModules) {
          if (module2.info.syntheticNamedExports)
            continue;
          if (!this.facadeModule && this.canModuleBeFacade(module2, exposedVariables)) {
            this.facadeModule = module2;
            this.facadeChunkByModule.set(module2, this);
            this.strictFacade = true;
            this.dynamicName = getChunkNameFromModule(module2);
          } else if (this.facadeModule === module2 && !this.strictFacade && this.canModuleBeFacade(module2, exposedVariables)) {
            this.strictFacade = true;
          } else if (!((_a = this.facadeChunkByModule.get(module2)) === null || _a === void 0 ? void 0 : _a.strictFacade)) {
            this.includedNamespaces.add(module2);
            this.exports.add(module2.namespace);
          }
        }
        return facades;
      }
      generateId(addons, options, existingNames, includeHash) {
        if (this.fileName !== null) {
          return this.fileName;
        }
        const [pattern, patternName] = this.facadeModule && this.facadeModule.isUserDefinedEntryPoint ? [options.entryFileNames, "output.entryFileNames"] : [options.chunkFileNames, "output.chunkFileNames"];
        return makeUnique(renderNamePattern(typeof pattern === "function" ? pattern(this.getChunkInfo()) : pattern, patternName, {
          format: () => options.format,
          hash: () => includeHash ? this.computeContentHashWithDependencies(addons, options, existingNames) : "[hash]",
          name: () => this.getChunkName()
        }), existingNames);
      }
      generateIdPreserveModules(preserveModulesRelativeDir, options, existingNames, unsetOptions) {
        const id = this.orderedModules[0].id;
        const sanitizedId = this.outputOptions.sanitizeFileName(id);
        let path;
        if (isAbsolute(id)) {
          const extension = (0, import_path.extname)(id);
          const pattern = unsetOptions.has("entryFileNames") ? "[name][assetExtname].js" : options.entryFileNames;
          const currentDir = (0, import_path.dirname)(sanitizedId);
          const fileName = renderNamePattern(typeof pattern === "function" ? pattern(this.getChunkInfo()) : pattern, "output.entryFileNames", {
            assetExtname: () => NON_ASSET_EXTENSIONS.includes(extension) ? "" : extension,
            ext: () => extension.substr(1),
            extname: () => extension,
            format: () => options.format,
            name: () => this.getChunkName()
          });
          const currentPath = `${currentDir}/${fileName}`;
          const { preserveModulesRoot } = options;
          if (preserveModulesRoot && currentPath.startsWith(preserveModulesRoot)) {
            path = currentPath.slice(preserveModulesRoot.length).replace(/^[\\/]/, "");
          } else {
            path = relative(preserveModulesRelativeDir, currentPath);
          }
        } else {
          path = `_virtual/${(0, import_path.basename)(sanitizedId)}`;
        }
        return makeUnique(normalize(path), existingNames);
      }
      getChunkInfo() {
        const facadeModule = this.facadeModule;
        const getChunkName = this.getChunkName.bind(this);
        return {
          exports: this.getExportNames(),
          facadeModuleId: facadeModule && facadeModule.id,
          isDynamicEntry: this.dynamicEntryModules.length > 0,
          isEntry: facadeModule !== null && facadeModule.info.isEntry,
          isImplicitEntry: this.implicitEntryModules.length > 0,
          modules: this.renderedModules,
          get name() {
            return getChunkName();
          },
          type: "chunk"
        };
      }
      getChunkInfoWithFileNames() {
        return Object.assign(this.getChunkInfo(), {
          code: void 0,
          dynamicImports: Array.from(this.dynamicDependencies, getId),
          fileName: this.id,
          implicitlyLoadedBefore: Array.from(this.implicitlyLoadedBefore, getId),
          importedBindings: this.getImportedBindingsPerDependency(),
          imports: Array.from(this.dependencies, getId),
          map: void 0,
          referencedFiles: this.getReferencedFiles()
        });
      }
      getChunkName() {
        return this.name || (this.name = this.outputOptions.sanitizeFileName(this.getFallbackChunkName()));
      }
      getExportNames() {
        return this.sortedExportNames || (this.sortedExportNames = Object.keys(this.exportsByName).sort());
      }
      getRenderedHash() {
        if (this.renderedHash)
          return this.renderedHash;
        const hash = createHash();
        const hashAugmentation = this.pluginDriver.hookReduceValueSync("augmentChunkHash", "", [this.getChunkInfo()], (augmentation, pluginHash) => {
          if (pluginHash) {
            augmentation += pluginHash;
          }
          return augmentation;
        });
        hash.update(hashAugmentation);
        hash.update(this.renderedSource.toString());
        hash.update(this.getExportNames().map((exportName) => {
          const variable = this.exportsByName[exportName];
          return `${relativeId(variable.module.id).replace(/\\/g, "/")}:${variable.name}:${exportName}`;
        }).join(","));
        return this.renderedHash = hash.digest("hex");
      }
      getVariableExportName(variable) {
        if (this.outputOptions.preserveModules && variable instanceof NamespaceVariable) {
          return "*";
        }
        return this.exportNamesByVariable.get(variable)[0];
      }
      link() {
        this.dependencies = getStaticDependencies(this, this.orderedModules, this.chunkByModule);
        for (const module2 of this.orderedModules) {
          this.addDependenciesToChunk(module2.dynamicDependencies, this.dynamicDependencies);
          this.addDependenciesToChunk(module2.implicitlyLoadedBefore, this.implicitlyLoadedBefore);
          this.setUpChunkImportsAndExportsForModule(module2);
        }
      }
      preRender(options, inputBase) {
        const magicString = new Bundle$1({ separator: options.compact ? "" : "\n\n" });
        this.usedModules = [];
        this.indentString = getIndentString3(this.orderedModules, options);
        const n2 = options.compact ? "" : "\n";
        const _ = options.compact ? "" : " ";
        const renderOptions = {
          compact: options.compact,
          dynamicImportFunction: options.dynamicImportFunction,
          exportNamesByVariable: this.exportNamesByVariable,
          format: options.format,
          freeze: options.freeze,
          indent: this.indentString,
          namespaceToStringTag: options.namespaceToStringTag,
          outputPluginDriver: this.pluginDriver,
          varOrConst: options.preferConst ? "const" : "var"
        };
        if (options.hoistTransitiveImports && !this.outputOptions.preserveModules && this.facadeModule !== null) {
          for (const dep of this.dependencies) {
            if (dep instanceof Chunk2)
              this.inlineChunkDependencies(dep);
          }
        }
        this.prepareDynamicImportsAndImportMetas();
        this.setIdentifierRenderResolutions(options);
        let hoistedSource = "";
        const renderedModules = this.renderedModules;
        for (const module2 of this.orderedModules) {
          let renderedLength = 0;
          if (module2.isIncluded() || this.includedNamespaces.has(module2)) {
            const source = module2.render(renderOptions).trim();
            renderedLength = source.length();
            if (renderedLength) {
              if (options.compact && source.lastLine().indexOf("//") !== -1)
                source.append("\n");
              this.renderedModuleSources.set(module2, source);
              magicString.addSource(source);
              this.usedModules.push(module2);
            }
            const namespace = module2.namespace;
            if (this.includedNamespaces.has(module2) && !this.outputOptions.preserveModules) {
              const rendered = namespace.renderBlock(renderOptions);
              if (namespace.renderFirst())
                hoistedSource += n2 + rendered;
              else
                magicString.addSource(new MagicString$1(rendered));
            }
          }
          const { renderedExports, removedExports } = module2.getRenderedExports();
          const { renderedModuleSources } = this;
          renderedModules[module2.id] = {
            get code() {
              var _a, _b;
              return (_b = (_a = renderedModuleSources.get(module2)) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : null;
            },
            originalLength: module2.originalCode.length,
            removedExports,
            renderedExports,
            renderedLength
          };
        }
        if (hoistedSource)
          magicString.prepend(hoistedSource + n2 + n2);
        if (this.needsExportsShim) {
          magicString.prepend(`${n2}${renderOptions.varOrConst} ${MISSING_EXPORT_SHIM_VARIABLE}${_}=${_}void 0;${n2}${n2}`);
        }
        if (options.compact) {
          this.renderedSource = magicString;
        } else {
          this.renderedSource = magicString.trim();
        }
        this.renderedHash = void 0;
        if (this.isEmpty && this.getExportNames().length === 0 && this.dependencies.size === 0) {
          const chunkName = this.getChunkName();
          this.inputOptions.onwarn({
            chunkName,
            code: "EMPTY_BUNDLE",
            message: `Generated an empty chunk: "${chunkName}"`
          });
        }
        this.setExternalRenderPaths(options, inputBase);
        this.renderedDependencies = this.getChunkDependencyDeclarations(options);
        this.renderedExports = this.exportMode === "none" ? [] : this.getChunkExportDeclarations(options.format);
      }
      async render(options, addons, outputChunk) {
        timeStart("render format", 2);
        const format = options.format;
        const finalise = finalisers[format];
        if (options.dynamicImportFunction && format !== "es") {
          this.inputOptions.onwarn({
            code: "INVALID_OPTION",
            message: '"output.dynamicImportFunction" is ignored for formats other than "es".'
          });
        }
        for (const dependency of this.dependencies) {
          const renderedDependency = this.renderedDependencies.get(dependency);
          if (dependency instanceof ExternalModule) {
            const originalId = dependency.renderPath;
            renderedDependency.id = escapeId(dependency.renormalizeRenderPath ? this.getRelativePath(originalId, false) : originalId);
          } else {
            renderedDependency.namedExportsMode = dependency.exportMode !== "default";
            renderedDependency.id = escapeId(this.getRelativePath(dependency.id, false));
          }
        }
        this.finaliseDynamicImports(options);
        this.finaliseImportMetas(format);
        const hasExports = this.renderedExports.length !== 0 || [...this.renderedDependencies.values()].some((dep) => dep.reexports && dep.reexports.length !== 0);
        let usesTopLevelAwait = false;
        const accessedGlobals = new Set();
        for (const module2 of this.orderedModules) {
          if (module2.usesTopLevelAwait) {
            usesTopLevelAwait = true;
          }
          const accessedGlobalVariables = this.accessedGlobalsByScope.get(module2.scope);
          if (accessedGlobalVariables) {
            for (const name of accessedGlobalVariables) {
              accessedGlobals.add(name);
            }
          }
        }
        if (usesTopLevelAwait && format !== "es" && format !== "system") {
          return error({
            code: "INVALID_TLA_FORMAT",
            message: `Module format ${format} does not support top-level await. Use the "es" or "system" output formats rather.`
          });
        }
        if (!this.id) {
          throw new Error("Internal Error: expecting chunk id");
        }
        const magicString = finalise(this.renderedSource, {
          accessedGlobals,
          dependencies: [...this.renderedDependencies.values()],
          exports: this.renderedExports,
          hasExports,
          id: this.id,
          indentString: this.indentString,
          intro: addons.intro,
          isEntryFacade: this.outputOptions.preserveModules || this.facadeModule !== null && this.facadeModule.info.isEntry,
          isModuleFacade: this.facadeModule !== null,
          namedExportsMode: this.exportMode !== "default",
          outro: addons.outro,
          usesTopLevelAwait,
          varOrConst: options.preferConst ? "const" : "var",
          warn: this.inputOptions.onwarn
        }, options);
        if (addons.banner)
          magicString.prepend(addons.banner);
        if (addons.footer)
          magicString.append(addons.footer);
        const prevCode = magicString.toString();
        timeEnd("render format", 2);
        let map = null;
        const chunkSourcemapChain = [];
        let code = await renderChunk({
          code: prevCode,
          options,
          outputPluginDriver: this.pluginDriver,
          renderChunk: outputChunk,
          sourcemapChain: chunkSourcemapChain
        });
        if (options.sourcemap) {
          timeStart("sourcemap", 2);
          let file;
          if (options.file)
            file = (0, import_path.resolve)(options.sourcemapFile || options.file);
          else if (options.dir)
            file = (0, import_path.resolve)(options.dir, this.id);
          else
            file = (0, import_path.resolve)(this.id);
          const decodedMap = magicString.generateDecodedMap({});
          map = collapseSourcemaps(file, decodedMap, this.usedModules, chunkSourcemapChain, options.sourcemapExcludeSources, this.inputOptions.onwarn);
          map.sources = map.sources.map((sourcePath) => {
            const { sourcemapPathTransform } = options;
            if (sourcemapPathTransform) {
              const newSourcePath = sourcemapPathTransform(sourcePath, `${file}.map`);
              if (typeof newSourcePath !== "string") {
                error(errFailedValidation(`sourcemapPathTransform function must return a string.`));
              }
              return newSourcePath;
            }
            return sourcePath;
          }).map(normalize);
          timeEnd("sourcemap", 2);
        }
        if (!options.compact && code[code.length - 1] !== "\n")
          code += "\n";
        return { code, map };
      }
      addDependenciesToChunk(moduleDependencies, chunkDependencies) {
        for (const module2 of moduleDependencies) {
          if (module2 instanceof Module) {
            const chunk = this.chunkByModule.get(module2);
            if (chunk && chunk !== this) {
              chunkDependencies.add(chunk);
            }
          } else {
            chunkDependencies.add(module2);
          }
        }
      }
      assignFacadeName({ fileName, name }, facadedModule) {
        if (fileName) {
          this.fileName = fileName;
        } else {
          this.name = this.outputOptions.sanitizeFileName(name || getChunkNameFromModule(facadedModule));
        }
      }
      checkCircularDependencyImport(variable, importingModule) {
        const variableModule = variable.module;
        if (variableModule instanceof Module) {
          const exportChunk = this.chunkByModule.get(variableModule);
          let alternativeReexportModule;
          do {
            alternativeReexportModule = importingModule.alternativeReexportModules.get(variable);
            if (alternativeReexportModule) {
              const exportingChunk = this.chunkByModule.get(alternativeReexportModule);
              if (exportingChunk && exportingChunk !== exportChunk) {
                this.inputOptions.onwarn(errCyclicCrossChunkReexport(variableModule.getExportNamesByVariable().get(variable)[0], variableModule.id, alternativeReexportModule.id, importingModule.id));
              }
              importingModule = alternativeReexportModule;
            }
          } while (alternativeReexportModule);
        }
      }
      computeContentHashWithDependencies(addons, options, existingNames) {
        const hash = createHash();
        hash.update([addons.intro, addons.outro, addons.banner, addons.footer].map((addon) => addon || "").join(":"));
        hash.update(options.format);
        const dependenciesForHashing = new Set([this]);
        for (const current2 of dependenciesForHashing) {
          if (current2 instanceof ExternalModule) {
            hash.update(":" + current2.renderPath);
          } else {
            hash.update(current2.getRenderedHash());
            hash.update(current2.generateId(addons, options, existingNames, false));
          }
          if (current2 instanceof ExternalModule)
            continue;
          for (const dependency of [...current2.dependencies, ...current2.dynamicDependencies]) {
            dependenciesForHashing.add(dependency);
          }
        }
        return hash.digest("hex").substr(0, 8);
      }
      ensureReexportsAreAvailableForModule(module2) {
        const map = module2.getExportNamesByVariable();
        for (const exportedVariable of map.keys()) {
          const isSynthetic = exportedVariable instanceof SyntheticNamedExportVariable;
          const importedVariable = isSynthetic ? exportedVariable.getBaseVariable() : exportedVariable;
          if (!(importedVariable instanceof NamespaceVariable && this.outputOptions.preserveModules)) {
            this.checkCircularDependencyImport(importedVariable, module2);
            const exportingModule = importedVariable.module;
            if (exportingModule instanceof Module) {
              const chunk = this.chunkByModule.get(exportingModule);
              if (chunk && chunk !== this) {
                chunk.exports.add(importedVariable);
                if (isSynthetic) {
                  this.imports.add(importedVariable);
                }
              }
            }
          }
        }
      }
      finaliseDynamicImports(options) {
        const stripKnownJsExtensions = options.format === "amd";
        for (const [module2, code] of this.renderedModuleSources) {
          for (const { node, resolution } of module2.dynamicImports) {
            const chunk = this.chunkByModule.get(resolution);
            const facadeChunk = this.facadeChunkByModule.get(resolution);
            if (!resolution || !node.included || chunk === this) {
              continue;
            }
            const renderedResolution = resolution instanceof Module ? `'${this.getRelativePath((facadeChunk || chunk).id, stripKnownJsExtensions)}'` : resolution instanceof ExternalModule ? `'${resolution.renormalizeRenderPath ? this.getRelativePath(resolution.renderPath, stripKnownJsExtensions) : resolution.renderPath}'` : resolution;
            node.renderFinalResolution(code, renderedResolution, resolution instanceof Module && !(facadeChunk === null || facadeChunk === void 0 ? void 0 : facadeChunk.strictFacade) && chunk.exportNamesByVariable.get(resolution.namespace)[0], options);
          }
        }
      }
      finaliseImportMetas(format) {
        for (const [module2, code] of this.renderedModuleSources) {
          for (const importMeta of module2.importMetas) {
            importMeta.renderFinalMechanism(code, this.id, format, this.pluginDriver);
          }
        }
      }
      generateVariableName() {
        if (this.manualChunkAlias) {
          return this.manualChunkAlias;
        }
        const moduleForNaming = this.entryModules[0] || this.implicitEntryModules[0] || this.dynamicEntryModules[0] || this.orderedModules[this.orderedModules.length - 1];
        if (moduleForNaming) {
          return moduleForNaming.chunkName || getAliasName(moduleForNaming.id);
        }
        return "chunk";
      }
      getChunkDependencyDeclarations(options) {
        const importSpecifiers = this.getImportSpecifiers();
        const reexportSpecifiers = this.getReexportSpecifiers();
        const dependencyDeclaration = new Map();
        for (const dep of this.dependencies) {
          const imports = importSpecifiers.get(dep) || null;
          const reexports = reexportSpecifiers.get(dep) || null;
          const namedExportsMode = dep instanceof ExternalModule || dep.exportMode !== "default";
          dependencyDeclaration.set(dep, {
            defaultVariableName: dep.defaultVariableName,
            globalName: dep instanceof ExternalModule && (options.format === "umd" || options.format === "iife") && getGlobalName(dep, options.globals, (imports || reexports) !== null, this.inputOptions.onwarn),
            id: void 0,
            imports,
            isChunk: dep instanceof Chunk2,
            name: dep.variableName,
            namedExportsMode,
            namespaceVariableName: dep.namespaceVariableName,
            reexports
          });
        }
        return dependencyDeclaration;
      }
      getChunkExportDeclarations(format) {
        const exports = [];
        for (const exportName of this.getExportNames()) {
          if (exportName[0] === "*")
            continue;
          const variable = this.exportsByName[exportName];
          if (!(variable instanceof SyntheticNamedExportVariable)) {
            const module2 = variable.module;
            if (module2 && this.chunkByModule.get(module2) !== this)
              continue;
          }
          let expression = null;
          let hoisted = false;
          let local = variable.getName();
          if (variable instanceof LocalVariable) {
            for (const declaration of variable.declarations) {
              if (declaration.parent instanceof FunctionDeclaration || declaration instanceof ExportDefaultDeclaration && declaration.declaration instanceof FunctionDeclaration) {
                hoisted = true;
                break;
              }
            }
          } else if (variable instanceof SyntheticNamedExportVariable) {
            expression = local;
            if (format === "es") {
              local = variable.renderName;
            }
          }
          exports.push({
            exported: exportName,
            expression,
            hoisted,
            local
          });
        }
        return exports;
      }
      getDependenciesToBeDeconflicted(addNonNamespacesAndInteropHelpers, addDependenciesWithoutBindings, interop) {
        const dependencies = new Set();
        const deconflictedDefault = new Set();
        const deconflictedNamespace = new Set();
        for (const variable of [...this.exportNamesByVariable.keys(), ...this.imports]) {
          if (addNonNamespacesAndInteropHelpers || variable.isNamespace) {
            const module2 = variable.module;
            if (module2 instanceof ExternalModule) {
              dependencies.add(module2);
              if (addNonNamespacesAndInteropHelpers) {
                if (variable.name === "default") {
                  if (defaultInteropHelpersByInteropType[String(interop(module2.id))]) {
                    deconflictedDefault.add(module2);
                  }
                } else if (variable.name === "*") {
                  if (namespaceInteropHelpersByInteropType[String(interop(module2.id))]) {
                    deconflictedNamespace.add(module2);
                  }
                }
              }
            } else {
              const chunk = this.chunkByModule.get(module2);
              if (chunk !== this) {
                dependencies.add(chunk);
                if (addNonNamespacesAndInteropHelpers && chunk.exportMode === "default" && variable.isNamespace) {
                  deconflictedNamespace.add(chunk);
                }
              }
            }
          }
        }
        if (addDependenciesWithoutBindings) {
          for (const dependency of this.dependencies) {
            dependencies.add(dependency);
          }
        }
        return { deconflictedDefault, deconflictedNamespace, dependencies };
      }
      getFallbackChunkName() {
        if (this.manualChunkAlias) {
          return this.manualChunkAlias;
        }
        if (this.dynamicName) {
          return this.dynamicName;
        }
        if (this.fileName) {
          return getAliasName(this.fileName);
        }
        return getAliasName(this.orderedModules[this.orderedModules.length - 1].id);
      }
      getImportSpecifiers() {
        const { interop } = this.outputOptions;
        const importsByDependency = new Map();
        for (const variable of this.imports) {
          const module2 = variable.module;
          let dependency;
          let imported;
          if (module2 instanceof ExternalModule) {
            dependency = module2;
            imported = variable.name;
            if (imported !== "default" && imported !== "*" && interop(module2.id) === "defaultOnly") {
              return error(errUnexpectedNamedImport(module2.id, imported, false));
            }
          } else {
            dependency = this.chunkByModule.get(module2);
            imported = dependency.getVariableExportName(variable);
          }
          getOrCreate(importsByDependency, dependency, () => []).push({
            imported,
            local: variable.getName()
          });
        }
        return importsByDependency;
      }
      getImportedBindingsPerDependency() {
        const importSpecifiers = {};
        for (const [dependency, declaration] of this.renderedDependencies) {
          const specifiers = new Set();
          if (declaration.imports) {
            for (const { imported } of declaration.imports) {
              specifiers.add(imported);
            }
          }
          if (declaration.reexports) {
            for (const { imported } of declaration.reexports) {
              specifiers.add(imported);
            }
          }
          importSpecifiers[dependency.id] = [...specifiers];
        }
        return importSpecifiers;
      }
      getReexportSpecifiers() {
        const { externalLiveBindings, interop } = this.outputOptions;
        const reexportSpecifiers = new Map();
        for (let exportName of this.getExportNames()) {
          let dependency;
          let imported;
          let needsLiveBinding = false;
          if (exportName[0] === "*") {
            const id = exportName.substr(1);
            if (interop(id) === "defaultOnly") {
              this.inputOptions.onwarn(errUnexpectedNamespaceReexport(id));
            }
            needsLiveBinding = externalLiveBindings;
            dependency = this.modulesById.get(id);
            imported = exportName = "*";
          } else {
            const variable = this.exportsByName[exportName];
            if (variable instanceof SyntheticNamedExportVariable)
              continue;
            const module2 = variable.module;
            if (module2 instanceof Module) {
              dependency = this.chunkByModule.get(module2);
              if (dependency === this)
                continue;
              imported = dependency.getVariableExportName(variable);
              needsLiveBinding = variable.isReassigned;
            } else {
              dependency = module2;
              imported = variable.name;
              if (imported !== "default" && imported !== "*" && interop(module2.id) === "defaultOnly") {
                return error(errUnexpectedNamedImport(module2.id, imported, true));
              }
              needsLiveBinding = externalLiveBindings && (imported !== "default" || isDefaultAProperty(String(interop(module2.id)), true));
            }
          }
          getOrCreate(reexportSpecifiers, dependency, () => []).push({
            imported,
            needsLiveBinding,
            reexported: exportName
          });
        }
        return reexportSpecifiers;
      }
      getReferencedFiles() {
        const referencedFiles = [];
        for (const module2 of this.orderedModules) {
          for (const meta of module2.importMetas) {
            const fileName = meta.getReferencedFileName(this.pluginDriver);
            if (fileName) {
              referencedFiles.push(fileName);
            }
          }
        }
        return referencedFiles;
      }
      getRelativePath(targetPath, stripJsExtension) {
        let relativePath2 = normalize(relative((0, import_path.dirname)(this.id), targetPath));
        if (stripJsExtension && relativePath2.endsWith(".js")) {
          relativePath2 = relativePath2.slice(0, -3);
        }
        if (relativePath2 === "..")
          return "../../" + (0, import_path.basename)(targetPath);
        if (relativePath2 === "")
          return "../" + (0, import_path.basename)(targetPath);
        return relativePath2.startsWith("../") ? relativePath2 : "./" + relativePath2;
      }
      inlineChunkDependencies(chunk) {
        for (const dep of chunk.dependencies) {
          if (this.dependencies.has(dep))
            continue;
          this.dependencies.add(dep);
          if (dep instanceof Chunk2) {
            this.inlineChunkDependencies(dep);
          }
        }
      }
      prepareDynamicImportsAndImportMetas() {
        var _a;
        const accessedGlobalsByScope = this.accessedGlobalsByScope;
        for (const module2 of this.orderedModules) {
          for (const { node, resolution } of module2.dynamicImports) {
            if (node.included) {
              if (resolution instanceof Module) {
                const chunk = this.chunkByModule.get(resolution);
                if (chunk === this) {
                  node.setInternalResolution(resolution.namespace);
                } else {
                  node.setExternalResolution(((_a = this.facadeChunkByModule.get(resolution)) === null || _a === void 0 ? void 0 : _a.exportMode) || chunk.exportMode, resolution, this.outputOptions, this.pluginDriver, accessedGlobalsByScope);
                }
              } else {
                node.setExternalResolution("external", resolution, this.outputOptions, this.pluginDriver, accessedGlobalsByScope);
              }
            }
          }
          for (const importMeta of module2.importMetas) {
            importMeta.addAccessedGlobals(this.outputOptions.format, accessedGlobalsByScope);
          }
        }
      }
      setExternalRenderPaths(options, inputBase) {
        for (const dependency of [...this.dependencies, ...this.dynamicDependencies]) {
          if (dependency instanceof ExternalModule) {
            dependency.setRenderPath(options, inputBase);
          }
        }
      }
      setIdentifierRenderResolutions({ format, interop, namespaceToStringTag }) {
        const syntheticExports = new Set();
        for (const exportName of this.getExportNames()) {
          const exportVariable = this.exportsByName[exportName];
          if (exportVariable instanceof ExportShimVariable) {
            this.needsExportsShim = true;
          }
          if (format !== "es" && format !== "system" && exportVariable.isReassigned && !exportVariable.isId) {
            exportVariable.setRenderNames("exports", exportName);
          } else if (exportVariable instanceof SyntheticNamedExportVariable) {
            syntheticExports.add(exportVariable);
          } else {
            exportVariable.setRenderNames(null, null);
          }
        }
        const usedNames = new Set(["Object", "Promise"]);
        if (this.needsExportsShim) {
          usedNames.add(MISSING_EXPORT_SHIM_VARIABLE);
        }
        if (namespaceToStringTag) {
          usedNames.add("Symbol");
        }
        switch (format) {
          case "system":
            usedNames.add("module").add("exports");
            break;
          case "es":
            break;
          case "cjs":
            usedNames.add("module").add("require").add("__filename").add("__dirname");
          default:
            usedNames.add("exports");
            for (const helper of HELPER_NAMES) {
              usedNames.add(helper);
            }
        }
        deconflictChunk(this.orderedModules, this.getDependenciesToBeDeconflicted(format !== "es" && format !== "system", format === "amd" || format === "umd" || format === "iife", interop), this.imports, usedNames, format, interop, this.outputOptions.preserveModules, this.outputOptions.externalLiveBindings, this.chunkByModule, syntheticExports, this.exportNamesByVariable, this.accessedGlobalsByScope, this.includedNamespaces);
      }
      setUpChunkImportsAndExportsForModule(module2) {
        const moduleImports = new Set(module2.imports);
        if (!this.outputOptions.preserveModules) {
          if (this.includedNamespaces.has(module2)) {
            const memberVariables = module2.namespace.getMemberVariables();
            for (const variable of Object.values(memberVariables)) {
              moduleImports.add(variable);
            }
          }
        }
        for (let variable of moduleImports) {
          if (variable instanceof ExportDefaultVariable) {
            variable = variable.getOriginalVariable();
          }
          if (variable instanceof SyntheticNamedExportVariable) {
            variable = variable.getBaseVariable();
          }
          const chunk = this.chunkByModule.get(variable.module);
          if (chunk !== this) {
            this.imports.add(variable);
            if (!(variable instanceof NamespaceVariable && this.outputOptions.preserveModules) && variable.module instanceof Module) {
              chunk.exports.add(variable);
              this.checkCircularDependencyImport(variable, module2);
            }
          }
        }
        if (this.includedNamespaces.has(module2) || module2.info.isEntry && module2.preserveSignature !== false || module2.includedDynamicImporters.some((importer) => this.chunkByModule.get(importer) !== this)) {
          this.ensureReexportsAreAvailableForModule(module2);
        }
        for (const { node, resolution } of module2.dynamicImports) {
          if (node.included && resolution instanceof Module && this.chunkByModule.get(resolution) === this && !this.includedNamespaces.has(resolution)) {
            this.includedNamespaces.add(resolution);
            this.ensureReexportsAreAvailableForModule(resolution);
          }
        }
      }
    };
    (function(BuildPhase2) {
      BuildPhase2[BuildPhase2["LOAD_AND_PARSE"] = 0] = "LOAD_AND_PARSE";
      BuildPhase2[BuildPhase2["ANALYSE"] = 1] = "ANALYSE";
      BuildPhase2[BuildPhase2["GENERATE"] = 2] = "GENERATE";
    })(BuildPhase || (BuildPhase = {}));
    FILE_PLACEHOLDER = {
      type: "placeholder"
    };
    FileEmitter = class {
      constructor(graph, options, baseFileEmitter) {
        this.graph = graph;
        this.options = options;
        this.bundle = null;
        this.facadeChunkByModule = null;
        this.outputOptions = null;
        this.assertAssetsFinalized = () => {
          for (const [referenceId, emittedFile] of this.filesByReferenceId.entries()) {
            if (emittedFile.type === "asset" && typeof emittedFile.fileName !== "string")
              return error(errNoAssetSourceSet(emittedFile.name || referenceId));
          }
        };
        this.emitFile = (emittedFile) => {
          if (!hasValidType(emittedFile)) {
            return error(errFailedValidation(`Emitted files must be of type "asset" or "chunk", received "${emittedFile && emittedFile.type}".`));
          }
          if (!hasValidName(emittedFile)) {
            return error(errFailedValidation(`The "fileName" or "name" properties of emitted files must be strings that are neither absolute nor relative paths, received "${emittedFile.fileName || emittedFile.name}".`));
          }
          if (emittedFile.type === "chunk") {
            return this.emitChunk(emittedFile);
          } else {
            return this.emitAsset(emittedFile);
          }
        };
        this.getFileName = (fileReferenceId) => {
          const emittedFile = this.filesByReferenceId.get(fileReferenceId);
          if (!emittedFile)
            return error(errFileReferenceIdNotFoundForFilename(fileReferenceId));
          if (emittedFile.type === "chunk") {
            return getChunkFileName(emittedFile, this.facadeChunkByModule);
          } else {
            return getAssetFileName(emittedFile, fileReferenceId);
          }
        };
        this.setAssetSource = (referenceId, requestedSource) => {
          const consumedFile = this.filesByReferenceId.get(referenceId);
          if (!consumedFile)
            return error(errAssetReferenceIdNotFoundForSetSource(referenceId));
          if (consumedFile.type !== "asset") {
            return error(errFailedValidation(`Asset sources can only be set for emitted assets but "${referenceId}" is an emitted chunk.`));
          }
          if (consumedFile.source !== void 0) {
            return error(errAssetSourceAlreadySet(consumedFile.name || referenceId));
          }
          const source = getValidSource(requestedSource, consumedFile, referenceId);
          if (this.bundle) {
            this.finalizeAsset(consumedFile, source, referenceId, this.bundle);
          } else {
            consumedFile.source = source;
          }
        };
        this.setOutputBundle = (outputBundle, outputOptions, facadeChunkByModule) => {
          this.outputOptions = outputOptions;
          this.bundle = outputBundle;
          this.facadeChunkByModule = facadeChunkByModule;
          for (const emittedFile of this.filesByReferenceId.values()) {
            if (emittedFile.fileName) {
              reserveFileNameInBundle(emittedFile.fileName, this.bundle, this.options.onwarn);
            }
          }
          for (const [referenceId, consumedFile] of this.filesByReferenceId.entries()) {
            if (consumedFile.type === "asset" && consumedFile.source !== void 0) {
              this.finalizeAsset(consumedFile, consumedFile.source, referenceId, this.bundle);
            }
          }
        };
        this.filesByReferenceId = baseFileEmitter ? new Map(baseFileEmitter.filesByReferenceId) : new Map();
      }
      assignReferenceId(file, idBase) {
        let referenceId;
        do {
          const hash = createHash();
          if (referenceId) {
            hash.update(referenceId);
          } else {
            hash.update(idBase);
          }
          referenceId = hash.digest("hex").substr(0, 8);
        } while (this.filesByReferenceId.has(referenceId));
        this.filesByReferenceId.set(referenceId, file);
        return referenceId;
      }
      emitAsset(emittedAsset) {
        const source = typeof emittedAsset.source !== "undefined" ? getValidSource(emittedAsset.source, emittedAsset, null) : void 0;
        const consumedAsset = {
          fileName: emittedAsset.fileName,
          name: emittedAsset.name,
          source,
          type: "asset"
        };
        const referenceId = this.assignReferenceId(consumedAsset, emittedAsset.fileName || emittedAsset.name || emittedAsset.type);
        if (this.bundle) {
          if (emittedAsset.fileName) {
            reserveFileNameInBundle(emittedAsset.fileName, this.bundle, this.options.onwarn);
          }
          if (source !== void 0) {
            this.finalizeAsset(consumedAsset, source, referenceId, this.bundle);
          }
        }
        return referenceId;
      }
      emitChunk(emittedChunk) {
        if (this.graph.phase > BuildPhase.LOAD_AND_PARSE) {
          return error(errInvalidRollupPhaseForChunkEmission());
        }
        if (typeof emittedChunk.id !== "string") {
          return error(errFailedValidation(`Emitted chunks need to have a valid string id, received "${emittedChunk.id}"`));
        }
        const consumedChunk = {
          fileName: emittedChunk.fileName,
          module: null,
          name: emittedChunk.name || emittedChunk.id,
          type: "chunk"
        };
        this.graph.moduleLoader.emitChunk(emittedChunk).then((module2) => consumedChunk.module = module2).catch(() => {
        });
        return this.assignReferenceId(consumedChunk, emittedChunk.id);
      }
      finalizeAsset(consumedFile, source, referenceId, bundle) {
        const fileName = consumedFile.fileName || findExistingAssetFileNameWithSource(bundle, source) || generateAssetFileName(consumedFile.name, source, this.outputOptions, bundle);
        const assetWithFileName = __spreadProps(__spreadValues({}, consumedFile), { fileName, source });
        this.filesByReferenceId.set(referenceId, assetWithFileName);
        const { options } = this;
        bundle[fileName] = {
          fileName,
          get isAsset() {
            warnDeprecation(`Accessing "isAsset" on files in the bundle is deprecated, please use "type === 'asset'" instead`, true, options);
            return true;
          },
          name: consumedFile.name,
          source,
          type: "asset"
        };
      }
    };
    concatSep = (out, next) => next ? `${out}
${next}` : out;
    concatDblSep = (out, next) => next ? `${out}

${next}` : out;
    compareExecIndex = (unitA, unitB) => unitA.execIndex > unitB.execIndex ? 1 : -1;
    Bundle2 = class {
      constructor(outputOptions, unsetOptions, inputOptions, pluginDriver, graph) {
        this.outputOptions = outputOptions;
        this.unsetOptions = unsetOptions;
        this.inputOptions = inputOptions;
        this.pluginDriver = pluginDriver;
        this.graph = graph;
        this.facadeChunkByModule = new Map();
        this.includedNamespaces = new Set();
      }
      async generate(isWrite) {
        timeStart("GENERATE", 1);
        const outputBundle = Object.create(null);
        this.pluginDriver.setOutputBundle(outputBundle, this.outputOptions, this.facadeChunkByModule);
        try {
          await this.pluginDriver.hookParallel("renderStart", [this.outputOptions, this.inputOptions]);
          timeStart("generate chunks", 2);
          const chunks = await this.generateChunks();
          if (chunks.length > 1) {
            validateOptionsForMultiChunkOutput(this.outputOptions, this.inputOptions.onwarn);
          }
          const inputBase = commondir(getAbsoluteEntryModulePaths(chunks));
          timeEnd("generate chunks", 2);
          timeStart("render modules", 2);
          const addons = await createAddons(this.outputOptions, this.pluginDriver);
          this.prerenderChunks(chunks, inputBase);
          timeEnd("render modules", 2);
          await this.addFinalizedChunksToBundle(chunks, inputBase, addons, outputBundle);
        } catch (error2) {
          await this.pluginDriver.hookParallel("renderError", [error2]);
          throw error2;
        }
        await this.pluginDriver.hookSeq("generateBundle", [
          this.outputOptions,
          outputBundle,
          isWrite
        ]);
        this.finaliseAssets(outputBundle);
        timeEnd("GENERATE", 1);
        return outputBundle;
      }
      async addFinalizedChunksToBundle(chunks, inputBase, addons, outputBundle) {
        this.assignChunkIds(chunks, inputBase, addons, outputBundle);
        for (const chunk of chunks) {
          outputBundle[chunk.id] = chunk.getChunkInfoWithFileNames();
        }
        await Promise.all(chunks.map(async (chunk) => {
          const outputChunk = outputBundle[chunk.id];
          Object.assign(outputChunk, await chunk.render(this.outputOptions, addons, outputChunk));
        }));
      }
      async addManualChunks(manualChunks) {
        const manualChunkAliasByEntry = new Map();
        const chunkEntries = await Promise.all(Object.entries(manualChunks).map(async ([alias, files]) => ({
          alias,
          entries: await this.graph.moduleLoader.addAdditionalModules(files)
        })));
        for (const { alias, entries } of chunkEntries) {
          for (const entry of entries) {
            addModuleToManualChunk(alias, entry, manualChunkAliasByEntry);
          }
        }
        return manualChunkAliasByEntry;
      }
      assignChunkIds(chunks, inputBase, addons, bundle) {
        const entryChunks = [];
        const otherChunks = [];
        for (const chunk of chunks) {
          (chunk.facadeModule && chunk.facadeModule.isUserDefinedEntryPoint ? entryChunks : otherChunks).push(chunk);
        }
        const chunksForNaming = entryChunks.concat(otherChunks);
        for (const chunk of chunksForNaming) {
          if (this.outputOptions.file) {
            chunk.id = (0, import_path.basename)(this.outputOptions.file);
          } else if (this.outputOptions.preserveModules) {
            chunk.id = chunk.generateIdPreserveModules(inputBase, this.outputOptions, bundle, this.unsetOptions);
          } else {
            chunk.id = chunk.generateId(addons, this.outputOptions, bundle, true);
          }
          bundle[chunk.id] = FILE_PLACEHOLDER;
        }
      }
      assignManualChunks(getManualChunk) {
        const manualChunkAliasByEntry = new Map();
        const manualChunksApi = {
          getModuleIds: () => this.graph.modulesById.keys(),
          getModuleInfo: this.graph.getModuleInfo
        };
        for (const module2 of this.graph.modulesById.values()) {
          if (module2 instanceof Module) {
            const manualChunkAlias = getManualChunk(module2.id, manualChunksApi);
            if (typeof manualChunkAlias === "string") {
              addModuleToManualChunk(manualChunkAlias, module2, manualChunkAliasByEntry);
            }
          }
        }
        return manualChunkAliasByEntry;
      }
      finaliseAssets(outputBundle) {
        for (const file of Object.values(outputBundle)) {
          if (!file.type) {
            warnDeprecation('A plugin is directly adding properties to the bundle object in the "generateBundle" hook. This is deprecated and will be removed in a future Rollup version, please use "this.emitFile" instead.', true, this.inputOptions);
            file.type = "asset";
          }
          if (this.outputOptions.validate && typeof file.code == "string") {
            try {
              this.graph.contextParse(file.code, {
                allowHashBang: true,
                ecmaVersion: "latest"
              });
            } catch (exception) {
              this.inputOptions.onwarn(errChunkInvalid(file, exception));
            }
          }
        }
        this.pluginDriver.finaliseAssets();
      }
      async generateChunks() {
        const { manualChunks } = this.outputOptions;
        const manualChunkAliasByEntry = typeof manualChunks === "object" ? await this.addManualChunks(manualChunks) : this.assignManualChunks(manualChunks);
        const chunks = [];
        const chunkByModule = new Map();
        for (const { alias, modules } of this.outputOptions.inlineDynamicImports ? [{ alias: null, modules: getIncludedModules(this.graph.modulesById) }] : this.outputOptions.preserveModules ? getIncludedModules(this.graph.modulesById).map((module2) => ({
          alias: null,
          modules: [module2]
        })) : getChunkAssignments(this.graph.entryModules, manualChunkAliasByEntry)) {
          sortByExecutionOrder(modules);
          const chunk = new Chunk2(modules, this.inputOptions, this.outputOptions, this.unsetOptions, this.pluginDriver, this.graph.modulesById, chunkByModule, this.facadeChunkByModule, this.includedNamespaces, alias);
          chunks.push(chunk);
          for (const module2 of modules) {
            chunkByModule.set(module2, chunk);
          }
        }
        for (const chunk of chunks) {
          chunk.link();
        }
        const facades = [];
        for (const chunk of chunks) {
          facades.push(...chunk.generateFacades());
        }
        return [...chunks, ...facades];
      }
      prerenderChunks(chunks, inputBase) {
        for (const chunk of chunks) {
          chunk.generateExports();
        }
        for (const chunk of chunks) {
          chunk.preRender(this.outputOptions, inputBase);
        }
      }
    };
    reservedWords = {
      3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
      5: "class enum extends super const export import",
      6: "enum",
      strict: "implements interface let package private protected public static yield",
      strictBind: "eval arguments"
    };
    ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";
    keywords = {
      5: ecma5AndLessKeywords,
      "5module": ecma5AndLessKeywords + " export import",
      6: ecma5AndLessKeywords + " const class extends export import super"
    };
    keywordRelationalOperator = /^in(stanceof)?$/;
    nonASCIIidentifierStartChars = "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC";
    nonASCIIidentifierChars = "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF\u1AC0\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F";
    nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
    nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");
    nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;
    astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 14, 29, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 19, 35, 5, 35, 5, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 66, 18, 2, 1, 11, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 28, 43, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 56, 50, 14, 50, 14, 35, 349, 41, 7, 1, 79, 28, 11, 0, 9, 21, 107, 20, 28, 22, 13, 52, 76, 44, 33, 24, 27, 35, 30, 0, 3, 0, 9, 34, 4, 0, 13, 47, 15, 3, 22, 0, 2, 0, 36, 17, 2, 24, 85, 6, 2, 0, 2, 3, 2, 14, 2, 9, 8, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 19, 0, 13, 4, 159, 52, 19, 3, 21, 2, 31, 47, 21, 1, 2, 0, 185, 46, 42, 3, 37, 47, 21, 0, 60, 42, 14, 0, 72, 26, 230, 43, 117, 63, 32, 7, 3, 0, 3, 7, 2, 1, 2, 23, 16, 0, 2, 0, 95, 7, 3, 38, 17, 0, 2, 0, 29, 0, 11, 39, 8, 0, 22, 0, 12, 45, 20, 0, 35, 56, 264, 8, 2, 36, 18, 0, 50, 29, 113, 6, 2, 1, 2, 37, 22, 0, 26, 5, 2, 1, 2, 31, 15, 0, 328, 18, 190, 0, 80, 921, 103, 110, 18, 195, 2749, 1070, 4050, 582, 8634, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 689, 63, 129, 74, 6, 0, 67, 12, 65, 1, 2, 0, 29, 6135, 9, 1237, 43, 8, 8952, 286, 50, 2, 18, 3, 9, 395, 2309, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 2357, 44, 11, 6, 17, 0, 370, 43, 1301, 196, 60, 67, 8, 0, 1205, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42717, 35, 4148, 12, 221, 3, 5761, 15, 7472, 3104, 541, 1507, 4938];
    astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 574, 3, 9, 9, 370, 1, 154, 10, 176, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 6, 1, 45, 0, 13, 2, 49, 13, 9, 3, 2, 11, 83, 11, 7, 0, 161, 11, 6, 9, 7, 3, 56, 1, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 193, 17, 10, 9, 5, 0, 82, 19, 13, 9, 214, 6, 3, 8, 28, 1, 83, 16, 16, 9, 82, 12, 9, 9, 84, 14, 5, 9, 243, 14, 166, 9, 71, 5, 2, 1, 3, 3, 2, 0, 2, 1, 13, 9, 120, 6, 3, 6, 4, 0, 29, 9, 41, 6, 2, 3, 9, 0, 10, 10, 47, 15, 406, 7, 2, 7, 17, 9, 57, 21, 2, 13, 123, 5, 4, 0, 2, 1, 2, 6, 2, 0, 9, 9, 49, 4, 2, 1, 2, 4, 9, 9, 330, 3, 19306, 9, 135, 4, 60, 6, 26, 9, 1014, 0, 2, 54, 8, 3, 82, 0, 12, 1, 19628, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 513, 54, 5, 49, 9, 0, 15, 0, 23, 4, 2, 14, 1361, 6, 2, 16, 3, 6, 2, 1, 2, 4, 262, 6, 10, 9, 419, 13, 1495, 6, 110, 6, 6, 9, 4759, 9, 787719, 239];
    TokenType = function TokenType2(label, conf) {
      if (conf === void 0)
        conf = {};
      this.label = label;
      this.keyword = conf.keyword;
      this.beforeExpr = !!conf.beforeExpr;
      this.startsExpr = !!conf.startsExpr;
      this.isLoop = !!conf.isLoop;
      this.isAssign = !!conf.isAssign;
      this.prefix = !!conf.prefix;
      this.postfix = !!conf.postfix;
      this.binop = conf.binop || null;
      this.updateContext = null;
    };
    beforeExpr = { beforeExpr: true };
    startsExpr = { startsExpr: true };
    keywords$1 = {};
    types = {
      num: new TokenType("num", startsExpr),
      regexp: new TokenType("regexp", startsExpr),
      string: new TokenType("string", startsExpr),
      name: new TokenType("name", startsExpr),
      privateId: new TokenType("privateId", startsExpr),
      eof: new TokenType("eof"),
      bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
      bracketR: new TokenType("]"),
      braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
      braceR: new TokenType("}"),
      parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
      parenR: new TokenType(")"),
      comma: new TokenType(",", beforeExpr),
      semi: new TokenType(";", beforeExpr),
      colon: new TokenType(":", beforeExpr),
      dot: new TokenType("."),
      question: new TokenType("?", beforeExpr),
      questionDot: new TokenType("?."),
      arrow: new TokenType("=>", beforeExpr),
      template: new TokenType("template"),
      invalidTemplate: new TokenType("invalidTemplate"),
      ellipsis: new TokenType("...", beforeExpr),
      backQuote: new TokenType("`", startsExpr),
      dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),
      eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
      assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
      incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
      prefix: new TokenType("!/~", { beforeExpr: true, prefix: true, startsExpr: true }),
      logicalOR: binop("||", 1),
      logicalAND: binop("&&", 2),
      bitwiseOR: binop("|", 3),
      bitwiseXOR: binop("^", 4),
      bitwiseAND: binop("&", 5),
      equality: binop("==/!=/===/!==", 6),
      relational: binop("</>/<=/>=", 7),
      bitShift: binop("<</>>/>>>", 8),
      plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
      modulo: binop("%", 10),
      star: binop("*", 10),
      slash: binop("/", 10),
      starstar: new TokenType("**", { beforeExpr: true }),
      coalesce: binop("??", 1),
      _break: kw("break"),
      _case: kw("case", beforeExpr),
      _catch: kw("catch"),
      _continue: kw("continue"),
      _debugger: kw("debugger"),
      _default: kw("default", beforeExpr),
      _do: kw("do", { isLoop: true, beforeExpr: true }),
      _else: kw("else", beforeExpr),
      _finally: kw("finally"),
      _for: kw("for", { isLoop: true }),
      _function: kw("function", startsExpr),
      _if: kw("if"),
      _return: kw("return", beforeExpr),
      _switch: kw("switch"),
      _throw: kw("throw", beforeExpr),
      _try: kw("try"),
      _var: kw("var"),
      _const: kw("const"),
      _while: kw("while", { isLoop: true }),
      _with: kw("with"),
      _new: kw("new", { beforeExpr: true, startsExpr: true }),
      _this: kw("this", startsExpr),
      _super: kw("super", startsExpr),
      _class: kw("class", startsExpr),
      _extends: kw("extends", beforeExpr),
      _export: kw("export"),
      _import: kw("import", startsExpr),
      _null: kw("null", startsExpr),
      _true: kw("true", startsExpr),
      _false: kw("false", startsExpr),
      _in: kw("in", { beforeExpr: true, binop: 7 }),
      _instanceof: kw("instanceof", { beforeExpr: true, binop: 7 }),
      _typeof: kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true }),
      _void: kw("void", { beforeExpr: true, prefix: true, startsExpr: true }),
      _delete: kw("delete", { beforeExpr: true, prefix: true, startsExpr: true })
    };
    lineBreak = /\r\n?|\n|\u2028|\u2029/;
    lineBreakG = new RegExp(lineBreak.source, "g");
    nonASCIIwhitespace = /[\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
    skipWhiteSpace = /(?:\s|\/\/.*|\/\*[^]*?\*\/)*/g;
    ref = Object.prototype;
    hasOwnProperty = ref.hasOwnProperty;
    toString5 = ref.toString;
    isArray = Array.isArray || function(obj) {
      return toString5.call(obj) === "[object Array]";
    };
    Position = function Position2(line, col) {
      this.line = line;
      this.column = col;
    };
    Position.prototype.offset = function offset(n2) {
      return new Position(this.line, this.column + n2);
    };
    SourceLocation = function SourceLocation2(p, start, end) {
      this.start = start;
      this.end = end;
      if (p.sourceFile !== null) {
        this.source = p.sourceFile;
      }
    };
    defaultOptions = {
      ecmaVersion: null,
      sourceType: "script",
      onInsertedSemicolon: null,
      onTrailingComma: null,
      allowReserved: null,
      allowReturnOutsideFunction: false,
      allowImportExportEverywhere: false,
      allowAwaitOutsideFunction: null,
      allowSuperOutsideMethod: null,
      allowHashBang: false,
      locations: false,
      onToken: null,
      onComment: null,
      ranges: false,
      program: null,
      sourceFile: null,
      directSourceFile: null,
      preserveParens: false
    };
    warnedAboutEcmaVersion = false;
    SCOPE_TOP = 1;
    SCOPE_FUNCTION = 2;
    SCOPE_VAR = SCOPE_TOP | SCOPE_FUNCTION;
    SCOPE_ASYNC = 4;
    SCOPE_GENERATOR = 8;
    SCOPE_ARROW = 16;
    SCOPE_SIMPLE_CATCH = 32;
    SCOPE_SUPER = 64;
    SCOPE_DIRECT_SUPER = 128;
    BIND_NONE = 0;
    BIND_VAR = 1;
    BIND_LEXICAL = 2;
    BIND_FUNCTION = 3;
    BIND_SIMPLE_CATCH = 4;
    BIND_OUTSIDE = 5;
    Parser = function Parser2(options, input, startPos) {
      this.options = options = getOptions(options);
      this.sourceFile = options.sourceFile;
      this.keywords = wordsRegexp(keywords[options.ecmaVersion >= 6 ? 6 : options.sourceType === "module" ? "5module" : 5]);
      var reserved = "";
      if (options.allowReserved !== true) {
        reserved = reservedWords[options.ecmaVersion >= 6 ? 6 : options.ecmaVersion === 5 ? 5 : 3];
        if (options.sourceType === "module") {
          reserved += " await";
        }
      }
      this.reservedWords = wordsRegexp(reserved);
      var reservedStrict = (reserved ? reserved + " " : "") + reservedWords.strict;
      this.reservedWordsStrict = wordsRegexp(reservedStrict);
      this.reservedWordsStrictBind = wordsRegexp(reservedStrict + " " + reservedWords.strictBind);
      this.input = String(input);
      this.containsEsc = false;
      if (startPos) {
        this.pos = startPos;
        this.lineStart = this.input.lastIndexOf("\n", startPos - 1) + 1;
        this.curLine = this.input.slice(0, this.lineStart).split(lineBreak).length;
      } else {
        this.pos = this.lineStart = 0;
        this.curLine = 1;
      }
      this.type = types.eof;
      this.value = null;
      this.start = this.end = this.pos;
      this.startLoc = this.endLoc = this.curPosition();
      this.lastTokEndLoc = this.lastTokStartLoc = null;
      this.lastTokStart = this.lastTokEnd = this.pos;
      this.context = this.initialContext();
      this.exprAllowed = true;
      this.inModule = options.sourceType === "module";
      this.strict = this.inModule || this.strictDirective(this.pos);
      this.potentialArrowAt = -1;
      this.potentialArrowInForAwait = false;
      this.yieldPos = this.awaitPos = this.awaitIdentPos = 0;
      this.labels = [];
      this.undefinedExports = Object.create(null);
      if (this.pos === 0 && options.allowHashBang && this.input.slice(0, 2) === "#!") {
        this.skipLineComment(2);
      }
      this.scopeStack = [];
      this.enterScope(SCOPE_TOP);
      this.regexpState = null;
      this.privateNameStack = [];
    };
    prototypeAccessors = { inFunction: { configurable: true }, inGenerator: { configurable: true }, inAsync: { configurable: true }, allowSuper: { configurable: true }, allowDirectSuper: { configurable: true }, treatFunctionsAsVar: { configurable: true }, inNonArrowFunction: { configurable: true } };
    Parser.prototype.parse = function parse() {
      var node = this.options.program || this.startNode();
      this.nextToken();
      return this.parseTopLevel(node);
    };
    prototypeAccessors.inFunction.get = function() {
      return (this.currentVarScope().flags & SCOPE_FUNCTION) > 0;
    };
    prototypeAccessors.inGenerator.get = function() {
      return (this.currentVarScope().flags & SCOPE_GENERATOR) > 0 && !this.currentVarScope().inClassFieldInit;
    };
    prototypeAccessors.inAsync.get = function() {
      return (this.currentVarScope().flags & SCOPE_ASYNC) > 0 && !this.currentVarScope().inClassFieldInit;
    };
    prototypeAccessors.allowSuper.get = function() {
      var ref2 = this.currentThisScope();
      var flags = ref2.flags;
      var inClassFieldInit = ref2.inClassFieldInit;
      return (flags & SCOPE_SUPER) > 0 || inClassFieldInit || this.options.allowSuperOutsideMethod;
    };
    prototypeAccessors.allowDirectSuper.get = function() {
      return (this.currentThisScope().flags & SCOPE_DIRECT_SUPER) > 0;
    };
    prototypeAccessors.treatFunctionsAsVar.get = function() {
      return this.treatFunctionsAsVarInScope(this.currentScope());
    };
    prototypeAccessors.inNonArrowFunction.get = function() {
      var ref2 = this.currentThisScope();
      var flags = ref2.flags;
      var inClassFieldInit = ref2.inClassFieldInit;
      return (flags & SCOPE_FUNCTION) > 0 || inClassFieldInit;
    };
    Parser.extend = function extend() {
      var plugins = [], len = arguments.length;
      while (len--)
        plugins[len] = arguments[len];
      var cls = this;
      for (var i = 0; i < plugins.length; i++) {
        cls = plugins[i](cls);
      }
      return cls;
    };
    Parser.parse = function parse2(input, options) {
      return new this(options, input).parse();
    };
    Parser.parseExpressionAt = function parseExpressionAt(input, pos, options) {
      var parser = new this(options, input, pos);
      parser.nextToken();
      return parser.parseExpression();
    };
    Parser.tokenizer = function tokenizer(input, options) {
      return new this(options, input);
    };
    Object.defineProperties(Parser.prototype, prototypeAccessors);
    pp = Parser.prototype;
    literal = /^(?:'((?:\\.|[^'\\])*?)'|"((?:\\.|[^"\\])*?)")/;
    pp.strictDirective = function(start) {
      for (; ; ) {
        skipWhiteSpace.lastIndex = start;
        start += skipWhiteSpace.exec(this.input)[0].length;
        var match = literal.exec(this.input.slice(start));
        if (!match) {
          return false;
        }
        if ((match[1] || match[2]) === "use strict") {
          skipWhiteSpace.lastIndex = start + match[0].length;
          var spaceAfter = skipWhiteSpace.exec(this.input), end = spaceAfter.index + spaceAfter[0].length;
          var next = this.input.charAt(end);
          return next === ";" || next === "}" || lineBreak.test(spaceAfter[0]) && !(/[(`.[+\-/*%<>=,?^&]/.test(next) || next === "!" && this.input.charAt(end + 1) === "=");
        }
        start += match[0].length;
        skipWhiteSpace.lastIndex = start;
        start += skipWhiteSpace.exec(this.input)[0].length;
        if (this.input[start] === ";") {
          start++;
        }
      }
    };
    pp.eat = function(type) {
      if (this.type === type) {
        this.next();
        return true;
      } else {
        return false;
      }
    };
    pp.isContextual = function(name) {
      return this.type === types.name && this.value === name && !this.containsEsc;
    };
    pp.eatContextual = function(name) {
      if (!this.isContextual(name)) {
        return false;
      }
      this.next();
      return true;
    };
    pp.expectContextual = function(name) {
      if (!this.eatContextual(name)) {
        this.unexpected();
      }
    };
    pp.canInsertSemicolon = function() {
      return this.type === types.eof || this.type === types.braceR || lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
    };
    pp.insertSemicolon = function() {
      if (this.canInsertSemicolon()) {
        if (this.options.onInsertedSemicolon) {
          this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
        }
        return true;
      }
    };
    pp.semicolon = function() {
      if (!this.eat(types.semi) && !this.insertSemicolon()) {
        this.unexpected();
      }
    };
    pp.afterTrailingComma = function(tokType, notNext) {
      if (this.type === tokType) {
        if (this.options.onTrailingComma) {
          this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
        }
        if (!notNext) {
          this.next();
        }
        return true;
      }
    };
    pp.expect = function(type) {
      this.eat(type) || this.unexpected();
    };
    pp.unexpected = function(pos) {
      this.raise(pos != null ? pos : this.start, "Unexpected token");
    };
    pp.checkPatternErrors = function(refDestructuringErrors, isAssign) {
      if (!refDestructuringErrors) {
        return;
      }
      if (refDestructuringErrors.trailingComma > -1) {
        this.raiseRecoverable(refDestructuringErrors.trailingComma, "Comma is not permitted after the rest element");
      }
      var parens = isAssign ? refDestructuringErrors.parenthesizedAssign : refDestructuringErrors.parenthesizedBind;
      if (parens > -1) {
        this.raiseRecoverable(parens, "Parenthesized pattern");
      }
    };
    pp.checkExpressionErrors = function(refDestructuringErrors, andThrow) {
      if (!refDestructuringErrors) {
        return false;
      }
      var shorthandAssign = refDestructuringErrors.shorthandAssign;
      var doubleProto = refDestructuringErrors.doubleProto;
      if (!andThrow) {
        return shorthandAssign >= 0 || doubleProto >= 0;
      }
      if (shorthandAssign >= 0) {
        this.raise(shorthandAssign, "Shorthand property assignments are valid only in destructuring patterns");
      }
      if (doubleProto >= 0) {
        this.raiseRecoverable(doubleProto, "Redefinition of __proto__ property");
      }
    };
    pp.checkYieldAwaitInDefaultParams = function() {
      if (this.yieldPos && (!this.awaitPos || this.yieldPos < this.awaitPos)) {
        this.raise(this.yieldPos, "Yield expression cannot be a default value");
      }
      if (this.awaitPos) {
        this.raise(this.awaitPos, "Await expression cannot be a default value");
      }
    };
    pp.isSimpleAssignTarget = function(expr) {
      if (expr.type === "ParenthesizedExpression") {
        return this.isSimpleAssignTarget(expr.expression);
      }
      return expr.type === "Identifier" || expr.type === "MemberExpression";
    };
    pp$1 = Parser.prototype;
    pp$1.parseTopLevel = function(node) {
      var exports = Object.create(null);
      if (!node.body) {
        node.body = [];
      }
      while (this.type !== types.eof) {
        var stmt = this.parseStatement(null, true, exports);
        node.body.push(stmt);
      }
      if (this.inModule) {
        for (var i = 0, list = Object.keys(this.undefinedExports); i < list.length; i += 1) {
          var name = list[i];
          this.raiseRecoverable(this.undefinedExports[name].start, "Export '" + name + "' is not defined");
        }
      }
      this.adaptDirectivePrologue(node.body);
      this.next();
      node.sourceType = this.options.sourceType;
      return this.finishNode(node, "Program");
    };
    loopLabel = { kind: "loop" };
    switchLabel = { kind: "switch" };
    pp$1.isLet = function(context) {
      if (this.options.ecmaVersion < 6 || !this.isContextual("let")) {
        return false;
      }
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input);
      var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
      if (nextCh === 91 || nextCh === 92 || nextCh > 55295 && nextCh < 56320) {
        return true;
      }
      if (context) {
        return false;
      }
      if (nextCh === 123) {
        return true;
      }
      if (isIdentifierStart(nextCh, true)) {
        var pos = next + 1;
        while (isIdentifierChar(nextCh = this.input.charCodeAt(pos), true)) {
          ++pos;
        }
        if (nextCh === 92 || nextCh > 55295 && nextCh < 56320) {
          return true;
        }
        var ident = this.input.slice(next, pos);
        if (!keywordRelationalOperator.test(ident)) {
          return true;
        }
      }
      return false;
    };
    pp$1.isAsyncFunction = function() {
      if (this.options.ecmaVersion < 8 || !this.isContextual("async")) {
        return false;
      }
      skipWhiteSpace.lastIndex = this.pos;
      var skip = skipWhiteSpace.exec(this.input);
      var next = this.pos + skip[0].length, after;
      return !lineBreak.test(this.input.slice(this.pos, next)) && this.input.slice(next, next + 8) === "function" && (next + 8 === this.input.length || !(isIdentifierChar(after = this.input.charCodeAt(next + 8)) || after > 55295 && after < 56320));
    };
    pp$1.parseStatement = function(context, topLevel, exports) {
      var starttype = this.type, node = this.startNode(), kind;
      if (this.isLet(context)) {
        starttype = types._var;
        kind = "let";
      }
      switch (starttype) {
        case types._break:
        case types._continue:
          return this.parseBreakContinueStatement(node, starttype.keyword);
        case types._debugger:
          return this.parseDebuggerStatement(node);
        case types._do:
          return this.parseDoStatement(node);
        case types._for:
          return this.parseForStatement(node);
        case types._function:
          if (context && (this.strict || context !== "if" && context !== "label") && this.options.ecmaVersion >= 6) {
            this.unexpected();
          }
          return this.parseFunctionStatement(node, false, !context);
        case types._class:
          if (context) {
            this.unexpected();
          }
          return this.parseClass(node, true);
        case types._if:
          return this.parseIfStatement(node);
        case types._return:
          return this.parseReturnStatement(node);
        case types._switch:
          return this.parseSwitchStatement(node);
        case types._throw:
          return this.parseThrowStatement(node);
        case types._try:
          return this.parseTryStatement(node);
        case types._const:
        case types._var:
          kind = kind || this.value;
          if (context && kind !== "var") {
            this.unexpected();
          }
          return this.parseVarStatement(node, kind);
        case types._while:
          return this.parseWhileStatement(node);
        case types._with:
          return this.parseWithStatement(node);
        case types.braceL:
          return this.parseBlock(true, node);
        case types.semi:
          return this.parseEmptyStatement(node);
        case types._export:
        case types._import:
          if (this.options.ecmaVersion > 10 && starttype === types._import) {
            skipWhiteSpace.lastIndex = this.pos;
            var skip = skipWhiteSpace.exec(this.input);
            var next = this.pos + skip[0].length, nextCh = this.input.charCodeAt(next);
            if (nextCh === 40 || nextCh === 46) {
              return this.parseExpressionStatement(node, this.parseExpression());
            }
          }
          if (!this.options.allowImportExportEverywhere) {
            if (!topLevel) {
              this.raise(this.start, "'import' and 'export' may only appear at the top level");
            }
            if (!this.inModule) {
              this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
            }
          }
          return starttype === types._import ? this.parseImport(node) : this.parseExport(node, exports);
        default:
          if (this.isAsyncFunction()) {
            if (context) {
              this.unexpected();
            }
            this.next();
            return this.parseFunctionStatement(node, true, !context);
          }
          var maybeName = this.value, expr = this.parseExpression();
          if (starttype === types.name && expr.type === "Identifier" && this.eat(types.colon)) {
            return this.parseLabeledStatement(node, maybeName, expr, context);
          } else {
            return this.parseExpressionStatement(node, expr);
          }
      }
    };
    pp$1.parseBreakContinueStatement = function(node, keyword) {
      var isBreak = keyword === "break";
      this.next();
      if (this.eat(types.semi) || this.insertSemicolon()) {
        node.label = null;
      } else if (this.type !== types.name) {
        this.unexpected();
      } else {
        node.label = this.parseIdent();
        this.semicolon();
      }
      var i = 0;
      for (; i < this.labels.length; ++i) {
        var lab = this.labels[i];
        if (node.label == null || lab.name === node.label.name) {
          if (lab.kind != null && (isBreak || lab.kind === "loop")) {
            break;
          }
          if (node.label && isBreak) {
            break;
          }
        }
      }
      if (i === this.labels.length) {
        this.raise(node.start, "Unsyntactic " + keyword);
      }
      return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
    };
    pp$1.parseDebuggerStatement = function(node) {
      this.next();
      this.semicolon();
      return this.finishNode(node, "DebuggerStatement");
    };
    pp$1.parseDoStatement = function(node) {
      this.next();
      this.labels.push(loopLabel);
      node.body = this.parseStatement("do");
      this.labels.pop();
      this.expect(types._while);
      node.test = this.parseParenExpression();
      if (this.options.ecmaVersion >= 6) {
        this.eat(types.semi);
      } else {
        this.semicolon();
      }
      return this.finishNode(node, "DoWhileStatement");
    };
    pp$1.parseForStatement = function(node) {
      this.next();
      var awaitAt = this.options.ecmaVersion >= 9 && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction) && this.eatContextual("await") ? this.lastTokStart : -1;
      this.labels.push(loopLabel);
      this.enterScope(0);
      this.expect(types.parenL);
      if (this.type === types.semi) {
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }
        return this.parseFor(node, null);
      }
      var isLet = this.isLet();
      if (this.type === types._var || this.type === types._const || isLet) {
        var init$1 = this.startNode(), kind = isLet ? "let" : this.value;
        this.next();
        this.parseVar(init$1, true, kind);
        this.finishNode(init$1, "VariableDeclaration");
        if ((this.type === types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && init$1.declarations.length === 1) {
          if (this.options.ecmaVersion >= 9) {
            if (this.type === types._in) {
              if (awaitAt > -1) {
                this.unexpected(awaitAt);
              }
            } else {
              node.await = awaitAt > -1;
            }
          }
          return this.parseForIn(node, init$1);
        }
        if (awaitAt > -1) {
          this.unexpected(awaitAt);
        }
        return this.parseFor(node, init$1);
      }
      var refDestructuringErrors = new DestructuringErrors();
      var init = this.parseExpression(awaitAt > -1 ? "await" : true, refDestructuringErrors);
      if (this.type === types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) {
        if (this.options.ecmaVersion >= 9) {
          if (this.type === types._in) {
            if (awaitAt > -1) {
              this.unexpected(awaitAt);
            }
          } else {
            node.await = awaitAt > -1;
          }
        }
        this.toAssignable(init, false, refDestructuringErrors);
        this.checkLValPattern(init);
        return this.parseForIn(node, init);
      } else {
        this.checkExpressionErrors(refDestructuringErrors, true);
      }
      if (awaitAt > -1) {
        this.unexpected(awaitAt);
      }
      return this.parseFor(node, init);
    };
    pp$1.parseFunctionStatement = function(node, isAsync, declarationPosition) {
      this.next();
      return this.parseFunction(node, FUNC_STATEMENT | (declarationPosition ? 0 : FUNC_HANGING_STATEMENT), false, isAsync);
    };
    pp$1.parseIfStatement = function(node) {
      this.next();
      node.test = this.parseParenExpression();
      node.consequent = this.parseStatement("if");
      node.alternate = this.eat(types._else) ? this.parseStatement("if") : null;
      return this.finishNode(node, "IfStatement");
    };
    pp$1.parseReturnStatement = function(node) {
      if (!this.inFunction && !this.options.allowReturnOutsideFunction) {
        this.raise(this.start, "'return' outside of function");
      }
      this.next();
      if (this.eat(types.semi) || this.insertSemicolon()) {
        node.argument = null;
      } else {
        node.argument = this.parseExpression();
        this.semicolon();
      }
      return this.finishNode(node, "ReturnStatement");
    };
    pp$1.parseSwitchStatement = function(node) {
      this.next();
      node.discriminant = this.parseParenExpression();
      node.cases = [];
      this.expect(types.braceL);
      this.labels.push(switchLabel);
      this.enterScope(0);
      var cur;
      for (var sawDefault = false; this.type !== types.braceR; ) {
        if (this.type === types._case || this.type === types._default) {
          var isCase = this.type === types._case;
          if (cur) {
            this.finishNode(cur, "SwitchCase");
          }
          node.cases.push(cur = this.startNode());
          cur.consequent = [];
          this.next();
          if (isCase) {
            cur.test = this.parseExpression();
          } else {
            if (sawDefault) {
              this.raiseRecoverable(this.lastTokStart, "Multiple default clauses");
            }
            sawDefault = true;
            cur.test = null;
          }
          this.expect(types.colon);
        } else {
          if (!cur) {
            this.unexpected();
          }
          cur.consequent.push(this.parseStatement(null));
        }
      }
      this.exitScope();
      if (cur) {
        this.finishNode(cur, "SwitchCase");
      }
      this.next();
      this.labels.pop();
      return this.finishNode(node, "SwitchStatement");
    };
    pp$1.parseThrowStatement = function(node) {
      this.next();
      if (lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) {
        this.raise(this.lastTokEnd, "Illegal newline after throw");
      }
      node.argument = this.parseExpression();
      this.semicolon();
      return this.finishNode(node, "ThrowStatement");
    };
    empty = [];
    pp$1.parseTryStatement = function(node) {
      this.next();
      node.block = this.parseBlock();
      node.handler = null;
      if (this.type === types._catch) {
        var clause = this.startNode();
        this.next();
        if (this.eat(types.parenL)) {
          clause.param = this.parseBindingAtom();
          var simple = clause.param.type === "Identifier";
          this.enterScope(simple ? SCOPE_SIMPLE_CATCH : 0);
          this.checkLValPattern(clause.param, simple ? BIND_SIMPLE_CATCH : BIND_LEXICAL);
          this.expect(types.parenR);
        } else {
          if (this.options.ecmaVersion < 10) {
            this.unexpected();
          }
          clause.param = null;
          this.enterScope(0);
        }
        clause.body = this.parseBlock(false);
        this.exitScope();
        node.handler = this.finishNode(clause, "CatchClause");
      }
      node.finalizer = this.eat(types._finally) ? this.parseBlock() : null;
      if (!node.handler && !node.finalizer) {
        this.raise(node.start, "Missing catch or finally clause");
      }
      return this.finishNode(node, "TryStatement");
    };
    pp$1.parseVarStatement = function(node, kind) {
      this.next();
      this.parseVar(node, false, kind);
      this.semicolon();
      return this.finishNode(node, "VariableDeclaration");
    };
    pp$1.parseWhileStatement = function(node) {
      this.next();
      node.test = this.parseParenExpression();
      this.labels.push(loopLabel);
      node.body = this.parseStatement("while");
      this.labels.pop();
      return this.finishNode(node, "WhileStatement");
    };
    pp$1.parseWithStatement = function(node) {
      if (this.strict) {
        this.raise(this.start, "'with' in strict mode");
      }
      this.next();
      node.object = this.parseParenExpression();
      node.body = this.parseStatement("with");
      return this.finishNode(node, "WithStatement");
    };
    pp$1.parseEmptyStatement = function(node) {
      this.next();
      return this.finishNode(node, "EmptyStatement");
    };
    pp$1.parseLabeledStatement = function(node, maybeName, expr, context) {
      for (var i$1 = 0, list = this.labels; i$1 < list.length; i$1 += 1) {
        var label = list[i$1];
        if (label.name === maybeName) {
          this.raise(expr.start, "Label '" + maybeName + "' is already declared");
        }
      }
      var kind = this.type.isLoop ? "loop" : this.type === types._switch ? "switch" : null;
      for (var i = this.labels.length - 1; i >= 0; i--) {
        var label$1 = this.labels[i];
        if (label$1.statementStart === node.start) {
          label$1.statementStart = this.start;
          label$1.kind = kind;
        } else {
          break;
        }
      }
      this.labels.push({ name: maybeName, kind, statementStart: this.start });
      node.body = this.parseStatement(context ? context.indexOf("label") === -1 ? context + "label" : context : "label");
      this.labels.pop();
      node.label = expr;
      return this.finishNode(node, "LabeledStatement");
    };
    pp$1.parseExpressionStatement = function(node, expr) {
      node.expression = expr;
      this.semicolon();
      return this.finishNode(node, "ExpressionStatement");
    };
    pp$1.parseBlock = function(createNewLexicalScope, node, exitStrict) {
      if (createNewLexicalScope === void 0)
        createNewLexicalScope = true;
      if (node === void 0)
        node = this.startNode();
      node.body = [];
      this.expect(types.braceL);
      if (createNewLexicalScope) {
        this.enterScope(0);
      }
      while (this.type !== types.braceR) {
        var stmt = this.parseStatement(null);
        node.body.push(stmt);
      }
      if (exitStrict) {
        this.strict = false;
      }
      this.next();
      if (createNewLexicalScope) {
        this.exitScope();
      }
      return this.finishNode(node, "BlockStatement");
    };
    pp$1.parseFor = function(node, init) {
      node.init = init;
      this.expect(types.semi);
      node.test = this.type === types.semi ? null : this.parseExpression();
      this.expect(types.semi);
      node.update = this.type === types.parenR ? null : this.parseExpression();
      this.expect(types.parenR);
      node.body = this.parseStatement("for");
      this.exitScope();
      this.labels.pop();
      return this.finishNode(node, "ForStatement");
    };
    pp$1.parseForIn = function(node, init) {
      var isForIn = this.type === types._in;
      this.next();
      if (init.type === "VariableDeclaration" && init.declarations[0].init != null && (!isForIn || this.options.ecmaVersion < 8 || this.strict || init.kind !== "var" || init.declarations[0].id.type !== "Identifier")) {
        this.raise(init.start, (isForIn ? "for-in" : "for-of") + " loop variable declaration may not have an initializer");
      }
      node.left = init;
      node.right = isForIn ? this.parseExpression() : this.parseMaybeAssign();
      this.expect(types.parenR);
      node.body = this.parseStatement("for");
      this.exitScope();
      this.labels.pop();
      return this.finishNode(node, isForIn ? "ForInStatement" : "ForOfStatement");
    };
    pp$1.parseVar = function(node, isFor, kind) {
      node.declarations = [];
      node.kind = kind;
      for (; ; ) {
        var decl = this.startNode();
        this.parseVarId(decl, kind);
        if (this.eat(types.eq)) {
          decl.init = this.parseMaybeAssign(isFor);
        } else if (kind === "const" && !(this.type === types._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
          this.unexpected();
        } else if (decl.id.type !== "Identifier" && !(isFor && (this.type === types._in || this.isContextual("of")))) {
          this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
        } else {
          decl.init = null;
        }
        node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
        if (!this.eat(types.comma)) {
          break;
        }
      }
      return node;
    };
    pp$1.parseVarId = function(decl, kind) {
      decl.id = this.parseBindingAtom();
      this.checkLValPattern(decl.id, kind === "var" ? BIND_VAR : BIND_LEXICAL, false);
    };
    FUNC_STATEMENT = 1;
    FUNC_HANGING_STATEMENT = 2;
    FUNC_NULLABLE_ID = 4;
    pp$1.parseFunction = function(node, statement, allowExpressionBody, isAsync) {
      this.initFunction(node);
      if (this.options.ecmaVersion >= 9 || this.options.ecmaVersion >= 6 && !isAsync) {
        if (this.type === types.star && statement & FUNC_HANGING_STATEMENT) {
          this.unexpected();
        }
        node.generator = this.eat(types.star);
      }
      if (this.options.ecmaVersion >= 8) {
        node.async = !!isAsync;
      }
      if (statement & FUNC_STATEMENT) {
        node.id = statement & FUNC_NULLABLE_ID && this.type !== types.name ? null : this.parseIdent();
        if (node.id && !(statement & FUNC_HANGING_STATEMENT)) {
          this.checkLValSimple(node.id, this.strict || node.generator || node.async ? this.treatFunctionsAsVar ? BIND_VAR : BIND_LEXICAL : BIND_FUNCTION);
        }
      }
      var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      this.enterScope(functionFlags(node.async, node.generator));
      if (!(statement & FUNC_STATEMENT)) {
        node.id = this.type === types.name ? this.parseIdent() : null;
      }
      this.parseFunctionParams(node);
      this.parseFunctionBody(node, allowExpressionBody, false);
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.finishNode(node, statement & FUNC_STATEMENT ? "FunctionDeclaration" : "FunctionExpression");
    };
    pp$1.parseFunctionParams = function(node) {
      this.expect(types.parenL);
      node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
      this.checkYieldAwaitInDefaultParams();
    };
    pp$1.parseClass = function(node, isStatement) {
      this.next();
      var oldStrict = this.strict;
      this.strict = true;
      this.parseClassId(node, isStatement);
      this.parseClassSuper(node);
      var privateNameMap = this.enterClassBody();
      var classBody = this.startNode();
      var hadConstructor = false;
      classBody.body = [];
      this.expect(types.braceL);
      while (this.type !== types.braceR) {
        var element = this.parseClassElement(node.superClass !== null);
        if (element) {
          classBody.body.push(element);
          if (element.type === "MethodDefinition" && element.kind === "constructor") {
            if (hadConstructor) {
              this.raise(element.start, "Duplicate constructor in the same class");
            }
            hadConstructor = true;
          } else if (element.key.type === "PrivateIdentifier" && isPrivateNameConflicted(privateNameMap, element)) {
            this.raiseRecoverable(element.key.start, "Identifier '#" + element.key.name + "' has already been declared");
          }
        }
      }
      this.strict = oldStrict;
      this.next();
      node.body = this.finishNode(classBody, "ClassBody");
      this.exitClassBody();
      return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
    };
    pp$1.parseClassElement = function(constructorAllowsSuper) {
      if (this.eat(types.semi)) {
        return null;
      }
      var ecmaVersion = this.options.ecmaVersion;
      var node = this.startNode();
      var keyName = "";
      var isGenerator = false;
      var isAsync = false;
      var kind = "method";
      node.static = false;
      if (this.eatContextual("static")) {
        if (this.isClassElementNameStart() || this.type === types.star) {
          node.static = true;
        } else {
          keyName = "static";
        }
      }
      if (!keyName && ecmaVersion >= 8 && this.eatContextual("async")) {
        if ((this.isClassElementNameStart() || this.type === types.star) && !this.canInsertSemicolon()) {
          isAsync = true;
        } else {
          keyName = "async";
        }
      }
      if (!keyName && (ecmaVersion >= 9 || !isAsync) && this.eat(types.star)) {
        isGenerator = true;
      }
      if (!keyName && !isAsync && !isGenerator) {
        var lastValue = this.value;
        if (this.eatContextual("get") || this.eatContextual("set")) {
          if (this.isClassElementNameStart()) {
            kind = lastValue;
          } else {
            keyName = lastValue;
          }
        }
      }
      if (keyName) {
        node.computed = false;
        node.key = this.startNodeAt(this.lastTokStart, this.lastTokStartLoc);
        node.key.name = keyName;
        this.finishNode(node.key, "Identifier");
      } else {
        this.parseClassElementName(node);
      }
      if (ecmaVersion < 13 || this.type === types.parenL || kind !== "method" || isGenerator || isAsync) {
        var isConstructor = !node.static && checkKeyName(node, "constructor");
        var allowsDirectSuper = isConstructor && constructorAllowsSuper;
        if (isConstructor && kind !== "method") {
          this.raise(node.key.start, "Constructor can't have get/set modifier");
        }
        node.kind = isConstructor ? "constructor" : kind;
        this.parseClassMethod(node, isGenerator, isAsync, allowsDirectSuper);
      } else {
        this.parseClassField(node);
      }
      return node;
    };
    pp$1.isClassElementNameStart = function() {
      return this.type === types.name || this.type === types.privateId || this.type === types.num || this.type === types.string || this.type === types.bracketL || this.type.keyword;
    };
    pp$1.parseClassElementName = function(element) {
      if (this.type === types.privateId) {
        if (this.value === "constructor") {
          this.raise(this.start, "Classes can't have an element named '#constructor'");
        }
        element.computed = false;
        element.key = this.parsePrivateIdent();
      } else {
        this.parsePropertyName(element);
      }
    };
    pp$1.parseClassMethod = function(method, isGenerator, isAsync, allowsDirectSuper) {
      var key = method.key;
      if (method.kind === "constructor") {
        if (isGenerator) {
          this.raise(key.start, "Constructor can't be a generator");
        }
        if (isAsync) {
          this.raise(key.start, "Constructor can't be an async method");
        }
      } else if (method.static && checkKeyName(method, "prototype")) {
        this.raise(key.start, "Classes may not have a static property named prototype");
      }
      var value = method.value = this.parseMethod(isGenerator, isAsync, allowsDirectSuper);
      if (method.kind === "get" && value.params.length !== 0) {
        this.raiseRecoverable(value.start, "getter should have no params");
      }
      if (method.kind === "set" && value.params.length !== 1) {
        this.raiseRecoverable(value.start, "setter should have exactly one param");
      }
      if (method.kind === "set" && value.params[0].type === "RestElement") {
        this.raiseRecoverable(value.params[0].start, "Setter cannot use rest params");
      }
      return this.finishNode(method, "MethodDefinition");
    };
    pp$1.parseClassField = function(field) {
      if (checkKeyName(field, "constructor")) {
        this.raise(field.key.start, "Classes can't have a field named 'constructor'");
      } else if (field.static && checkKeyName(field, "prototype")) {
        this.raise(field.key.start, "Classes can't have a static field named 'prototype'");
      }
      if (this.eat(types.eq)) {
        var scope = this.currentThisScope();
        var inClassFieldInit = scope.inClassFieldInit;
        scope.inClassFieldInit = true;
        field.value = this.parseMaybeAssign();
        scope.inClassFieldInit = inClassFieldInit;
      } else {
        field.value = null;
      }
      this.semicolon();
      return this.finishNode(field, "PropertyDefinition");
    };
    pp$1.parseClassId = function(node, isStatement) {
      if (this.type === types.name) {
        node.id = this.parseIdent();
        if (isStatement) {
          this.checkLValSimple(node.id, BIND_LEXICAL, false);
        }
      } else {
        if (isStatement === true) {
          this.unexpected();
        }
        node.id = null;
      }
    };
    pp$1.parseClassSuper = function(node) {
      node.superClass = this.eat(types._extends) ? this.parseExprSubscripts() : null;
    };
    pp$1.enterClassBody = function() {
      var element = { declared: Object.create(null), used: [] };
      this.privateNameStack.push(element);
      return element.declared;
    };
    pp$1.exitClassBody = function() {
      var ref2 = this.privateNameStack.pop();
      var declared = ref2.declared;
      var used = ref2.used;
      var len = this.privateNameStack.length;
      var parent = len === 0 ? null : this.privateNameStack[len - 1];
      for (var i = 0; i < used.length; ++i) {
        var id = used[i];
        if (!has2(declared, id.name)) {
          if (parent) {
            parent.used.push(id);
          } else {
            this.raiseRecoverable(id.start, "Private field '#" + id.name + "' must be declared in an enclosing class");
          }
        }
      }
    };
    pp$1.parseExport = function(node, exports) {
      this.next();
      if (this.eat(types.star)) {
        if (this.options.ecmaVersion >= 11) {
          if (this.eatContextual("as")) {
            node.exported = this.parseIdent(true);
            this.checkExport(exports, node.exported.name, this.lastTokStart);
          } else {
            node.exported = null;
          }
        }
        this.expectContextual("from");
        if (this.type !== types.string) {
          this.unexpected();
        }
        node.source = this.parseExprAtom();
        this.semicolon();
        return this.finishNode(node, "ExportAllDeclaration");
      }
      if (this.eat(types._default)) {
        this.checkExport(exports, "default", this.lastTokStart);
        var isAsync;
        if (this.type === types._function || (isAsync = this.isAsyncFunction())) {
          var fNode = this.startNode();
          this.next();
          if (isAsync) {
            this.next();
          }
          node.declaration = this.parseFunction(fNode, FUNC_STATEMENT | FUNC_NULLABLE_ID, false, isAsync);
        } else if (this.type === types._class) {
          var cNode = this.startNode();
          node.declaration = this.parseClass(cNode, "nullableID");
        } else {
          node.declaration = this.parseMaybeAssign();
          this.semicolon();
        }
        return this.finishNode(node, "ExportDefaultDeclaration");
      }
      if (this.shouldParseExportStatement()) {
        node.declaration = this.parseStatement(null);
        if (node.declaration.type === "VariableDeclaration") {
          this.checkVariableExport(exports, node.declaration.declarations);
        } else {
          this.checkExport(exports, node.declaration.id.name, node.declaration.id.start);
        }
        node.specifiers = [];
        node.source = null;
      } else {
        node.declaration = null;
        node.specifiers = this.parseExportSpecifiers(exports);
        if (this.eatContextual("from")) {
          if (this.type !== types.string) {
            this.unexpected();
          }
          node.source = this.parseExprAtom();
        } else {
          for (var i = 0, list = node.specifiers; i < list.length; i += 1) {
            var spec = list[i];
            this.checkUnreserved(spec.local);
            this.checkLocalExport(spec.local);
          }
          node.source = null;
        }
        this.semicolon();
      }
      return this.finishNode(node, "ExportNamedDeclaration");
    };
    pp$1.checkExport = function(exports, name, pos) {
      if (!exports) {
        return;
      }
      if (has2(exports, name)) {
        this.raiseRecoverable(pos, "Duplicate export '" + name + "'");
      }
      exports[name] = true;
    };
    pp$1.checkPatternExport = function(exports, pat) {
      var type = pat.type;
      if (type === "Identifier") {
        this.checkExport(exports, pat.name, pat.start);
      } else if (type === "ObjectPattern") {
        for (var i = 0, list = pat.properties; i < list.length; i += 1) {
          var prop = list[i];
          this.checkPatternExport(exports, prop);
        }
      } else if (type === "ArrayPattern") {
        for (var i$1 = 0, list$1 = pat.elements; i$1 < list$1.length; i$1 += 1) {
          var elt = list$1[i$1];
          if (elt) {
            this.checkPatternExport(exports, elt);
          }
        }
      } else if (type === "Property") {
        this.checkPatternExport(exports, pat.value);
      } else if (type === "AssignmentPattern") {
        this.checkPatternExport(exports, pat.left);
      } else if (type === "RestElement") {
        this.checkPatternExport(exports, pat.argument);
      } else if (type === "ParenthesizedExpression") {
        this.checkPatternExport(exports, pat.expression);
      }
    };
    pp$1.checkVariableExport = function(exports, decls) {
      if (!exports) {
        return;
      }
      for (var i = 0, list = decls; i < list.length; i += 1) {
        var decl = list[i];
        this.checkPatternExport(exports, decl.id);
      }
    };
    pp$1.shouldParseExportStatement = function() {
      return this.type.keyword === "var" || this.type.keyword === "const" || this.type.keyword === "class" || this.type.keyword === "function" || this.isLet() || this.isAsyncFunction();
    };
    pp$1.parseExportSpecifiers = function(exports) {
      var nodes = [], first = true;
      this.expect(types.braceL);
      while (!this.eat(types.braceR)) {
        if (!first) {
          this.expect(types.comma);
          if (this.afterTrailingComma(types.braceR)) {
            break;
          }
        } else {
          first = false;
        }
        var node = this.startNode();
        node.local = this.parseIdent(true);
        node.exported = this.eatContextual("as") ? this.parseIdent(true) : node.local;
        this.checkExport(exports, node.exported.name, node.exported.start);
        nodes.push(this.finishNode(node, "ExportSpecifier"));
      }
      return nodes;
    };
    pp$1.parseImport = function(node) {
      this.next();
      if (this.type === types.string) {
        node.specifiers = empty;
        node.source = this.parseExprAtom();
      } else {
        node.specifiers = this.parseImportSpecifiers();
        this.expectContextual("from");
        node.source = this.type === types.string ? this.parseExprAtom() : this.unexpected();
      }
      this.semicolon();
      return this.finishNode(node, "ImportDeclaration");
    };
    pp$1.parseImportSpecifiers = function() {
      var nodes = [], first = true;
      if (this.type === types.name) {
        var node = this.startNode();
        node.local = this.parseIdent();
        this.checkLValSimple(node.local, BIND_LEXICAL);
        nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
        if (!this.eat(types.comma)) {
          return nodes;
        }
      }
      if (this.type === types.star) {
        var node$1 = this.startNode();
        this.next();
        this.expectContextual("as");
        node$1.local = this.parseIdent();
        this.checkLValSimple(node$1.local, BIND_LEXICAL);
        nodes.push(this.finishNode(node$1, "ImportNamespaceSpecifier"));
        return nodes;
      }
      this.expect(types.braceL);
      while (!this.eat(types.braceR)) {
        if (!first) {
          this.expect(types.comma);
          if (this.afterTrailingComma(types.braceR)) {
            break;
          }
        } else {
          first = false;
        }
        var node$2 = this.startNode();
        node$2.imported = this.parseIdent(true);
        if (this.eatContextual("as")) {
          node$2.local = this.parseIdent();
        } else {
          this.checkUnreserved(node$2.imported);
          node$2.local = node$2.imported;
        }
        this.checkLValSimple(node$2.local, BIND_LEXICAL);
        nodes.push(this.finishNode(node$2, "ImportSpecifier"));
      }
      return nodes;
    };
    pp$1.adaptDirectivePrologue = function(statements) {
      for (var i = 0; i < statements.length && this.isDirectiveCandidate(statements[i]); ++i) {
        statements[i].directive = statements[i].expression.raw.slice(1, -1);
      }
    };
    pp$1.isDirectiveCandidate = function(statement) {
      return statement.type === "ExpressionStatement" && statement.expression.type === "Literal" && typeof statement.expression.value === "string" && (this.input[statement.start] === '"' || this.input[statement.start] === "'");
    };
    pp$2 = Parser.prototype;
    pp$2.toAssignable = function(node, isBinding, refDestructuringErrors) {
      if (this.options.ecmaVersion >= 6 && node) {
        switch (node.type) {
          case "Identifier":
            if (this.inAsync && node.name === "await") {
              this.raise(node.start, "Cannot use 'await' as identifier inside an async function");
            }
            break;
          case "ObjectPattern":
          case "ArrayPattern":
          case "AssignmentPattern":
          case "RestElement":
            break;
          case "ObjectExpression":
            node.type = "ObjectPattern";
            if (refDestructuringErrors) {
              this.checkPatternErrors(refDestructuringErrors, true);
            }
            for (var i = 0, list = node.properties; i < list.length; i += 1) {
              var prop = list[i];
              this.toAssignable(prop, isBinding);
              if (prop.type === "RestElement" && (prop.argument.type === "ArrayPattern" || prop.argument.type === "ObjectPattern")) {
                this.raise(prop.argument.start, "Unexpected token");
              }
            }
            break;
          case "Property":
            if (node.kind !== "init") {
              this.raise(node.key.start, "Object pattern can't contain getter or setter");
            }
            this.toAssignable(node.value, isBinding);
            break;
          case "ArrayExpression":
            node.type = "ArrayPattern";
            if (refDestructuringErrors) {
              this.checkPatternErrors(refDestructuringErrors, true);
            }
            this.toAssignableList(node.elements, isBinding);
            break;
          case "SpreadElement":
            node.type = "RestElement";
            this.toAssignable(node.argument, isBinding);
            if (node.argument.type === "AssignmentPattern") {
              this.raise(node.argument.start, "Rest elements cannot have a default value");
            }
            break;
          case "AssignmentExpression":
            if (node.operator !== "=") {
              this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
            }
            node.type = "AssignmentPattern";
            delete node.operator;
            this.toAssignable(node.left, isBinding);
            break;
          case "ParenthesizedExpression":
            this.toAssignable(node.expression, isBinding, refDestructuringErrors);
            break;
          case "ChainExpression":
            this.raiseRecoverable(node.start, "Optional chaining cannot appear in left-hand side");
            break;
          case "MemberExpression":
            if (!isBinding) {
              break;
            }
          default:
            this.raise(node.start, "Assigning to rvalue");
        }
      } else if (refDestructuringErrors) {
        this.checkPatternErrors(refDestructuringErrors, true);
      }
      return node;
    };
    pp$2.toAssignableList = function(exprList, isBinding) {
      var end = exprList.length;
      for (var i = 0; i < end; i++) {
        var elt = exprList[i];
        if (elt) {
          this.toAssignable(elt, isBinding);
        }
      }
      if (end) {
        var last = exprList[end - 1];
        if (this.options.ecmaVersion === 6 && isBinding && last && last.type === "RestElement" && last.argument.type !== "Identifier") {
          this.unexpected(last.argument.start);
        }
      }
      return exprList;
    };
    pp$2.parseSpread = function(refDestructuringErrors) {
      var node = this.startNode();
      this.next();
      node.argument = this.parseMaybeAssign(false, refDestructuringErrors);
      return this.finishNode(node, "SpreadElement");
    };
    pp$2.parseRestBinding = function() {
      var node = this.startNode();
      this.next();
      if (this.options.ecmaVersion === 6 && this.type !== types.name) {
        this.unexpected();
      }
      node.argument = this.parseBindingAtom();
      return this.finishNode(node, "RestElement");
    };
    pp$2.parseBindingAtom = function() {
      if (this.options.ecmaVersion >= 6) {
        switch (this.type) {
          case types.bracketL:
            var node = this.startNode();
            this.next();
            node.elements = this.parseBindingList(types.bracketR, true, true);
            return this.finishNode(node, "ArrayPattern");
          case types.braceL:
            return this.parseObj(true);
        }
      }
      return this.parseIdent();
    };
    pp$2.parseBindingList = function(close, allowEmpty, allowTrailingComma) {
      var elts = [], first = true;
      while (!this.eat(close)) {
        if (first) {
          first = false;
        } else {
          this.expect(types.comma);
        }
        if (allowEmpty && this.type === types.comma) {
          elts.push(null);
        } else if (allowTrailingComma && this.afterTrailingComma(close)) {
          break;
        } else if (this.type === types.ellipsis) {
          var rest = this.parseRestBinding();
          this.parseBindingListItem(rest);
          elts.push(rest);
          if (this.type === types.comma) {
            this.raise(this.start, "Comma is not permitted after the rest element");
          }
          this.expect(close);
          break;
        } else {
          var elem = this.parseMaybeDefault(this.start, this.startLoc);
          this.parseBindingListItem(elem);
          elts.push(elem);
        }
      }
      return elts;
    };
    pp$2.parseBindingListItem = function(param) {
      return param;
    };
    pp$2.parseMaybeDefault = function(startPos, startLoc, left) {
      left = left || this.parseBindingAtom();
      if (this.options.ecmaVersion < 6 || !this.eat(types.eq)) {
        return left;
      }
      var node = this.startNodeAt(startPos, startLoc);
      node.left = left;
      node.right = this.parseMaybeAssign();
      return this.finishNode(node, "AssignmentPattern");
    };
    pp$2.checkLValSimple = function(expr, bindingType, checkClashes) {
      if (bindingType === void 0)
        bindingType = BIND_NONE;
      var isBind = bindingType !== BIND_NONE;
      switch (expr.type) {
        case "Identifier":
          if (this.strict && this.reservedWordsStrictBind.test(expr.name)) {
            this.raiseRecoverable(expr.start, (isBind ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
          }
          if (isBind) {
            if (bindingType === BIND_LEXICAL && expr.name === "let") {
              this.raiseRecoverable(expr.start, "let is disallowed as a lexically bound name");
            }
            if (checkClashes) {
              if (has2(checkClashes, expr.name)) {
                this.raiseRecoverable(expr.start, "Argument name clash");
              }
              checkClashes[expr.name] = true;
            }
            if (bindingType !== BIND_OUTSIDE) {
              this.declareName(expr.name, bindingType, expr.start);
            }
          }
          break;
        case "ChainExpression":
          this.raiseRecoverable(expr.start, "Optional chaining cannot appear in left-hand side");
          break;
        case "MemberExpression":
          if (isBind) {
            this.raiseRecoverable(expr.start, "Binding member expression");
          }
          break;
        case "ParenthesizedExpression":
          if (isBind) {
            this.raiseRecoverable(expr.start, "Binding parenthesized expression");
          }
          return this.checkLValSimple(expr.expression, bindingType, checkClashes);
        default:
          this.raise(expr.start, (isBind ? "Binding" : "Assigning to") + " rvalue");
      }
    };
    pp$2.checkLValPattern = function(expr, bindingType, checkClashes) {
      if (bindingType === void 0)
        bindingType = BIND_NONE;
      switch (expr.type) {
        case "ObjectPattern":
          for (var i = 0, list = expr.properties; i < list.length; i += 1) {
            var prop = list[i];
            this.checkLValInnerPattern(prop, bindingType, checkClashes);
          }
          break;
        case "ArrayPattern":
          for (var i$1 = 0, list$1 = expr.elements; i$1 < list$1.length; i$1 += 1) {
            var elem = list$1[i$1];
            if (elem) {
              this.checkLValInnerPattern(elem, bindingType, checkClashes);
            }
          }
          break;
        default:
          this.checkLValSimple(expr, bindingType, checkClashes);
      }
    };
    pp$2.checkLValInnerPattern = function(expr, bindingType, checkClashes) {
      if (bindingType === void 0)
        bindingType = BIND_NONE;
      switch (expr.type) {
        case "Property":
          this.checkLValInnerPattern(expr.value, bindingType, checkClashes);
          break;
        case "AssignmentPattern":
          this.checkLValPattern(expr.left, bindingType, checkClashes);
          break;
        case "RestElement":
          this.checkLValPattern(expr.argument, bindingType, checkClashes);
          break;
        default:
          this.checkLValPattern(expr, bindingType, checkClashes);
      }
    };
    pp$3 = Parser.prototype;
    pp$3.checkPropClash = function(prop, propHash, refDestructuringErrors) {
      if (this.options.ecmaVersion >= 9 && prop.type === "SpreadElement") {
        return;
      }
      if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) {
        return;
      }
      var key = prop.key;
      var name;
      switch (key.type) {
        case "Identifier":
          name = key.name;
          break;
        case "Literal":
          name = String(key.value);
          break;
        default:
          return;
      }
      var kind = prop.kind;
      if (this.options.ecmaVersion >= 6) {
        if (name === "__proto__" && kind === "init") {
          if (propHash.proto) {
            if (refDestructuringErrors) {
              if (refDestructuringErrors.doubleProto < 0) {
                refDestructuringErrors.doubleProto = key.start;
              }
            } else {
              this.raiseRecoverable(key.start, "Redefinition of __proto__ property");
            }
          }
          propHash.proto = true;
        }
        return;
      }
      name = "$" + name;
      var other = propHash[name];
      if (other) {
        var redefinition;
        if (kind === "init") {
          redefinition = this.strict && other.init || other.get || other.set;
        } else {
          redefinition = other.init || other[kind];
        }
        if (redefinition) {
          this.raiseRecoverable(key.start, "Redefinition of property");
        }
      } else {
        other = propHash[name] = {
          init: false,
          get: false,
          set: false
        };
      }
      other[kind] = true;
    };
    pp$3.parseExpression = function(forInit, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseMaybeAssign(forInit, refDestructuringErrors);
      if (this.type === types.comma) {
        var node = this.startNodeAt(startPos, startLoc);
        node.expressions = [expr];
        while (this.eat(types.comma)) {
          node.expressions.push(this.parseMaybeAssign(forInit, refDestructuringErrors));
        }
        return this.finishNode(node, "SequenceExpression");
      }
      return expr;
    };
    pp$3.parseMaybeAssign = function(forInit, refDestructuringErrors, afterLeftParse) {
      if (this.isContextual("yield")) {
        if (this.inGenerator) {
          return this.parseYield(forInit);
        } else {
          this.exprAllowed = false;
        }
      }
      var ownDestructuringErrors = false, oldParenAssign = -1, oldTrailingComma = -1;
      if (refDestructuringErrors) {
        oldParenAssign = refDestructuringErrors.parenthesizedAssign;
        oldTrailingComma = refDestructuringErrors.trailingComma;
        refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = -1;
      } else {
        refDestructuringErrors = new DestructuringErrors();
        ownDestructuringErrors = true;
      }
      var startPos = this.start, startLoc = this.startLoc;
      if (this.type === types.parenL || this.type === types.name) {
        this.potentialArrowAt = this.start;
        this.potentialArrowInForAwait = forInit === "await";
      }
      var left = this.parseMaybeConditional(forInit, refDestructuringErrors);
      if (afterLeftParse) {
        left = afterLeftParse.call(this, left, startPos, startLoc);
      }
      if (this.type.isAssign) {
        var node = this.startNodeAt(startPos, startLoc);
        node.operator = this.value;
        if (this.type === types.eq) {
          left = this.toAssignable(left, false, refDestructuringErrors);
        }
        if (!ownDestructuringErrors) {
          refDestructuringErrors.parenthesizedAssign = refDestructuringErrors.trailingComma = refDestructuringErrors.doubleProto = -1;
        }
        if (refDestructuringErrors.shorthandAssign >= left.start) {
          refDestructuringErrors.shorthandAssign = -1;
        }
        if (this.type === types.eq) {
          this.checkLValPattern(left);
        } else {
          this.checkLValSimple(left);
        }
        node.left = left;
        this.next();
        node.right = this.parseMaybeAssign(forInit);
        return this.finishNode(node, "AssignmentExpression");
      } else {
        if (ownDestructuringErrors) {
          this.checkExpressionErrors(refDestructuringErrors, true);
        }
      }
      if (oldParenAssign > -1) {
        refDestructuringErrors.parenthesizedAssign = oldParenAssign;
      }
      if (oldTrailingComma > -1) {
        refDestructuringErrors.trailingComma = oldTrailingComma;
      }
      return left;
    };
    pp$3.parseMaybeConditional = function(forInit, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseExprOps(forInit, refDestructuringErrors);
      if (this.checkExpressionErrors(refDestructuringErrors)) {
        return expr;
      }
      if (this.eat(types.question)) {
        var node = this.startNodeAt(startPos, startLoc);
        node.test = expr;
        node.consequent = this.parseMaybeAssign();
        this.expect(types.colon);
        node.alternate = this.parseMaybeAssign(forInit);
        return this.finishNode(node, "ConditionalExpression");
      }
      return expr;
    };
    pp$3.parseExprOps = function(forInit, refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseMaybeUnary(refDestructuringErrors, false);
      if (this.checkExpressionErrors(refDestructuringErrors)) {
        return expr;
      }
      return expr.start === startPos && expr.type === "ArrowFunctionExpression" ? expr : this.parseExprOp(expr, startPos, startLoc, -1, forInit);
    };
    pp$3.parseExprOp = function(left, leftStartPos, leftStartLoc, minPrec, forInit) {
      var prec = this.type.binop;
      if (prec != null && (!forInit || this.type !== types._in)) {
        if (prec > minPrec) {
          var logical = this.type === types.logicalOR || this.type === types.logicalAND;
          var coalesce = this.type === types.coalesce;
          if (coalesce) {
            prec = types.logicalAND.binop;
          }
          var op = this.value;
          this.next();
          var startPos = this.start, startLoc = this.startLoc;
          var right = this.parseExprOp(this.parseMaybeUnary(null, false), startPos, startLoc, prec, forInit);
          var node = this.buildBinary(leftStartPos, leftStartLoc, left, right, op, logical || coalesce);
          if (logical && this.type === types.coalesce || coalesce && (this.type === types.logicalOR || this.type === types.logicalAND)) {
            this.raiseRecoverable(this.start, "Logical expressions and coalesce expressions cannot be mixed. Wrap either by parentheses");
          }
          return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, forInit);
        }
      }
      return left;
    };
    pp$3.buildBinary = function(startPos, startLoc, left, right, op, logical) {
      var node = this.startNodeAt(startPos, startLoc);
      node.left = left;
      node.operator = op;
      node.right = right;
      return this.finishNode(node, logical ? "LogicalExpression" : "BinaryExpression");
    };
    pp$3.parseMaybeUnary = function(refDestructuringErrors, sawUnary, incDec) {
      var startPos = this.start, startLoc = this.startLoc, expr;
      if (this.isContextual("await") && (this.inAsync || !this.inFunction && this.options.allowAwaitOutsideFunction)) {
        expr = this.parseAwait();
        sawUnary = true;
      } else if (this.type.prefix) {
        var node = this.startNode(), update = this.type === types.incDec;
        node.operator = this.value;
        node.prefix = true;
        this.next();
        node.argument = this.parseMaybeUnary(null, true, update);
        this.checkExpressionErrors(refDestructuringErrors, true);
        if (update) {
          this.checkLValSimple(node.argument);
        } else if (this.strict && node.operator === "delete" && node.argument.type === "Identifier") {
          this.raiseRecoverable(node.start, "Deleting local variable in strict mode");
        } else if (node.operator === "delete" && isPrivateFieldAccess(node.argument)) {
          this.raiseRecoverable(node.start, "Private fields can not be deleted");
        } else {
          sawUnary = true;
        }
        expr = this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
      } else {
        expr = this.parseExprSubscripts(refDestructuringErrors);
        if (this.checkExpressionErrors(refDestructuringErrors)) {
          return expr;
        }
        while (this.type.postfix && !this.canInsertSemicolon()) {
          var node$1 = this.startNodeAt(startPos, startLoc);
          node$1.operator = this.value;
          node$1.prefix = false;
          node$1.argument = expr;
          this.checkLValSimple(expr);
          this.next();
          expr = this.finishNode(node$1, "UpdateExpression");
        }
      }
      if (!incDec && this.eat(types.starstar)) {
        if (sawUnary) {
          this.unexpected(this.lastTokStart);
        } else {
          return this.buildBinary(startPos, startLoc, expr, this.parseMaybeUnary(null, false), "**", false);
        }
      } else {
        return expr;
      }
    };
    pp$3.parseExprSubscripts = function(refDestructuringErrors) {
      var startPos = this.start, startLoc = this.startLoc;
      var expr = this.parseExprAtom(refDestructuringErrors);
      if (expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")") {
        return expr;
      }
      var result = this.parseSubscripts(expr, startPos, startLoc);
      if (refDestructuringErrors && result.type === "MemberExpression") {
        if (refDestructuringErrors.parenthesizedAssign >= result.start) {
          refDestructuringErrors.parenthesizedAssign = -1;
        }
        if (refDestructuringErrors.parenthesizedBind >= result.start) {
          refDestructuringErrors.parenthesizedBind = -1;
        }
        if (refDestructuringErrors.trailingComma >= result.start) {
          refDestructuringErrors.trailingComma = -1;
        }
      }
      return result;
    };
    pp$3.parseSubscripts = function(base2, startPos, startLoc, noCalls) {
      var maybeAsyncArrow = this.options.ecmaVersion >= 8 && base2.type === "Identifier" && base2.name === "async" && this.lastTokEnd === base2.end && !this.canInsertSemicolon() && base2.end - base2.start === 5 && this.potentialArrowAt === base2.start;
      var optionalChained = false;
      while (true) {
        var element = this.parseSubscript(base2, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained);
        if (element.optional) {
          optionalChained = true;
        }
        if (element === base2 || element.type === "ArrowFunctionExpression") {
          if (optionalChained) {
            var chainNode = this.startNodeAt(startPos, startLoc);
            chainNode.expression = element;
            element = this.finishNode(chainNode, "ChainExpression");
          }
          return element;
        }
        base2 = element;
      }
    };
    pp$3.parseSubscript = function(base2, startPos, startLoc, noCalls, maybeAsyncArrow, optionalChained) {
      var optionalSupported = this.options.ecmaVersion >= 11;
      var optional = optionalSupported && this.eat(types.questionDot);
      if (noCalls && optional) {
        this.raise(this.lastTokStart, "Optional chaining cannot appear in the callee of new expressions");
      }
      var computed = this.eat(types.bracketL);
      if (computed || optional && this.type !== types.parenL && this.type !== types.backQuote || this.eat(types.dot)) {
        var node = this.startNodeAt(startPos, startLoc);
        node.object = base2;
        if (computed) {
          node.property = this.parseExpression();
          this.expect(types.bracketR);
        } else if (this.type === types.privateId && base2.type !== "Super") {
          node.property = this.parsePrivateIdent();
        } else {
          node.property = this.parseIdent(this.options.allowReserved !== "never");
        }
        node.computed = !!computed;
        if (optionalSupported) {
          node.optional = optional;
        }
        base2 = this.finishNode(node, "MemberExpression");
      } else if (!noCalls && this.eat(types.parenL)) {
        var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
        this.yieldPos = 0;
        this.awaitPos = 0;
        this.awaitIdentPos = 0;
        var exprList = this.parseExprList(types.parenR, this.options.ecmaVersion >= 8, false, refDestructuringErrors);
        if (maybeAsyncArrow && !optional && !this.canInsertSemicolon() && this.eat(types.arrow)) {
          this.checkPatternErrors(refDestructuringErrors, false);
          this.checkYieldAwaitInDefaultParams();
          if (this.awaitIdentPos > 0) {
            this.raise(this.awaitIdentPos, "Cannot use 'await' as identifier inside an async function");
          }
          this.yieldPos = oldYieldPos;
          this.awaitPos = oldAwaitPos;
          this.awaitIdentPos = oldAwaitIdentPos;
          return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList, true);
        }
        this.checkExpressionErrors(refDestructuringErrors, true);
        this.yieldPos = oldYieldPos || this.yieldPos;
        this.awaitPos = oldAwaitPos || this.awaitPos;
        this.awaitIdentPos = oldAwaitIdentPos || this.awaitIdentPos;
        var node$1 = this.startNodeAt(startPos, startLoc);
        node$1.callee = base2;
        node$1.arguments = exprList;
        if (optionalSupported) {
          node$1.optional = optional;
        }
        base2 = this.finishNode(node$1, "CallExpression");
      } else if (this.type === types.backQuote) {
        if (optional || optionalChained) {
          this.raise(this.start, "Optional chaining cannot appear in the tag of tagged template expressions");
        }
        var node$2 = this.startNodeAt(startPos, startLoc);
        node$2.tag = base2;
        node$2.quasi = this.parseTemplate({ isTagged: true });
        base2 = this.finishNode(node$2, "TaggedTemplateExpression");
      }
      return base2;
    };
    pp$3.parseExprAtom = function(refDestructuringErrors) {
      if (this.type === types.slash) {
        this.readRegexp();
      }
      var node, canBeArrow = this.potentialArrowAt === this.start;
      switch (this.type) {
        case types._super:
          if (!this.allowSuper) {
            this.raise(this.start, "'super' keyword outside a method");
          }
          node = this.startNode();
          this.next();
          if (this.type === types.parenL && !this.allowDirectSuper) {
            this.raise(node.start, "super() call outside constructor of a subclass");
          }
          if (this.type !== types.dot && this.type !== types.bracketL && this.type !== types.parenL) {
            this.unexpected();
          }
          return this.finishNode(node, "Super");
        case types._this:
          node = this.startNode();
          this.next();
          return this.finishNode(node, "ThisExpression");
        case types.name:
          var startPos = this.start, startLoc = this.startLoc, containsEsc = this.containsEsc;
          var id = this.parseIdent(false);
          if (this.options.ecmaVersion >= 8 && !containsEsc && id.name === "async" && !this.canInsertSemicolon() && this.eat(types._function)) {
            return this.parseFunction(this.startNodeAt(startPos, startLoc), 0, false, true);
          }
          if (canBeArrow && !this.canInsertSemicolon()) {
            if (this.eat(types.arrow)) {
              return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], false);
            }
            if (this.options.ecmaVersion >= 8 && id.name === "async" && this.type === types.name && !containsEsc && (!this.potentialArrowInForAwait || this.value !== "of" || this.containsEsc)) {
              id = this.parseIdent(false);
              if (this.canInsertSemicolon() || !this.eat(types.arrow)) {
                this.unexpected();
              }
              return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id], true);
            }
          }
          return id;
        case types.regexp:
          var value = this.value;
          node = this.parseLiteral(value.value);
          node.regex = { pattern: value.pattern, flags: value.flags };
          return node;
        case types.num:
        case types.string:
          return this.parseLiteral(this.value);
        case types._null:
        case types._true:
        case types._false:
          node = this.startNode();
          node.value = this.type === types._null ? null : this.type === types._true;
          node.raw = this.type.keyword;
          this.next();
          return this.finishNode(node, "Literal");
        case types.parenL:
          var start = this.start, expr = this.parseParenAndDistinguishExpression(canBeArrow);
          if (refDestructuringErrors) {
            if (refDestructuringErrors.parenthesizedAssign < 0 && !this.isSimpleAssignTarget(expr)) {
              refDestructuringErrors.parenthesizedAssign = start;
            }
            if (refDestructuringErrors.parenthesizedBind < 0) {
              refDestructuringErrors.parenthesizedBind = start;
            }
          }
          return expr;
        case types.bracketL:
          node = this.startNode();
          this.next();
          node.elements = this.parseExprList(types.bracketR, true, true, refDestructuringErrors);
          return this.finishNode(node, "ArrayExpression");
        case types.braceL:
          return this.parseObj(false, refDestructuringErrors);
        case types._function:
          node = this.startNode();
          this.next();
          return this.parseFunction(node, 0);
        case types._class:
          return this.parseClass(this.startNode(), false);
        case types._new:
          return this.parseNew();
        case types.backQuote:
          return this.parseTemplate();
        case types._import:
          if (this.options.ecmaVersion >= 11) {
            return this.parseExprImport();
          } else {
            return this.unexpected();
          }
        default:
          this.unexpected();
      }
    };
    pp$3.parseExprImport = function() {
      var node = this.startNode();
      if (this.containsEsc) {
        this.raiseRecoverable(this.start, "Escape sequence in keyword import");
      }
      var meta = this.parseIdent(true);
      switch (this.type) {
        case types.parenL:
          return this.parseDynamicImport(node);
        case types.dot:
          node.meta = meta;
          return this.parseImportMeta(node);
        default:
          this.unexpected();
      }
    };
    pp$3.parseDynamicImport = function(node) {
      this.next();
      node.source = this.parseMaybeAssign();
      if (!this.eat(types.parenR)) {
        var errorPos = this.start;
        if (this.eat(types.comma) && this.eat(types.parenR)) {
          this.raiseRecoverable(errorPos, "Trailing comma is not allowed in import()");
        } else {
          this.unexpected(errorPos);
        }
      }
      return this.finishNode(node, "ImportExpression");
    };
    pp$3.parseImportMeta = function(node) {
      this.next();
      var containsEsc = this.containsEsc;
      node.property = this.parseIdent(true);
      if (node.property.name !== "meta") {
        this.raiseRecoverable(node.property.start, "The only valid meta property for import is 'import.meta'");
      }
      if (containsEsc) {
        this.raiseRecoverable(node.start, "'import.meta' must not contain escaped characters");
      }
      if (this.options.sourceType !== "module" && !this.options.allowImportExportEverywhere) {
        this.raiseRecoverable(node.start, "Cannot use 'import.meta' outside a module");
      }
      return this.finishNode(node, "MetaProperty");
    };
    pp$3.parseLiteral = function(value) {
      var node = this.startNode();
      node.value = value;
      node.raw = this.input.slice(this.start, this.end);
      if (node.raw.charCodeAt(node.raw.length - 1) === 110) {
        node.bigint = node.raw.slice(0, -1).replace(/_/g, "");
      }
      this.next();
      return this.finishNode(node, "Literal");
    };
    pp$3.parseParenExpression = function() {
      this.expect(types.parenL);
      var val = this.parseExpression();
      this.expect(types.parenR);
      return val;
    };
    pp$3.parseParenAndDistinguishExpression = function(canBeArrow) {
      var startPos = this.start, startLoc = this.startLoc, val, allowTrailingComma = this.options.ecmaVersion >= 8;
      if (this.options.ecmaVersion >= 6) {
        this.next();
        var innerStartPos = this.start, innerStartLoc = this.startLoc;
        var exprList = [], first = true, lastIsComma = false;
        var refDestructuringErrors = new DestructuringErrors(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, spreadStart;
        this.yieldPos = 0;
        this.awaitPos = 0;
        while (this.type !== types.parenR) {
          first ? first = false : this.expect(types.comma);
          if (allowTrailingComma && this.afterTrailingComma(types.parenR, true)) {
            lastIsComma = true;
            break;
          } else if (this.type === types.ellipsis) {
            spreadStart = this.start;
            exprList.push(this.parseParenItem(this.parseRestBinding()));
            if (this.type === types.comma) {
              this.raise(this.start, "Comma is not permitted after the rest element");
            }
            break;
          } else {
            exprList.push(this.parseMaybeAssign(false, refDestructuringErrors, this.parseParenItem));
          }
        }
        var innerEndPos = this.start, innerEndLoc = this.startLoc;
        this.expect(types.parenR);
        if (canBeArrow && !this.canInsertSemicolon() && this.eat(types.arrow)) {
          this.checkPatternErrors(refDestructuringErrors, false);
          this.checkYieldAwaitInDefaultParams();
          this.yieldPos = oldYieldPos;
          this.awaitPos = oldAwaitPos;
          return this.parseParenArrowList(startPos, startLoc, exprList);
        }
        if (!exprList.length || lastIsComma) {
          this.unexpected(this.lastTokStart);
        }
        if (spreadStart) {
          this.unexpected(spreadStart);
        }
        this.checkExpressionErrors(refDestructuringErrors, true);
        this.yieldPos = oldYieldPos || this.yieldPos;
        this.awaitPos = oldAwaitPos || this.awaitPos;
        if (exprList.length > 1) {
          val = this.startNodeAt(innerStartPos, innerStartLoc);
          val.expressions = exprList;
          this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
        } else {
          val = exprList[0];
        }
      } else {
        val = this.parseParenExpression();
      }
      if (this.options.preserveParens) {
        var par = this.startNodeAt(startPos, startLoc);
        par.expression = val;
        return this.finishNode(par, "ParenthesizedExpression");
      } else {
        return val;
      }
    };
    pp$3.parseParenItem = function(item) {
      return item;
    };
    pp$3.parseParenArrowList = function(startPos, startLoc, exprList) {
      return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList);
    };
    empty$1 = [];
    pp$3.parseNew = function() {
      if (this.containsEsc) {
        this.raiseRecoverable(this.start, "Escape sequence in keyword new");
      }
      var node = this.startNode();
      var meta = this.parseIdent(true);
      if (this.options.ecmaVersion >= 6 && this.eat(types.dot)) {
        node.meta = meta;
        var containsEsc = this.containsEsc;
        node.property = this.parseIdent(true);
        if (node.property.name !== "target") {
          this.raiseRecoverable(node.property.start, "The only valid meta property for new is 'new.target'");
        }
        if (containsEsc) {
          this.raiseRecoverable(node.start, "'new.target' must not contain escaped characters");
        }
        if (!this.inNonArrowFunction) {
          this.raiseRecoverable(node.start, "'new.target' can only be used in functions");
        }
        return this.finishNode(node, "MetaProperty");
      }
      var startPos = this.start, startLoc = this.startLoc, isImport = this.type === types._import;
      node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
      if (isImport && node.callee.type === "ImportExpression") {
        this.raise(startPos, "Cannot use new with import()");
      }
      if (this.eat(types.parenL)) {
        node.arguments = this.parseExprList(types.parenR, this.options.ecmaVersion >= 8, false);
      } else {
        node.arguments = empty$1;
      }
      return this.finishNode(node, "NewExpression");
    };
    pp$3.parseTemplateElement = function(ref2) {
      var isTagged = ref2.isTagged;
      var elem = this.startNode();
      if (this.type === types.invalidTemplate) {
        if (!isTagged) {
          this.raiseRecoverable(this.start, "Bad escape sequence in untagged template literal");
        }
        elem.value = {
          raw: this.value,
          cooked: null
        };
      } else {
        elem.value = {
          raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, "\n"),
          cooked: this.value
        };
      }
      this.next();
      elem.tail = this.type === types.backQuote;
      return this.finishNode(elem, "TemplateElement");
    };
    pp$3.parseTemplate = function(ref2) {
      if (ref2 === void 0)
        ref2 = {};
      var isTagged = ref2.isTagged;
      if (isTagged === void 0)
        isTagged = false;
      var node = this.startNode();
      this.next();
      node.expressions = [];
      var curElt = this.parseTemplateElement({ isTagged });
      node.quasis = [curElt];
      while (!curElt.tail) {
        if (this.type === types.eof) {
          this.raise(this.pos, "Unterminated template literal");
        }
        this.expect(types.dollarBraceL);
        node.expressions.push(this.parseExpression());
        this.expect(types.braceR);
        node.quasis.push(curElt = this.parseTemplateElement({ isTagged }));
      }
      this.next();
      return this.finishNode(node, "TemplateLiteral");
    };
    pp$3.isAsyncProp = function(prop) {
      return !prop.computed && prop.key.type === "Identifier" && prop.key.name === "async" && (this.type === types.name || this.type === types.num || this.type === types.string || this.type === types.bracketL || this.type.keyword || this.options.ecmaVersion >= 9 && this.type === types.star) && !lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
    };
    pp$3.parseObj = function(isPattern, refDestructuringErrors) {
      var node = this.startNode(), first = true, propHash = {};
      node.properties = [];
      this.next();
      while (!this.eat(types.braceR)) {
        if (!first) {
          this.expect(types.comma);
          if (this.options.ecmaVersion >= 5 && this.afterTrailingComma(types.braceR)) {
            break;
          }
        } else {
          first = false;
        }
        var prop = this.parseProperty(isPattern, refDestructuringErrors);
        if (!isPattern) {
          this.checkPropClash(prop, propHash, refDestructuringErrors);
        }
        node.properties.push(prop);
      }
      return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
    };
    pp$3.parseProperty = function(isPattern, refDestructuringErrors) {
      var prop = this.startNode(), isGenerator, isAsync, startPos, startLoc;
      if (this.options.ecmaVersion >= 9 && this.eat(types.ellipsis)) {
        if (isPattern) {
          prop.argument = this.parseIdent(false);
          if (this.type === types.comma) {
            this.raise(this.start, "Comma is not permitted after the rest element");
          }
          return this.finishNode(prop, "RestElement");
        }
        if (this.type === types.parenL && refDestructuringErrors) {
          if (refDestructuringErrors.parenthesizedAssign < 0) {
            refDestructuringErrors.parenthesizedAssign = this.start;
          }
          if (refDestructuringErrors.parenthesizedBind < 0) {
            refDestructuringErrors.parenthesizedBind = this.start;
          }
        }
        prop.argument = this.parseMaybeAssign(false, refDestructuringErrors);
        if (this.type === types.comma && refDestructuringErrors && refDestructuringErrors.trailingComma < 0) {
          refDestructuringErrors.trailingComma = this.start;
        }
        return this.finishNode(prop, "SpreadElement");
      }
      if (this.options.ecmaVersion >= 6) {
        prop.method = false;
        prop.shorthand = false;
        if (isPattern || refDestructuringErrors) {
          startPos = this.start;
          startLoc = this.startLoc;
        }
        if (!isPattern) {
          isGenerator = this.eat(types.star);
        }
      }
      var containsEsc = this.containsEsc;
      this.parsePropertyName(prop);
      if (!isPattern && !containsEsc && this.options.ecmaVersion >= 8 && !isGenerator && this.isAsyncProp(prop)) {
        isAsync = true;
        isGenerator = this.options.ecmaVersion >= 9 && this.eat(types.star);
        this.parsePropertyName(prop, refDestructuringErrors);
      } else {
        isAsync = false;
      }
      this.parsePropertyValue(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc);
      return this.finishNode(prop, "Property");
    };
    pp$3.parsePropertyValue = function(prop, isPattern, isGenerator, isAsync, startPos, startLoc, refDestructuringErrors, containsEsc) {
      if ((isGenerator || isAsync) && this.type === types.colon) {
        this.unexpected();
      }
      if (this.eat(types.colon)) {
        prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refDestructuringErrors);
        prop.kind = "init";
      } else if (this.options.ecmaVersion >= 6 && this.type === types.parenL) {
        if (isPattern) {
          this.unexpected();
        }
        prop.kind = "init";
        prop.method = true;
        prop.value = this.parseMethod(isGenerator, isAsync);
      } else if (!isPattern && !containsEsc && this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type !== types.comma && this.type !== types.braceR && this.type !== types.eq)) {
        if (isGenerator || isAsync) {
          this.unexpected();
        }
        prop.kind = prop.key.name;
        this.parsePropertyName(prop);
        prop.value = this.parseMethod(false);
        var paramCount = prop.kind === "get" ? 0 : 1;
        if (prop.value.params.length !== paramCount) {
          var start = prop.value.start;
          if (prop.kind === "get") {
            this.raiseRecoverable(start, "getter should have no params");
          } else {
            this.raiseRecoverable(start, "setter should have exactly one param");
          }
        } else {
          if (prop.kind === "set" && prop.value.params[0].type === "RestElement") {
            this.raiseRecoverable(prop.value.params[0].start, "Setter cannot use rest params");
          }
        }
      } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
        if (isGenerator || isAsync) {
          this.unexpected();
        }
        this.checkUnreserved(prop.key);
        if (prop.key.name === "await" && !this.awaitIdentPos) {
          this.awaitIdentPos = startPos;
        }
        prop.kind = "init";
        if (isPattern) {
          prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
        } else if (this.type === types.eq && refDestructuringErrors) {
          if (refDestructuringErrors.shorthandAssign < 0) {
            refDestructuringErrors.shorthandAssign = this.start;
          }
          prop.value = this.parseMaybeDefault(startPos, startLoc, this.copyNode(prop.key));
        } else {
          prop.value = this.copyNode(prop.key);
        }
        prop.shorthand = true;
      } else {
        this.unexpected();
      }
    };
    pp$3.parsePropertyName = function(prop) {
      if (this.options.ecmaVersion >= 6) {
        if (this.eat(types.bracketL)) {
          prop.computed = true;
          prop.key = this.parseMaybeAssign();
          this.expect(types.bracketR);
          return prop.key;
        } else {
          prop.computed = false;
        }
      }
      return prop.key = this.type === types.num || this.type === types.string ? this.parseExprAtom() : this.parseIdent(this.options.allowReserved !== "never");
    };
    pp$3.initFunction = function(node) {
      node.id = null;
      if (this.options.ecmaVersion >= 6) {
        node.generator = node.expression = false;
      }
      if (this.options.ecmaVersion >= 8) {
        node.async = false;
      }
    };
    pp$3.parseMethod = function(isGenerator, isAsync, allowDirectSuper) {
      var node = this.startNode(), oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.initFunction(node);
      if (this.options.ecmaVersion >= 6) {
        node.generator = isGenerator;
      }
      if (this.options.ecmaVersion >= 8) {
        node.async = !!isAsync;
      }
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      this.enterScope(functionFlags(isAsync, node.generator) | SCOPE_SUPER | (allowDirectSuper ? SCOPE_DIRECT_SUPER : 0));
      this.expect(types.parenL);
      node.params = this.parseBindingList(types.parenR, false, this.options.ecmaVersion >= 8);
      this.checkYieldAwaitInDefaultParams();
      this.parseFunctionBody(node, false, true);
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.finishNode(node, "FunctionExpression");
    };
    pp$3.parseArrowExpression = function(node, params, isAsync) {
      var oldYieldPos = this.yieldPos, oldAwaitPos = this.awaitPos, oldAwaitIdentPos = this.awaitIdentPos;
      this.enterScope(functionFlags(isAsync, false) | SCOPE_ARROW);
      this.initFunction(node);
      if (this.options.ecmaVersion >= 8) {
        node.async = !!isAsync;
      }
      this.yieldPos = 0;
      this.awaitPos = 0;
      this.awaitIdentPos = 0;
      node.params = this.toAssignableList(params, true);
      this.parseFunctionBody(node, true, false);
      this.yieldPos = oldYieldPos;
      this.awaitPos = oldAwaitPos;
      this.awaitIdentPos = oldAwaitIdentPos;
      return this.finishNode(node, "ArrowFunctionExpression");
    };
    pp$3.parseFunctionBody = function(node, isArrowFunction, isMethod) {
      var isExpression = isArrowFunction && this.type !== types.braceL;
      var oldStrict = this.strict, useStrict = false;
      if (isExpression) {
        node.body = this.parseMaybeAssign();
        node.expression = true;
        this.checkParams(node, false);
      } else {
        var nonSimple = this.options.ecmaVersion >= 7 && !this.isSimpleParamList(node.params);
        if (!oldStrict || nonSimple) {
          useStrict = this.strictDirective(this.end);
          if (useStrict && nonSimple) {
            this.raiseRecoverable(node.start, "Illegal 'use strict' directive in function with non-simple parameter list");
          }
        }
        var oldLabels = this.labels;
        this.labels = [];
        if (useStrict) {
          this.strict = true;
        }
        this.checkParams(node, !oldStrict && !useStrict && !isArrowFunction && !isMethod && this.isSimpleParamList(node.params));
        if (this.strict && node.id) {
          this.checkLValSimple(node.id, BIND_OUTSIDE);
        }
        node.body = this.parseBlock(false, void 0, useStrict && !oldStrict);
        node.expression = false;
        this.adaptDirectivePrologue(node.body.body);
        this.labels = oldLabels;
      }
      this.exitScope();
    };
    pp$3.isSimpleParamList = function(params) {
      for (var i = 0, list = params; i < list.length; i += 1) {
        var param = list[i];
        if (param.type !== "Identifier") {
          return false;
        }
      }
      return true;
    };
    pp$3.checkParams = function(node, allowDuplicates) {
      var nameHash = Object.create(null);
      for (var i = 0, list = node.params; i < list.length; i += 1) {
        var param = list[i];
        this.checkLValInnerPattern(param, BIND_VAR, allowDuplicates ? null : nameHash);
      }
    };
    pp$3.parseExprList = function(close, allowTrailingComma, allowEmpty, refDestructuringErrors) {
      var elts = [], first = true;
      while (!this.eat(close)) {
        if (!first) {
          this.expect(types.comma);
          if (allowTrailingComma && this.afterTrailingComma(close)) {
            break;
          }
        } else {
          first = false;
        }
        var elt = void 0;
        if (allowEmpty && this.type === types.comma) {
          elt = null;
        } else if (this.type === types.ellipsis) {
          elt = this.parseSpread(refDestructuringErrors);
          if (refDestructuringErrors && this.type === types.comma && refDestructuringErrors.trailingComma < 0) {
            refDestructuringErrors.trailingComma = this.start;
          }
        } else {
          elt = this.parseMaybeAssign(false, refDestructuringErrors);
        }
        elts.push(elt);
      }
      return elts;
    };
    pp$3.checkUnreserved = function(ref2) {
      var start = ref2.start;
      var end = ref2.end;
      var name = ref2.name;
      if (this.inGenerator && name === "yield") {
        this.raiseRecoverable(start, "Cannot use 'yield' as identifier inside a generator");
      }
      if (this.inAsync && name === "await") {
        this.raiseRecoverable(start, "Cannot use 'await' as identifier inside an async function");
      }
      if (this.currentThisScope().inClassFieldInit && name === "arguments") {
        this.raiseRecoverable(start, "Cannot use 'arguments' in class field initializer");
      }
      if (this.keywords.test(name)) {
        this.raise(start, "Unexpected keyword '" + name + "'");
      }
      if (this.options.ecmaVersion < 6 && this.input.slice(start, end).indexOf("\\") !== -1) {
        return;
      }
      var re = this.strict ? this.reservedWordsStrict : this.reservedWords;
      if (re.test(name)) {
        if (!this.inAsync && name === "await") {
          this.raiseRecoverable(start, "Cannot use keyword 'await' outside an async function");
        }
        this.raiseRecoverable(start, "The keyword '" + name + "' is reserved");
      }
    };
    pp$3.parseIdent = function(liberal, isBinding) {
      var node = this.startNode();
      if (this.type === types.name) {
        node.name = this.value;
      } else if (this.type.keyword) {
        node.name = this.type.keyword;
        if ((node.name === "class" || node.name === "function") && (this.lastTokEnd !== this.lastTokStart + 1 || this.input.charCodeAt(this.lastTokStart) !== 46)) {
          this.context.pop();
        }
      } else {
        this.unexpected();
      }
      this.next(!!liberal);
      this.finishNode(node, "Identifier");
      if (!liberal) {
        this.checkUnreserved(node);
        if (node.name === "await" && !this.awaitIdentPos) {
          this.awaitIdentPos = node.start;
        }
      }
      return node;
    };
    pp$3.parsePrivateIdent = function() {
      var node = this.startNode();
      if (this.type === types.privateId) {
        node.name = this.value;
      } else {
        this.unexpected();
      }
      this.next();
      this.finishNode(node, "PrivateIdentifier");
      if (this.privateNameStack.length === 0) {
        this.raise(node.start, "Private field '#" + node.name + "' must be declared in an enclosing class");
      } else {
        this.privateNameStack[this.privateNameStack.length - 1].used.push(node);
      }
      return node;
    };
    pp$3.parseYield = function(forInit) {
      if (!this.yieldPos) {
        this.yieldPos = this.start;
      }
      var node = this.startNode();
      this.next();
      if (this.type === types.semi || this.canInsertSemicolon() || this.type !== types.star && !this.type.startsExpr) {
        node.delegate = false;
        node.argument = null;
      } else {
        node.delegate = this.eat(types.star);
        node.argument = this.parseMaybeAssign(forInit);
      }
      return this.finishNode(node, "YieldExpression");
    };
    pp$3.parseAwait = function() {
      if (!this.awaitPos) {
        this.awaitPos = this.start;
      }
      var node = this.startNode();
      this.next();
      node.argument = this.parseMaybeUnary(null, true);
      return this.finishNode(node, "AwaitExpression");
    };
    pp$4 = Parser.prototype;
    pp$4.raise = function(pos, message) {
      var loc = getLineInfo(this.input, pos);
      message += " (" + loc.line + ":" + loc.column + ")";
      var err = new SyntaxError(message);
      err.pos = pos;
      err.loc = loc;
      err.raisedAt = this.pos;
      throw err;
    };
    pp$4.raiseRecoverable = pp$4.raise;
    pp$4.curPosition = function() {
      if (this.options.locations) {
        return new Position(this.curLine, this.pos - this.lineStart);
      }
    };
    pp$5 = Parser.prototype;
    Scope = function Scope2(flags) {
      this.flags = flags;
      this.var = [];
      this.lexical = [];
      this.functions = [];
      this.inClassFieldInit = false;
    };
    pp$5.enterScope = function(flags) {
      this.scopeStack.push(new Scope(flags));
    };
    pp$5.exitScope = function() {
      this.scopeStack.pop();
    };
    pp$5.treatFunctionsAsVarInScope = function(scope) {
      return scope.flags & SCOPE_FUNCTION || !this.inModule && scope.flags & SCOPE_TOP;
    };
    pp$5.declareName = function(name, bindingType, pos) {
      var redeclared = false;
      if (bindingType === BIND_LEXICAL) {
        var scope = this.currentScope();
        redeclared = scope.lexical.indexOf(name) > -1 || scope.functions.indexOf(name) > -1 || scope.var.indexOf(name) > -1;
        scope.lexical.push(name);
        if (this.inModule && scope.flags & SCOPE_TOP) {
          delete this.undefinedExports[name];
        }
      } else if (bindingType === BIND_SIMPLE_CATCH) {
        var scope$1 = this.currentScope();
        scope$1.lexical.push(name);
      } else if (bindingType === BIND_FUNCTION) {
        var scope$2 = this.currentScope();
        if (this.treatFunctionsAsVar) {
          redeclared = scope$2.lexical.indexOf(name) > -1;
        } else {
          redeclared = scope$2.lexical.indexOf(name) > -1 || scope$2.var.indexOf(name) > -1;
        }
        scope$2.functions.push(name);
      } else {
        for (var i = this.scopeStack.length - 1; i >= 0; --i) {
          var scope$3 = this.scopeStack[i];
          if (scope$3.lexical.indexOf(name) > -1 && !(scope$3.flags & SCOPE_SIMPLE_CATCH && scope$3.lexical[0] === name) || !this.treatFunctionsAsVarInScope(scope$3) && scope$3.functions.indexOf(name) > -1) {
            redeclared = true;
            break;
          }
          scope$3.var.push(name);
          if (this.inModule && scope$3.flags & SCOPE_TOP) {
            delete this.undefinedExports[name];
          }
          if (scope$3.flags & SCOPE_VAR) {
            break;
          }
        }
      }
      if (redeclared) {
        this.raiseRecoverable(pos, "Identifier '" + name + "' has already been declared");
      }
    };
    pp$5.checkLocalExport = function(id) {
      if (this.scopeStack[0].lexical.indexOf(id.name) === -1 && this.scopeStack[0].var.indexOf(id.name) === -1) {
        this.undefinedExports[id.name] = id;
      }
    };
    pp$5.currentScope = function() {
      return this.scopeStack[this.scopeStack.length - 1];
    };
    pp$5.currentVarScope = function() {
      for (var i = this.scopeStack.length - 1; ; i--) {
        var scope = this.scopeStack[i];
        if (scope.flags & SCOPE_VAR) {
          return scope;
        }
      }
    };
    pp$5.currentThisScope = function() {
      for (var i = this.scopeStack.length - 1; ; i--) {
        var scope = this.scopeStack[i];
        if (scope.flags & SCOPE_VAR && !(scope.flags & SCOPE_ARROW)) {
          return scope;
        }
      }
    };
    Node = function Node2(parser, pos, loc) {
      this.type = "";
      this.start = pos;
      this.end = 0;
      if (parser.options.locations) {
        this.loc = new SourceLocation(parser, loc);
      }
      if (parser.options.directSourceFile) {
        this.sourceFile = parser.options.directSourceFile;
      }
      if (parser.options.ranges) {
        this.range = [pos, 0];
      }
    };
    pp$6 = Parser.prototype;
    pp$6.startNode = function() {
      return new Node(this, this.start, this.startLoc);
    };
    pp$6.startNodeAt = function(pos, loc) {
      return new Node(this, pos, loc);
    };
    pp$6.finishNode = function(node, type) {
      return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
    };
    pp$6.finishNodeAt = function(node, type, pos, loc) {
      return finishNodeAt.call(this, node, type, pos, loc);
    };
    pp$6.copyNode = function(node) {
      var newNode = new Node(this, node.start, this.startLoc);
      for (var prop in node) {
        newNode[prop] = node[prop];
      }
      return newNode;
    };
    TokContext = function TokContext2(token, isExpr, preserveSpace, override, generator) {
      this.token = token;
      this.isExpr = !!isExpr;
      this.preserveSpace = !!preserveSpace;
      this.override = override;
      this.generator = !!generator;
    };
    types$1 = {
      b_stat: new TokContext("{", false),
      b_expr: new TokContext("{", true),
      b_tmpl: new TokContext("${", false),
      p_stat: new TokContext("(", false),
      p_expr: new TokContext("(", true),
      q_tmpl: new TokContext("`", true, true, function(p) {
        return p.tryReadTemplateToken();
      }),
      f_stat: new TokContext("function", false),
      f_expr: new TokContext("function", true),
      f_expr_gen: new TokContext("function", true, false, null, true),
      f_gen: new TokContext("function", false, false, null, true)
    };
    pp$7 = Parser.prototype;
    pp$7.initialContext = function() {
      return [types$1.b_stat];
    };
    pp$7.braceIsBlock = function(prevType) {
      var parent = this.curContext();
      if (parent === types$1.f_expr || parent === types$1.f_stat) {
        return true;
      }
      if (prevType === types.colon && (parent === types$1.b_stat || parent === types$1.b_expr)) {
        return !parent.isExpr;
      }
      if (prevType === types._return || prevType === types.name && this.exprAllowed) {
        return lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
      }
      if (prevType === types._else || prevType === types.semi || prevType === types.eof || prevType === types.parenR || prevType === types.arrow) {
        return true;
      }
      if (prevType === types.braceL) {
        return parent === types$1.b_stat;
      }
      if (prevType === types._var || prevType === types._const || prevType === types.name) {
        return false;
      }
      return !this.exprAllowed;
    };
    pp$7.inGeneratorContext = function() {
      for (var i = this.context.length - 1; i >= 1; i--) {
        var context = this.context[i];
        if (context.token === "function") {
          return context.generator;
        }
      }
      return false;
    };
    pp$7.updateContext = function(prevType) {
      var update, type = this.type;
      if (type.keyword && prevType === types.dot) {
        this.exprAllowed = false;
      } else if (update = type.updateContext) {
        update.call(this, prevType);
      } else {
        this.exprAllowed = type.beforeExpr;
      }
    };
    types.parenR.updateContext = types.braceR.updateContext = function() {
      if (this.context.length === 1) {
        this.exprAllowed = true;
        return;
      }
      var out = this.context.pop();
      if (out === types$1.b_stat && this.curContext().token === "function") {
        out = this.context.pop();
      }
      this.exprAllowed = !out.isExpr;
    };
    types.braceL.updateContext = function(prevType) {
      this.context.push(this.braceIsBlock(prevType) ? types$1.b_stat : types$1.b_expr);
      this.exprAllowed = true;
    };
    types.dollarBraceL.updateContext = function() {
      this.context.push(types$1.b_tmpl);
      this.exprAllowed = true;
    };
    types.parenL.updateContext = function(prevType) {
      var statementParens = prevType === types._if || prevType === types._for || prevType === types._with || prevType === types._while;
      this.context.push(statementParens ? types$1.p_stat : types$1.p_expr);
      this.exprAllowed = true;
    };
    types.incDec.updateContext = function() {
    };
    types._function.updateContext = types._class.updateContext = function(prevType) {
      if (prevType.beforeExpr && prevType !== types._else && !(prevType === types.semi && this.curContext() !== types$1.p_stat) && !(prevType === types._return && lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) && !((prevType === types.colon || prevType === types.braceL) && this.curContext() === types$1.b_stat)) {
        this.context.push(types$1.f_expr);
      } else {
        this.context.push(types$1.f_stat);
      }
      this.exprAllowed = false;
    };
    types.backQuote.updateContext = function() {
      if (this.curContext() === types$1.q_tmpl) {
        this.context.pop();
      } else {
        this.context.push(types$1.q_tmpl);
      }
      this.exprAllowed = false;
    };
    types.star.updateContext = function(prevType) {
      if (prevType === types._function) {
        var index = this.context.length - 1;
        if (this.context[index] === types$1.f_expr) {
          this.context[index] = types$1.f_expr_gen;
        } else {
          this.context[index] = types$1.f_gen;
        }
      }
      this.exprAllowed = true;
    };
    types.name.updateContext = function(prevType) {
      var allowed = false;
      if (this.options.ecmaVersion >= 6 && prevType !== types.dot) {
        if (this.value === "of" && !this.exprAllowed || this.value === "yield" && this.inGeneratorContext()) {
          allowed = true;
        }
      }
      this.exprAllowed = allowed;
    };
    ecma9BinaryProperties = "ASCII ASCII_Hex_Digit AHex Alphabetic Alpha Any Assigned Bidi_Control Bidi_C Bidi_Mirrored Bidi_M Case_Ignorable CI Cased Changes_When_Casefolded CWCF Changes_When_Casemapped CWCM Changes_When_Lowercased CWL Changes_When_NFKC_Casefolded CWKCF Changes_When_Titlecased CWT Changes_When_Uppercased CWU Dash Default_Ignorable_Code_Point DI Deprecated Dep Diacritic Dia Emoji Emoji_Component Emoji_Modifier Emoji_Modifier_Base Emoji_Presentation Extender Ext Grapheme_Base Gr_Base Grapheme_Extend Gr_Ext Hex_Digit Hex IDS_Binary_Operator IDSB IDS_Trinary_Operator IDST ID_Continue IDC ID_Start IDS Ideographic Ideo Join_Control Join_C Logical_Order_Exception LOE Lowercase Lower Math Noncharacter_Code_Point NChar Pattern_Syntax Pat_Syn Pattern_White_Space Pat_WS Quotation_Mark QMark Radical Regional_Indicator RI Sentence_Terminal STerm Soft_Dotted SD Terminal_Punctuation Term Unified_Ideograph UIdeo Uppercase Upper Variation_Selector VS White_Space space XID_Continue XIDC XID_Start XIDS";
    ecma10BinaryProperties = ecma9BinaryProperties + " Extended_Pictographic";
    ecma11BinaryProperties = ecma10BinaryProperties;
    ecma12BinaryProperties = ecma11BinaryProperties + " EBase EComp EMod EPres ExtPict";
    unicodeBinaryProperties = {
      9: ecma9BinaryProperties,
      10: ecma10BinaryProperties,
      11: ecma11BinaryProperties,
      12: ecma12BinaryProperties
    };
    unicodeGeneralCategoryValues = "Cased_Letter LC Close_Punctuation Pe Connector_Punctuation Pc Control Cc cntrl Currency_Symbol Sc Dash_Punctuation Pd Decimal_Number Nd digit Enclosing_Mark Me Final_Punctuation Pf Format Cf Initial_Punctuation Pi Letter L Letter_Number Nl Line_Separator Zl Lowercase_Letter Ll Mark M Combining_Mark Math_Symbol Sm Modifier_Letter Lm Modifier_Symbol Sk Nonspacing_Mark Mn Number N Open_Punctuation Ps Other C Other_Letter Lo Other_Number No Other_Punctuation Po Other_Symbol So Paragraph_Separator Zp Private_Use Co Punctuation P punct Separator Z Space_Separator Zs Spacing_Mark Mc Surrogate Cs Symbol S Titlecase_Letter Lt Unassigned Cn Uppercase_Letter Lu";
    ecma9ScriptValues = "Adlam Adlm Ahom Ahom Anatolian_Hieroglyphs Hluw Arabic Arab Armenian Armn Avestan Avst Balinese Bali Bamum Bamu Bassa_Vah Bass Batak Batk Bengali Beng Bhaiksuki Bhks Bopomofo Bopo Brahmi Brah Braille Brai Buginese Bugi Buhid Buhd Canadian_Aboriginal Cans Carian Cari Caucasian_Albanian Aghb Chakma Cakm Cham Cham Cherokee Cher Common Zyyy Coptic Copt Qaac Cuneiform Xsux Cypriot Cprt Cyrillic Cyrl Deseret Dsrt Devanagari Deva Duployan Dupl Egyptian_Hieroglyphs Egyp Elbasan Elba Ethiopic Ethi Georgian Geor Glagolitic Glag Gothic Goth Grantha Gran Greek Grek Gujarati Gujr Gurmukhi Guru Han Hani Hangul Hang Hanunoo Hano Hatran Hatr Hebrew Hebr Hiragana Hira Imperial_Aramaic Armi Inherited Zinh Qaai Inscriptional_Pahlavi Phli Inscriptional_Parthian Prti Javanese Java Kaithi Kthi Kannada Knda Katakana Kana Kayah_Li Kali Kharoshthi Khar Khmer Khmr Khojki Khoj Khudawadi Sind Lao Laoo Latin Latn Lepcha Lepc Limbu Limb Linear_A Lina Linear_B Linb Lisu Lisu Lycian Lyci Lydian Lydi Mahajani Mahj Malayalam Mlym Mandaic Mand Manichaean Mani Marchen Marc Masaram_Gondi Gonm Meetei_Mayek Mtei Mende_Kikakui Mend Meroitic_Cursive Merc Meroitic_Hieroglyphs Mero Miao Plrd Modi Modi Mongolian Mong Mro Mroo Multani Mult Myanmar Mymr Nabataean Nbat New_Tai_Lue Talu Newa Newa Nko Nkoo Nushu Nshu Ogham Ogam Ol_Chiki Olck Old_Hungarian Hung Old_Italic Ital Old_North_Arabian Narb Old_Permic Perm Old_Persian Xpeo Old_South_Arabian Sarb Old_Turkic Orkh Oriya Orya Osage Osge Osmanya Osma Pahawh_Hmong Hmng Palmyrene Palm Pau_Cin_Hau Pauc Phags_Pa Phag Phoenician Phnx Psalter_Pahlavi Phlp Rejang Rjng Runic Runr Samaritan Samr Saurashtra Saur Sharada Shrd Shavian Shaw Siddham Sidd SignWriting Sgnw Sinhala Sinh Sora_Sompeng Sora Soyombo Soyo Sundanese Sund Syloti_Nagri Sylo Syriac Syrc Tagalog Tglg Tagbanwa Tagb Tai_Le Tale Tai_Tham Lana Tai_Viet Tavt Takri Takr Tamil Taml Tangut Tang Telugu Telu Thaana Thaa Thai Thai Tibetan Tibt Tifinagh Tfng Tirhuta Tirh Ugaritic Ugar Vai Vaii Warang_Citi Wara Yi Yiii Zanabazar_Square Zanb";
    ecma10ScriptValues = ecma9ScriptValues + " Dogra Dogr Gunjala_Gondi Gong Hanifi_Rohingya Rohg Makasar Maka Medefaidrin Medf Old_Sogdian Sogo Sogdian Sogd";
    ecma11ScriptValues = ecma10ScriptValues + " Elymaic Elym Nandinagari Nand Nyiakeng_Puachue_Hmong Hmnp Wancho Wcho";
    ecma12ScriptValues = ecma11ScriptValues + " Chorasmian Chrs Diak Dives_Akuru Khitan_Small_Script Kits Yezi Yezidi";
    unicodeScriptValues = {
      9: ecma9ScriptValues,
      10: ecma10ScriptValues,
      11: ecma11ScriptValues,
      12: ecma12ScriptValues
    };
    data = {};
    buildUnicodeData(9);
    buildUnicodeData(10);
    buildUnicodeData(11);
    buildUnicodeData(12);
    pp$8 = Parser.prototype;
    RegExpValidationState = function RegExpValidationState2(parser) {
      this.parser = parser;
      this.validFlags = "gim" + (parser.options.ecmaVersion >= 6 ? "uy" : "") + (parser.options.ecmaVersion >= 9 ? "s" : "") + (parser.options.ecmaVersion >= 13 ? "d" : "");
      this.unicodeProperties = data[parser.options.ecmaVersion >= 12 ? 12 : parser.options.ecmaVersion];
      this.source = "";
      this.flags = "";
      this.start = 0;
      this.switchU = false;
      this.switchN = false;
      this.pos = 0;
      this.lastIntValue = 0;
      this.lastStringValue = "";
      this.lastAssertionIsQuantifiable = false;
      this.numCapturingParens = 0;
      this.maxBackReference = 0;
      this.groupNames = [];
      this.backReferenceNames = [];
    };
    RegExpValidationState.prototype.reset = function reset(start, pattern, flags) {
      var unicode = flags.indexOf("u") !== -1;
      this.start = start | 0;
      this.source = pattern + "";
      this.flags = flags;
      this.switchU = unicode && this.parser.options.ecmaVersion >= 6;
      this.switchN = unicode && this.parser.options.ecmaVersion >= 9;
    };
    RegExpValidationState.prototype.raise = function raise(message) {
      this.parser.raiseRecoverable(this.start, "Invalid regular expression: /" + this.source + "/: " + message);
    };
    RegExpValidationState.prototype.at = function at(i, forceU) {
      if (forceU === void 0)
        forceU = false;
      var s = this.source;
      var l = s.length;
      if (i >= l) {
        return -1;
      }
      var c = s.charCodeAt(i);
      if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i + 1 >= l) {
        return c;
      }
      var next = s.charCodeAt(i + 1);
      return next >= 56320 && next <= 57343 ? (c << 10) + next - 56613888 : c;
    };
    RegExpValidationState.prototype.nextIndex = function nextIndex(i, forceU) {
      if (forceU === void 0)
        forceU = false;
      var s = this.source;
      var l = s.length;
      if (i >= l) {
        return l;
      }
      var c = s.charCodeAt(i), next;
      if (!(forceU || this.switchU) || c <= 55295 || c >= 57344 || i + 1 >= l || (next = s.charCodeAt(i + 1)) < 56320 || next > 57343) {
        return i + 1;
      }
      return i + 2;
    };
    RegExpValidationState.prototype.current = function current(forceU) {
      if (forceU === void 0)
        forceU = false;
      return this.at(this.pos, forceU);
    };
    RegExpValidationState.prototype.lookahead = function lookahead(forceU) {
      if (forceU === void 0)
        forceU = false;
      return this.at(this.nextIndex(this.pos, forceU), forceU);
    };
    RegExpValidationState.prototype.advance = function advance2(forceU) {
      if (forceU === void 0)
        forceU = false;
      this.pos = this.nextIndex(this.pos, forceU);
    };
    RegExpValidationState.prototype.eat = function eat(ch, forceU) {
      if (forceU === void 0)
        forceU = false;
      if (this.current(forceU) === ch) {
        this.advance(forceU);
        return true;
      }
      return false;
    };
    pp$8.validateRegExpFlags = function(state) {
      var validFlags = state.validFlags;
      var flags = state.flags;
      for (var i = 0; i < flags.length; i++) {
        var flag = flags.charAt(i);
        if (validFlags.indexOf(flag) === -1) {
          this.raise(state.start, "Invalid regular expression flag");
        }
        if (flags.indexOf(flag, i + 1) > -1) {
          this.raise(state.start, "Duplicate regular expression flag");
        }
      }
    };
    pp$8.validateRegExpPattern = function(state) {
      this.regexp_pattern(state);
      if (!state.switchN && this.options.ecmaVersion >= 9 && state.groupNames.length > 0) {
        state.switchN = true;
        this.regexp_pattern(state);
      }
    };
    pp$8.regexp_pattern = function(state) {
      state.pos = 0;
      state.lastIntValue = 0;
      state.lastStringValue = "";
      state.lastAssertionIsQuantifiable = false;
      state.numCapturingParens = 0;
      state.maxBackReference = 0;
      state.groupNames.length = 0;
      state.backReferenceNames.length = 0;
      this.regexp_disjunction(state);
      if (state.pos !== state.source.length) {
        if (state.eat(41)) {
          state.raise("Unmatched ')'");
        }
        if (state.eat(93) || state.eat(125)) {
          state.raise("Lone quantifier brackets");
        }
      }
      if (state.maxBackReference > state.numCapturingParens) {
        state.raise("Invalid escape");
      }
      for (var i = 0, list = state.backReferenceNames; i < list.length; i += 1) {
        var name = list[i];
        if (state.groupNames.indexOf(name) === -1) {
          state.raise("Invalid named capture referenced");
        }
      }
    };
    pp$8.regexp_disjunction = function(state) {
      this.regexp_alternative(state);
      while (state.eat(124)) {
        this.regexp_alternative(state);
      }
      if (this.regexp_eatQuantifier(state, true)) {
        state.raise("Nothing to repeat");
      }
      if (state.eat(123)) {
        state.raise("Lone quantifier brackets");
      }
    };
    pp$8.regexp_alternative = function(state) {
      while (state.pos < state.source.length && this.regexp_eatTerm(state)) {
      }
    };
    pp$8.regexp_eatTerm = function(state) {
      if (this.regexp_eatAssertion(state)) {
        if (state.lastAssertionIsQuantifiable && this.regexp_eatQuantifier(state)) {
          if (state.switchU) {
            state.raise("Invalid quantifier");
          }
        }
        return true;
      }
      if (state.switchU ? this.regexp_eatAtom(state) : this.regexp_eatExtendedAtom(state)) {
        this.regexp_eatQuantifier(state);
        return true;
      }
      return false;
    };
    pp$8.regexp_eatAssertion = function(state) {
      var start = state.pos;
      state.lastAssertionIsQuantifiable = false;
      if (state.eat(94) || state.eat(36)) {
        return true;
      }
      if (state.eat(92)) {
        if (state.eat(66) || state.eat(98)) {
          return true;
        }
        state.pos = start;
      }
      if (state.eat(40) && state.eat(63)) {
        var lookbehind = false;
        if (this.options.ecmaVersion >= 9) {
          lookbehind = state.eat(60);
        }
        if (state.eat(61) || state.eat(33)) {
          this.regexp_disjunction(state);
          if (!state.eat(41)) {
            state.raise("Unterminated group");
          }
          state.lastAssertionIsQuantifiable = !lookbehind;
          return true;
        }
      }
      state.pos = start;
      return false;
    };
    pp$8.regexp_eatQuantifier = function(state, noError) {
      if (noError === void 0)
        noError = false;
      if (this.regexp_eatQuantifierPrefix(state, noError)) {
        state.eat(63);
        return true;
      }
      return false;
    };
    pp$8.regexp_eatQuantifierPrefix = function(state, noError) {
      return state.eat(42) || state.eat(43) || state.eat(63) || this.regexp_eatBracedQuantifier(state, noError);
    };
    pp$8.regexp_eatBracedQuantifier = function(state, noError) {
      var start = state.pos;
      if (state.eat(123)) {
        var min = 0, max = -1;
        if (this.regexp_eatDecimalDigits(state)) {
          min = state.lastIntValue;
          if (state.eat(44) && this.regexp_eatDecimalDigits(state)) {
            max = state.lastIntValue;
          }
          if (state.eat(125)) {
            if (max !== -1 && max < min && !noError) {
              state.raise("numbers out of order in {} quantifier");
            }
            return true;
          }
        }
        if (state.switchU && !noError) {
          state.raise("Incomplete quantifier");
        }
        state.pos = start;
      }
      return false;
    };
    pp$8.regexp_eatAtom = function(state) {
      return this.regexp_eatPatternCharacters(state) || state.eat(46) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state);
    };
    pp$8.regexp_eatReverseSolidusAtomEscape = function(state) {
      var start = state.pos;
      if (state.eat(92)) {
        if (this.regexp_eatAtomEscape(state)) {
          return true;
        }
        state.pos = start;
      }
      return false;
    };
    pp$8.regexp_eatUncapturingGroup = function(state) {
      var start = state.pos;
      if (state.eat(40)) {
        if (state.eat(63) && state.eat(58)) {
          this.regexp_disjunction(state);
          if (state.eat(41)) {
            return true;
          }
          state.raise("Unterminated group");
        }
        state.pos = start;
      }
      return false;
    };
    pp$8.regexp_eatCapturingGroup = function(state) {
      if (state.eat(40)) {
        if (this.options.ecmaVersion >= 9) {
          this.regexp_groupSpecifier(state);
        } else if (state.current() === 63) {
          state.raise("Invalid group");
        }
        this.regexp_disjunction(state);
        if (state.eat(41)) {
          state.numCapturingParens += 1;
          return true;
        }
        state.raise("Unterminated group");
      }
      return false;
    };
    pp$8.regexp_eatExtendedAtom = function(state) {
      return state.eat(46) || this.regexp_eatReverseSolidusAtomEscape(state) || this.regexp_eatCharacterClass(state) || this.regexp_eatUncapturingGroup(state) || this.regexp_eatCapturingGroup(state) || this.regexp_eatInvalidBracedQuantifier(state) || this.regexp_eatExtendedPatternCharacter(state);
    };
    pp$8.regexp_eatInvalidBracedQuantifier = function(state) {
      if (this.regexp_eatBracedQuantifier(state, true)) {
        state.raise("Nothing to repeat");
      }
      return false;
    };
    pp$8.regexp_eatSyntaxCharacter = function(state) {
      var ch = state.current();
      if (isSyntaxCharacter(ch)) {
        state.lastIntValue = ch;
        state.advance();
        return true;
      }
      return false;
    };
    pp$8.regexp_eatPatternCharacters = function(state) {
      var start = state.pos;
      var ch = 0;
      while ((ch = state.current()) !== -1 && !isSyntaxCharacter(ch)) {
        state.advance();
      }
      return state.pos !== start;
    };
    pp$8.regexp_eatExtendedPatternCharacter = function(state) {
      var ch = state.current();
      if (ch !== -1 && ch !== 36 && !(ch >= 40 && ch <= 43) && ch !== 46 && ch !== 63 && ch !== 91 && ch !== 94 && ch !== 124) {
        state.advance();
        return true;
      }
      return false;
    };
    pp$8.regexp_groupSpecifier = function(state) {
      if (state.eat(63)) {
        if (this.regexp_eatGroupName(state)) {
          if (state.groupNames.indexOf(state.lastStringValue) !== -1) {
            state.raise("Duplicate capture group name");
          }
          state.groupNames.push(state.lastStringValue);
          return;
        }
        state.raise("Invalid group");
      }
    };
    pp$8.regexp_eatGroupName = function(state) {
      state.lastStringValue = "";
      if (state.eat(60)) {
        if (this.regexp_eatRegExpIdentifierName(state) && state.eat(62)) {
          return true;
        }
        state.raise("Invalid capture group name");
      }
      return false;
    };
    pp$8.regexp_eatRegExpIdentifierName = function(state) {
      state.lastStringValue = "";
      if (this.regexp_eatRegExpIdentifierStart(state)) {
        state.lastStringValue += codePointToString(state.lastIntValue);
        while (this.regexp_eatRegExpIdentifierPart(state)) {
          state.lastStringValue += codePointToString(state.lastIntValue);
        }
        return true;
      }
      return false;
    };
    pp$8.regexp_eatRegExpIdentifierStart = function(state) {
      var start = state.pos;
      var forceU = this.options.ecmaVersion >= 11;
      var ch = state.current(forceU);
      state.advance(forceU);
      if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
        ch = state.lastIntValue;
      }
      if (isRegExpIdentifierStart(ch)) {
        state.lastIntValue = ch;
        return true;
      }
      state.pos = start;
      return false;
    };
    pp$8.regexp_eatRegExpIdentifierPart = function(state) {
      var start = state.pos;
      var forceU = this.options.ecmaVersion >= 11;
      var ch = state.current(forceU);
      state.advance(forceU);
      if (ch === 92 && this.regexp_eatRegExpUnicodeEscapeSequence(state, forceU)) {
        ch = state.lastIntValue;
      }
      if (isRegExpIdentifierPart(ch)) {
        state.lastIntValue = ch;
        return true;
      }
      state.pos = start;
      return false;
    };
    pp$8.regexp_eatAtomEscape = function(state) {
      if (this.regexp_eatBackReference(state) || this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state) || state.switchN && this.regexp_eatKGroupName(state)) {
        return true;
      }
      if (state.switchU) {
        if (state.current() === 99) {
          state.raise("Invalid unicode escape");
        }
        state.raise("Invalid escape");
      }
      return false;
    };
    pp$8.regexp_eatBackReference = function(state) {
      var start = state.pos;
      if (this.regexp_eatDecimalEscape(state)) {
        var n2 = state.lastIntValue;
        if (state.switchU) {
          if (n2 > state.maxBackReference) {
            state.maxBackReference = n2;
          }
          return true;
        }
        if (n2 <= state.numCapturingParens) {
          return true;
        }
        state.pos = start;
      }
      return false;
    };
    pp$8.regexp_eatKGroupName = function(state) {
      if (state.eat(107)) {
        if (this.regexp_eatGroupName(state)) {
          state.backReferenceNames.push(state.lastStringValue);
          return true;
        }
        state.raise("Invalid named reference");
      }
      return false;
    };
    pp$8.regexp_eatCharacterEscape = function(state) {
      return this.regexp_eatControlEscape(state) || this.regexp_eatCControlLetter(state) || this.regexp_eatZero(state) || this.regexp_eatHexEscapeSequence(state) || this.regexp_eatRegExpUnicodeEscapeSequence(state, false) || !state.switchU && this.regexp_eatLegacyOctalEscapeSequence(state) || this.regexp_eatIdentityEscape(state);
    };
    pp$8.regexp_eatCControlLetter = function(state) {
      var start = state.pos;
      if (state.eat(99)) {
        if (this.regexp_eatControlLetter(state)) {
          return true;
        }
        state.pos = start;
      }
      return false;
    };
    pp$8.regexp_eatZero = function(state) {
      if (state.current() === 48 && !isDecimalDigit(state.lookahead())) {
        state.lastIntValue = 0;
        state.advance();
        return true;
      }
      return false;
    };
    pp$8.regexp_eatControlEscape = function(state) {
      var ch = state.current();
      if (ch === 116) {
        state.lastIntValue = 9;
        state.advance();
        return true;
      }
      if (ch === 110) {
        state.lastIntValue = 10;
        state.advance();
        return true;
      }
      if (ch === 118) {
        state.lastIntValue = 11;
        state.advance();
        return true;
      }
      if (ch === 102) {
        state.lastIntValue = 12;
        state.advance();
        return true;
      }
      if (ch === 114) {
        state.lastIntValue = 13;
        state.advance();
        return true;
      }
      return false;
    };
    pp$8.regexp_eatControlLetter = function(state) {
      var ch = state.current();
      if (isControlLetter(ch)) {
        state.lastIntValue = ch % 32;
        state.advance();
        return true;
      }
      return false;
    };
    pp$8.regexp_eatRegExpUnicodeEscapeSequence = function(state, forceU) {
      if (forceU === void 0)
        forceU = false;
      var start = state.pos;
      var switchU = forceU || state.switchU;
      if (state.eat(117)) {
        if (this.regexp_eatFixedHexDigits(state, 4)) {
          var lead = state.lastIntValue;
          if (switchU && lead >= 55296 && lead <= 56319) {
            var leadSurrogateEnd = state.pos;
            if (state.eat(92) && state.eat(117) && this.regexp_eatFixedHexDigits(state, 4)) {
              var trail = state.lastIntValue;
              if (trail >= 56320 && trail <= 57343) {
                state.lastIntValue = (lead - 55296) * 1024 + (trail - 56320) + 65536;
                return true;
              }
            }
            state.pos = leadSurrogateEnd;
            state.lastIntValue = lead;
          }
          return true;
        }
        if (switchU && state.eat(123) && this.regexp_eatHexDigits(state) && state.eat(125) && isValidUnicode(state.lastIntValue)) {
          return true;
        }
        if (switchU) {
          state.raise("Invalid unicode escape");
        }
        state.pos = start;
      }
      return false;
    };
    pp$8.regexp_eatIdentityEscape = function(state) {
      if (state.switchU) {
        if (this.regexp_eatSyntaxCharacter(state)) {
          return true;
        }
        if (state.eat(47)) {
          state.lastIntValue = 47;
          return true;
        }
        return false;
      }
      var ch = state.current();
      if (ch !== 99 && (!state.switchN || ch !== 107)) {
        state.lastIntValue = ch;
        state.advance();
        return true;
      }
      return false;
    };
    pp$8.regexp_eatDecimalEscape = function(state) {
      state.lastIntValue = 0;
      var ch = state.current();
      if (ch >= 49 && ch <= 57) {
        do {
          state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
          state.advance();
        } while ((ch = state.current()) >= 48 && ch <= 57);
        return true;
      }
      return false;
    };
    pp$8.regexp_eatCharacterClassEscape = function(state) {
      var ch = state.current();
      if (isCharacterClassEscape(ch)) {
        state.lastIntValue = -1;
        state.advance();
        return true;
      }
      if (state.switchU && this.options.ecmaVersion >= 9 && (ch === 80 || ch === 112)) {
        state.lastIntValue = -1;
        state.advance();
        if (state.eat(123) && this.regexp_eatUnicodePropertyValueExpression(state) && state.eat(125)) {
          return true;
        }
        state.raise("Invalid property name");
      }
      return false;
    };
    pp$8.regexp_eatUnicodePropertyValueExpression = function(state) {
      var start = state.pos;
      if (this.regexp_eatUnicodePropertyName(state) && state.eat(61)) {
        var name = state.lastStringValue;
        if (this.regexp_eatUnicodePropertyValue(state)) {
          var value = state.lastStringValue;
          this.regexp_validateUnicodePropertyNameAndValue(state, name, value);
          return true;
        }
      }
      state.pos = start;
      if (this.regexp_eatLoneUnicodePropertyNameOrValue(state)) {
        var nameOrValue = state.lastStringValue;
        this.regexp_validateUnicodePropertyNameOrValue(state, nameOrValue);
        return true;
      }
      return false;
    };
    pp$8.regexp_validateUnicodePropertyNameAndValue = function(state, name, value) {
      if (!has2(state.unicodeProperties.nonBinary, name)) {
        state.raise("Invalid property name");
      }
      if (!state.unicodeProperties.nonBinary[name].test(value)) {
        state.raise("Invalid property value");
      }
    };
    pp$8.regexp_validateUnicodePropertyNameOrValue = function(state, nameOrValue) {
      if (!state.unicodeProperties.binary.test(nameOrValue)) {
        state.raise("Invalid property name");
      }
    };
    pp$8.regexp_eatUnicodePropertyName = function(state) {
      var ch = 0;
      state.lastStringValue = "";
      while (isUnicodePropertyNameCharacter(ch = state.current())) {
        state.lastStringValue += codePointToString(ch);
        state.advance();
      }
      return state.lastStringValue !== "";
    };
    pp$8.regexp_eatUnicodePropertyValue = function(state) {
      var ch = 0;
      state.lastStringValue = "";
      while (isUnicodePropertyValueCharacter(ch = state.current())) {
        state.lastStringValue += codePointToString(ch);
        state.advance();
      }
      return state.lastStringValue !== "";
    };
    pp$8.regexp_eatLoneUnicodePropertyNameOrValue = function(state) {
      return this.regexp_eatUnicodePropertyValue(state);
    };
    pp$8.regexp_eatCharacterClass = function(state) {
      if (state.eat(91)) {
        state.eat(94);
        this.regexp_classRanges(state);
        if (state.eat(93)) {
          return true;
        }
        state.raise("Unterminated character class");
      }
      return false;
    };
    pp$8.regexp_classRanges = function(state) {
      while (this.regexp_eatClassAtom(state)) {
        var left = state.lastIntValue;
        if (state.eat(45) && this.regexp_eatClassAtom(state)) {
          var right = state.lastIntValue;
          if (state.switchU && (left === -1 || right === -1)) {
            state.raise("Invalid character class");
          }
          if (left !== -1 && right !== -1 && left > right) {
            state.raise("Range out of order in character class");
          }
        }
      }
    };
    pp$8.regexp_eatClassAtom = function(state) {
      var start = state.pos;
      if (state.eat(92)) {
        if (this.regexp_eatClassEscape(state)) {
          return true;
        }
        if (state.switchU) {
          var ch$1 = state.current();
          if (ch$1 === 99 || isOctalDigit(ch$1)) {
            state.raise("Invalid class escape");
          }
          state.raise("Invalid escape");
        }
        state.pos = start;
      }
      var ch = state.current();
      if (ch !== 93) {
        state.lastIntValue = ch;
        state.advance();
        return true;
      }
      return false;
    };
    pp$8.regexp_eatClassEscape = function(state) {
      var start = state.pos;
      if (state.eat(98)) {
        state.lastIntValue = 8;
        return true;
      }
      if (state.switchU && state.eat(45)) {
        state.lastIntValue = 45;
        return true;
      }
      if (!state.switchU && state.eat(99)) {
        if (this.regexp_eatClassControlLetter(state)) {
          return true;
        }
        state.pos = start;
      }
      return this.regexp_eatCharacterClassEscape(state) || this.regexp_eatCharacterEscape(state);
    };
    pp$8.regexp_eatClassControlLetter = function(state) {
      var ch = state.current();
      if (isDecimalDigit(ch) || ch === 95) {
        state.lastIntValue = ch % 32;
        state.advance();
        return true;
      }
      return false;
    };
    pp$8.regexp_eatHexEscapeSequence = function(state) {
      var start = state.pos;
      if (state.eat(120)) {
        if (this.regexp_eatFixedHexDigits(state, 2)) {
          return true;
        }
        if (state.switchU) {
          state.raise("Invalid escape");
        }
        state.pos = start;
      }
      return false;
    };
    pp$8.regexp_eatDecimalDigits = function(state) {
      var start = state.pos;
      var ch = 0;
      state.lastIntValue = 0;
      while (isDecimalDigit(ch = state.current())) {
        state.lastIntValue = 10 * state.lastIntValue + (ch - 48);
        state.advance();
      }
      return state.pos !== start;
    };
    pp$8.regexp_eatHexDigits = function(state) {
      var start = state.pos;
      var ch = 0;
      state.lastIntValue = 0;
      while (isHexDigit(ch = state.current())) {
        state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
        state.advance();
      }
      return state.pos !== start;
    };
    pp$8.regexp_eatLegacyOctalEscapeSequence = function(state) {
      if (this.regexp_eatOctalDigit(state)) {
        var n1 = state.lastIntValue;
        if (this.regexp_eatOctalDigit(state)) {
          var n2 = state.lastIntValue;
          if (n1 <= 3 && this.regexp_eatOctalDigit(state)) {
            state.lastIntValue = n1 * 64 + n2 * 8 + state.lastIntValue;
          } else {
            state.lastIntValue = n1 * 8 + n2;
          }
        } else {
          state.lastIntValue = n1;
        }
        return true;
      }
      return false;
    };
    pp$8.regexp_eatOctalDigit = function(state) {
      var ch = state.current();
      if (isOctalDigit(ch)) {
        state.lastIntValue = ch - 48;
        state.advance();
        return true;
      }
      state.lastIntValue = 0;
      return false;
    };
    pp$8.regexp_eatFixedHexDigits = function(state, length3) {
      var start = state.pos;
      state.lastIntValue = 0;
      for (var i = 0; i < length3; ++i) {
        var ch = state.current();
        if (!isHexDigit(ch)) {
          state.pos = start;
          return false;
        }
        state.lastIntValue = 16 * state.lastIntValue + hexToInt(ch);
        state.advance();
      }
      return true;
    };
    Token = function Token2(p) {
      this.type = p.type;
      this.value = p.value;
      this.start = p.start;
      this.end = p.end;
      if (p.options.locations) {
        this.loc = new SourceLocation(p, p.startLoc, p.endLoc);
      }
      if (p.options.ranges) {
        this.range = [p.start, p.end];
      }
    };
    pp$9 = Parser.prototype;
    pp$9.next = function(ignoreEscapeSequenceInKeyword) {
      if (!ignoreEscapeSequenceInKeyword && this.type.keyword && this.containsEsc) {
        this.raiseRecoverable(this.start, "Escape sequence in keyword " + this.type.keyword);
      }
      if (this.options.onToken) {
        this.options.onToken(new Token(this));
      }
      this.lastTokEnd = this.end;
      this.lastTokStart = this.start;
      this.lastTokEndLoc = this.endLoc;
      this.lastTokStartLoc = this.startLoc;
      this.nextToken();
    };
    pp$9.getToken = function() {
      this.next();
      return new Token(this);
    };
    if (typeof Symbol !== "undefined") {
      pp$9[Symbol.iterator] = function() {
        var this$1$1 = this;
        return {
          next: function() {
            var token = this$1$1.getToken();
            return {
              done: token.type === types.eof,
              value: token
            };
          }
        };
      };
    }
    pp$9.curContext = function() {
      return this.context[this.context.length - 1];
    };
    pp$9.nextToken = function() {
      var curContext = this.curContext();
      if (!curContext || !curContext.preserveSpace) {
        this.skipSpace();
      }
      this.start = this.pos;
      if (this.options.locations) {
        this.startLoc = this.curPosition();
      }
      if (this.pos >= this.input.length) {
        return this.finishToken(types.eof);
      }
      if (curContext.override) {
        return curContext.override(this);
      } else {
        this.readToken(this.fullCharCodeAtPos());
      }
    };
    pp$9.readToken = function(code) {
      if (isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92) {
        return this.readWord();
      }
      return this.getTokenFromCode(code);
    };
    pp$9.fullCharCodeAtPos = function() {
      var code = this.input.charCodeAt(this.pos);
      if (code <= 55295 || code >= 56320) {
        return code;
      }
      var next = this.input.charCodeAt(this.pos + 1);
      return next <= 56319 || next >= 57344 ? code : (code << 10) + next - 56613888;
    };
    pp$9.skipBlockComment = function() {
      var startLoc = this.options.onComment && this.curPosition();
      var start = this.pos, end = this.input.indexOf("*/", this.pos += 2);
      if (end === -1) {
        this.raise(this.pos - 2, "Unterminated comment");
      }
      this.pos = end + 2;
      if (this.options.locations) {
        lineBreakG.lastIndex = start;
        var match;
        while ((match = lineBreakG.exec(this.input)) && match.index < this.pos) {
          ++this.curLine;
          this.lineStart = match.index + match[0].length;
        }
      }
      if (this.options.onComment) {
        this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos, startLoc, this.curPosition());
      }
    };
    pp$9.skipLineComment = function(startSkip) {
      var start = this.pos;
      var startLoc = this.options.onComment && this.curPosition();
      var ch = this.input.charCodeAt(this.pos += startSkip);
      while (this.pos < this.input.length && !isNewLine(ch)) {
        ch = this.input.charCodeAt(++this.pos);
      }
      if (this.options.onComment) {
        this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos, startLoc, this.curPosition());
      }
    };
    pp$9.skipSpace = function() {
      loop:
        while (this.pos < this.input.length) {
          var ch = this.input.charCodeAt(this.pos);
          switch (ch) {
            case 32:
            case 160:
              ++this.pos;
              break;
            case 13:
              if (this.input.charCodeAt(this.pos + 1) === 10) {
                ++this.pos;
              }
            case 10:
            case 8232:
            case 8233:
              ++this.pos;
              if (this.options.locations) {
                ++this.curLine;
                this.lineStart = this.pos;
              }
              break;
            case 47:
              switch (this.input.charCodeAt(this.pos + 1)) {
                case 42:
                  this.skipBlockComment();
                  break;
                case 47:
                  this.skipLineComment(2);
                  break;
                default:
                  break loop;
              }
              break;
            default:
              if (ch > 8 && ch < 14 || ch >= 5760 && nonASCIIwhitespace.test(String.fromCharCode(ch))) {
                ++this.pos;
              } else {
                break loop;
              }
          }
        }
    };
    pp$9.finishToken = function(type, val) {
      this.end = this.pos;
      if (this.options.locations) {
        this.endLoc = this.curPosition();
      }
      var prevType = this.type;
      this.type = type;
      this.value = val;
      this.updateContext(prevType);
    };
    pp$9.readToken_dot = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next >= 48 && next <= 57) {
        return this.readNumber(true);
      }
      var next2 = this.input.charCodeAt(this.pos + 2);
      if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
        this.pos += 3;
        return this.finishToken(types.ellipsis);
      } else {
        ++this.pos;
        return this.finishToken(types.dot);
      }
    };
    pp$9.readToken_slash = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (this.exprAllowed) {
        ++this.pos;
        return this.readRegexp();
      }
      if (next === 61) {
        return this.finishOp(types.assign, 2);
      }
      return this.finishOp(types.slash, 1);
    };
    pp$9.readToken_mult_modulo_exp = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      var size = 1;
      var tokentype = code === 42 ? types.star : types.modulo;
      if (this.options.ecmaVersion >= 7 && code === 42 && next === 42) {
        ++size;
        tokentype = types.starstar;
        next = this.input.charCodeAt(this.pos + 2);
      }
      if (next === 61) {
        return this.finishOp(types.assign, size + 1);
      }
      return this.finishOp(tokentype, size);
    };
    pp$9.readToken_pipe_amp = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === code) {
        if (this.options.ecmaVersion >= 12) {
          var next2 = this.input.charCodeAt(this.pos + 2);
          if (next2 === 61) {
            return this.finishOp(types.assign, 3);
          }
        }
        return this.finishOp(code === 124 ? types.logicalOR : types.logicalAND, 2);
      }
      if (next === 61) {
        return this.finishOp(types.assign, 2);
      }
      return this.finishOp(code === 124 ? types.bitwiseOR : types.bitwiseAND, 1);
    };
    pp$9.readToken_caret = function() {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 61) {
        return this.finishOp(types.assign, 2);
      }
      return this.finishOp(types.bitwiseXOR, 1);
    };
    pp$9.readToken_plus_min = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === code) {
        if (next === 45 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 62 && (this.lastTokEnd === 0 || lineBreak.test(this.input.slice(this.lastTokEnd, this.pos)))) {
          this.skipLineComment(3);
          this.skipSpace();
          return this.nextToken();
        }
        return this.finishOp(types.incDec, 2);
      }
      if (next === 61) {
        return this.finishOp(types.assign, 2);
      }
      return this.finishOp(types.plusMin, 1);
    };
    pp$9.readToken_lt_gt = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      var size = 1;
      if (next === code) {
        size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
        if (this.input.charCodeAt(this.pos + size) === 61) {
          return this.finishOp(types.assign, size + 1);
        }
        return this.finishOp(types.bitShift, size);
      }
      if (next === 33 && code === 60 && !this.inModule && this.input.charCodeAt(this.pos + 2) === 45 && this.input.charCodeAt(this.pos + 3) === 45) {
        this.skipLineComment(4);
        this.skipSpace();
        return this.nextToken();
      }
      if (next === 61) {
        size = 2;
      }
      return this.finishOp(types.relational, size);
    };
    pp$9.readToken_eq_excl = function(code) {
      var next = this.input.charCodeAt(this.pos + 1);
      if (next === 61) {
        return this.finishOp(types.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
      }
      if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
        this.pos += 2;
        return this.finishToken(types.arrow);
      }
      return this.finishOp(code === 61 ? types.eq : types.prefix, 1);
    };
    pp$9.readToken_question = function() {
      var ecmaVersion = this.options.ecmaVersion;
      if (ecmaVersion >= 11) {
        var next = this.input.charCodeAt(this.pos + 1);
        if (next === 46) {
          var next2 = this.input.charCodeAt(this.pos + 2);
          if (next2 < 48 || next2 > 57) {
            return this.finishOp(types.questionDot, 2);
          }
        }
        if (next === 63) {
          if (ecmaVersion >= 12) {
            var next2$1 = this.input.charCodeAt(this.pos + 2);
            if (next2$1 === 61) {
              return this.finishOp(types.assign, 3);
            }
          }
          return this.finishOp(types.coalesce, 2);
        }
      }
      return this.finishOp(types.question, 1);
    };
    pp$9.readToken_numberSign = function() {
      var ecmaVersion = this.options.ecmaVersion;
      var code = 35;
      if (ecmaVersion >= 13) {
        ++this.pos;
        code = this.fullCharCodeAtPos();
        if (isIdentifierStart(code, true) || code === 92) {
          return this.finishToken(types.privateId, this.readWord1());
        }
      }
      this.raise(this.pos, "Unexpected character '" + codePointToString$1(code) + "'");
    };
    pp$9.getTokenFromCode = function(code) {
      switch (code) {
        case 46:
          return this.readToken_dot();
        case 40:
          ++this.pos;
          return this.finishToken(types.parenL);
        case 41:
          ++this.pos;
          return this.finishToken(types.parenR);
        case 59:
          ++this.pos;
          return this.finishToken(types.semi);
        case 44:
          ++this.pos;
          return this.finishToken(types.comma);
        case 91:
          ++this.pos;
          return this.finishToken(types.bracketL);
        case 93:
          ++this.pos;
          return this.finishToken(types.bracketR);
        case 123:
          ++this.pos;
          return this.finishToken(types.braceL);
        case 125:
          ++this.pos;
          return this.finishToken(types.braceR);
        case 58:
          ++this.pos;
          return this.finishToken(types.colon);
        case 96:
          if (this.options.ecmaVersion < 6) {
            break;
          }
          ++this.pos;
          return this.finishToken(types.backQuote);
        case 48:
          var next = this.input.charCodeAt(this.pos + 1);
          if (next === 120 || next === 88) {
            return this.readRadixNumber(16);
          }
          if (this.options.ecmaVersion >= 6) {
            if (next === 111 || next === 79) {
              return this.readRadixNumber(8);
            }
            if (next === 98 || next === 66) {
              return this.readRadixNumber(2);
            }
          }
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
          return this.readNumber(false);
        case 34:
        case 39:
          return this.readString(code);
        case 47:
          return this.readToken_slash();
        case 37:
        case 42:
          return this.readToken_mult_modulo_exp(code);
        case 124:
        case 38:
          return this.readToken_pipe_amp(code);
        case 94:
          return this.readToken_caret();
        case 43:
        case 45:
          return this.readToken_plus_min(code);
        case 60:
        case 62:
          return this.readToken_lt_gt(code);
        case 61:
        case 33:
          return this.readToken_eq_excl(code);
        case 63:
          return this.readToken_question();
        case 126:
          return this.finishOp(types.prefix, 1);
        case 35:
          return this.readToken_numberSign();
      }
      this.raise(this.pos, "Unexpected character '" + codePointToString$1(code) + "'");
    };
    pp$9.finishOp = function(type, size) {
      var str = this.input.slice(this.pos, this.pos + size);
      this.pos += size;
      return this.finishToken(type, str);
    };
    pp$9.readRegexp = function() {
      var escaped, inClass, start = this.pos;
      for (; ; ) {
        if (this.pos >= this.input.length) {
          this.raise(start, "Unterminated regular expression");
        }
        var ch = this.input.charAt(this.pos);
        if (lineBreak.test(ch)) {
          this.raise(start, "Unterminated regular expression");
        }
        if (!escaped) {
          if (ch === "[") {
            inClass = true;
          } else if (ch === "]" && inClass) {
            inClass = false;
          } else if (ch === "/" && !inClass) {
            break;
          }
          escaped = ch === "\\";
        } else {
          escaped = false;
        }
        ++this.pos;
      }
      var pattern = this.input.slice(start, this.pos);
      ++this.pos;
      var flagsStart = this.pos;
      var flags = this.readWord1();
      if (this.containsEsc) {
        this.unexpected(flagsStart);
      }
      var state = this.regexpState || (this.regexpState = new RegExpValidationState(this));
      state.reset(start, pattern, flags);
      this.validateRegExpFlags(state);
      this.validateRegExpPattern(state);
      var value = null;
      try {
        value = new RegExp(pattern, flags);
      } catch (e) {
      }
      return this.finishToken(types.regexp, { pattern, flags, value });
    };
    pp$9.readInt = function(radix, len, maybeLegacyOctalNumericLiteral) {
      var allowSeparators = this.options.ecmaVersion >= 12 && len === void 0;
      var isLegacyOctalNumericLiteral = maybeLegacyOctalNumericLiteral && this.input.charCodeAt(this.pos) === 48;
      var start = this.pos, total = 0, lastCode = 0;
      for (var i = 0, e = len == null ? Infinity : len; i < e; ++i, ++this.pos) {
        var code = this.input.charCodeAt(this.pos), val = void 0;
        if (allowSeparators && code === 95) {
          if (isLegacyOctalNumericLiteral) {
            this.raiseRecoverable(this.pos, "Numeric separator is not allowed in legacy octal numeric literals");
          }
          if (lastCode === 95) {
            this.raiseRecoverable(this.pos, "Numeric separator must be exactly one underscore");
          }
          if (i === 0) {
            this.raiseRecoverable(this.pos, "Numeric separator is not allowed at the first of digits");
          }
          lastCode = code;
          continue;
        }
        if (code >= 97) {
          val = code - 97 + 10;
        } else if (code >= 65) {
          val = code - 65 + 10;
        } else if (code >= 48 && code <= 57) {
          val = code - 48;
        } else {
          val = Infinity;
        }
        if (val >= radix) {
          break;
        }
        lastCode = code;
        total = total * radix + val;
      }
      if (allowSeparators && lastCode === 95) {
        this.raiseRecoverable(this.pos - 1, "Numeric separator is not allowed at the last of digits");
      }
      if (this.pos === start || len != null && this.pos - start !== len) {
        return null;
      }
      return total;
    };
    pp$9.readRadixNumber = function(radix) {
      var start = this.pos;
      this.pos += 2;
      var val = this.readInt(radix);
      if (val == null) {
        this.raise(this.start + 2, "Expected number in radix " + radix);
      }
      if (this.options.ecmaVersion >= 11 && this.input.charCodeAt(this.pos) === 110) {
        val = stringToBigInt(this.input.slice(start, this.pos));
        ++this.pos;
      } else if (isIdentifierStart(this.fullCharCodeAtPos())) {
        this.raise(this.pos, "Identifier directly after number");
      }
      return this.finishToken(types.num, val);
    };
    pp$9.readNumber = function(startsWithDot) {
      var start = this.pos;
      if (!startsWithDot && this.readInt(10, void 0, true) === null) {
        this.raise(start, "Invalid number");
      }
      var octal = this.pos - start >= 2 && this.input.charCodeAt(start) === 48;
      if (octal && this.strict) {
        this.raise(start, "Invalid number");
      }
      var next = this.input.charCodeAt(this.pos);
      if (!octal && !startsWithDot && this.options.ecmaVersion >= 11 && next === 110) {
        var val$1 = stringToBigInt(this.input.slice(start, this.pos));
        ++this.pos;
        if (isIdentifierStart(this.fullCharCodeAtPos())) {
          this.raise(this.pos, "Identifier directly after number");
        }
        return this.finishToken(types.num, val$1);
      }
      if (octal && /[89]/.test(this.input.slice(start, this.pos))) {
        octal = false;
      }
      if (next === 46 && !octal) {
        ++this.pos;
        this.readInt(10);
        next = this.input.charCodeAt(this.pos);
      }
      if ((next === 69 || next === 101) && !octal) {
        next = this.input.charCodeAt(++this.pos);
        if (next === 43 || next === 45) {
          ++this.pos;
        }
        if (this.readInt(10) === null) {
          this.raise(start, "Invalid number");
        }
      }
      if (isIdentifierStart(this.fullCharCodeAtPos())) {
        this.raise(this.pos, "Identifier directly after number");
      }
      var val = stringToNumber(this.input.slice(start, this.pos), octal);
      return this.finishToken(types.num, val);
    };
    pp$9.readCodePoint = function() {
      var ch = this.input.charCodeAt(this.pos), code;
      if (ch === 123) {
        if (this.options.ecmaVersion < 6) {
          this.unexpected();
        }
        var codePos = ++this.pos;
        code = this.readHexChar(this.input.indexOf("}", this.pos) - this.pos);
        ++this.pos;
        if (code > 1114111) {
          this.invalidStringToken(codePos, "Code point out of bounds");
        }
      } else {
        code = this.readHexChar(4);
      }
      return code;
    };
    pp$9.readString = function(quote) {
      var out = "", chunkStart = ++this.pos;
      for (; ; ) {
        if (this.pos >= this.input.length) {
          this.raise(this.start, "Unterminated string constant");
        }
        var ch = this.input.charCodeAt(this.pos);
        if (ch === quote) {
          break;
        }
        if (ch === 92) {
          out += this.input.slice(chunkStart, this.pos);
          out += this.readEscapedChar(false);
          chunkStart = this.pos;
        } else {
          if (isNewLine(ch, this.options.ecmaVersion >= 10)) {
            this.raise(this.start, "Unterminated string constant");
          }
          ++this.pos;
        }
      }
      out += this.input.slice(chunkStart, this.pos++);
      return this.finishToken(types.string, out);
    };
    INVALID_TEMPLATE_ESCAPE_ERROR = {};
    pp$9.tryReadTemplateToken = function() {
      this.inTemplateElement = true;
      try {
        this.readTmplToken();
      } catch (err) {
        if (err === INVALID_TEMPLATE_ESCAPE_ERROR) {
          this.readInvalidTemplateToken();
        } else {
          throw err;
        }
      }
      this.inTemplateElement = false;
    };
    pp$9.invalidStringToken = function(position, message) {
      if (this.inTemplateElement && this.options.ecmaVersion >= 9) {
        throw INVALID_TEMPLATE_ESCAPE_ERROR;
      } else {
        this.raise(position, message);
      }
    };
    pp$9.readTmplToken = function() {
      var out = "", chunkStart = this.pos;
      for (; ; ) {
        if (this.pos >= this.input.length) {
          this.raise(this.start, "Unterminated template");
        }
        var ch = this.input.charCodeAt(this.pos);
        if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
          if (this.pos === this.start && (this.type === types.template || this.type === types.invalidTemplate)) {
            if (ch === 36) {
              this.pos += 2;
              return this.finishToken(types.dollarBraceL);
            } else {
              ++this.pos;
              return this.finishToken(types.backQuote);
            }
          }
          out += this.input.slice(chunkStart, this.pos);
          return this.finishToken(types.template, out);
        }
        if (ch === 92) {
          out += this.input.slice(chunkStart, this.pos);
          out += this.readEscapedChar(true);
          chunkStart = this.pos;
        } else if (isNewLine(ch)) {
          out += this.input.slice(chunkStart, this.pos);
          ++this.pos;
          switch (ch) {
            case 13:
              if (this.input.charCodeAt(this.pos) === 10) {
                ++this.pos;
              }
            case 10:
              out += "\n";
              break;
            default:
              out += String.fromCharCode(ch);
              break;
          }
          if (this.options.locations) {
            ++this.curLine;
            this.lineStart = this.pos;
          }
          chunkStart = this.pos;
        } else {
          ++this.pos;
        }
      }
    };
    pp$9.readInvalidTemplateToken = function() {
      for (; this.pos < this.input.length; this.pos++) {
        switch (this.input[this.pos]) {
          case "\\":
            ++this.pos;
            break;
          case "$":
            if (this.input[this.pos + 1] !== "{") {
              break;
            }
          case "`":
            return this.finishToken(types.invalidTemplate, this.input.slice(this.start, this.pos));
        }
      }
      this.raise(this.start, "Unterminated template");
    };
    pp$9.readEscapedChar = function(inTemplate) {
      var ch = this.input.charCodeAt(++this.pos);
      ++this.pos;
      switch (ch) {
        case 110:
          return "\n";
        case 114:
          return "\r";
        case 120:
          return String.fromCharCode(this.readHexChar(2));
        case 117:
          return codePointToString$1(this.readCodePoint());
        case 116:
          return "	";
        case 98:
          return "\b";
        case 118:
          return "\v";
        case 102:
          return "\f";
        case 13:
          if (this.input.charCodeAt(this.pos) === 10) {
            ++this.pos;
          }
        case 10:
          if (this.options.locations) {
            this.lineStart = this.pos;
            ++this.curLine;
          }
          return "";
        case 56:
        case 57:
          if (this.strict) {
            this.invalidStringToken(this.pos - 1, "Invalid escape sequence");
          }
          if (inTemplate) {
            var codePos = this.pos - 1;
            this.invalidStringToken(codePos, "Invalid escape sequence in template string");
            return null;
          }
        default:
          if (ch >= 48 && ch <= 55) {
            var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
            var octal = parseInt(octalStr, 8);
            if (octal > 255) {
              octalStr = octalStr.slice(0, -1);
              octal = parseInt(octalStr, 8);
            }
            this.pos += octalStr.length - 1;
            ch = this.input.charCodeAt(this.pos);
            if ((octalStr !== "0" || ch === 56 || ch === 57) && (this.strict || inTemplate)) {
              this.invalidStringToken(this.pos - 1 - octalStr.length, inTemplate ? "Octal literal in template string" : "Octal literal in strict mode");
            }
            return String.fromCharCode(octal);
          }
          if (isNewLine(ch)) {
            return "";
          }
          return String.fromCharCode(ch);
      }
    };
    pp$9.readHexChar = function(len) {
      var codePos = this.pos;
      var n2 = this.readInt(16, len);
      if (n2 === null) {
        this.invalidStringToken(codePos, "Bad character escape sequence");
      }
      return n2;
    };
    pp$9.readWord1 = function() {
      this.containsEsc = false;
      var word = "", first = true, chunkStart = this.pos;
      var astral = this.options.ecmaVersion >= 6;
      while (this.pos < this.input.length) {
        var ch = this.fullCharCodeAtPos();
        if (isIdentifierChar(ch, astral)) {
          this.pos += ch <= 65535 ? 1 : 2;
        } else if (ch === 92) {
          this.containsEsc = true;
          word += this.input.slice(chunkStart, this.pos);
          var escStart = this.pos;
          if (this.input.charCodeAt(++this.pos) !== 117) {
            this.invalidStringToken(this.pos, "Expecting Unicode escape sequence \\uXXXX");
          }
          ++this.pos;
          var esc = this.readCodePoint();
          if (!(first ? isIdentifierStart : isIdentifierChar)(esc, astral)) {
            this.invalidStringToken(escStart, "Invalid Unicode escape");
          }
          word += codePointToString$1(esc);
          chunkStart = this.pos;
        } else {
          break;
        }
        first = false;
      }
      return word + this.input.slice(chunkStart, this.pos);
    };
    pp$9.readWord = function() {
      var word = this.readWord1();
      var type = types.name;
      if (this.keywords.test(word)) {
        type = keywords$1[word];
      }
      return this.finishToken(type, word);
    };
    version = "8.4.0";
    Parser.acorn = {
      Parser,
      version,
      defaultOptions,
      Position,
      SourceLocation,
      getLineInfo,
      Node,
      TokenType,
      tokTypes: types,
      keywordTypes: keywords$1,
      TokContext,
      tokContexts: types$1,
      isIdentifierChar,
      isIdentifierStart,
      Token,
      isNewLine,
      lineBreak,
      lineBreakG,
      nonASCIIwhitespace
    };
    readFile = (file) => new Promise((fulfil, reject) => import_fs.default.readFile(file, "utf-8", (err, contents) => err ? reject(err) : fulfil(contents)));
    Queue = class {
      constructor(maxParallel = 1) {
        this.maxParallel = maxParallel;
        this.queue = new Array();
        this.workerCount = 0;
      }
      run(task) {
        return new Promise((resolve2, reject) => {
          this.queue.push({ reject, resolve: resolve2, task });
          this.work();
        });
      }
      async work() {
        if (this.workerCount >= this.maxParallel)
          return;
        this.workerCount++;
        let entry;
        while (entry = this.queue.shift()) {
          const { reject, resolve: resolve2, task } = entry;
          try {
            const result = await task();
            resolve2(result);
          } catch (err) {
            reject(err);
          }
        }
        this.workerCount--;
      }
    };
    ANONYMOUS_PLUGIN_PREFIX = "at position ";
    ANONYMOUS_OUTPUT_PLUGIN_PREFIX = "at output position ";
    deprecatedHooks = [
      { active: true, deprecated: "resolveAssetUrl", replacement: "resolveFileUrl" }
    ];
    NO_CACHE = {
      delete() {
        return false;
      },
      get() {
        return void 0;
      },
      has() {
        return false;
      },
      set() {
      }
    };
    ModuleLoader = class {
      constructor(graph, modulesById, options, pluginDriver) {
        this.graph = graph;
        this.modulesById = modulesById;
        this.options = options;
        this.pluginDriver = pluginDriver;
        this.implicitEntryModules = new Set();
        this.indexedEntryModules = [];
        this.latestLoadModulesPromise = Promise.resolve();
        this.nextEntryModuleIndex = 0;
        this.readQueue = new Queue();
        this.resolveId = async (source, importer, customOptions, skip = null) => {
          return this.addDefaultsToResolvedId(this.getNormalizedResolvedIdWithoutDefaults(this.options.external(source, importer, false) ? false : await resolveId(source, importer, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, skip, customOptions), importer, source));
        };
        this.hasModuleSideEffects = options.treeshake ? options.treeshake.moduleSideEffects : () => true;
        this.readQueue.maxParallel = options.maxParallelFileReads;
      }
      async addAdditionalModules(unresolvedModules) {
        const result = this.extendLoadModulesPromise(Promise.all(unresolvedModules.map((id) => this.loadEntryModule(id, false, void 0, null))));
        await this.awaitLoadModulesPromise();
        return result;
      }
      async addEntryModules(unresolvedEntryModules, isUserDefined) {
        const firstEntryModuleIndex = this.nextEntryModuleIndex;
        this.nextEntryModuleIndex += unresolvedEntryModules.length;
        const newEntryModules = await this.extendLoadModulesPromise(Promise.all(unresolvedEntryModules.map(({ id, importer }) => this.loadEntryModule(id, true, importer, null))).then((entryModules) => {
          let moduleIndex = firstEntryModuleIndex;
          for (let index = 0; index < entryModules.length; index++) {
            const entryModule = entryModules[index];
            entryModule.isUserDefinedEntryPoint = entryModule.isUserDefinedEntryPoint || isUserDefined;
            addChunkNamesToModule(entryModule, unresolvedEntryModules[index], isUserDefined);
            const existingIndexedModule = this.indexedEntryModules.find((indexedModule) => indexedModule.module === entryModule);
            if (!existingIndexedModule) {
              this.indexedEntryModules.push({ index: moduleIndex, module: entryModule });
            } else {
              existingIndexedModule.index = Math.min(existingIndexedModule.index, moduleIndex);
            }
            moduleIndex++;
          }
          this.indexedEntryModules.sort(({ index: indexA }, { index: indexB }) => indexA > indexB ? 1 : -1);
          return entryModules;
        }));
        await this.awaitLoadModulesPromise();
        return {
          entryModules: this.indexedEntryModules.map(({ module: module2 }) => module2),
          implicitEntryModules: [...this.implicitEntryModules],
          newEntryModules
        };
      }
      async emitChunk({ fileName, id, importer, name, implicitlyLoadedAfterOneOf, preserveSignature }) {
        const unresolvedModule = {
          fileName: fileName || null,
          id,
          importer,
          name: name || null
        };
        const module2 = implicitlyLoadedAfterOneOf ? await this.addEntryWithImplicitDependants(unresolvedModule, implicitlyLoadedAfterOneOf) : (await this.addEntryModules([unresolvedModule], false)).newEntryModules[0];
        if (preserveSignature != null) {
          module2.preserveSignature = preserveSignature;
        }
        return module2;
      }
      addDefaultsToResolvedId(resolvedId) {
        var _a, _b;
        if (!resolvedId) {
          return null;
        }
        const external = resolvedId.external || false;
        return {
          external,
          id: resolvedId.id,
          meta: resolvedId.meta || EMPTY_OBJECT,
          moduleSideEffects: (_a = resolvedId.moduleSideEffects) !== null && _a !== void 0 ? _a : this.hasModuleSideEffects(resolvedId.id, !!external),
          syntheticNamedExports: (_b = resolvedId.syntheticNamedExports) !== null && _b !== void 0 ? _b : false
        };
      }
      addEntryWithImplicitDependants(unresolvedModule, implicitlyLoadedAfter) {
        return this.extendLoadModulesPromise(this.loadEntryModule(unresolvedModule.id, false, unresolvedModule.importer, null).then(async (entryModule) => {
          addChunkNamesToModule(entryModule, unresolvedModule, false);
          if (!entryModule.info.isEntry) {
            this.implicitEntryModules.add(entryModule);
            const implicitlyLoadedAfterModules = await Promise.all(implicitlyLoadedAfter.map((id) => this.loadEntryModule(id, false, unresolvedModule.importer, entryModule.id)));
            for (const module2 of implicitlyLoadedAfterModules) {
              entryModule.implicitlyLoadedAfter.add(module2);
            }
            for (const dependant of entryModule.implicitlyLoadedAfter) {
              dependant.implicitlyLoadedBefore.add(entryModule);
            }
          }
          return entryModule;
        }));
      }
      async addModuleSource(id, importer, module2) {
        timeStart("load modules", 3);
        let source;
        try {
          source = await this.readQueue.run(async () => {
            var _a;
            return (_a = await this.pluginDriver.hookFirst("load", [id])) !== null && _a !== void 0 ? _a : await readFile(id);
          });
        } catch (err) {
          timeEnd("load modules", 3);
          let msg = `Could not load ${id}`;
          if (importer)
            msg += ` (imported by ${relativeId(importer)})`;
          msg += `: ${err.message}`;
          err.message = msg;
          throw err;
        }
        timeEnd("load modules", 3);
        const sourceDescription = typeof source === "string" ? { code: source } : typeof source === "object" && typeof source.code === "string" ? source : error(errBadLoader(id));
        const cachedModule = this.graph.cachedModules.get(id);
        if (cachedModule && !cachedModule.customTransformCache && cachedModule.originalCode === sourceDescription.code) {
          if (cachedModule.transformFiles) {
            for (const emittedFile of cachedModule.transformFiles)
              this.pluginDriver.emitFile(emittedFile);
          }
          module2.setSource(cachedModule);
        } else {
          module2.updateOptions(sourceDescription);
          module2.setSource(await transform(sourceDescription, module2, this.pluginDriver, this.options.onwarn));
        }
      }
      async awaitLoadModulesPromise() {
        let startingPromise;
        do {
          startingPromise = this.latestLoadModulesPromise;
          await startingPromise;
        } while (startingPromise !== this.latestLoadModulesPromise);
      }
      extendLoadModulesPromise(loadNewModulesPromise) {
        this.latestLoadModulesPromise = Promise.all([
          loadNewModulesPromise,
          this.latestLoadModulesPromise
        ]);
        this.latestLoadModulesPromise.catch(() => {
        });
        return loadNewModulesPromise;
      }
      async fetchDynamicDependencies(module2, resolveDynamicImportPromises) {
        const dependencies = await Promise.all(resolveDynamicImportPromises.map((resolveDynamicImportPromise) => resolveDynamicImportPromise.then(async ([dynamicImport, resolvedId]) => {
          if (resolvedId === null)
            return null;
          if (typeof resolvedId === "string") {
            dynamicImport.resolution = resolvedId;
            return null;
          }
          return dynamicImport.resolution = await this.fetchResolvedDependency(relativeId(resolvedId.id), module2.id, resolvedId);
        })));
        for (const dependency of dependencies) {
          if (dependency) {
            module2.dynamicDependencies.add(dependency);
            dependency.dynamicImporters.push(module2.id);
          }
        }
      }
      async fetchModule({ id, meta, moduleSideEffects, syntheticNamedExports }, importer, isEntry) {
        const existingModule = this.modulesById.get(id);
        if (existingModule instanceof Module) {
          if (isEntry) {
            existingModule.info.isEntry = true;
            this.implicitEntryModules.delete(existingModule);
            for (const dependant of existingModule.implicitlyLoadedAfter) {
              dependant.implicitlyLoadedBefore.delete(existingModule);
            }
            existingModule.implicitlyLoadedAfter.clear();
          }
          return existingModule;
        }
        const module2 = new Module(this.graph, id, this.options, isEntry, moduleSideEffects, syntheticNamedExports, meta);
        this.modulesById.set(id, module2);
        this.graph.watchFiles[id] = true;
        await this.addModuleSource(id, importer, module2);
        const resolveStaticDependencyPromises = this.getResolveStaticDependencyPromises(module2);
        const resolveDynamicImportPromises = this.getResolveDynamicImportPromises(module2);
        Promise.all([
          ...resolveStaticDependencyPromises,
          ...resolveDynamicImportPromises
        ]).then(() => this.pluginDriver.hookParallel("moduleParsed", [module2.info]));
        await Promise.all([
          this.fetchStaticDependencies(module2, resolveStaticDependencyPromises),
          this.fetchDynamicDependencies(module2, resolveDynamicImportPromises)
        ]);
        module2.linkImports();
        return module2;
      }
      fetchResolvedDependency(source, importer, resolvedId) {
        if (resolvedId.external) {
          const { external, id, moduleSideEffects, meta } = resolvedId;
          if (!this.modulesById.has(id)) {
            this.modulesById.set(id, new ExternalModule(this.options, id, moduleSideEffects, meta, external !== "absolute" && isAbsolute(id)));
          }
          const externalModule = this.modulesById.get(id);
          if (!(externalModule instanceof ExternalModule)) {
            return error(errInternalIdCannotBeExternal(source, importer));
          }
          return Promise.resolve(externalModule);
        } else {
          return this.fetchModule(resolvedId, importer, false);
        }
      }
      async fetchStaticDependencies(module2, resolveStaticDependencyPromises) {
        for (const dependency of await Promise.all(resolveStaticDependencyPromises.map((resolveStaticDependencyPromise) => resolveStaticDependencyPromise.then(([source, resolvedId]) => this.fetchResolvedDependency(source, module2.id, resolvedId))))) {
          module2.dependencies.add(dependency);
          dependency.importers.push(module2.id);
        }
        if (!this.options.treeshake || module2.info.hasModuleSideEffects === "no-treeshake") {
          for (const dependency of module2.dependencies) {
            if (dependency instanceof Module) {
              dependency.importedFromNotTreeshaken = true;
            }
          }
        }
      }
      getNormalizedResolvedIdWithoutDefaults(resolveIdResult, importer, source) {
        const { makeAbsoluteExternalsRelative } = this.options;
        if (resolveIdResult) {
          if (typeof resolveIdResult === "object") {
            const external2 = resolveIdResult.external || this.options.external(resolveIdResult.id, importer, true);
            return __spreadProps(__spreadValues({}, resolveIdResult), {
              external: external2 && (external2 === "relative" || !isAbsolute(resolveIdResult.id) || external2 === true && isNotAbsoluteExternal(resolveIdResult.id, source, makeAbsoluteExternalsRelative) || "absolute")
            });
          }
          const external = this.options.external(resolveIdResult, importer, true);
          return {
            external: external && (isNotAbsoluteExternal(resolveIdResult, source, makeAbsoluteExternalsRelative) || "absolute"),
            id: external && makeAbsoluteExternalsRelative ? normalizeRelativeExternalId(resolveIdResult, importer) : resolveIdResult
          };
        }
        const id = makeAbsoluteExternalsRelative ? normalizeRelativeExternalId(source, importer) : source;
        if (resolveIdResult !== false && !this.options.external(id, importer, true)) {
          return null;
        }
        return {
          external: isNotAbsoluteExternal(id, source, makeAbsoluteExternalsRelative) || "absolute",
          id
        };
      }
      getResolveDynamicImportPromises(module2) {
        return module2.dynamicImports.map(async (dynamicImport) => {
          const resolvedId = await this.resolveDynamicImport(module2, typeof dynamicImport.argument === "string" ? dynamicImport.argument : dynamicImport.argument.esTreeNode, module2.id);
          if (resolvedId && typeof resolvedId === "object") {
            dynamicImport.id = resolvedId.id;
          }
          return [dynamicImport, resolvedId];
        });
      }
      getResolveStaticDependencyPromises(module2) {
        return Array.from(module2.sources, async (source) => [
          source,
          module2.resolvedIds[source] = module2.resolvedIds[source] || this.handleResolveId(await this.resolveId(source, module2.id, EMPTY_OBJECT), source, module2.id)
        ]);
      }
      handleResolveId(resolvedId, source, importer) {
        if (resolvedId === null) {
          if (isRelative(source)) {
            return error(errUnresolvedImport(source, importer));
          }
          this.options.onwarn(errUnresolvedImportTreatedAsExternal(source, importer));
          return {
            external: true,
            id: source,
            meta: EMPTY_OBJECT,
            moduleSideEffects: this.hasModuleSideEffects(source, true),
            syntheticNamedExports: false
          };
        } else {
          if (resolvedId.external && resolvedId.syntheticNamedExports) {
            this.options.onwarn(errExternalSyntheticExports(source, importer));
          }
        }
        return resolvedId;
      }
      async loadEntryModule(unresolvedId, isEntry, importer, implicitlyLoadedBefore) {
        const resolveIdResult = await resolveId(unresolvedId, importer, this.options.preserveSymlinks, this.pluginDriver, this.resolveId, null, EMPTY_OBJECT);
        if (resolveIdResult == null) {
          return error(implicitlyLoadedBefore === null ? errUnresolvedEntry(unresolvedId) : errUnresolvedImplicitDependant(unresolvedId, implicitlyLoadedBefore));
        }
        if (resolveIdResult === false || typeof resolveIdResult === "object" && resolveIdResult.external) {
          return error(implicitlyLoadedBefore === null ? errEntryCannotBeExternal(unresolvedId) : errImplicitDependantCannotBeExternal(unresolvedId, implicitlyLoadedBefore));
        }
        return this.fetchModule(this.addDefaultsToResolvedId(typeof resolveIdResult === "object" ? resolveIdResult : { id: resolveIdResult }), void 0, isEntry);
      }
      async resolveDynamicImport(module2, specifier, importer) {
        const resolution = await this.pluginDriver.hookFirst("resolveDynamicImport", [
          specifier,
          importer
        ]);
        if (typeof specifier !== "string") {
          if (typeof resolution === "string") {
            return resolution;
          }
          if (!resolution) {
            return null;
          }
          return __spreadValues({
            external: false,
            moduleSideEffects: true
          }, resolution);
        }
        if (resolution == null) {
          return module2.resolvedIds[specifier] = module2.resolvedIds[specifier] || this.handleResolveId(await this.resolveId(specifier, module2.id, EMPTY_OBJECT), specifier, module2.id);
        }
        return this.handleResolveId(this.addDefaultsToResolvedId(this.getNormalizedResolvedIdWithoutDefaults(resolution, importer, specifier)), specifier, importer);
      }
    };
    GlobalScope = class extends Scope$1 {
      constructor() {
        super();
        this.variables.set("undefined", new UndefinedVariable());
      }
      findVariable(name) {
        let variable = this.variables.get(name);
        if (!variable) {
          variable = new GlobalVariable(name);
          this.variables.set(name, variable);
        }
        return variable;
      }
    };
    inputHookNames = {
      buildEnd: 1,
      buildStart: 1,
      closeBundle: 1,
      closeWatcher: 1,
      load: 1,
      moduleParsed: 1,
      options: 1,
      resolveDynamicImport: 1,
      resolveId: 1,
      transform: 1,
      watchChange: 1
    };
    inputHooks = Object.keys(inputHookNames);
    PluginDriver = class {
      constructor(graph, options, userPlugins, pluginCache, basePluginDriver) {
        this.graph = graph;
        this.options = options;
        this.pluginContexts = new Map();
        warnDeprecatedHooks(userPlugins, options);
        this.pluginCache = pluginCache;
        this.fileEmitter = new FileEmitter(graph, options, basePluginDriver && basePluginDriver.fileEmitter);
        this.emitFile = this.fileEmitter.emitFile.bind(this.fileEmitter);
        this.getFileName = this.fileEmitter.getFileName.bind(this.fileEmitter);
        this.finaliseAssets = this.fileEmitter.assertAssetsFinalized.bind(this.fileEmitter);
        this.setOutputBundle = this.fileEmitter.setOutputBundle.bind(this.fileEmitter);
        this.plugins = userPlugins.concat(basePluginDriver ? basePluginDriver.plugins : []);
        const existingPluginNames = new Set();
        for (const plugin of this.plugins) {
          this.pluginContexts.set(plugin, getPluginContext(plugin, pluginCache, graph, options, this.fileEmitter, existingPluginNames));
        }
        if (basePluginDriver) {
          for (const plugin of userPlugins) {
            for (const hook of inputHooks) {
              if (hook in plugin) {
                options.onwarn(errInputHookInOutputPlugin(plugin.name, hook));
              }
            }
          }
        }
      }
      createOutputPluginDriver(plugins) {
        return new PluginDriver(this.graph, this.options, plugins, this.pluginCache, this);
      }
      hookFirst(hookName, args, replaceContext, skipped) {
        let promise = Promise.resolve(void 0);
        for (const plugin of this.plugins) {
          if (skipped && skipped.has(plugin))
            continue;
          promise = promise.then((result) => {
            if (result != null)
              return result;
            return this.runHook(hookName, args, plugin, false, replaceContext);
          });
        }
        return promise;
      }
      hookFirstSync(hookName, args, replaceContext) {
        for (const plugin of this.plugins) {
          const result = this.runHookSync(hookName, args, plugin, replaceContext);
          if (result != null)
            return result;
        }
        return null;
      }
      hookParallel(hookName, args, replaceContext) {
        const promises = [];
        for (const plugin of this.plugins) {
          const hookPromise = this.runHook(hookName, args, plugin, false, replaceContext);
          if (!hookPromise)
            continue;
          promises.push(hookPromise);
        }
        return Promise.all(promises).then(() => {
        });
      }
      hookReduceArg0(hookName, [arg0, ...rest], reduce, replaceContext) {
        let promise = Promise.resolve(arg0);
        for (const plugin of this.plugins) {
          promise = promise.then((arg02) => {
            const args = [arg02, ...rest];
            const hookPromise = this.runHook(hookName, args, plugin, false, replaceContext);
            if (!hookPromise)
              return arg02;
            return hookPromise.then((result) => reduce.call(this.pluginContexts.get(plugin), arg02, result, plugin));
          });
        }
        return promise;
      }
      hookReduceArg0Sync(hookName, [arg0, ...rest], reduce, replaceContext) {
        for (const plugin of this.plugins) {
          const args = [arg0, ...rest];
          const result = this.runHookSync(hookName, args, plugin, replaceContext);
          arg0 = reduce.call(this.pluginContexts.get(plugin), arg0, result, plugin);
        }
        return arg0;
      }
      hookReduceValue(hookName, initialValue, args, reduce, replaceContext) {
        let promise = Promise.resolve(initialValue);
        for (const plugin of this.plugins) {
          promise = promise.then((value) => {
            const hookPromise = this.runHook(hookName, args, plugin, true, replaceContext);
            if (!hookPromise)
              return value;
            return hookPromise.then((result) => reduce.call(this.pluginContexts.get(plugin), value, result, plugin));
          });
        }
        return promise;
      }
      hookReduceValueSync(hookName, initialValue, args, reduce, replaceContext) {
        let acc = initialValue;
        for (const plugin of this.plugins) {
          const result = this.runHookSync(hookName, args, plugin, replaceContext);
          acc = reduce.call(this.pluginContexts.get(plugin), acc, result, plugin);
        }
        return acc;
      }
      hookSeq(hookName, args, replaceContext) {
        let promise = Promise.resolve();
        for (const plugin of this.plugins) {
          promise = promise.then(() => this.runHook(hookName, args, plugin, false, replaceContext));
        }
        return promise;
      }
      hookSeqSync(hookName, args, replaceContext) {
        for (const plugin of this.plugins) {
          this.runHookSync(hookName, args, plugin, replaceContext);
        }
      }
      runHook(hookName, args, plugin, permitValues, hookContext) {
        const hook = plugin[hookName];
        if (!hook)
          return void 0;
        let context = this.pluginContexts.get(plugin);
        if (hookContext) {
          context = hookContext(context, plugin);
        }
        return Promise.resolve().then(() => {
          if (typeof hook !== "function") {
            if (permitValues)
              return hook;
            return throwInvalidHookError(hookName, plugin.name);
          }
          return hook.apply(context, args);
        }).catch((err) => throwPluginError(err, plugin.name, { hook: hookName }));
      }
      runHookSync(hookName, args, plugin, hookContext) {
        const hook = plugin[hookName];
        if (!hook)
          return void 0;
        let context = this.pluginContexts.get(plugin);
        if (hookContext) {
          context = hookContext(context, plugin);
        }
        try {
          if (typeof hook !== "function") {
            return throwInvalidHookError(hookName, plugin.name);
          }
          return hook.apply(context, args);
        } catch (err) {
          return throwPluginError(err, plugin.name, { hook: hookName });
        }
      }
    };
    Graph = class {
      constructor(options, watcher) {
        var _a, _b;
        this.options = options;
        this.entryModules = [];
        this.modulesById = new Map();
        this.needsTreeshakingPass = false;
        this.phase = BuildPhase.LOAD_AND_PARSE;
        this.watchFiles = Object.create(null);
        this.watchMode = false;
        this.externalModules = [];
        this.implicitEntryModules = [];
        this.modules = [];
        this.getModuleInfo = (moduleId) => {
          const foundModule = this.modulesById.get(moduleId);
          if (!foundModule)
            return null;
          return foundModule.info;
        };
        this.deoptimizationTracker = new PathTracker();
        this.cachedModules = new Map();
        if (options.cache !== false) {
          if ((_a = options.cache) === null || _a === void 0 ? void 0 : _a.modules) {
            for (const module2 of options.cache.modules)
              this.cachedModules.set(module2.id, module2);
          }
          this.pluginCache = ((_b = options.cache) === null || _b === void 0 ? void 0 : _b.plugins) || Object.create(null);
          for (const name in this.pluginCache) {
            const cache = this.pluginCache[name];
            for (const value of Object.values(cache))
              value[0]++;
          }
        }
        if (watcher) {
          this.watchMode = true;
          const handleChange = (...args) => this.pluginDriver.hookSeqSync("watchChange", args);
          const handleClose = () => this.pluginDriver.hookSeqSync("closeWatcher", []);
          watcher.on("change", handleChange);
          watcher.on("close", handleClose);
          watcher.once("restart", () => {
            watcher.removeListener("change", handleChange);
            watcher.removeListener("close", handleClose);
          });
        }
        this.pluginDriver = new PluginDriver(this, options, options.plugins, this.pluginCache);
        this.scope = new GlobalScope();
        this.acornParser = Parser.extend(...options.acornInjectPlugins);
        this.moduleLoader = new ModuleLoader(this, this.modulesById, this.options, this.pluginDriver);
      }
      async build() {
        timeStart("generate module graph", 2);
        await this.generateModuleGraph();
        timeEnd("generate module graph", 2);
        timeStart("sort modules", 2);
        this.phase = BuildPhase.ANALYSE;
        this.sortModules();
        timeEnd("sort modules", 2);
        timeStart("mark included statements", 2);
        this.includeStatements();
        timeEnd("mark included statements", 2);
        this.phase = BuildPhase.GENERATE;
      }
      contextParse(code, options = {}) {
        const onCommentOrig = options.onComment;
        const comments = [];
        if (onCommentOrig && typeof onCommentOrig == "function") {
          options.onComment = (block, text, start, end, ...args) => {
            comments.push({ end, start, type: block ? "Block" : "Line", value: text });
            return onCommentOrig.call(options, block, text, start, end, ...args);
          };
        } else {
          options.onComment = comments;
        }
        const ast = this.acornParser.parse(code, __spreadValues(__spreadValues({}, this.options.acorn), options));
        if (typeof onCommentOrig == "object") {
          onCommentOrig.push(...comments);
        }
        options.onComment = onCommentOrig;
        addAnnotations(comments, ast, code);
        return ast;
      }
      getCache() {
        for (const name in this.pluginCache) {
          const cache = this.pluginCache[name];
          let allDeleted = true;
          for (const [key, value] of Object.entries(cache)) {
            if (value[0] >= this.options.experimentalCacheExpiry)
              delete cache[key];
            else
              allDeleted = false;
          }
          if (allDeleted)
            delete this.pluginCache[name];
        }
        return {
          modules: this.modules.map((module2) => module2.toJSON()),
          plugins: this.pluginCache
        };
      }
      async generateModuleGraph() {
        ({ entryModules: this.entryModules, implicitEntryModules: this.implicitEntryModules } = await this.moduleLoader.addEntryModules(normalizeEntryModules(this.options.input), true));
        if (this.entryModules.length === 0) {
          throw new Error("You must supply options.input to rollup");
        }
        for (const module2 of this.modulesById.values()) {
          if (module2 instanceof Module) {
            this.modules.push(module2);
          } else {
            this.externalModules.push(module2);
          }
        }
      }
      includeStatements() {
        for (const module2 of [...this.entryModules, ...this.implicitEntryModules]) {
          markModuleAndImpureDependenciesAsExecuted(module2);
        }
        if (this.options.treeshake) {
          let treeshakingPass = 1;
          do {
            timeStart(`treeshaking pass ${treeshakingPass}`, 3);
            this.needsTreeshakingPass = false;
            for (const module2 of this.modules) {
              if (module2.isExecuted) {
                if (module2.info.hasModuleSideEffects === "no-treeshake") {
                  module2.includeAllInBundle();
                } else {
                  module2.include();
                }
              }
            }
            if (treeshakingPass === 1) {
              for (const module2 of [...this.entryModules, ...this.implicitEntryModules]) {
                if (module2.preserveSignature !== false) {
                  module2.includeAllExports(false);
                  this.needsTreeshakingPass = true;
                }
              }
            }
            timeEnd(`treeshaking pass ${treeshakingPass++}`, 3);
          } while (this.needsTreeshakingPass);
        } else {
          for (const module2 of this.modules)
            module2.includeAllInBundle();
        }
        for (const externalModule of this.externalModules)
          externalModule.warnUnusedImports();
        for (const module2 of this.implicitEntryModules) {
          for (const dependant of module2.implicitlyLoadedAfter) {
            if (!(dependant.info.isEntry || dependant.isIncluded())) {
              error(errImplicitDependantIsNotIncluded(dependant));
            }
          }
        }
      }
      sortModules() {
        const { orderedModules, cyclePaths } = analyseModuleExecution(this.entryModules);
        for (const cyclePath of cyclePaths) {
          this.options.onwarn({
            code: "CIRCULAR_DEPENDENCY",
            cycle: cyclePath,
            importer: cyclePath[0],
            message: `Circular dependency: ${cyclePath.join(" -> ")}`
          });
        }
        this.modules = orderedModules;
        for (const module2 of this.modules) {
          module2.bindReferences();
        }
        this.warnForMissingExports();
      }
      warnForMissingExports() {
        for (const module2 of this.modules) {
          for (const importDescription of Object.values(module2.importDescriptions)) {
            if (importDescription.name !== "*" && !importDescription.module.getVariableForExportName(importDescription.name)) {
              module2.warn({
                code: "NON_EXISTENT_EXPORT",
                message: `Non-existent export '${importDescription.name}' is imported from ${relativeId(importDescription.module.id)}`,
                name: importDescription.name,
                source: importDescription.module.id
              }, importDescription.start);
            }
          }
        }
      }
    };
    defaultOnWarn = (warning) => console.warn(warning.message || warning);
    treeshakePresets = {
      recommended: {
        annotations: true,
        correctVarValueBeforeDeclaration: false,
        moduleSideEffects: () => true,
        propertyReadSideEffects: true,
        tryCatchDeoptimization: true,
        unknownGlobalSideEffects: false
      },
      safest: {
        annotations: true,
        correctVarValueBeforeDeclaration: true,
        moduleSideEffects: () => true,
        propertyReadSideEffects: true,
        tryCatchDeoptimization: true,
        unknownGlobalSideEffects: true
      },
      smallest: {
        annotations: true,
        correctVarValueBeforeDeclaration: false,
        moduleSideEffects: () => false,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false,
        unknownGlobalSideEffects: false
      }
    };
    getOnwarn = (config) => {
      const { onwarn } = config;
      return onwarn ? (warning) => {
        warning.toString = () => {
          let str = "";
          if (warning.plugin)
            str += `(${warning.plugin} plugin) `;
          if (warning.loc)
            str += `${relativeId(warning.loc.file)} (${warning.loc.line}:${warning.loc.column}) `;
          str += warning.message;
          return str;
        };
        onwarn(warning, defaultOnWarn);
      } : defaultOnWarn;
    };
    getAcorn = (config) => __spreadValues({
      allowAwaitOutsideFunction: true,
      ecmaVersion: "latest",
      preserveParens: false,
      sourceType: "module"
    }, config.acorn);
    getAcornInjectPlugins = (config) => ensureArray(config.acornInjectPlugins);
    getCache = (config) => {
      var _a;
      return ((_a = config.cache) === null || _a === void 0 ? void 0 : _a.cache) || config.cache;
    };
    getIdMatcher = (option) => {
      if (option === true) {
        return () => true;
      }
      if (typeof option === "function") {
        return (id, ...args) => !id.startsWith("\0") && option(id, ...args) || false;
      }
      if (option) {
        const ids = new Set();
        const matchers = [];
        for (const value of ensureArray(option)) {
          if (value instanceof RegExp) {
            matchers.push(value);
          } else {
            ids.add(value);
          }
        }
        return (id, ..._args) => ids.has(id) || matchers.some((matcher) => matcher.test(id));
      }
      return () => false;
    };
    getInlineDynamicImports$1 = (config, warn, strictDeprecations) => {
      const configInlineDynamicImports = config.inlineDynamicImports;
      if (configInlineDynamicImports) {
        warnDeprecationWithOptions('The "inlineDynamicImports" option is deprecated. Use the "output.inlineDynamicImports" option instead.', false, warn, strictDeprecations);
      }
      return configInlineDynamicImports;
    };
    getInput = (config) => {
      const configInput = config.input;
      return configInput == null ? [] : typeof configInput === "string" ? [configInput] : configInput;
    };
    getManualChunks$1 = (config, warn, strictDeprecations) => {
      const configManualChunks = config.manualChunks;
      if (configManualChunks) {
        warnDeprecationWithOptions('The "manualChunks" option is deprecated. Use the "output.manualChunks" option instead.', false, warn, strictDeprecations);
      }
      return configManualChunks;
    };
    getMaxParallelFileReads = (config) => {
      const maxParallelFileReads = config.maxParallelFileReads;
      if (typeof maxParallelFileReads === "number") {
        if (maxParallelFileReads <= 0)
          return Infinity;
        return maxParallelFileReads;
      }
      return 20;
    };
    getModuleContext = (config, context) => {
      const configModuleContext = config.moduleContext;
      if (typeof configModuleContext === "function") {
        return (id) => {
          var _a;
          return (_a = configModuleContext(id)) !== null && _a !== void 0 ? _a : context;
        };
      }
      if (configModuleContext) {
        const contextByModuleId = Object.create(null);
        for (const [key, moduleContext] of Object.entries(configModuleContext)) {
          contextByModuleId[(0, import_path.resolve)(key)] = moduleContext;
        }
        return (id) => contextByModuleId[id] || context;
      }
      return () => context;
    };
    getPreserveEntrySignatures = (config, unsetOptions) => {
      const configPreserveEntrySignatures = config.preserveEntrySignatures;
      if (configPreserveEntrySignatures == null) {
        unsetOptions.add("preserveEntrySignatures");
      }
      return configPreserveEntrySignatures !== null && configPreserveEntrySignatures !== void 0 ? configPreserveEntrySignatures : "strict";
    };
    getPreserveModules$1 = (config, warn, strictDeprecations) => {
      const configPreserveModules = config.preserveModules;
      if (configPreserveModules) {
        warnDeprecationWithOptions('The "preserveModules" option is deprecated. Use the "output.preserveModules" option instead.', false, warn, strictDeprecations);
      }
      return configPreserveModules;
    };
    getTreeshake = (config, warn, strictDeprecations) => {
      const configTreeshake = config.treeshake;
      if (configTreeshake === false) {
        return false;
      }
      if (typeof configTreeshake === "string") {
        const preset = treeshakePresets[configTreeshake];
        if (preset) {
          return preset;
        }
        error(errInvalidOption("treeshake", `valid values are false, true, ${printQuotedStringList(Object.keys(treeshakePresets))}. You can also supply an object for more fine-grained control`));
      }
      let configWithPreset = {};
      if (typeof configTreeshake === "object") {
        if (typeof configTreeshake.pureExternalModules !== "undefined") {
          warnDeprecationWithOptions(`The "treeshake.pureExternalModules" option is deprecated. The "treeshake.moduleSideEffects" option should be used instead. "treeshake.pureExternalModules: true" is equivalent to "treeshake.moduleSideEffects: 'no-external'"`, true, warn, strictDeprecations);
        }
        configWithPreset = configTreeshake;
        const presetName = configTreeshake.preset;
        if (presetName) {
          const preset = treeshakePresets[presetName];
          if (preset) {
            configWithPreset = __spreadValues(__spreadValues({}, preset), configTreeshake);
          } else {
            error(errInvalidOption("treeshake.preset", `valid values are ${printQuotedStringList(Object.keys(treeshakePresets))}`));
          }
        }
      }
      return {
        annotations: configWithPreset.annotations !== false,
        correctVarValueBeforeDeclaration: configWithPreset.correctVarValueBeforeDeclaration === true,
        moduleSideEffects: typeof configTreeshake === "object" && configTreeshake.pureExternalModules ? getHasModuleSideEffects(configTreeshake.moduleSideEffects, configTreeshake.pureExternalModules) : getHasModuleSideEffects(configWithPreset.moduleSideEffects, void 0),
        propertyReadSideEffects: configWithPreset.propertyReadSideEffects === "always" ? "always" : configWithPreset.propertyReadSideEffects !== false,
        tryCatchDeoptimization: configWithPreset.tryCatchDeoptimization !== false,
        unknownGlobalSideEffects: configWithPreset.unknownGlobalSideEffects !== false
      };
    };
    getHasModuleSideEffects = (moduleSideEffectsOption, pureExternalModules) => {
      if (typeof moduleSideEffectsOption === "boolean") {
        return () => moduleSideEffectsOption;
      }
      if (moduleSideEffectsOption === "no-external") {
        return (_id, external) => !external;
      }
      if (typeof moduleSideEffectsOption === "function") {
        return (id, external) => !id.startsWith("\0") ? moduleSideEffectsOption(id, external) !== false : true;
      }
      if (Array.isArray(moduleSideEffectsOption)) {
        const ids = new Set(moduleSideEffectsOption);
        return (id) => ids.has(id);
      }
      if (moduleSideEffectsOption) {
        error(errInvalidOption("treeshake.moduleSideEffects", 'please use one of false, "no-external", a function or an array'));
      }
      const isPureExternalModule = getIdMatcher(pureExternalModules);
      return (id, external) => !(external && isPureExternalModule(id));
    };
    getFile = (config, preserveModules, inputOptions) => {
      const { file } = config;
      if (typeof file === "string") {
        if (preserveModules) {
          return error({
            code: "INVALID_OPTION",
            message: 'You must set "output.dir" instead of "output.file" when using the "output.preserveModules" option.'
          });
        }
        if (!Array.isArray(inputOptions.input))
          return error({
            code: "INVALID_OPTION",
            message: 'You must set "output.dir" instead of "output.file" when providing named inputs.'
          });
      }
      return file;
    };
    getFormat = (config) => {
      const configFormat = config.format;
      switch (configFormat) {
        case void 0:
        case "es":
        case "esm":
        case "module":
          return "es";
        case "cjs":
        case "commonjs":
          return "cjs";
        case "system":
        case "systemjs":
          return "system";
        case "amd":
        case "iife":
        case "umd":
          return configFormat;
        default:
          return error({
            message: `You must specify "output.format", which can be one of "amd", "cjs", "system", "es", "iife" or "umd".`,
            url: `https://rollupjs.org/guide/en/#outputformat`
          });
      }
    };
    getInlineDynamicImports = (config, inputOptions) => {
      var _a;
      const inlineDynamicImports = ((_a = config.inlineDynamicImports) !== null && _a !== void 0 ? _a : inputOptions.inlineDynamicImports) || false;
      const { input } = inputOptions;
      if (inlineDynamicImports && (Array.isArray(input) ? input : Object.keys(input)).length > 1) {
        return error({
          code: "INVALID_OPTION",
          message: 'Multiple inputs are not supported for "output.inlineDynamicImports".'
        });
      }
      return inlineDynamicImports;
    };
    getPreserveModules = (config, inlineDynamicImports, inputOptions) => {
      var _a;
      const preserveModules = ((_a = config.preserveModules) !== null && _a !== void 0 ? _a : inputOptions.preserveModules) || false;
      if (preserveModules) {
        if (inlineDynamicImports) {
          return error({
            code: "INVALID_OPTION",
            message: `The "output.inlineDynamicImports" option is not supported for "output.preserveModules".`
          });
        }
        if (inputOptions.preserveEntrySignatures === false) {
          return error({
            code: "INVALID_OPTION",
            message: 'Setting "preserveEntrySignatures" to "false" is not supported for "output.preserveModules".'
          });
        }
      }
      return preserveModules;
    };
    getPreserveModulesRoot = (config) => {
      const { preserveModulesRoot } = config;
      if (preserveModulesRoot === null || preserveModulesRoot === void 0) {
        return void 0;
      }
      return (0, import_path.resolve)(preserveModulesRoot);
    };
    getAmd = (config) => {
      const collection = __spreadValues({
        autoId: false,
        basePath: "",
        define: "define"
      }, config.amd);
      if ((collection.autoId || collection.basePath) && collection.id) {
        return error({
          code: "INVALID_OPTION",
          message: '"output.amd.autoId"/"output.amd.basePath" and "output.amd.id" cannot be used together.'
        });
      }
      if (collection.basePath && !collection.autoId) {
        return error({
          code: "INVALID_OPTION",
          message: '"output.amd.basePath" only works with "output.amd.autoId".'
        });
      }
      let normalized;
      if (collection.autoId) {
        normalized = {
          autoId: true,
          basePath: collection.basePath,
          define: collection.define
        };
      } else {
        normalized = {
          autoId: false,
          define: collection.define,
          id: collection.id
        };
      }
      return normalized;
    };
    getAddon = (config, name) => {
      const configAddon = config[name];
      if (typeof configAddon === "function") {
        return configAddon;
      }
      return () => configAddon || "";
    };
    getDir = (config, file) => {
      const { dir } = config;
      if (typeof dir === "string" && typeof file === "string") {
        return error({
          code: "INVALID_OPTION",
          message: 'You must set either "output.file" for a single-file build or "output.dir" when generating multiple chunks.'
        });
      }
      return dir;
    };
    getDynamicImportFunction = (config, inputOptions) => {
      const configDynamicImportFunction = config.dynamicImportFunction;
      if (configDynamicImportFunction) {
        warnDeprecation(`The "output.dynamicImportFunction" option is deprecated. Use the "renderDynamicImport" plugin hook instead.`, false, inputOptions);
      }
      return configDynamicImportFunction;
    };
    getEntryFileNames = (config, unsetOptions) => {
      const configEntryFileNames = config.entryFileNames;
      if (configEntryFileNames == null) {
        unsetOptions.add("entryFileNames");
      }
      return configEntryFileNames !== null && configEntryFileNames !== void 0 ? configEntryFileNames : "[name].js";
    };
    getIndent = (config, compact) => {
      if (compact) {
        return "";
      }
      const configIndent = config.indent;
      return configIndent === false ? "" : configIndent !== null && configIndent !== void 0 ? configIndent : true;
    };
    ALLOWED_INTEROP_TYPES = new Set(["auto", "esModule", "default", "defaultOnly", true, false]);
    getInterop = (config, inputOptions) => {
      const configInterop = config.interop;
      const validatedInteropTypes = new Set();
      const validateInterop = (interop) => {
        if (!validatedInteropTypes.has(interop)) {
          validatedInteropTypes.add(interop);
          if (!ALLOWED_INTEROP_TYPES.has(interop)) {
            return error({
              code: "INVALID_OPTION",
              message: `The value ${JSON.stringify(interop)} is not supported for "output.interop". Use one of ${Array.from(ALLOWED_INTEROP_TYPES.values(), (value) => JSON.stringify(value)).join(", ")} instead.`,
              url: "https://rollupjs.org/guide/en/#outputinterop"
            });
          }
          if (typeof interop === "boolean") {
            warnDeprecation({
              message: `The boolean value "${interop}" for the "output.interop" option is deprecated. Use ${interop ? '"auto"' : '"esModule", "default" or "defaultOnly"'} instead.`,
              url: "https://rollupjs.org/guide/en/#outputinterop"
            }, false, inputOptions);
          }
        }
        return interop;
      };
      if (typeof configInterop === "function") {
        const interopPerId = Object.create(null);
        let defaultInterop = null;
        return (id) => id === null ? defaultInterop || validateInterop(defaultInterop = configInterop(id)) : id in interopPerId ? interopPerId[id] : validateInterop(interopPerId[id] = configInterop(id));
      }
      return configInterop === void 0 ? () => true : () => validateInterop(configInterop);
    };
    getManualChunks = (config, inlineDynamicImports, preserveModules, inputOptions) => {
      const configManualChunks = config.manualChunks || inputOptions.manualChunks;
      if (configManualChunks) {
        if (inlineDynamicImports) {
          return error({
            code: "INVALID_OPTION",
            message: 'The "output.manualChunks" option is not supported for "output.inlineDynamicImports".'
          });
        }
        if (preserveModules) {
          return error({
            code: "INVALID_OPTION",
            message: 'The "output.manualChunks" option is not supported for "output.preserveModules".'
          });
        }
      }
      return configManualChunks || {};
    };
    getMinifyInternalExports = (config, format, compact) => {
      var _a;
      return (_a = config.minifyInternalExports) !== null && _a !== void 0 ? _a : compact || format === "es" || format === "system";
    };
    (function(SortingFileType2) {
      SortingFileType2[SortingFileType2["ENTRY_CHUNK"] = 0] = "ENTRY_CHUNK";
      SortingFileType2[SortingFileType2["SECONDARY_CHUNK"] = 1] = "SECONDARY_CHUNK";
      SortingFileType2[SortingFileType2["ASSET"] = 2] = "ASSET";
    })(SortingFileType || (SortingFileType = {}));
  }
});

// src/index.ts
__export(exports, {
  default: () => comlink,
  inWorker: () => inWorker
});
init_cjs_shims();
var import_fs3 = __toModule(require("fs"));
var import_crypto3 = __toModule(require("crypto"));
var import_path3 = __toModule(require("path"));

// node_modules/rollup/dist/es/rollup.js
init_cjs_shims();
init_rollup();
var import_path2 = __toModule(require("path"));
var import_crypto2 = __toModule(require("crypto"));
var import_fs2 = __toModule(require("fs"));
var import_events2 = __toModule(require("events"));

// src/index.ts
function getAssetHash(content) {
  return (0, import_crypto3.createHash)("sha256").update(content).digest("hex").slice(0, 8);
}
function inWorker(plugin) {
  plugin._inWorker = true;
  return plugin;
}
var internal_schema = "comlink-internal:";
function comlink({
  moduleWorker = false,
  types: types2 = false,
  schema = "comlink:",
  typeFile = "comlink-workers.d.ts",
  internal_worker_plugins = [
    "alias",
    "vite:modulepreload-polyfill",
    "vite:resolve",
    "vite:esbuild",
    "vite:json",
    "vite:wasm",
    "vite:asset",
    "vite:define",
    "commonjs",
    "vite:data-uri",
    "rollup-plugin-dynamic-import-variables",
    "asset-import-meta-url",
    "vite:import-analysis",
    "vite:esbuild-transpile",
    "vite:terser",
    "vite:reporter",
    "load-fallback"
  ]
} = {}) {
  let typesFile = "";
  let data2 = {};
  let isBuild = false;
  let config;
  let timer = null;
  function createTypes() {
    const data_json = "//" + JSON.stringify(data2);
    const types3 = Object.entries(data2).map(([id, real]) => {
      if (real.endsWith(".ts"))
        real = real.slice(0, real.length - 3);
      if (real[0] == "/" || real[0] == "\\")
        real = "." + real;
      if (real.startsWith(config.root))
        real = "." + real.slice(config.root.length);
      return moduleDefinition(id, real);
    }).join("");
    (0, import_fs3.writeFileSync)(typesFile, data_json + types3);
  }
  return inWorker({
    name: "comlink",
    configResolved(resolvedConfig) {
      isBuild = resolvedConfig.command === "build";
      config = resolvedConfig;
      if (types2) {
        typesFile = (0, import_path3.join)(config.root, typeFile);
        if (!isBuild && (0, import_fs3.existsSync)(typesFile)) {
          data2 = JSON.parse((0, import_fs3.readFileSync)(typesFile, "utf-8").split("\n")[0].slice(2));
        }
      }
    },
    async resolveId(id, importer) {
      var _a;
      if (id.startsWith(internal_schema)) {
        return id;
      }
      if (!id.startsWith(schema)) {
        return;
      }
      const realPath = id.slice(schema.length);
      const realID = (_a = await this.resolve(realPath, importer)) == null ? void 0 : _a.id.slice(config.root.length);
      if (!realID)
        throw new Error(`Worker module ${realPath} not found`);
      if (!isBuild && types2) {
        if (data2[id] != realID) {
          data2[id] = realID;
          if (!timer) {
            timer = setTimeout(() => {
              createTypes();
              timer = null;
            }, 2e3);
          }
        }
      }
      return schema + realID;
    },
    buildEnd() {
      if (types2) {
        createTypes();
      }
    },
    async load(id) {
      if (id.startsWith(schema)) {
        const baseId = `${internal_schema}${id.slice(schema.length)}`;
        let url = `/@id/${baseId}`;
        if (isBuild && !moduleWorker) {
          const bundle = await rollup({
            input: baseId,
            plugins: [
              ...config.plugins.filter((v) => v._inWorker || internal_worker_plugins.includes(v.name)),
              {
                name: "worker-env",
                resolveImportMeta(prop, ctx) {
                  if (prop !== "url")
                    return null;
                  return `new URL('${ctx.chunkId}', location.origin + '${config.base[0] == "/" ? "" : "/"}${config.base}').href`;
                }
              }
            ]
          });
          let code;
          try {
            const { output } = await bundle.generate({
              format: "iife",
              sourcemap: config.build.sourcemap
            });
            code = output[0].code;
          } finally {
            await bundle.close();
          }
          const content = Buffer.from(code);
          const p = id.split(/\/|\\/g);
          const b = p[p.length - 1].split(".");
          const basename2 = b.slice(0, b.length - 1).join(".");
          const contentHash = getAssetHash(content);
          const fileName = (0, import_path3.join)(config.build.assetsDir, `${basename2}.${contentHash}.js`);
          url = `__VITE_ASSET__${this.emitFile({
            fileName,
            type: "asset",
            source: code
          })}__`;
        }
        if (isBuild && moduleWorker) {
          url = baseId;
        }
        return `
          import { wrap } from 'comlink'

          let workers = []

          if (import.meta.hot) {
            import.meta.hot.dispose((data) => {
              workers.forEach(worker => worker.terminate())
            })
          }

          export default () => {
            const worker = new Worker('${url}'${!isBuild || moduleWorker ? ", {type: 'module'}" : ""})
            ${!isBuild ? "workers.push(worker)" : ""}
            return wrap(worker)
          }
        `;
      }
      if (id.startsWith(internal_schema)) {
        return `
          // Dev-Vite env
          ${!isBuild ? "import '/@vite/env'" : ""}
          import { expose } from 'comlink'
          import * as m from '${id.slice(internal_schema.length)}'
          
          expose(m)
        `;
      }
    }
  });
}
function moduleDefinition(id, real) {
  return `
declare module "${id}" {
  const mod: () => import("comlink").Remote<typeof import("${real}")>
  export default mod
}
`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  inWorker
});
/*
  @license
	Rollup.js v2.56.3
	Mon, 23 Aug 2021 05:06:39 GMT - commit c41d17ceedfa6c1d7430da70c6c80d86a91e9434


	https://github.com/rollup/rollup

	Released under the MIT License.
*/
