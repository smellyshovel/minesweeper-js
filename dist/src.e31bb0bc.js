// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"cell.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Cell =
/*#__PURE__*/
function () {
  function Cell(field, x, y) {
    _classCallCheck(this, Cell);

    this.field = field;
    this.x = x;
    this.y = y;
    this._image = this.Images.closed;
    this.isMined = false;
    this.value = 0;
    this.isClosed = true;
    this.isFlagged = false;
    this.isDoubted = false;
  }

  _createClass(Cell, [{
    key: "draw",
    value: function draw() {
      this.field.context.drawImage(this._image, this.bounds.left, this.bounds.top, this.size, this.size);
    }
  }, {
    key: "open",
    value: function open() {
      if (!this.field.game.isStarted) {
        this.field.mineCells([this].concat(_toConsumableArray(this.neighbours)));
        this.field.game.dispatch("start", this.field.game);
      }

      (function openCell(cell, isRecursive) {
        if (cell.isOpened || cell.isFlagged || cell.isDoubted) return;

        if (cell.isMined) {
          cell.isClosed = false;
        } else {
          cell.image = "".concat(cell.value);
          cell.isClosed = false;

          if (cell.value === 0) {
            cell.neighbours.forEach(function (neighbour) {
              return openCell(neighbour, true);
            });
          }
        }

        if (!isRecursive) {
          cell.field.game.dispatch("cellopen", cell);
        }
      })(this);
    }
  }, {
    key: "flag",
    value: function flag(force) {
      if (this.isClosed) {
        if (!this.isFlagged && !this.isDoubted) {
          // closed but not flagged nor doubted
          this.isFlagged = true;
          this.image = "flag";
        } else if (this.isFlagged) {
          // already flagged
          this.isFlagged = false;
          this.isDoubted = true;
          this.image = "doubt";
        } else if (this.isDoubted) {
          // already doubted
          this.isDoubted = false;
          this.image = "closed";
        }
      }

      if (force) {
        this.isDoubted = false;
        this.isFlagged = true;
        this.image = "flag";
      }

      this.field.game.dispatch("cellflag", this);
    }
  }, {
    key: "leftDown",
    value: function leftDown() {
      if (this.isClosed && !this.isFlagged && !this.isDoubted) {
        this.tempImage = "0";
      }
    }
  }, {
    key: "leftUp",
    value: function leftUp() {
      if (this.isClosed && !this.isFlagged && !this.isDoubted) {
        this.open();
      }
    }
  }, {
    key: "rightUp",
    value: function rightUp() {
      this.flag();
    }
  }, {
    key: "middleDown",
    value: function middleDown() {
      this.neighbours.forEach(function (neighbour) {
        if (neighbour.isClosed && !neighbour.isFlagged && !neighbour.isDoubted) {
          neighbour.tempImage = "0";
        }
      });
    }
  }, {
    key: "middleUp",
    value: function middleUp() {
      if (this.isOpened && this.value) {
        var flaggedNeighbours = this.neighbours.filter(function (neighbour) {
          return neighbour.isFlagged;
        });

        if (flaggedNeighbours.length === this.value) {
          this.neighbours.forEach(function (neighbour) {
            return neighbour.open();
          });
        }
      }

      this.field.draw();
    }
  }, {
    key: "Images",
    get: function get() {
      return this.field.theme;
    }
  }, {
    key: "image",
    set: function set(val) {
      this._image = this.Images["".concat(val)];
      this.draw();
    }
  }, {
    key: "tempImage",
    set: function set(val) {
      var currentImage = this._image;
      this.image = val;
      this._image = currentImage;
    }
  }, {
    key: "bounds",
    get: function get() {
      var offsetX = (this.field.canvas.width - this.field.props.width * this.size) / 2;
      var offsetY = (this.field.canvas.height - this.field.props.height * this.size) / 2;
      return {
        left: this.x * this.size + offsetX,
        right: this.x * this.size + this.size + offsetX,
        top: this.y * this.size + offsetY,
        bottom: this.y * this.size + this.size + offsetY
      };
    }
  }, {
    key: "size",
    get: function get() {
      return Math.min(this.field.canvas.width / this.field.props.width, this.field.canvas.height / this.field.props.height);
    }
  }, {
    key: "isOpened",
    get: function get() {
      return !this.isClosed;
    }
  }]);

  return Cell;
}();

