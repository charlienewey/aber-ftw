/*jslint browser: true*/

//Javascript: The Good Parts pg 22 (Chapter 3: Objects)
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        'use strict';
        
        var F = function () {};
        F.prototype = o;
        return new F();
    };
}