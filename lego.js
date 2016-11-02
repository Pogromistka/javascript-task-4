'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

var assort = ['and', 'or', 'filterIn', 'sortBy', 'select', 'limit', 'format'];

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {

    var copyCollection = JSON.parse(JSON.stringify(collection));
    var arg = [].slice.call(arguments);

    arg.splice(0, 1);
    arg.sort(function (argA, argB) {
        return assort.indexOf(argA.func) - assort.indexOf(argB.func);
    });

    for (var i = 0; i < arg.length; i++) {
        copyCollection = arg[i].res(copyCollection);
    }

    return copyCollection;
    // return collection;
};

/**
 * Выбор полей
 * @params {...String}
 * @returns {Object}
 */
exports.select = function () {

    var fields = [].slice.call(arguments);
    var selectedCol = [];

    return {
        func: 'select',
        res: function (collection) {
            for (var i = 0; i < collection.length; i++) {
                selectedCol.push(copyNoteCollection(collection[i], fields));
            }

            return selectedCol;
        }
    };
};

function copyNoteCollection(note, fields) {

    var remarkCol = {};

    for (var key in note) {
        if (fields.indexOf(key) !== -1) {
            remarkCol[key] = note[key];
        }
    }

    return remarkCol;
}

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Object}
 */
exports.filterIn = function (property, values) {
    // console.info(property, values);

    var filteredCol = [];

    return {
        func: 'filterIn',
        res: function (collection) {
            for (var i = 0; i < collection.length; i++) {
                if (collection[i][property] !== undefined &&
                    values.indexOf(collection[i][property]) !== -1) {
                    filteredCol.push(collection[i]);
                }
            }

            return filteredCol;
        }
    };
};

/**
 * Сортировка коллекции по полю
 * @param {String} property – Свойство для фильтрации
 * @param {String} order – Порядок сортировки (asc - по возрастанию; desc – по убыванию)
 * @returns {Object}
 */
exports.sortBy = function (property, order) {
    // console.info(property, order);

    return {
        func: 'sortBy',
        res: function (collection) {
            collection.sort(function (personaA, personaB) {
                // if (order === 'desc') {

                   // return personaB[property] - personaA[property];
                // }

                return (order === 'asc') ? personaA[property] > personaB[property]
                : personaA[property] < personaB[property];
            });

            return collection;
        }
    };
};

/**
 * Форматирование поля
 * @param {String} property – Свойство для фильтрации
 * @param {Function} formatter – Функция для форматирования
 * @returns {Object}
 */
exports.format = function (property, formatter) {
    // console.info(property, formatter);

    return {
        func: 'format',
        res: function (collection) {
            for (var i = 0; i < collection.length; i++) {
                collection[i][property] = formatter(collection[i][property]);
            }

            return collection;
        }
    };
};

/**
 * Ограничение количества элементов в коллекции
 * @param {Number} count – Максимальное количество элементов
 * @returns {Object}
 */
exports.limit = function (count) {
    // console.info(count);

    return {
        func: 'limit',
        res: function (collection) {
            if (collection.length > count) {
                collection.splice(count, collection.length - count);
            }

            return collection;
        }
    };
};

if (exports.isStar) {

    /**
     * Фильтрация, объединяющая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Object}
     */
    exports.or = function () {
        var resArray;
        var orCollection = [];
        var arg = [].slice.call(arguments);

        return {
            func: 'filterIn',
            res: function (collection) {
                for (var i = 0; i < arg.length; i++) {
                    resArray = arg[i].res(collection);
                    Array.prototype.push.apply(orCollection, resArray);
                }

                return orCollection;
            }
        };
    };

    /**
     * Фильтрация, пересекающая фильтрующие функции
     * @star
     * @params {...Function} – Фильтрующие функции
     * @returns {Object}
     */
    exports.and = function () {
        var arg = [].slice.call(arguments);

        return {
            func: 'filterIn',
            res: function (collection) {
                var andCollection = collection;
                for (var i = 0; i < arg.length; i++) {
                    andCollection = arg[i].res(andCollection);
                }

                return andCollection;
            }
        };
    };
}
