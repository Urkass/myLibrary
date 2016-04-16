'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.showName = showName;

var _databank = require('./databank.json');

var _databank2 = _interopRequireDefault(_databank);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function showName() {
    console.log(_databank2.default.students[0].name);
};