exports.default = Cell;
},{}],"field.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cell = _interopRequireDefault(require("./cell"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Field =
/*#__PURE__*/
function () {
  function Field(_ref) {
    var game = _ref.game,
        canvas = _ref.canvas,
        theme = _ref.theme,
        props = _objectWithoutProperties(_ref, ["game", "canvas", "theme"]);

    _classCallCheck(this, Field);

    this.game = game;
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.theme = theme;
    this.props = props;
    this.initCells();
    this.eventListeners = new Map();
    this.registerEventListeners();
    this.draw();
  }

  _createClass(Field, [{
    key: "initCells",
    value: function initCells() {
      var _this = this;

      this.cells = Array.from(new Array(this.props.width * this.props.height), function (c, i) {
        var x = i % _this.props.width;
        var y = (i - x) / _this.props.width;
        return new _cell.default(_this, x, y);
      });
      this.cells.forEach(function (cell) {
        cell.neighbours = _this.cells.filter(function (neighbour) {
          var xs = [cell.x - 1, cell.x, cell.x + 1];
          var ys = [cell.y - 1, cell.y, cell.y + 1];
          return xs.includes(neighbour.x) && ys.includes(neighbour.y) && cell !== neighbour;
        });
      });
    }
  }, {
    key: "mineCells",
    value: function mineCells(except) {
      var cellsToFill = this.cells.filter(function (cell) {
        return !except.includes(cell);
      });
      this.minedCells = [];

      while (this.minedCells.length < this.props.mines) {
        var cell = cellsToFill[Math.random() * cellsToFill.length | 0];

        if (!cell.isMined) {
          cell.isMined = true;
          this.minedCells.push(cell);
        }
      }

      this.minedCells.forEach(function (cell) {
        cell.neighbours.forEach(function (neighbour) {
          return neighbour.value += 1;
        });
      });
    }
  }, {
    key: "locateCell",
    value: function locateCell(offsetX, offsetY) {
      return this.cells.find(function (cell) {
        return cell.bounds.left <= offsetX && cell.bounds.right >= offsetX && cell.bounds.top <= offsetY && cell.bounds.bottom >= offsetY;
      });
    }
  }, {
    key: "draw",
    value: function draw() {
      if (this.game.isPaused) {
        this.context.fillStyle = "#f2f2f2";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.textBaseline = 'middle';
        this.context.textAlign = "center";
        this.context.font = "2em Helvetica";
        this.context.fillStyle = "#828282";
        this.context.fillText("The game is paused.", this.canvas.width / 2, this.canvas.height / 2);
      } else {
        this.context.fillStyle = "#fff";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.cells.forEach(function (cell) {
          return cell.draw();
        });
      }
    }
  }, {
    key: "registerEventListeners",
    value: function registerEventListeners() {
      var _this2 = this;

      // no need to ever unregister it
      this.canvas.addEventListener("contextmenu", function (event) {
        event.preventDefault();
      });
      var ignoreNextUp = false;
      this.eventListeners.set({
        event: "mousedown",
        target: this.canvas
      }, function (event) {
        // force draw to insure the latest state is visible
        _this2.draw();

        var cell = _this2.locateCell(event.offsetX, event.offsetY);

        if (!cell) return;

        if (event.buttons === 1) {
          // left button
          cell.leftDown();
        } else if (event.buttons > 2 && event.buttons < 8) {
          // middle or both left and right buttons
          cell.middleDown();
        }

        ignoreNextUp = false;
      }); // the last mousemove'd cell

      var lastCell;
      this.eventListeners.set({
        event: "mousemove",
        target: this.canvas
      }, function (event) {
        var cell = _this2.locateCell(event.offsetX, event.offsetY);

        if (!cell) return;

        if (lastCell !== cell) {
          // force draw to insure the latest state is visible
          _this2.draw();

          if (event.buttons === 1) {
            // left button
            cell.leftDown();
          } else if (event.buttons > 2 && event.buttons < 8) {
            // middle or both left and right buttons
            cell.middleDown();
          }

          lastCell = cell;
        }
      });
      this.eventListeners.set({
        event: "mouseleave",
        target: this.canvas
      }, function (event) {
        _this2.draw();

        ignoreNextUp = false;
      });
      this.eventListeners.set({
        event: "mouseup",
        target: this.canvas
      }, function (event) {
        var cell = _this2.locateCell(event.offsetX, event.offsetY);

        if (!cell) return;

        if (event.buttons === 0) {
          // no more buttons are down
          if (event.button === 0) {
            // left button
            if (!ignoreNextUp) cell.leftUp();
          } else if (event.button === 2) {
            // right button
            if (!ignoreNextUp) cell.rightUp();
          } else if (event.button === 1) {
            // middle button
            cell.middleUp();
            ignoreNextUp = true;
          }
        } else if (event.buttons > 0 && event.buttons < 8) {
          // either left or right button is still down
          cell.middleUp();
          ignoreNextUp = true;
        }
      });
      this.eventListeners.forEach(function (val, key) {
        key.target.addEventListener(key.event, val);
      });
    }
  }, {
    key: "unregisterEventListeners",
    value: function unregisterEventListeners() {
      this.eventListeners.forEach(function (val, key) {
        key.target.removeEventListener(key.event, val);
      });
      this.eventListeners.clear();
    }
  }, {
    key: "closedCells",
    get: function get() {
      return this.cells.filter(function (cell) {
        return cell.isClosed;
      });
    }
  }, {
    key: "openedCells",
    get: function get() {
      return this.cells.filter(function (cell) {
        return cell.isOpened;
      });
    }
  }, {
    key: "flaggedCells",
    get: function get() {
      return this.cells.filter(function (cell) {
        return cell.isFlagged;
      });
    }
  }]);

  return Field;
}();

