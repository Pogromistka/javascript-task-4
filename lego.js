'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы or и and
 */
exports.isStar = true;

var priorityFunc = ['and', 'or', 'filterIn', 'sortBy', 'select', 'limit', 'format'];

/**
 * Запрос к коллекции
 * @param {Array} collection
 * @params {...Function} – Функции для запроса
 * @returns {Array}
 */
exports.query = function (collection) {
    var copyCollection = [];
    var arg = [].slice.call(arguments);

    copyCollection = collection.map(function (item) {
        var note = {};
        return Object.keys(item).forEach(function (key) {
            note[key] = item[key];
        });
    });

    arg.splice(0, 1);
    arg.sort(sortPriorityFunc);

    arg.forEach(function (item) {
        copyCollection = item.func(copyCollection);
    });

    return copyCollection;
};

function sortPriorityFunc(argA, argB) {
    return priorityFunc.indexOf(argA.name) - priorityFunc.indexOf(argB.name);
}

/**
 * Выбор полей
 * @params {...String}
 * @returns {Object}
 */
exports.select = function () {
    var fields = [].slice.call(arguments);
    var selectedCol = [];

    return {
        name: 'select',
        func: function (collection) {
            collection.forEach(function (item) {
                selectedCol.push(copyNoteCollection(item, fields));
            });

            return selectedCol;
        }
    };
};

function copyNoteCollection(note, fields) {
    var remarkCol = {};

    // for (var key in note) {
    Object.keys(note).forEach(function (key) {
        if (fields.indexOf(key) !== -1) {
            remarkCol[key] = note[key];
        }
    });
    // }

    return remarkCol;
}

/**
 * Фильтрация поля по массиву значений
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Доступные значения
 * @returns {Object}
 */
exports.filterIn = function (property, values) {
    var filteredCol = [];

    return {
        name: 'filterIn',
        func: function (collection) {
            collection.forEach(function (item) {
                if (item[property] && values.indexOf(item[property]) !== -1) {
                    filteredCol.push(item);
                }
            });

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

    return {
        name: 'sortBy',
        func: function (collection) {
            collection.sort(function (firstPerson, secondPerson) {

                return (order === 'asc') ? firstPerson[property] > secondPerson[property]
                : firstPerson[property] < secondPerson[property];
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

    return {
        name: 'format',
        func: function (collection) {
            collection.forEach(function (item) {
                item[property] = formatter(item[property]);
            });

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

    return {
        name: 'limit',
        func: function (collection) {

            return collection.slice(0, count);
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
            name: 'or',
            func: function (collection) {
                resArray = collection.filter(function (elem) {
                    return arg.some(function (item) {
                        return item.func(collection).indexOf(elem) !== -1;
                    });
                });

                orCollection = orCollection.concat(resArray);

                return orCollection.slice();
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
            name: 'and',
            func: function (collection) {
                var andCollection = collection.slice();
                arg.forEach(function (item) {
                    andCollection = item.func(andCollection);
                });

                return andCollection;
            }
        };
    };
}
