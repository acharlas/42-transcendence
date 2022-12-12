"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sphere = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
function Sphere() {
    return ((0, jsx_runtime_1.jsxs)("mesh", { children: [(0, jsx_runtime_1.jsx)("sphereGeometry", {}), (0, jsx_runtime_1.jsx)("meshBasicMaterial", { color: "red" })] }));
}
exports.Sphere = Sphere;