exports.default = Field;
},{"./cell":"cell.js"}],"minesweeper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _field = _interopRequireDefault(require("./field"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Minesweeper =
/*#__PURE__*/
function () {
  function Minesweeper(_ref) {
    var _this = this;

    var canvas = _ref.canvas,
        theme = _ref.theme,
        _ref$width = _ref.width,
        width = _ref$width === void 0 ? 9 : _ref$width,
        _ref$height = _ref.height,
        height = _ref$height === void 0 ? 9 : _ref$height,
        _ref$mines = _ref.mines,
        mines = _ref$mines === void 0 ? 10 : _ref$mines;

    _classCallCheck(this, Minesweeper);

    if (width < 5 || width > 50 || height < 5 || height > 50) {
      throw new Error("Incorrect field size. The field must be from 5\xD75 to 50\xD750 cells large, but ".concat(width, "\xD7").concat(height, " is provided"));
    }

    if (mines < 1 || mines > width * height - 10) {
      throw new Error("Incorrect number of mines. For the ".concat(width, "\xD7").concat(height, " field it must be between 1 and ").concat(width * height - 10, ", but ").concat(mines, " is provided"));
    } // all the event listeners registered using `.on()` are stored here


    this.eventListeners = {};
    this.field = new _field.default({
      game: this,
      canvas: canvas,
      theme: theme,
      width: width,
      height: height,
      mines: mines
    });
    this.on("start", function () {
      _this.isStarted = true;
    }).on("cellopen", function (cell) {
      var won = _this.field.closedCells.every(function (cell) {
        return cell.isMined;
      });

      var lost = _this.field.openedCells.some(function (cell) {
        return cell.isMined;
      });

      if (won) {
        _this.field.minedCells.forEach(function (cell) {
          return cell.flag(true);
        });

        _this.dispatch("end", "won");
      } else if (lost) {
        _this.field.minedCells.forEach(function (cell) {
          if (!cell.isFlagged) cell.image = "mine";
        });

        _this.field.flaggedCells.forEach(function (cell) {
          if (!cell.isMined) cell.image = "cross";
        });

        cell.image = "trigger";

        _this.dispatch("end", "lost");
      }
    }).on("pause", function () {
      _this.isPaused = true;

      _this.field.draw();

      _this.field.unregisterEventListeners();
    }).on("resume", function () {
      _this.isPaused = false;

      _this.field.draw();

      _this.field.registerEventListeners();
    }).on("end", function () {
      _this.isEnded = true;

      _this.field.unregisterEventListeners();
    });
  }

  _createClass(Minesweeper, [{
    key: "pause",
    value: function pause() {
      this.dispatch("pause");
    }
  }, {
    key: "resume",
    value: function resume() {
      this.dispatch("resume");
    }
  }, {
    key: "on",
    value: function on(event, listener) {
      if (!this.eventListeners[event]) this.eventListeners[event] = [];
      this.eventListeners[event].push(listener);
      return this;
    }
  }, {
    key: "dispatch",
    value: function dispatch(event) {
      var _this2 = this;

      for (var _len = arguments.length, params = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        params[_key - 1] = arguments[_key];
      }

      (this.eventListeners[event] || []).forEach(function (listener) {
        if (typeof listener === "function") {
          listener.call.apply(listener, [_this2].concat(params));
        }
      });
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this.dispatch("end");
      return null;
    }
  }]);

  return Minesweeper;
}();

