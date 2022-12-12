"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPrivilege = exports.ChannelType = exports.UserStatus = void 0;
var UserStatus;
(function (UserStatus) {
    UserStatus["connected"] = "connected";
    UserStatus["disconnected"] = "disconnected";
    UserStatus["invited"] = "invited";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var ChannelType;
(function (ChannelType) {
    ChannelType["public"] = "public";
    ChannelType["private"] = "private";
    ChannelType["protected"] = "protected";
    ChannelType["dm"] = "dm";
})(ChannelType = exports.ChannelType || (exports.ChannelType = {}));
var UserPrivilege;
(function (UserPrivilege) {
    UserPrivilege["owner"] = "owner";
    UserPrivilege["admin"] = "admin";
    UserPrivilege["default"] = "default";
    UserPrivilege["muted"] = "muted";
    UserPrivilege["ban"] = "ban";
})(UserPrivilege = exports.UserPrivilege || (exports.UserPrivilege = {}));