exports.default = Minesweeper;
},{"./field":"field.js"}],"assets/cells/1.svg":[function(require,module,exports) {
module.exports = "/1.c1313452.svg";
},{}],"assets/cells/0.svg":[function(require,module,exports) {
module.exports = "/0.f7b88c5c.svg";
},{}],"assets/cells/2.svg":[function(require,module,exports) {
module.exports = "/2.fb248939.svg";
},{}],"assets/cells/3.svg":[function(require,module,exports) {
module.exports = "/3.230c7b9e.svg";
},{}],"assets/cells/4.svg":[function(require,module,exports) {
module.exports = "/4.874532b5.svg";
},{}],"assets/cells/5.svg":[function(require,module,exports) {
module.exports = "/5.275bb037.svg";
},{}],"assets/cells/6.svg":[function(require,module,exports) {
module.exports = "/6.55e750bf.svg";
},{}],"assets/cells/7.svg":[function(require,module,exports) {
module.exports = "/7.3e483b0b.svg";
},{}],"assets/cells/8.svg":[function(require,module,exports) {
module.exports = "/8.5f7c9b70.svg";
},{}],"assets/cells/9.svg":[function(require,module,exports) {
module.exports = "/9.15af0125.svg";
},{}],"assets/cells/closed.svg":[function(require,module,exports) {
module.exports = "/closed.6d05b706.svg";
},{}],"assets/cells/cross.svg":[function(require,module,exports) {
module.exports = "/cross.98d030f8.svg";
},{}],"assets/cells/doubt.svg":[function(require,module,exports) {
module.exports = "/doubt.10b396ba.svg";
},{}],"assets/cells/flag.svg":[function(require,module,exports) {
module.exports = "/flag.1cd68c94.svg";
},{}],"assets/cells/mine.svg":[function(require,module,exports) {
module.exports = "/mine.372ec99c.svg";
},{}],"assets/cells/trigger.svg":[function(require,module,exports) {
module.exports = "/trigger.83feb2f5.svg";
},{}],"assets/cells/*.svg":[function(require,module,exports) {
module.exports = {
  "0": require("./0.svg"),
  "1": require("./1.svg"),
  "2": require("./2.svg"),
  "3": require("./3.svg"),
  "4": require("./4.svg"),
  "5": require("./5.svg"),
  "6": require("./6.svg"),
  "7": require("./7.svg"),
  "8": require("./8.svg"),
  "9": require("./9.svg"),
  "closed": require("./closed.svg"),
  "cross": require("./cross.svg"),
  "doubt": require("./doubt.svg"),
  "flag": require("./flag.svg"),
  "mine": require("./mine.svg"),
  "trigger": require("./trigger.svg")
};
},{"./1.svg":"assets/cells/1.svg","./0.svg":"assets/cells/0.svg","./2.svg":"assets/cells/2.svg","./3.svg":"assets/cells/3.svg","./4.svg":"assets/cells/4.svg","./5.svg":"assets/cells/5.svg","./6.svg":"assets/cells/6.svg","./7.svg":"assets/cells/7.svg","./8.svg":"assets/cells/8.svg","./9.svg":"assets/cells/9.svg","./closed.svg":"assets/cells/closed.svg","./cross.svg":"assets/cells/cross.svg","./doubt.svg":"assets/cells/doubt.svg","./flag.svg":"assets/cells/flag.svg","./mine.svg":"assets/cells/mine.svg","./trigger.svg":"assets/cells/trigger.svg"}],"index.js":[function(require,module,exports) {
"use strict";

var _minesweeper = _interopRequireDefault(require("./minesweeper"));

var _ = _interopRequireDefault(require("./assets/cells/*.svg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Settings = {
  get defaultPresets() {
    return {
      easy: {
        width: 9,
        height: 9,
        mines: 10
      },
      medium: {
        width: 16,
        height: 16,
        mines: 40
      },
      hard: {
        width: 30,
        height: 16,
        mines: 99
      }
    };
  },

  get difficulty() {
    return localStorage.getItem("difficulty");
  },

  set difficulty(val) {
    localStorage.setItem("difficulty", val);
  },

  get customPreset() {
    return JSON.parse(localStorage.getItem("customPreset"));
  },

  set customPreset(val) {
    localStorage.setItem("customPreset", JSON.stringify(val));
  },

  set customWidth(val) {
    var customPreset = this.customPreset;
    customPreset.width = val;
    this.customPreset = customPreset;
  },

  set customHeight(val) {
    var customPreset = this.customPreset;
    customPreset.height = val;
    this.customPreset = customPreset;
  },

  set customMines(val) {
    var customPreset = this.customPreset;
    customPreset.mines = val;
    this.customPreset = customPreset;
  },

  get width() {
    if (this.difficulty !== "custom") {
      return +this.defaultPresets[this.difficulty].width;
    } else {
      return +this.customPreset.width;
    }
  },

  get height() {
    if (this.difficulty !== "custom") {
      return +this.defaultPresets[this.difficulty].height;
    } else {
      return +this.customPreset.height;
    }
  },

  get mines() {
    if (this.difficulty !== "custom") {
      return +this.defaultPresets[this.difficulty].mines;
    } else {
      return +this.customPreset.mines;
    }
  }

};

if (!Settings.difficulty) {
  Settings.difficulty = "medium";
}

if (!Settings.customPreset) {
  Settings.customPreset = {
    width: 20,
    height: 20,
    mines: 20
  };
}

var difficultyInput = document.querySelector("#difficulty");
var widthInput = document.querySelector("#width");
var heightInput = document.querySelector("#height");
var minesInput = document.querySelector("#mines");
difficultyInput.value = Settings.difficulty;

function updateInputs() {
  widthInput.value = Settings.width;
  heightInput.value = Settings.height;
  minesInput.value = Settings.mines;

  if (Settings.difficulty !== "custom") {
    widthInput.disabled = true;
    heightInput.disabled = true;
    minesInput.disabled = true;
  } else {
    widthInput.disabled = false;
    heightInput.disabled = false;
    minesInput.disabled = false;
  }
}

updateInputs();

function updateMines() {
  minesInput.max = Settings.width * Settings.height - 10;

  if (+minesInput.value > +minesInput.max) {
    minesInput.value = minesInput.max;
  }

  Settings.customMines = minesInput.value;
}

updateMines();
difficultyInput.addEventListener("change", function () {
  Settings.difficulty = this.value;
  updateInputs();
});
widthInput.addEventListener("change", function () {
  Settings.customWidth = this.value;
  updateMines();
});
heightInput.addEventListener("change", function () {
  Settings.customHeight = this.value;
  updateMines();
});
minesInput.addEventListener("change", function () {
  updateMines();
});
var timerOutput = document.querySelector("#timer");
timerOutput.value = "00:00";
var timer,
    time = 0;

function startTimer() {
  timer = setInterval(function () {
    time += 1;
    outputTime(); // clock =
  }, 1000);
}

function stopTimer(clear) {
  clearInterval(timer);
  if (clear) time = 0, outputTime();
}

function outputTime() {
  var minutes = time / 60 | 0;
  var seconds = time % 60;
  timerOutput.innerHTML = "".concat(minutes < 10 ? "".concat("0" + minutes) : minutes, ":").concat(seconds < 10 ? "".concat("0" + seconds) : seconds);
}

var pauseButton = document.querySelector("#pause");
var Images = {};

for (var name in _.default) {
  var img = new Image();
  img.src = _.default[name];
  Images[name] = img;
}

var game = startNewGame();

function startNewGame() {
  var game = new _minesweeper.default({
    canvas: document.querySelector("#minesweeper"),
    theme: _objectSpread({}, Images),
    width: Settings.width,
    height: Settings.height,
    mines: Settings.mines
  });
  var resultOutput = document.querySelector("#result");
  resultOutput.value = "";
  var flagsOutput = document.querySelector("#flags");
  flagsOutput.value = "0 / ".concat(Settings.mines);
  game.on("start", function () {
    startTimer();
    pauseButton.disabled = false;
  }).on("pause", function () {
    stopTimer();
    pauseButton.innerHTML = "Resume";
  }).on("resume", function () {
    startTimer();
    pauseButton.innerHTML = "Pause";
  }).on("cellflag", function () {
    flagsOutput.value = "".concat(game.field.flaggedCells.length, " / ").concat(Settings.mines);
  }).on("end", function (result) {
    if (result === "won") {
      resultOutput.value = "You won! Congratulations!";
      resultOutput.classList.add("visible");
    } else if (result === "lost") {
      resultOutput.value = "You lost :(";
      resultOutput.classList.add("visible");
    }

    setTimeout(function () {
      resultOutput.classList.remove("visible");
    }, 2000);
    pauseButton.disabled = true;
    stopTimer();
  });
  return game;
}

;
document.querySelector("#start").addEventListener("click", function () {
  if (game.isStarted && !game.isEnded && !confirm("Are you sure?")) return;
  game = game.destroy();
  game = startNewGame();
  stopTimer(true);
});
pauseButton.addEventListener("click", function () {
  if (game.isPaused) {
    game.resume();
  } else {
    game.pause();
  }
});

function resizeCanvas() {
  var canvas = document.querySelector("#minesweeper");
  canvas.width = canvas.getBoundingClientRect().width;
  canvas.height = canvas.getBoundingClientRect().height;
  game.field.draw();
}

resizeCanvas();
window.addEventListener("resize", function (event) {
  resizeCanvas();
});
},{"./minesweeper":"minesweeper.js","./assets/cells/*.svg":"assets/cells/*.svg"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "35339" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map